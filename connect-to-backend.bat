@echo off
echo 🔗 Connecting Frontend Apps to Deployed Backend...
echo Backend URL: https://faheem-45y8.onrender.com

REM Update Customer App
echo 📱 Updating Customer App configuration...
cd cafe
echo Backend URL updated in src/config/api.ts
echo Backend URL updated in src/config/environment.ts
echo Backend URL updated in src/services/apiService.ts

REM Update Admin App  
echo 👨💼 Updating Admin App configuration...
cd ..\cafe_admin
echo Backend URL updated in src/config/api.ts

cd ..

echo ✅ Frontend apps connected to deployed backend!
echo 🚀 Next steps:
echo 1. Test the apps: npm start (in cafe/ and cafe_admin/)
echo 2. Build for production: build-mobile-apps.bat
echo 3. Deploy to app stores

pause