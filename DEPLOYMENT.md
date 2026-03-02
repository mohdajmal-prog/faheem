# 🚀 DEPLOYMENT GUIDE

## Backend Deployment (Vercel)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy Backend
```bash
cd backend
vercel
```

### Step 3: Add Environment Variables in Vercel Dashboard
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- JWT_SECRET
- FIREBASE_PROJECT_ID

### Step 4: Get Deployment URL
Example: `https://cafe-backend.vercel.app`

## Frontend Deployment

### Student App (Vercel)
```bash
cd cafe
npm run build
vercel --prod
```

### Admin App (Vercel)
```bash
cd cafe_admin
npm run build
vercel --prod
```

## Update API URLs

After backend deployment, update in both apps:

**cafe/src/constants/api.ts:**
```typescript
export const API_BASE_URL = 'https://your-backend.vercel.app';
```

**cafe_admin/src/constants/api.ts:**
```typescript
export const API_BASE_URL = 'https://your-backend.vercel.app';
```

## Note

Backend is Node.js server - deploy to Vercel/Railway/Render
Frontend apps are Expo - deploy web build to Vercel
