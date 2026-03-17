@echo off
echo Building APKs locally using Expo CLI...
echo.
echo Installing Expo CLI...
call npm install -g @expo/cli

echo.
echo Building Customer App APK...
cd cafe
call npx expo install --fix
call npx expo export --platform android
call npx expo run:android --variant release

echo.
echo Building Admin App APK...
cd ..\cafe_admin
call npx expo install --fix
call npx expo export --platform android
call npx expo run:android --variant release

echo.
echo Local builds completed!
echo APK files should be in android/app/build/outputs/apk/release/
pause