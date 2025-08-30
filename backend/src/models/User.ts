import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profilePic?: string;
  bio?: string;
  isVerified: boolean;
  role: 'user' | 'admin' | 'moderator';
  isBanned: boolean;
  banReason?: string;
  bannedAt?: Date;
  bannedBy?: mongoose.Types.ObjectId;
  moderationStatus: 'pending' | 'approved' | 'flagged' | 'rejected';
  lastLoginAt?: Date;
  loginCount: number;
  cart: Array<{
    product: mongoose.Types.ObjectId;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePic: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 500
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String
  },
  bannedAt: {
    type: Date
  },
  bannedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'flagged', 'rejected'],
    default: 'pending'
  },
  lastLoginAt: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  cart: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isBanned: 1 });
UserSchema.index({ moderationStatus: 1 });
UserSchema.index({ createdAt: 1 });

// Pre-save middleware to update login count and last login
UserSchema.pre('save', function(next) {
  if (this.isModified('lastLoginAt')) {
    this.loginCount += 1;
  }
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
