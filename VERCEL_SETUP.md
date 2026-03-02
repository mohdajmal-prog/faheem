# Vercel Setup Instructions

## ✅ Vercel Configuration

### Project Settings
- **Project Name**: cafe-f
- **Framework**: Other (Node.js)
- **Root Directory**: `./backend` (for backend deployment)
- **Build Command**: `npm run build`
- **Output Directory**: `.`
- **Install Command**: `npm install`

---

## 🔧 Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
SUPABASE_URL=https://csymdwzebhkfxjdyykrb.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeW1kd3plYmhrZnhqZHl5a3JiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQwMjU3MSwiZXhwIjoyMDg2OTc4NTcxfQ.yApFlbcpCOF_QVSdtrLaqcg2EoiHri7LymmTLeye0-c
JWT_SECRET=cafe_secret_2024_ajmal_xyz
DATABASE_URL=postgresql://postgres:AmbisCafe47$@db.csymdwzebhkfxjdyykrb.supabase.co:5432/postgres
PORT=3006
```

---

## 📝 Deployment Steps

### 1. Backend Deployment
1. Go to Vercel Dashboard
2. Click "New Project"
3. Import from GitHub: `mohdajmal-prog/cafe-f`
4. Set Root Directory: `./backend`
5. Add Environment Variables (see above)
6. Deploy

**Backend URL**: Will be provided after deployment (e.g., `https://cafe-f.vercel.app`)

### 2. Frontend Deployment
1. Create new Vercel project
2. Import same GitHub repo
3. Set Root Directory: `./cafe`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:
   ```
   EXPO_PUBLIC_API_URL=https://cafe-f.vercel.app
   ```
7. Deploy

### 3. Admin Panel Deployment
1. Create new Vercel project
2. Import same GitHub repo
3. Set Root Directory: `./cafe_admin`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:
   ```
   EXPO_PUBLIC_API_URL=https://cafe-f.vercel.app
   ```
7. Deploy

---

## ✅ Post-Deployment

1. Test backend: `https://your-backend-url/`
2. Update frontend API URL with backend URL
3. Test frontend login
4. Test menu loading
5. Test cart and orders

---

**Status**: Ready for Deployment
