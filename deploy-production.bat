@echo off
echo 🚀 Deploying Ambis Cafe to Production...

REM 1. Deploy Backend to Vercel
echo 📦 Deploying Backend...
cd backend
call vercel --prod
cd ..

REM 2. Build Customer App
echo 📱 Building Customer App...
cd cafe
call npx expo build:android --release-channel production
call npx expo build:ios --release-channel production
cd ..

REM 3. Build Admin App
echo 👨💼 Building Admin App...
cd cafe_admin
call npx expo build:android --release-channel production
call npx expo build:ios --release-channel production
cd ..

echo ✅ Deployment Complete!
echo 📱 Customer App: Ready for Play Store/App Store
echo 👨💼 Admin App: Ready for internal distribution
echo 🌐 Backend: Deployed to Vercel
pause