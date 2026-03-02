# Vercel Deployment Guide - Cafe App

## 📋 Pre-Deployment Checklist

- [x] All code committed to GitHub
- [x] Environment variables configured
- [x] Backend and frontend tested locally
- [x] No console errors
- [x] All features working

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Deploy Backend to Vercel

#### 1.1 Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub
- Authorize Vercel to access your repositories

#### 1.2 Deploy Backend
```bash
cd backend
vercel
```

**Configuration:**
- Project name: `cafe-backend`
- Framework: `Other`
- Root directory: `backend`
- Build command: `npm install`
- Output directory: `.`
- Environment variables:
  - `SUPABASE_URL`: https://csymdwzebhkfxjdyykrb.supabase.co
  - `SUPABASE_SERVICE_KEY`: (from .env)
  - `JWT_SECRET`: cafe_secret_2024_ajmal_xyz
  - `PORT`: 3006

**Result:** Backend URL will be like `https://cafe-backend-xxx.vercel.app`

---

### Step 2: Deploy Frontend to Vercel

#### 2.1 Update API Configuration
Edit `cafe/src/constants/api.ts`:

```typescript
// Change from:
const MANUAL_IP = '10.15.56.208';

// To:
const MANUAL_IP = 'https://cafe-backend-xxx.vercel.app'; // Your backend URL
```

#### 2.2 Deploy Frontend
```bash
cd cafe
vercel
```

**Configuration:**
- Project name: `cafe-app`
- Framework: `Expo`
- Root directory: `cafe`
- Build command: `npm run build`
- Output directory: `dist`

**Result:** Frontend URL will be like `https://cafe-app-xxx.vercel.app`

---

### Step 3: Deploy Admin Panel to Vercel

#### 3.1 Update API Configuration
Edit `cafe_admin/src/constants/api.ts`:

```typescript
// Change from:
const MANUAL_IP = '10.15.56.208';

// To:
const MANUAL_IP = 'https://cafe-backend-xxx.vercel.app'; // Your backend URL
```

#### 3.2 Deploy Admin
```bash
cd cafe_admin
vercel
```

**Configuration:**
- Project name: `cafe-admin`
- Framework: `Expo`
- Root directory: `cafe_admin`
- Build command: `npm run build`
- Output directory: `dist`

**Result:** Admin URL will be like `https://cafe-admin-xxx.vercel.app`

---

## 🔧 Environment Variables Setup

### Backend Environment Variables (Vercel Dashboard)

1. Go to Vercel Dashboard
2. Select `cafe-backend` project
3. Go to Settings → Environment Variables
4. Add:

```
SUPABASE_URL=https://csymdwzebhkfxjdyykrb.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=cafe_secret_2024_ajmal_xyz
DATABASE_URL=postgresql://postgres:AmbisCafe47$@db.csymdwzebhkfxjdyykrb.supabase.co:5432/postgres
PORT=3006
```

---

## 📱 Frontend Configuration

### Update API Base URL

**File:** `cafe/src/constants/api.ts`

```typescript
// Replace:
const MANUAL_IP = '10.15.56.208';

// With your Vercel backend URL:
const MANUAL_IP = 'https://cafe-backend-xxx.vercel.app';

// Or use environment variable:
const MANUAL_IP = process.env.EXPO_PUBLIC_API_URL || 'https://cafe-backend-xxx.vercel.app';
```

### Add to `cafe/.env.production`

```
EXPO_PUBLIC_API_URL=https://cafe-backend-xxx.vercel.app
```

---

## 🔗 CORS Configuration

### Backend CORS Setup

**File:** `backend/server.js`

```javascript
app.use(cors({
  origin: [
    'https://cafe-app-xxx.vercel.app',
    'https://cafe-admin-xxx.vercel.app',
    'http://localhost:3000',
    'http://localhost:8081'
  ],
  credentials: true
}));
```

---

## ✅ Post-Deployment Testing

### 1. Test Backend
```bash
curl https://cafe-backend-xxx.vercel.app/
# Should return: {"message": "Cafe Backend API is running", "status": "ok"}
```

### 2. Test Frontend
- Open https://cafe-app-xxx.vercel.app
- Test login/register
- Test menu loading
- Test cart functionality
- Test order creation

### 3. Test Admin Panel
- Open https://cafe-admin-xxx.vercel.app
- Test admin login
- Test menu management
- Test order viewing
- Test analytics

---

## 🐛 Troubleshooting

### Issue: API Connection Failed
**Solution:**
1. Check backend URL in frontend config
2. Verify CORS settings
3. Check environment variables in Vercel dashboard
4. Restart deployment

### Issue: Build Failed
**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are installed
3. Check for TypeScript errors
4. Verify environment variables

### Issue: WebSocket Connection Failed
**Solution:**
1. WebSocket may not work on Vercel serverless
2. Use polling instead (already implemented as fallback)
3. Consider using Supabase real-time instead

---

## 📊 Deployment URLs

After deployment, you'll have:

```
Frontend: https://cafe-app-xxx.vercel.app
Admin: https://cafe-admin-xxx.vercel.app
Backend: https://cafe-backend-xxx.vercel.app
```

---

## 🔐 Security Checklist

- [x] Environment variables not exposed
- [x] CORS properly configured
- [x] JWT tokens secure
- [x] Database credentials protected
- [x] API keys not in code

---

## 📈 Monitoring

### Vercel Dashboard
- Monitor deployments
- Check build logs
- View analytics
- Monitor errors

### Backend Logs
- Check Vercel function logs
- Monitor API errors
- Track performance

---

## 🚀 Continuous Deployment

### Auto-Deploy on Push
1. Connect GitHub repository to Vercel
2. Set production branch to `master`
3. Every push to master auto-deploys

### Manual Deployment
```bash
vercel --prod
```

---

## 📞 Support

For deployment issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Check build logs in Vercel dashboard
3. Verify environment variables
4. Test locally first

---

**Status**: ✅ Ready for Deployment
**Last Updated**: 2024
