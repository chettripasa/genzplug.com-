import { useNotificationStore } from '../stores/notificationStore';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  size: number;
  duration?: number; // for videos
}

export class UploadService {
  private static readonly MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  private static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private static readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

  // Upload image to Cloudinary
  static async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    folder: string = 'nexushub/images'
  ): Promise<UploadResult> {
    try {
      // Validate file
      this.validateImageFile(file);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'nexushub');
      formData.append('folder', folder);

      // Upload with progress tracking
      const result = await this.uploadWithProgress(
        `${import.meta.env.VITE_CLOUDINARY_URL || 'https://api.cloudinary.com/v1_1/your-cloud-name'}/image/upload`,
        formData,
        onProgress
      );

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Upload video to Cloudinary
  static async uploadVideo(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    folder: string = 'nexushub/videos'
  ): Promise<UploadResult> {
    try {
      // Validate file
      this.validateVideoFile(file);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'nexushub');
      formData.append('folder', folder);
      formData.append('resource_type', 'video');
      formData.append('eager', 'sp_full_hd,w_1280,h_720,c_fill,g_auto');
      formData.append('eager_async', 'true');

      // Upload with progress tracking
      const result = await this.uploadWithProgress(
        `${import.meta.env.VITE_CLOUDINARY_URL || 'https://api.cloudinary.com/v1_1/your-cloud-name'}/video/upload`,
        formData,
        onProgress
      );

      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        duration: result.duration,
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  // Upload multiple files
  static async uploadMultiple(
    files: File[],
    onProgress?: (progress: UploadProgress) => void,
    folder: string = 'nexushub'
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        let result: UploadResult;

        if (this.isImageFile(file)) {
          result = await this.uploadImage(file, onProgress, `${folder}/images`);
        } else if (this.isVideoFile(file)) {
          result = await this.uploadVideo(file, onProgress, `${folder}/videos`);
        } else {
          throw new Error(`Unsupported file type: ${file.type}`);
        }

        results.push(result);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error;
      }
    }

    return results;
  }

  // Upload to backend API (alternative to direct Cloudinary)
  static async uploadToBackend(
    file: File,
    type: 'image' | 'video',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Validate file
      if (type === 'image') {
        this.validateImageFile(file);
      } else {
        this.validateVideoFile(file);
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      // Upload with progress tracking
      const result = await this.uploadWithProgress(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/${type}`,
        formData,
        onProgress,
        true // Include auth header
      );

      return result;
    } catch (error) {
      console.error(`Error uploading ${type} to backend:`, error);
      throw error;
    }
  }

  // Private method for upload with progress tracking
  private static async uploadWithProgress(
    url: string,
    formData: FormData,
    onProgress?: (progress: UploadProgress) => void,
    includeAuth: boolean = false
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });

      // Response handling
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      // Error handling
      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      // Setup request
      xhr.open('POST', url);

      if (includeAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      }

      // Send request
      xhr.send(formData);
    });
  }

  // File validation methods
  private static validateImageFile(file: File): void {
    if (!this.isImageFile(file)) {
      throw new Error('Invalid image file type');
    }
    if (file.size > this.MAX_IMAGE_SIZE) {
      throw new Error(`Image file size must be less than ${this.MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
    }
  }

  private static validateVideoFile(file: File): void {
    if (!this.isVideoFile(file)) {
      throw new Error('Invalid video file type');
    }
    if (file.size > this.MAX_VIDEO_SIZE) {
      throw new Error(`Video file size must be less than ${this.MAX_VIDEO_SIZE / (1024 * 1024)}MB`);
    }
  }

  private static isImageFile(file: File): boolean {
    return this.ALLOWED_IMAGE_TYPES.includes(file.type);
  }

  private static isVideoFile(file: File): boolean {
    return this.ALLOWED_VIDEO_TYPES.includes(file.type);
  }

  // Get file preview URL
  static getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  // Clean up preview URL
  static revokeFilePreview(url: string): void {
    URL.revokeObjectURL(url);
  }

  // Compress image before upload
  static async compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Get upload progress text
  static getProgressText(progress: UploadProgress): string {
    const loadedMB = (progress.loaded / (1024 * 1024)).toFixed(1);
    const totalMB = (progress.total / (1024 * 1024)).toFixed(1);
    return `${progress.percentage}% (${loadedMB}MB / ${totalMB}MB)`;
  }
}
