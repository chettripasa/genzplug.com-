# 🚀 NexusHub Complete Deployment Guide

## ⚠️ CRITICAL SECURITY ALERT

**Your Stripe Secret Key was exposed in the conversation. You MUST:**

1. **IMMEDIATELY** go to your [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. **Regenerate** your Secret Key (`sk_live_...`)
3. **Update** the new key in your Vercel environment variables
4. **Never share** secret keys publicly again

## 🎯 Deployment Overview

This guide will deploy NexusHub to:
- **Backend:** Vercel (Serverless Functions)
- **Frontend:** Vercel (Static Site)
- **Database:** MongoDB Atlas (Your existing cluster)
- **Payments:** Stripe (Your existing account)

## 📋 Prerequisites

- [x] GitHub repository with your code
- [x] MongoDB Atlas cluster (already configured)
- [x] Stripe account (already configured)
- [ ] Vercel account ([sign up here](https://vercel.com))
- [ ] Cloudinary account for media uploads

## 🔧 Backend Deployment

### Step 1: Prepare Repository
```bash
# Ensure all code is committed and pushed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy Backend to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**

### Step 3: Configure Backend Environment Variables
In your Vercel project settings, add these variables:

```env
# General
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-nexushub-frontend.vercel.app

# Database (Your MongoDB Atlas)
MONGODB_URI=mongodb://atlas-sql-68b23dd1515ebf25b5d085dd-yextdb.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin

# Authentication (Generate strong, unique secrets)
JWT_SECRET=your_super_secure_jwt_secret_min_32_chars_long_change_this
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_min_32_chars_long_change_this

# Stripe (Use NEW regenerated secret key!)
STRIPE_PUBLISHABLE_KEY=pk_live_cJFDoE30cTVJfBcuiMVe8vMw002uFdFRMJ
STRIPE_SECRET_KEY=sk_live_NEW_REGENERATED_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_from_stripe_dashboard

# Cloudinary (Create account at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# FFmpeg
FFMPEG_PATH=/usr/bin/ffmpeg
```

## 🌐 Frontend Deployment

### Step 1: Deploy Frontend to Vercel
1. Create a **new Vercel project** for the frontend
2. Import the same GitHub repository
3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **"Deploy"**

### Step 2: Configure Frontend Environment Variables
```env
# API Configuration
VITE_API_URL=https://your-nexushub-backend.vercel.app

# Stripe (Public key only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_cJFDoE30cTVJfBcuiMVe8vMw002uFdFRMJ

# App Configuration
VITE_APP_NAME=NexusHub
VITE_APP_VERSION=1.0.0
```

## 🔄 Update URLs and Redeploy

### Step 1: Update Backend CLIENT_URL
1. Go to your **backend Vercel project**
2. Update `CLIENT_URL` to your frontend URL
3. Redeploy the backend

### Step 2: Update Frontend API_URL
1. Go to your **frontend Vercel project**
2. Update `VITE_API_URL` to your backend URL
3. Redeploy the frontend

## 🗄️ MongoDB Atlas Configuration

### Step 1: Network Access
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Add IP address: `0.0.0.0/0` (temporarily allow all IPs)
4. **Note:** Restrict to Vercel IP ranges later for security

### Step 2: Database Access
1. Go to **Database Access**
2. Ensure your user has **readWrite** permissions on `sample_mflix`

## 💳 Stripe Webhook Setup

### Step 1: Create Webhook Endpoint
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-nexushub-backend.vercel.app/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### Step 2: Get Webhook Secret
1. Copy the **"Signing secret"** from the webhook
2. Add it to your backend environment variables as `STRIPE_WEBHOOK_SECRET`

## 🧪 Testing Your Deployment

### Backend Health Check
```bash
curl https://your-nexushub-backend.vercel.app/health
```

### Frontend Test
1. Visit your frontend URL
2. Test user registration/login
3. Test video upload (if Cloudinary is configured)
4. Test Stripe checkout (use test cards)

## 🔒 Security Checklist

- [ ] Stripe Secret Key regenerated
- [ ] Strong JWT secrets generated
- [ ] Environment variables not committed to Git
- [ ] MongoDB network access configured
- [ ] Stripe webhooks configured
- [ ] HTTPS enforced (Vercel handles this)

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:** Ensure `CLIENT_URL` is correct in backend
2. **Database Connection:** Check MongoDB Atlas network access
3. **Build Failures:** Verify Node.js version (18+) and dependencies
4. **WebSocket Issues:** Check Socket.IO configuration in production

### Support
- Check Vercel deployment logs
- Verify environment variables are set correctly
- Test endpoints individually with tools like Postman

## 🎉 Success!

Once deployed, your NexusHub platform will be:
- **Live on the internet** with custom URLs
- **Fully functional** with all features
- **Scalable** and **secure**
- **Ready for users** worldwide

## 📞 Next Steps

1. **Monitor** your application performance
2. **Set up** monitoring and logging
3. **Configure** custom domain (optional)
4. **Scale** as your user base grows
5. **Implement** additional security measures

---

**Remember:** Security first! Always regenerate exposed keys and never commit sensitive information to version control.
