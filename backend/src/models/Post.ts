import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  mediaUrl?: string;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  comments: Array<{
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  mediaUrl: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create text index for search functionality
PostSchema.index({ content: 'text', tags: 'text' });

// Create compound index for efficient querying
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.model<IPost>('Post', PostSchema);
