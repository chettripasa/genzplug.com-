# NexusHub Frontend Deployment Guide

## Vercel Deployment Configuration

### Project Settings
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Environment Variables

Add these to your Vercel project settings:

```env
# API Configuration
VITE_API_URL=https://your-nexushub-backend.vercel.app

# Stripe (Public key only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_cJFDoE30cTVJfBcuiMVe8vMw002uFdFRMJ

# App Configuration
VITE_APP_NAME=NexusHub
VITE_APP_VERSION=1.0.0
```

## Deployment Steps

1. **Push code to GitHub repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
3. **Configure build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add environment variables** (see above)
5. **Deploy**
6. **Update backend CLIENT_URL** with your frontend URL
7. **Redeploy backend**

## Important Notes

- The frontend will automatically proxy API calls to your backend URL
- WebSocket connections will be handled through the backend deployment
- Make sure your backend is deployed first and accessible
- Update the `VITE_API_URL` to point to your actual backend deployment

## Post-Deployment

1. Test all functionality:
   - User registration/login
   - Video upload and playback
   - Social features
   - Real-time chat
   - E-commerce features
2. Verify WebSocket connections work
3. Check that all API endpoints are accessible
4. Test responsive design on mobile devices
