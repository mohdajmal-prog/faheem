@echo off
REM Comprehensive Git Push Script for Cafe App (Windows)
REM This script commits all changes and pushes to the repository

echo 🚀 Starting Git commit and push process...
echo ================================================

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Error: Not in a Git repository
    echo Please run this script from the root of your Git repository
    pause
    exit /b 1
)

REM Check Git status
echo 📊 Current Git status:
git status --short

echo.
echo 📝 Preparing comprehensive commit...

REM Add all changes
echo ➕ Adding all changes to staging...
git add .

REM Check if there are any changes to commit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo ℹ️  No changes to commit
    pause
    exit /b 0
)

REM Create comprehensive commit message
set "COMMIT_MESSAGE=🔧 Major Error Fixes & System Improvements

✅ Fixed Issues:
- Removed Twilio dependency completely
- Standardized authentication token storage (authToken)
- Fixed payment system platform detection (web/mobile)
- Improved error handling across all services
- Fixed API URL configuration for localhost
- Enhanced backend authentication flow
- Added comprehensive error boundary component
- Created startup validation scripts
- Fixed Supabase import issues in all routes
- Improved PaymentComponent with fallback methods

🚀 New Features:
- Simple phone-based login (no SMS required)
- Web-compatible payment system
- Better error messages and user feedback
- Startup validation for backend
- Comprehensive error fix documentation

🔧 Technical Improvements:
- Consistent token key usage across all services
- Better platform detection for payment methods
- Enhanced error logging and debugging
- Improved code organization and structure
- Added safety checks and validations

📱 App Status:
- Login: ✅ Working (phone-based)
- Menu: ✅ Loading properly
- Orders: ✅ Creating and displaying
- Payment: ✅ Web and mobile compatible
- Navigation: ✅ Smooth transitions

🎯 All major errors resolved and app is production-ready!"

REM Commit changes
echo 💾 Committing changes...
git commit -m "%COMMIT_MESSAGE%"

if %errorlevel% neq 0 (
    echo ❌ Error: Failed to commit changes
    pause
    exit /b 1
)

echo ✅ Changes committed successfully!

REM Get current branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo 🌿 Current branch: %CURRENT_BRANCH%

REM Push to remote
echo 🚀 Pushing to remote repository...
git push origin %CURRENT_BRANCH%

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCCESS! All changes pushed to repository
    echo ================================================
    echo 📋 Summary:
    echo    ✅ All files added and committed
    echo    ✅ Pushed to branch: %CURRENT_BRANCH%
    echo    ✅ Repository is up to date
    echo.
    echo 🔗 Your changes are now available in the remote repository!
) else (
    echo ❌ Error: Failed to push to remote repository
    echo Please check your internet connection and repository permissions
    pause
    exit /b 1
)

echo.
echo Press any key to continue...
pause >nul