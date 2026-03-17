@echo off
echo ========================================
echo    Ambis Cafe APK Builder
echo ========================================
echo.

echo Step 1: Building Customer App APK...
echo ----------------------------------------
cd cafe
echo Current directory: %CD%
echo.

echo Logging into EAS...
call eas login
if %ERRORLEVEL% neq 0 (
    echo Failed to login to EAS. Please check your credentials.
    pause
    exit /b 1
)

echo.
echo Starting APK build for Customer App...
call eas build --platform android --profile preview --non-interactive
if %ERRORLEVEL% neq 0 (
    echo Customer app build failed!
    pause
    exit /b 1
)

echo.
echo Customer App APK build initiated successfully!
echo.

echo Step 2: Building Admin App APK...
echo ----------------------------------------
cd ..\cafe_admin
echo Current directory: %CD%
echo.

echo Starting APK build for Admin App...
call eas build --platform android --profile preview --non-interactive
if %ERRORLEVEL% neq 0 (
    echo Admin app build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    BUILD PROCESS COMPLETED!
echo ========================================
echo.
echo Both APK builds have been initiated successfully!
echo.
echo To download your APKs:
echo 1. Visit: https://expo.dev/accounts/[your-account]/projects
echo 2. Find your builds and download the APK files
echo 3. Install on Android devices
echo.
echo Customer App Package: com.ambiscafe.app
echo Admin App Package: com.ambiscafe.admin
echo.
pause