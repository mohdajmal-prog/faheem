@echo off
echo 🌐 Deploying Customer App as Web Application...

cd cafe

echo 📦 Installing web dependencies...
call npm install

echo 🔨 Building for web...
call npm run build:web

echo 🚀 Deploying to Vercel...
call npx vercel --prod

cd ..

echo ✅ Customer Web App Deployed!
echo 🌐 Your app is now accessible via web browser
echo 📱 Users can access it from any device with internet

pause