# 🚀 Deployment Guide for Ambis Cafe

## 📋 Quick Deployment Options

### 1. **Render (Recommended - Free Tier Available)**

#### Backend Deployment:
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set these configurations:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node.js
   - **Plan**: Free (or paid for better performance)

#### Environment Variables (Set in Render Dashboard):
```env
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret_32_chars_minimum
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_PAYMENT_LINK=your_payment_link
PORT=10000
```

### 2. **Vercel (Serverless)**

#### Deploy Backend:
```bash
cd backend
npm install -g vercel
vercel --prod
```

#### Vercel Configuration (vercel.json):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 3. **Railway**

1. Connect GitHub repository
2. Deploy backend service
3. Set environment variables
4. Railway will auto-detect Node.js and run `npm start`

### 4. **Heroku**

#### Deploy Steps:
```bash
# Install Heroku CLI
heroku create ambis-cafe-backend
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=your_url
# ... set other environment variables
git push heroku main
```

### 5. **Docker Deployment**

#### Build and Run:
```bash
# Build image
docker build -t ambis-cafe .

# Run container
docker run -p 3006:3006 \
  -e NODE_ENV=production \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_SERVICE_KEY=your_key \
  -e JWT_SECRET=your_secret \
  -e RAZORPAY_KEY_ID=your_key \
  -e RAZORPAY_KEY_SECRET=your_secret \
  ambis-cafe
```

## 📱 Mobile App Deployment

### Customer App (cafe/):
```bash
cd cafe
npm install
npx expo build:android  # For Android APK
npx expo build:ios      # For iOS (requires Apple Developer account)
```

### Admin App (cafe_admin/):
```bash
cd cafe_admin
npm install
npx expo build:android  # For Android APK
npx expo build:ios      # For iOS
```

## 🔧 Pre-Deployment Checklist

### ✅ Backend Ready:
- [ ] All environment variables set
- [ ] Database (Supabase) configured
- [ ] Payment gateway (Razorpay) configured
- [ ] CORS settings updated for production domain
- [ ] SSL/HTTPS enabled

### ✅ Frontend Ready:
- [ ] API URLs updated to production backend
- [ ] App icons and splash screens configured
- [ ] Push notification setup (if needed)
- [ ] App store metadata prepared

## 🌐 Production URLs

After deployment, update these in your mobile apps:

### API Base URL:
- **Render**: `https://your-app-name.onrender.com`
- **Vercel**: `https://your-app-name.vercel.app`
- **Railway**: `https://your-app-name.up.railway.app`
- **Heroku**: `https://your-app-name.herokuapp.com`

## 🔒 Security Notes

1. **Never commit `.env` files**
2. **Use strong JWT secrets (32+ characters)**
3. **Enable HTTPS in production**
4. **Set proper CORS origins**
5. **Use environment-specific configurations**

## 📊 Monitoring

### Health Check Endpoint:
- `GET /` - Returns server status
- `GET /debug/token-info` - Test authentication (with valid token)

### Logs:
- Check platform-specific logs for debugging
- Monitor database connections
- Track payment processing

## 🆘 Troubleshooting

### Common Issues:

1. **Build Script Missing**: Fixed in package.json
2. **Environment Variables**: Ensure all required vars are set
3. **Database Connection**: Check Supabase credentials
4. **Payment Issues**: Verify Razorpay configuration
5. **CORS Errors**: Update allowed origins for production

### Support:
- Check logs in your deployment platform
- Verify environment variables
- Test API endpoints manually
- Monitor database connections

---

**Your Ambis Cafe system is now ready for production deployment!** 🎉