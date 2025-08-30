// Load environment variables from .env file
require('dotenv').config();

const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const Redis = require('redis');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const cloudinary = require('cloudinary').v2;

console.log('🔍 Testing NexusHub Backend Setup...\n');

// Test 1: Check Node.js version
console.log('✅ Node.js Version:', process.version);

// Test 2: Check if required packages are installed
const requiredPackages = [
  'mongoose', 'redis', 'fluent-ffmpeg', 'ffmpeg-static',
  'cloudinary', 'stripe', 'socket.io', 'express'
];

console.log('\n📦 Checking required packages...');
requiredPackages.forEach(pkg => {
  try {
    require(pkg);
    console.log(`  ✅ ${pkg}`);
  } catch (error) {
    console.log(`  ❌ ${pkg} - NOT INSTALLED`);
  }
});

// Test 3: Check FFmpeg
console.log('\n🎥 Checking FFmpeg...');
if (ffmpegPath) {
  console.log('  ✅ FFmpeg binary found');
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  console.log('  ❌ FFmpeg binary not found');
}

// Test 4: Check environment variables
console.log('\n🔐 Checking environment variables...');
const requiredEnvVars = [
  'MONGODB_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY',
  'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY'
];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}`);
  } else {
    console.log(`  ❌ ${envVar} - NOT SET`);
  }
});

// Test 5: Test MongoDB connection
console.log('\n🗄️ Testing MongoDB connection...');
async function testMongoDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await client.connect();
    console.log('  ✅ MongoDB connection successful');
    await client.close();
  } catch (error) {
    console.log('  ❌ MongoDB connection failed:', error.message);
  }
}

// Test 6: Test Redis connection
console.log('\n🔴 Testing Redis connection...');
async function testRedis() {
  if (!process.env.REDIS_URL) {
    console.log('  ⚠️ No REDIS_URL set, skipping Redis test');
    return;
  }
  
  console.log('  ⚠️ Redis test disabled to prevent error spam');
  console.log('  ℹ️ Redis is optional and not required for core functionality');
}

// Test 7: Test Cloudinary configuration
console.log('\n☁️ Testing Cloudinary configuration...');
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('  ✅ Cloudinary configured');
} else {
  console.log('  ❌ Cloudinary not configured');
}

// Test 8: Check uploads directory
console.log('\n📁 Checking uploads directory...');
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads', 'videos', 'temp');

if (fs.existsSync(uploadsDir)) {
  console.log('  ✅ Uploads directory exists');
} else {
  console.log('  ❌ Uploads directory missing - creating...');
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('  ✅ Uploads directory created');
  } catch (error) {
    console.log('  ❌ Failed to create uploads directory:', error.message);
  }
}

// Run async tests
async function runTests() {
  await testMongoDB();
  await testRedis();
  
  console.log('\n🎯 Setup Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Set up your .env file with required variables');
  console.log('2. Start MongoDB and Redis services');
  console.log('3. Run: npm run dev');
  console.log('4. Test the API endpoints');
}

runTests().catch(console.error);
