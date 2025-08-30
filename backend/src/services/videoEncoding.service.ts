import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Video, { IVideo } from '../models/Video';
import { uploadToCloudinary } from '../config/cloudinary';

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegPath);

interface TranscodeResult {
  playlistPath: string;
  thumbnailPath: string;
  duration: number;
}

export class VideoEncodingService {
  private readonly inputPath: string;
  private readonly outputDir: string;
  private readonly videoId: string;
  private readonly io: any; // Socket.IO instance for progress updates

  constructor(inputPath: string, videoId: string, io?: any) {
    this.inputPath = inputPath;
    this.videoId = videoId;
    this.outputDir = path.join(__dirname, '..', '..', 'uploads', 'videos', videoId);
    this.io = io;
  }

  private async ensureOutputDir(): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
  }

  private emitProgress(progress: number, stage: string): void {
    if (this.io) {
      this.io.to(`video_${this.videoId}`).emit('video-progress', {
        videoId: this.videoId,
        progress,
        stage,
        timestamp: new Date().toISOString()
      });
    }
  }

  async transcode(): Promise<TranscodeResult> {
    await this.ensureOutputDir();
    
    // Update video status to processing
    await Video.findByIdAndUpdate(this.videoId, { status: 'processing' });
    this.emitProgress(0, 'Starting transcoding...');

    return new Promise((resolve, reject) => {
      let duration = 0;

      // Get video duration first
      ffmpeg.ffprobe(this.inputPath, (err, metadata) => {
        if (err) {
          this.emitProgress(0, 'Failed to analyze video');
          return reject(err);
        }
        
        duration = metadata.format.duration || 0;
        this.emitProgress(5, 'Video analyzed, starting transcoding...');

        // Now transcode
        const command = ffmpeg(this.inputPath)
          .outputOptions([
            // HLS configuration for adaptive streaming
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls'
          ])
          .output(path.join(this.outputDir, 'master.m3u8'))
          .videoCodec('libx264')
          .audioCodec('aac')
          .addOptions([
            // Multiple output resolutions
            '-filter_complex',
            `split=3 [output1][output2][output3];
             [output1]scale=w=1920:h=1080[1080p];
             [output2]scale=w=1280:h=720[720p];
             [output3]scale=w=854:h=480[480p]`,
            '-map', '[1080p]', '-map', '0:a',
            '-map', '[720p]', '-map', '0:a',
            '-map', '[480p]', '-map', '0:a',
            '-var_stream_map', '"v:0,a:0,name:1080p v:1,a:1,name:720p v:2,a:2,name:480p"'
          ]);

        command
          .on('start', (commandLine) => {
            console.log(`Spawned Ffmpeg with command: ${commandLine}`);
            this.emitProgress(10, 'Transcoding started...');
          })
          .on('progress', (progress) => {
            const progressPercent = Math.round(progress.percent || 0);
            // Scale progress from 10% to 80% (transcoding phase)
            const scaledProgress = 10 + (progressPercent * 0.7);
            this.emitProgress(scaledProgress, `Transcoding: ${progressPercent}% done`);
          })
          .on('end', async () => {
            console.log('Transcoding finished');
            this.emitProgress(80, 'Transcoding completed, generating thumbnail...');
            
            try {
              const thumbnailPath = await this.generateThumbnail();
              this.emitProgress(90, 'Thumbnail generated, uploading to cloud...');
              
              resolve({
                playlistPath: path.join(this.outputDir, 'master.m3u8'),
                thumbnailPath,
                duration
              });
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (err) => {
            console.error('Error during transcoding:', err);
            this.emitProgress(0, 'Transcoding failed');
            reject(err);
          })
          .run();
      });
    });
  }

  private async generateThumbnail(): Promise<string> {
    return new Promise((resolve, reject) => {
      const thumbnailPath = path.join(this.outputDir, 'thumbnail.jpg');
      
      ffmpeg(this.inputPath)
        .screenshots({
          count: 1,
          filename: 'thumbnail.jpg',
          folder: this.outputDir,
          size: '640x360',
          timestamps: ['50%'] // Get frame from the middle of the video
        })
        .on('end', () => resolve(thumbnailPath))
        .on('error', reject);
    });
  }

  async cleanup(): Promise<void> {
    try {
      // Remove the original uploaded file
      await fs.unlink(this.inputPath);
      // Note: You might want to keep the transcoded files or upload them to cloud storage
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
}

// Usage in the controller
export const processUploadedVideo = async (filePath: string, videoDoc: IVideo, io?: any): Promise<void> => {
  const processor = new VideoEncodingService(filePath, videoDoc._id.toString(), io);
  
  try {
    const { playlistPath, thumbnailPath, duration } = await processor.transcode();
    
    // Upload to Cloudinary or similar CDN
    const [videoResult, thumbResult] = await Promise.all([
      uploadToCloudinary(playlistPath, { resource_type: 'video', folder: `videos/${videoDoc._id}` }),
      uploadToCloudinary(thumbnailPath, { folder: `videos/${videoDoc._id}/thumbs` })
    ]);

    // Update the video document with the processed details
    videoDoc.videoUrl = videoResult.secure_url;
    videoDoc.thumbnailUrl = thumbResult.secure_url;
    videoDoc.duration = duration;
    videoDoc.status = 'processed';
    
    await videoDoc.save();
    
    // Emit completion event
    if (io) {
      io.to(`video_${videoDoc._id}`).emit('video-complete', {
        videoId: videoDoc._id,
        status: 'processed',
        videoUrl: videoResult.secure_url,
        thumbnailUrl: thumbResult.secure_url,
        duration
      });
    }
    
    // Clean up local files
    await processor.cleanup();
    
  } catch (error) {
    console.error('Video processing failed:', error);
    videoDoc.status = 'failed';
    await videoDoc.save();
    
    // Emit error event
    if (io) {
      io.to(`video_${videoDoc._id}`).emit('video-error', {
        videoId: videoDoc._id,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    await processor.cleanup();
    throw error;
  }
};
