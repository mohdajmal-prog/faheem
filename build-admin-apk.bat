@echo off
echo Building Ambis Cafe Admin App APK...
cd cafe_admin
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
echo Starting APK build...
call eas build --platform android --profile preview --non-interactive
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo.
echo APK build initiated successfully!
echo Visit https://expo.dev to download your APK when ready.
pause