# Quick Vercel Deployment Checklist

## ✅ Pre-Deployment

- [x] Code pushed to GitHub
- [x] All tests passed
- [x] No console errors
- [x] Environment variables configured
- [x] vercel.json files present

---

## 🚀 Deployment Steps (Quick)

### 1. Backend Deployment
```bash
cd backend
vercel --prod
```

**Environment Variables to Add:**
- `SUPABASE_URL`: https://csymdwzebhkfxjdyykrb.supabase.co
- `SUPABASE_SERVICE_KEY`: (from .env)
- `JWT_SECRET`: cafe_secret_2024_ajmal_xyz
- `DATABASE_URL`: (from .env)
- `PORT`: 3006

**Note:** Copy the deployed URL (e.g., https://cafe-backend-xxx.vercel.app)

---

### 2. Frontend Deployment

#### Update API URL
Edit `cafe/src/constants/api.ts`:
```typescript
const MANUAL_IP = 'https://cafe-backend-xxx.vercel.app'; // Your backend URL
```

#### Deploy
```bash
cd cafe
vercel --prod
```

---

### 3. Admin Panel Deployment

#### Update API URL
Edit `cafe_admin/src/constants/api.ts`:
```typescript
const MANUAL_IP = 'https://cafe-backend-xxx.vercel.app'; // Your backend URL
```

#### Deploy
```bash
cd cafe_admin
vercel --prod
```

---

## 📋 Configuration Files

### Backend (vercel.json)
✅ Already configured for Node.js

### Frontend (vercel.json)
✅ Already configured for Expo web export

### Environment Variables
✅ Add in Vercel Dashboard → Settings → Environment Variables

---

## 🔗 Final URLs

After deployment:
- **Frontend**: https://cafe-app-xxx.vercel.app
- **Admin**: https://cafe-admin-xxx.vercel.app
- **Backend**: https://cafe-backend-xxx.vercel.app

---

## ✅ Post-Deployment Verification

1. Test backend health check
2. Test frontend login
3. Test menu loading
4. Test cart functionality
5. Test order creation
6. Test admin panel

---

## 📝 Notes

- Update API URLs in both frontend and admin after backend deployment
- Add environment variables before deploying
- Enable auto-deploy from GitHub for continuous deployment
- Monitor Vercel dashboard for errors

---

**Status**: ✅ Ready to Deploy
