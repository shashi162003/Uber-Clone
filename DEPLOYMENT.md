# 🚀 Deployment Guide

This guide will help you deploy the Uber Clone application to production using Render for the backend and Vercel for the frontend.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **GitHub Repository** - Your code pushed to GitHub
2. **MongoDB Atlas Account** - For production database
3. **Google Maps API Key** - For location services
4. **Render Account** - For backend deployment
5. **Vercel Account** - For frontend deployment

## 🔧 Backend Deployment (Render)

### Step 1: Prepare MongoDB Atlas

1. Create a MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist IP addresses (use 0.0.0.0/0 for Render)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/uber-clone`

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `uber-clone-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables

In Render dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/uber-clone
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=24h
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://your-app-name.onrender.com`

## 🎨 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables

In Vercel dashboard, add these environment variables:

```env
VITE_API_URL=https://your-backend-app.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-app.vercel.app`

## 🔄 Automatic Deployments

Both Render and Vercel will automatically redeploy when you push to the main branch.

## ✅ Verification

1. **Backend**: Visit `https://your-backend-app.onrender.com` - should show "Hello World"
2. **Frontend**: Visit `https://your-app.vercel.app` - should show the application
3. **Database**: Check MongoDB Atlas for connection logs
4. **API**: Test API endpoints using the frontend

## 🐛 Troubleshooting

### Common Issues

**Backend not starting:**
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check Render logs for errors

**Frontend API errors:**
- Ensure VITE_API_URL points to your Render backend
- Check CORS settings in backend
- Verify API endpoints are working

**Database connection issues:**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has correct permissions

## 📊 Monitoring

### Backend (Render)
- Monitor logs in Render dashboard
- Set up health checks
- Monitor response times

### Frontend (Vercel)
- Use Vercel Analytics
- Monitor Core Web Vitals
- Check deployment logs

## 🔒 Security Checklist

- [ ] Environment variables are set correctly
- [ ] MongoDB Atlas IP whitelist is configured
- [ ] JWT secret is secure and random
- [ ] Google Maps API key has proper restrictions
- [ ] CORS is configured for production domains
- [ ] HTTPS is enabled (automatic on both platforms)

## 📈 Performance Optimization

### Backend
- Enable compression in Express
- Use MongoDB indexes
- Implement caching where appropriate
- Monitor database queries

### Frontend
- Optimize images and assets
- Use code splitting
- Enable service workers
- Monitor bundle size

## 🚀 Going Live

1. Update README.md with live URLs
2. Test all features thoroughly
3. Set up monitoring and alerts
4. Create backup strategies
5. Document any custom configurations

Your Uber Clone is now live! 🎉
