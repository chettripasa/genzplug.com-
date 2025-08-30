import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import configurations
import { connectDB, isDBConnected } from './config/database';
// Redis connection will be imported dynamically when needed

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import videoRoutes from './routes/videos';
import socialRoutes from './routes/social';
import gamingRoutes from './routes/gaming';
import uploadRoutes from './routes/upload';
import paymentRoutes from './routes/payments';

// Import socket setup
import { setupChatSocket } from './sockets/chat.socket';
import { setupAdminSocket } from './sockets/admin.socket';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

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
    process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173',
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

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to NexusHub API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      videos: '/api/videos',
      social: '/api/social',
      gaming: '/api/gaming',
      upload: '/api/upload',
      payments: '/api/payments'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/gaming', gamingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);

// WebSocket connection handling
setupChatSocket(io);
setupAdminSocket(io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server function
async function startServer() {
  try {
    // Connect to MongoDB (optional for development)
    try {
      await connectDB();
      if (isDBConnected()) {
        console.log('✅ MongoDB connected successfully');
      } else {
        console.log('⚠️ MongoDB connection failed, continuing without database');
      }
    } catch (error) {
      console.log('⚠️ MongoDB connection failed, continuing without database');
    }

    // Redis connection disabled for now to prevent error spam
    console.log('⚠️ Redis connection disabled for development');

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`📱 Client URL: ${process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔌 WebSocket server ready`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
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

// Handle production - different behavior for serverless
if (process.env.NODE_ENV === 'production') {
  // For Vercel, we don't want to listen on a port in the traditional way
  // Vercel will manage the server
  console.log('🚀 Server configured for production deployment');
  module.exports = app;
} else {
  // For local development, start the server
  startServer();
}

export { app, io };
