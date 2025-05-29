# 🚀 Complete Deployment Guide

## 📋 Prerequisites Checklist

Before starting deployment, ensure you have:

- [ ] GitHub account and repository created
- [ ] MongoDB Atlas account (free tier available)
- [ ] Google Maps API key with Places API enabled
- [ ] Render account (free tier available)
- [ ] Vercel account (free tier available)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Build a Database" → "M0 Sandbox" (Free)
4. Select a cloud provider and region (closest to your users)
5. Name your cluster (e.g., "uber-clone-cluster")

### 1.2 Configure Database Access
1. **Create Database User:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `uber_admin`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"

2. **Configure Network Access:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Render deployment

### 1.3 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://uber_admin:<password>@uber-clone-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `/uber-clone` before the `?`
   ```
   mongodb+srv://uber_admin:yourpassword@uber-clone-cluster.xxxxx.mongodb.net/uber-clone?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Prepare for Render
1. Ensure your code is pushed to GitHub
2. Your backend should be in the `Backend/` directory

### 2.2 Create Render Account and Deploy
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:

**Basic Settings:**
- **Name**: `uber-clone-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `Backend`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.3 Set Environment Variables
In the Render dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URL=mongodb+srv://uber_admin:yourpassword@uber-clone-cluster.xxxxx.mongodb.net/uber-clone?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-for-production
JWT_EXPIRES_IN=24h
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
FRONTEND_URL=https://your-app.vercel.app
```

**Important Notes:**
- Generate a strong JWT_SECRET (32+ characters)
- Use your actual MongoDB connection string
- FRONTEND_URL will be updated after Vercel deployment

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://your-app-name.onrender.com`
4. Test by visiting the URL - should show JSON response

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### 3.2 Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure the project:

**Framework Preset**: Vite
**Root Directory**: `Frontend`
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### 3.3 Set Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend-app.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Note your frontend URL: `https://your-app.vercel.app`

---

## 🔄 Step 4: Update Backend CORS

### 4.1 Update Environment Variables
Go back to Render dashboard and update:
```env
FRONTEND_URL=https://your-actual-app.vercel.app
```

### 4.2 Redeploy Backend
Render will automatically redeploy when you update environment variables.

---

## ✅ Step 5: Verification

### 5.1 Test Backend
Visit `https://your-backend-app.onrender.com`
Should return:
```json
{
  "message": "Uber Clone Backend API is running!",
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### 5.2 Test Frontend
1. Visit `https://your-app.vercel.app`
2. Should load the application
3. Try registering a new user
4. Check browser console for any errors

### 5.3 Test API Connection
1. Open browser developer tools
2. Go to Network tab
3. Try logging in or registering
4. Should see successful API calls to your Render backend

---

## 🐛 Troubleshooting

### Backend Issues

**Deployment Failed:**
- Check build logs in Render dashboard
- Ensure package.json has correct start script
- Verify Node.js version compatibility

**Database Connection Error:**
- Verify MongoDB connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**CORS Errors:**
- Verify FRONTEND_URL environment variable
- Check allowed origins in backend code
- Ensure both HTTP and HTTPS are handled

### Frontend Issues

**Build Failed:**
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Check for TypeScript or ESLint errors

**API Connection Failed:**
- Verify VITE_API_URL points to correct backend
- Check network tab for failed requests
- Ensure backend is running and accessible

**Environment Variables Not Working:**
- Ensure variables start with VITE_
- Redeploy after adding variables
- Check Vercel environment variables section

---

## 🎉 Success!

Your Uber Clone is now live:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend-app.onrender.com
- **Database**: MongoDB Atlas

## 📈 Next Steps

1. **Custom Domain**: Add custom domain in Vercel
2. **Monitoring**: Set up error tracking (Sentry)
3. **Analytics**: Add Google Analytics
4. **Performance**: Monitor Core Web Vitals
5. **Security**: Review security headers
6. **Backup**: Set up database backups

## 🔄 Automatic Deployments

Both platforms will automatically redeploy when you push to the main branch on GitHub.
