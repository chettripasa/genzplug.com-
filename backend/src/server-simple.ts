import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import User model
import User from './models/User';
import Video from './models/Video';
import Post from './models/Post';

// JWT Authentication Middleware
interface AuthenticatedRequest extends express.Request {
  user: {
    userId: string;
    role: string;
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Role-based access control middleware
const requireRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions.' 
      });
    }
    
    next();
  };
};

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development',
    uptime: process.uptime(),
  });
});

// Basic API endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'NexusHub API is working!' });
});

// Auth routes (basic)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      role: 'user',
      isBanned: false,
      moderationStatus: 'pending',
      loginCount: 0
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Account is banned',
        reason: user.banReason
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update login stats
    user.lastLoginAt = new Date();
    user.loginCount += 1;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      lastLoginAt: user.lastLoginAt,
      loginCount: user.loginCount
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// User Profile Management (Protected Routes)
app.get('/api/users/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.put('/api/users/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { username, bio, profilePic } = req.body;
    const updates: any = {};
    
    if (username) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (profilePic !== undefined) updates.profilePic = profilePic;
    
    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user.userId } 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.put('/api/users/change-password', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    user.password = hashedNewPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Video routes (basic)
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find({ status: 'processed', isPublic: true })
      .populate('owner', 'username profilePic')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      videos,
      total: videos.length
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/videos', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, description, category, tags } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }
    
    const video = new Video({
      title,
      description,
      category,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      owner: req.user.userId,
      status: 'uploaded',
      isPublic: true
    });
    
    await video.save();
    
    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      video
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Payment routes (basic)
app.get('/api/payments/test', (req, res) => {
  res.json({ message: 'Payments endpoint - to be implemented' });
});

// Social Hub Features
app.post('/api/social/posts', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { content, mediaUrl, tags } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required'
      });
    }
    
    const post = new Post({
      author: req.user.userId,
      content: content.trim(),
      mediaUrl,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      likes: [],
      comments: [],
      isPublic: true
    });
    
    await post.save();
    
    // Populate author info for response
    await post.populate('author', 'username profilePic');
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/social/posts', async (req, res) => {
  try {
    const { page = 1, limit = 20, author, tags } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    let query: any = { isPublic: true };
    
    if (author) {
      query.author = author;
    }
    
    if (tags) {
      const tagArray = (tags as string).split(',').map((tag: string) => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    const posts = await Post.find(query)
      .populate('author', 'username profilePic bio')
      .populate('comments.author', 'username profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Post.countDocuments(query);
    
    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalPosts: total,
        hasNext: skip + posts.length < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/social/posts/:postId/like', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const userId = req.user.userId;
    const likeIndex = post.likes.findIndex(likeId => likeId.toString() === userId);
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(new mongoose.Types.ObjectId(userId));
    }
    
    await post.save();
    
    res.json({
      success: true,
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      likes: post.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/social/posts/:postId/comments', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const comment = {
      author: new mongoose.Types.ObjectId(req.user.userId),
      content: content.trim(),
      createdAt: new Date()
    };
    
    post.comments.push(comment);
    await post.save();
    
    // Populate comment author info
    await post.populate('comments.author', 'username profilePic');
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// User Follow System
app.post('/api/social/follow/:userId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.userId;
    
    if (userId === followerId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot follow yourself'
      });
    }
    
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const follower = await User.findById(followerId);
    if (!follower) {
      return res.status(404).json({
        success: false,
        message: 'Follower not found'
      });
    }
    
    // Check if already following
    const isFollowing = follower.following.some(id => id.toString() === userId);
    
    if (isFollowing) {
      // Unfollow
      follower.following = follower.following.filter(id => id.toString() !== userId);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== followerId);
    } else {
      // Follow
      follower.following.push(new mongoose.Types.ObjectId(userId));
      userToFollow.followers.push(new mongoose.Types.ObjectId(followerId));
    }
    
    await Promise.all([follower.save(), userToFollow.save()]);
    
    res.json({
      success: true,
      message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
      isFollowing: !isFollowing
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/social/users/:userId/followers', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate('followers', 'username profilePic bio');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      followers: user.followers,
      count: user.followers.length
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/social/users/:userId/following', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).populate('following', 'username profilePic bio');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      following: user.following,
      count: user.following.length
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Admin Routes (Role-based access control)
app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.put('/api/admin/users/:userId/ban', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.params;
    const { banReason } = req.body;
    
    if (!banReason) {
      return res.status(400).json({
        success: false,
        message: 'Ban reason is required'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isBanned: true,
        banReason,
        bannedAt: new Date(),
        bannedBy: req.user.userId
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User banned successfully',
      user
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.put('/api/admin/users/:userId/unban', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isBanned: false,
        banReason: undefined,
        bannedAt: undefined,
        bannedBy: undefined
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User unbanned successfully',
      user
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.put('/api/admin/users/:userId/role', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user, moderator, or admin'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env['MONGODB_URI'];
    if (mongoURI) {
      await mongoose.connect(mongoURI);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('⚠️ MONGODB_URI not set, skipping database connection');
    }

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
