@echo off
echo 🚀 Pushing Ambis Cafe to GitHub...

REM Check if git is initialized
if not exist ".git" (
    echo 📝 Initializing git repository...
    git init
    git branch -M main
) else (
    echo ✅ Git repository already exists
)

REM Add all files
echo 📦 Adding files to git...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if %errorlevel% neq 0 (
    echo 💾 Committing changes...
    git commit -m "feat: Complete Ambis Cafe app with emoji to icon conversion, Twilio OTP integration, and advertisements system

- Replaced all emojis with Ionicons for consistent UI
- Implemented real-time Twilio SMS OTP authentication
- Added advertisements system with fallback support
- Fixed login/register screens and removed demo notifications
- Enhanced error handling and user experience
- Added comprehensive testing scripts
- Updated database schema for advertisements"
) else (
    echo ℹ️ No changes to commit
)

echo 🌐 Ready to push to GitHub!
echo.
echo Next steps:
echo 1. Create a new repository on GitHub (https://github.com/new)
echo 2. Copy the repository URL
echo 3. Run: git remote add origin YOUR_REPO_URL
echo 4. Run: git push -u origin main
echo.
echo Example:
echo git remote add origin https://github.com/yourusername/ambis-cafe.git
echo git push -u origin main

pause