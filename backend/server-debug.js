const express = require('express');
const cors = require('cors');

// Load environment variables
try {
  require('dotenv').config();
  console.log('✅ Environment variables loaded');
} catch (error) {
  console.log('⚠️ Could not load .env file:', error.message);
}

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting NexusHub Server...');
console.log(`📋 Port: ${PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('📡 Health check requested');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    message: 'NexusHub Server is running!'
  });
});

// Basic API endpoints
app.get('/api/test', (req, res) => {
  console.log('📡 API test requested');
  res.json({ 
    message: 'NexusHub API is working!',
    timestamp: new Date().toISOString()
  });
});

// Video routes (basic)
app.get('/api/videos', (req, res) => {
  console.log('📡 Videos endpoint requested');
  res.json({ 
    message: 'Videos endpoint - to be implemented',
    timestamp: new Date().toISOString()
  });
});

// Payment routes (basic)
app.get('/api/payments/test', (req, res) => {
  console.log('📡 Payments test requested');
  res.json({ 
    message: 'Payments endpoint - to be implemented',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to NexusHub API!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: '/api/test',
      videos: '/api/videos',
      payments: '/api/payments/test'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('✅ Server started successfully!');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
  console.log(`🔗 Videos: http://localhost:${PORT}/api/videos`);
  console.log(`🔗 Payments: http://localhost:${PORT}/api/payments/test`);
  console.log(`🔗 Root: http://localhost:${PORT}/`);
  console.log('📡 Server is ready to accept requests...');
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Server terminated');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Keep process alive
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  server.close(() => {
    console.log('✅ Server closed due to uncaught exception');
    process.exit(1);
  });
});

console.log('🔧 Server setup complete, starting...');

