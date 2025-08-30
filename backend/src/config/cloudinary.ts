import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface UploadOptions {
  resource_type?: 'image' | 'video' | 'raw';
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  invalidate?: boolean;
}

export const uploadToCloudinary = async (
  filePath: string,
  options: UploadOptions = {}
): Promise<{ secure_url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: options.resource_type || 'auto',
      folder: options.folder,
      public_id: options.public_id,
      overwrite: options.overwrite || false,
      invalidate: options.invalidate || true
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload to Cloudinary');
  }
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete from Cloudinary');
  }
};

export const generateVideoThumbnail = async (
  videoUrl: string,
  options: {
    time?: string;
    width?: number;
    height?: number;
    crop?: string;
  } = {}
): Promise<string> => {
  try {
    const thumbnailUrl = cloudinary.url(videoUrl, {
      resource_type: 'video',
      transformation: [
        {
          width: options.width || 640,
          height: options.height || 360,
          crop: options.crop || 'fill',
          gravity: 'auto'
        },
        {
          start_offset: options.time || '50%',
          duration: 1
        }
      ]
    });

    return thumbnailUrl;
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    throw new Error('Failed to generate thumbnail');
  }
};
