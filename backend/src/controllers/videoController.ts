import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Video from '../models/Video';
import { processUploadedVideo } from '../services/videoEncoding.service';
import { AuthRequest } from '../middleware/auth';

// Import the io instance from server
import { io } from '../server';

export const uploadVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No video file uploaded' });
      return;
    }

    const { title, description, category, tags } = req.body;

    // Create video document first
    const video = new Video({
      title,
      description,
      category,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      owner: req.user.userId,
      status: 'uploaded',
      filePath: req.file.path // Temporary path from multer
    });

    await video.save();

    // Process video asynchronously with Socket.IO for progress updates
    processUploadedVideo(req.file.path, video, io).catch(console.error);

    res.status(201).json({
      message: 'Video uploaded successfully. Processing started.',
      videoId: video._id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

export const getVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query: any = { status: 'processed', isPublic: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    const videos = await Video.find(query)
      .populate('owner', 'username profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Video.countDocuments(query);

    res.json({
      videos,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalVideos: total,
        hasNext: skip + videos.length < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error while fetching videos' });
  }
};

export const getVideoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id)
      .populate('owner', 'username profilePic bio');

    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    if (!video.isPublic && (!req.user || (req.user as any)._id.toString() !== video.owner._id.toString())) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ message: 'Server error while fetching video' });
  }
};

export const updateVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category, tags, isPublic } = req.body;

    const video = await Video.findById(id);
    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    if (video.owner.toString() !== (req.user as any)._id.toString()) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const updates: any = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (tags) updates.tags = tags.split(',').map((tag: string) => tag.trim());
    if (typeof isPublic === 'boolean') updates.isPublic = isPublic;

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('owner', 'username profilePic');

    res.json(updatedVideo);
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Server error while updating video' });
  }
};

export const deleteVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);
    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    if (video.owner.toString() !== (req.user as any)._id.toString()) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    await Video.findByIdAndDelete(id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error while deleting video' });
  }
};

export const likeVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      res.status(404).json({ message: 'Video not found' });
      return;
    }

    // Simple like implementation - you might want to track individual user likes
    video.likes += 1;
    await video.save();

    res.json({ likes: video.likes });
  } catch (error) {
    console.error('Like video error:', error);
    res.status(500).json({ message: 'Server error while liking video' });
  }
};
