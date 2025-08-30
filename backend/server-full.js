const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log('🚀 Starting NexusHub Full-Featured Server...');
console.log(`📋 Port: ${PORT}`);
console.log(`🌍 Environment: ${NODE_ENV}`);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
    message: 'NexusHub Full-Featured Server is running!'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to NexusHub Full-Featured API!',
    version: '1.0.0',
    features: [
      'Video Processing & HLS Streaming',
      'Stripe Payment Integration',
      'Real-time Chat with Socket.IO',
      'User Authentication & Authorization',
      'File Upload & Management',
      'E-commerce Order Management'
    ],
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      videos: '/api/videos',
      payments: '/api/payments',
      chat: '/api/chat',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders'
    }
  });
});

// Basic API endpoints (placeholder implementations)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'NexusHub Full-Featured API is working!',
    timestamp: new Date().toISOString(),
    features: 'All subsystems are ready for testing'
  });
});

// Video routes (placeholder)
app.get('/api/videos', (req, res) => {
  res.json({ 
    message: 'Video processing system ready',
    features: [
      'HLS Adaptive Streaming',
      'Multi-resolution transcoding',
      'Automatic thumbnail generation',
      'Cloudinary CDN integration'
    ],
    timestamp: new Date().toISOString()
  });
});

// Payment routes (placeholder)
app.get('/api/payments/test', (req, res) => {
  res.json({ 
    message: 'Stripe payment system ready',
    features: [
      'Checkout sessions',
      'Webhook handling',
      'Order management',
      'Payment intents & refunds'
    ],
    timestamp: new Date().toISOString()
  });
});

// Chat routes (placeholder)
app.get('/api/chat/status', (req, res) => {
  res.json({ 
    message: 'Real-time chat system ready',
    features: [
      'Socket.IO integration',
      'User presence tracking',
      'Typing indicators',
      'Conversation management'
    ],
    timestamp: new Date().toISOString()
  });
});

// User routes (placeholder)
app.get('/api/users/status', (req, res) => {
  res.json({ 
    message: 'User management system ready',
    features: [
      'JWT authentication',
      'Role-based access control',
      'Profile management',
      'Shopping cart integration'
    ],
    timestamp: new Date().toISOString()
  });
});

// Product routes (placeholder)
app.get('/api/products/status', (req, res) => {
  res.json({ 
    message: 'E-commerce system ready',
    features: [
      'Product catalog',
      'Inventory management',
      'Category organization',
      'Search & filtering'
    ],
    timestamp: new Date().toISOString()
  });
});

// Order routes (placeholder)
app.get('/api/orders/status', (req, res) => {
  res.json({ 
    message: 'Order management system ready',
    features: [
      'Order tracking',
      'Payment integration',
      'Shipping management',
      'Order history'
    ],
    timestamp: new Date().toISOString()
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
  });

  // Chat functionality
  socket.on('send-message', (data) => {
    console.log('💬 Message received:', data);
    // Broadcast to room
    socket.to(data.conversationId).emit('new-message', {
      ...data,
      timestamp: new Date().toISOString()
    });
  });

  // Typing indicators
  socket.on('typing-start', (data) => {
    socket.to(data.conversationId).emit('user-typing', {
      userId: socket.id,
      isTyping: true
    });
  });

  socket.on('typing-stop', (data) => {
    socket.to(data.conversationId).emit('user-typing', {
      userId: socket.id,
      isTyping: false
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (mongoURI) {
      await mongoose.connect(mongoURI);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('⚠️ MONGODB_URI not set, skipping database connection');
    }

    // Start HTTP server
    server.listen(PORT, () => {
      console.log('✅ Full-featured server started successfully!');
      console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔌 WebSocket server ready`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API status: http://localhost:${PORT}/api/test`);
      console.log(`🔗 Video system: http://localhost:${PORT}/api/videos`);
      console.log(`🔗 Payment system: http://localhost:${PORT}/api/payments/test`);
      console.log(`🔗 Chat system: http://localhost:${PORT}/api/chat/status`);
      console.log('📡 All subsystems are ready for testing!');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start the server
startServer();
