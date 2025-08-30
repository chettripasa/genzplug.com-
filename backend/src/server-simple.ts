import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// Middleware
app.use(cors());
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

// Video routes (basic)
app.get('/api/videos', (req, res) => {
  res.json({ message: 'Videos endpoint - to be implemented' });
});

// Payment routes (basic)
app.get('/api/payments/test', (req, res) => {
  res.json({ message: 'Payments endpoint - to be implemented' });
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
