import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  filePath?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: number;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  progress: number;
  error?: string;
  moderationStatus: 'pending' | 'approved' | 'flagged' | 'rejected';
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  views: number;
  likes: number;
  dislikes: number;
  tags: string[];
  category: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filePath: {
    type: String
  },
  videoUrl: {
    type: String
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'processed', 'failed'],
    default: 'uploaded'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  error: {
    type: String
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'flagged', 'rejected'],
    default: 'pending'
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['gaming', 'tutorial', 'entertainment', 'education', 'other']
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
VideoSchema.index({ owner: 1, createdAt: -1 });
VideoSchema.index({ status: 1 });
VideoSchema.index({ category: 1 });
VideoSchema.index({ tags: 1 });
VideoSchema.index({ createdAt: -1 });
VideoSchema.index({ moderationStatus: 1 });
VideoSchema.index({ progress: 1 });

export default mongoose.model<IVideo>('Video', VideoSchema);
