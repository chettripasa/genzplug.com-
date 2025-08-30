# 🚀 NexusHub Deployment Guide

## ⚠️ **IMPORTANT: Security First!**

**Never commit actual API keys to GitHub!** This guide uses placeholders that you'll replace with your real credentials in Vercel.

## 🎯 **Deployment Overview**

- **Backend:** Vercel (Serverless Functions)
- **Frontend:** Vercel (Static Site)
- **Database:** MongoDB Atlas
- **Payments:** Stripe
- **Media:** Cloudinary

## 🔧 **Step 1: Deploy Backend to Vercel**

### 1.1 **Go to Vercel**
- Visit [vercel.com](https://vercel.com)
- Sign in with GitHub
- Click **"Add New..."** → **"Project"**

### 1.2 **Import Repository**
- Select your GitHub repository: `chettripasa/genzplug.com-`
- Click **"Import"**

### 1.3 **Configure Backend Project**
```
Framework Preset: Other
Root Directory: backend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 1.4 **Add Environment Variables**
Click **"Environment Variables"** and add these:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-nexushub-frontend.vercel.app

MONGODB_URI=mongodb://atlas-sql-68b23dd1515ebf25b5d085dd-yextdb.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin

JWT_SECRET=your_super_secure_jwt_secret_min_32_chars_long
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_min_32_chars_long

STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FFMPEG_PATH=/usr/bin/ffmpeg
```

### 1.5 **Deploy Backend**
- Click **"Deploy"**
- Wait for completion
- **Copy your backend URL**

## 🌐 **Step 2: Deploy Frontend to Vercel**

### 2.1 **Create New Vercel Project**
- Go back to Vercel dashboard
- Click **"Add New..."** → **"Project"**
- Import the **same** GitHub repository

### 2.2 **Configure Frontend Project**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 **Add Frontend Environment Variables**
```env
VITE_API_URL=https://your-nexushub-backend.vercel.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
VITE_APP_NAME=NexusHub
VITE_APP_VERSION=1.0.0
```

### 2.4 **Deploy Frontend**
- Click **"Deploy"**
- Wait for completion
- **Copy your frontend URL**

## 🔄 **Step 3: Update URLs and Redeploy**

### 3.1 **Update Backend CLIENT_URL**
1. Go to **backend Vercel project**
2. Update `CLIENT_URL` to your **frontend URL**
3. Click **"Redeploy"**

### 3.2 **Update Frontend API_URL**
1. Go to **frontend Vercel project**
2. Update `VITE_API_URL` to your **backend URL**
3. Click **"Redeploy"**

## 🗄️ **Step 4: MongoDB Atlas Setup**

### 4.1 **Network Access**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Network Access"**
3. Click **"Add IP Address"**
4. Add: `0.0.0.0/0` (temporarily)
5. Click **"Confirm"**

### 4.2 **Database Access**
1. Go to **"Database Access"**
2. Ensure user has **readWrite** permissions on `sample_mflix`

## 💳 **Step 5: Stripe Webhook Setup**

### 5.1 **Create Webhook**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. **Endpoint URL:** `https://your-nexushub-backend.vercel.app/api/payments/webhook`
4. **Events:** `checkout.session.completed`, `payment_intent.succeeded`
5. Click **"Add endpoint"**

### 5.2 **Get Webhook Secret**
1. Copy the **"Signing secret"** (starts with `whsec_`)
2. Update `STRIPE_WEBHOOK_SECRET` in backend Vercel
3. **Redeploy** backend

## 🧪 **Step 6: Test Your Deployment**

### 6.1 **Backend Health Check**
```bash
curl https://your-nexushub-backend.vercel.app/health
```

### 6.2 **Frontend Test**
1. Visit your frontend URL
2. Test user registration/login
3. Test video upload (if Cloudinary configured)
4. Test Stripe checkout

## 🔒 **Security Checklist**

- [ ] Stripe Secret Key regenerated (if exposed)
- [ ] Strong JWT secrets generated
- [ ] Environment variables not committed to Git
- [ ] MongoDB network access configured
- [ ] Stripe webhooks configured
- [ ] HTTPS enforced (Vercel handles this)

## 🚨 **Troubleshooting**

### **CORS Errors**
- Ensure `CLIENT_URL` in backend matches your frontend URL exactly
- Check that both projects are redeployed after URL updates

### **Database Connection Issues**
- Verify MongoDB Atlas network access allows `0.0.0.0/0`
- Check that your database user has proper permissions

### **Build Failures**
- Ensure Node.js version is 18+ (Vercel handles this)
- Check that all dependencies are in `package.json`

## 🎉 **Success!**

Once deployed, your NexusHub platform will be:
- **Live on the internet** with custom URLs
- **Fully functional** with all features
- **Scalable** and **secure**
- **Ready for users** worldwide

---

**Remember:** Replace all placeholder values with your actual credentials in Vercel environment variables!

