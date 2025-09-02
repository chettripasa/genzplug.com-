# 🚀 Deployment Guide - GitHub & Vercel

## 📋 Prerequisites

1. **GitHub Account**: https://github.com
2. **Vercel Account**: https://vercel.com
3. **MongoDB Atlas Account**: https://mongodb.com/atlas (for production database)

## 🔄 Step 1: GitHub Deployment

### Your code is already on GitHub! ✅
- **Repository**: https://github.com/chettripasa/genzplug.com-
- **Status**: All changes committed and pushed

### To update GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## 🚀 Step 2: Vercel Deployment

### 2.1 Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository: `chettripasa/genzplug.com-`
4. Select the repository and click **"Import"**

### 2.2 Configure Vercel Settings

#### Project Settings:
- **Framework Preset**: Other
- **Root Directory**: `./` (leave empty)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm run install:all`

#### Environment Variables (Add these in Vercel Dashboard):

```env
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/nexushub?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app

# Optional (for full functionality)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2.3 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Your app will be live at: `https://your-app.vercel.app`

## 🔧 Step 3: MongoDB Atlas Setup (Production)

### 3.1 Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a new cluster (free tier works)
3. Create a database user
4. Get your connection string

### 3.2 Update Environment Variables

In Vercel Dashboard, update `MONGODB_URI` with your Atlas connection string.

## 🌐 Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

### 4.2 Update Environment Variables

Update `CLIENT_URL` and `FRONTEND_URL` with your custom domain.

## 🔍 Step 5: Verify Deployment

### Check Your Live App:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-app.vercel.app/api/health`
- **Health Check**: `https://your-app.vercel.app/health`

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Vercel build logs
   - Ensure all dependencies are in package.json
   - Verify build command is correct

2. **API Not Working**
   - Check environment variables in Vercel
   - Verify MongoDB connection string
   - Check CORS settings

3. **Frontend Not Loading**
   - Check if frontend build completed
   - Verify output directory is correct
   - Check for JavaScript errors in browser console

### Debug Commands:

```bash
# Test build locally
npm run build

# Check server status
npm run status

# Test production build
npm run build:backend
npm run build:frontend
```

## 📊 Monitoring

### Vercel Analytics:
- Function execution times
- Error rates
- Performance metrics

### MongoDB Atlas:
- Database performance
- Connection monitoring
- Query analytics

## 🔄 Continuous Deployment

### Automatic Deployments:
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failures

### Manual Deployments:
- Use Vercel CLI: `vercel --prod`
- Deploy from specific branch
- Deploy with different environment variables

## 🎉 Success!

Your NexusHub application is now:
- ✅ **On GitHub**: https://github.com/chettripasa/genzplug.com-
- ✅ **Deployed on Vercel**: https://your-app.vercel.app
- ✅ **Production Ready**: With MongoDB Atlas
- ✅ **Scalable**: Auto-scaling with Vercel

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **GitHub Issues**: Create issues in your repository

---

**Happy Deploying! 🚀**
