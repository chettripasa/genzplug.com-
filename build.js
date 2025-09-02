const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process for Vercel...');

try {
  // Build backend
  console.log('📦 Building backend...');
  execSync('cd backend && npm run build', { stdio: 'inherit' });
  
  // Build frontend
  console.log('📦 Building frontend...');
  execSync('cd frontend && npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
