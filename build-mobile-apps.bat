@echo off
echo 📱 Building Mobile Apps for Distribution...

REM Build Customer App
echo Building Customer App...
cd cafe
call npx expo build:android --type apk
call npx expo build:ios
cd ..

REM Build Admin App
echo Building Admin App...
cd cafe_admin
call npx expo build:android --type apk
call npx expo build:ios
cd ..

echo ✅ Apps built successfully!
echo 📱 Customer APK: Ready for Google Play Store
echo 👨‍💼 Admin APK: Ready for internal use
pause