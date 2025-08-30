const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
  console.log(`🔗 Videos: http://localhost:${PORT}/api/videos`);
  console.log(`🔗 Payments: http://localhost:${PORT}/api/payments/test`);
});
