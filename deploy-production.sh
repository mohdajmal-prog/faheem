#!/bin/bash

echo "🚀 Deploying Ambis Cafe to Production..."

# 1. Deploy Backend to Vercel
echo "📦 Deploying Backend..."
cd backend
vercel --prod
cd ..

# 2. Build Customer App
echo "📱 Building Customer App..."
cd cafe
expo build:android --release-channel production
expo build:ios --release-channel production
cd ..

# 3. Build Admin App
echo "👨‍💼 Building Admin App..."
cd cafe_admin
expo build:android --release-channel production
expo build:ios --release-channel production
cd ..

echo "✅ Deployment Complete!"
echo "📱 Customer App: Ready for Play Store/App Store"
echo "👨‍💼 Admin App: Ready for internal distribution"
echo "🌐 Backend: Deployed to Vercel"