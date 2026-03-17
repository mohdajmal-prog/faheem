@echo off
REM Push entire cafe project to https://github.com/mohdajmal-prog/faheem.git
REM This script sets up the remote and pushes all code

echo 🚀 Pushing entire cafe project to GitHub repository...
echo Repository: https://github.com/mohdajmal-prog/faheem.git
echo ================================================

REM Check if we're in a git repository
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo 📁 Git repository already exists
)

REM Add the remote repository
echo 🔗 Setting up remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/mohdajmal-prog/faheem.git
echo ✅ Remote repository set to: https://github.com/mohdajmal-prog/faheem.git

REM Check Git status
echo 📊 Current Git status:
git status --short

REM Add all files
echo ➕ Adding all files to staging...
git add .

REM Create comprehensive commit message for the entire project
set "COMMIT_MESSAGE=🍕 Complete Ambis Cafe Food Ordering System

🎯 Full-Stack Application Features:
- React Native (Expo) mobile app for customers
- React Native admin panel for restaurant management
- Node.js/Express backend API server
- Supabase PostgreSQL database
- Razorpay payment integration
- Real-time WebSocket updates

📱 Customer App Features:
- Phone-based authentication (no SMS required)
- Dynamic menu browsing with categories
- Shopping cart with quantity management
- Order placement and tracking
- Payment integration (web & mobile compatible)
- Order history and status updates
- Dark/Light theme support
- Advertisement banner system

🖥️ Admin Panel Features:
- Order management dashboard
- Menu item management (add/edit/delete)
- Order status updates
- Analytics and reporting
- Advertisement management
- QR code scanner for order completion

🔧 Backend API Features:
- RESTful API with comprehensive endpoints
- JWT authentication system
- Supabase database integration
- Payment processing with Razorpay
- WebSocket real-time updates
- Rate limiting and security middleware
- Error handling and logging

💳 Payment System:
- Razorpay integration for cards, UPI, wallets
- Web and mobile compatible checkout
- Payment verification and order confirmation
- Fallback payment methods

🛡️ Security & Performance:
- JWT token authentication
- Input validation and sanitization
- CORS protection and security headers
- Error boundaries and comprehensive error handling
- Startup validation scripts
- Environment variable management

🚀 Technical Stack:
- Frontend: React Native, Expo, TypeScript
- Backend: Node.js, Express.js
- Database: PostgreSQL (Supabase)
- Payment: Razorpay
- Real-time: WebSocket
- Authentication: JWT
- Icons: Ionicons (no emojis)

📦 Project Structure:
- /backend - Node.js API server
- /cafe - Customer mobile app
- /cafe_admin - Admin panel app
- /docs - Documentation and guides

✅ All Major Issues Fixed:
- Removed Twilio dependency
- Standardized authentication tokens
- Fixed payment system compatibility
- Enhanced error handling
- Improved API configuration
- Added comprehensive validation

🎉 Production Ready:
- All components tested and working
- Error handling implemented
- Documentation complete
- Deployment ready"

REM Commit all changes
echo 💾 Committing entire project...
git commit -m "%COMMIT_MESSAGE%"

if %errorlevel% neq 0 (
    echo ❌ Error: Failed to commit changes
    pause
    exit /b 1
)

echo ✅ Project committed successfully!

REM Push to the repository
echo 🚀 Pushing to GitHub repository...
echo This may take a few minutes for the initial push...

git branch -M main
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCCESS! Complete project pushed to repository
    echo ================================================
    echo 📋 Repository Details:
    echo    🔗 URL: https://github.com/mohdajmal-prog/faheem.git
    echo    🌿 Branch: main
    echo    📦 Status: All files uploaded
    echo.
    echo 🍕 Your complete Ambis Cafe system is now available at:
    echo    https://github.com/mohdajmal-prog/faheem
    echo.
    echo 📱 To clone and run elsewhere:
    echo    git clone https://github.com/mohdajmal-prog/faheem.git
    echo    cd faheem
    echo    # Follow README.md instructions
    echo.
    echo ✅ Project successfully uploaded to GitHub!
) else (
    echo ❌ Error: Failed to push to repository
    echo.
    echo 🔍 Possible solutions:
    echo    1. Check your internet connection
    echo    2. Verify GitHub repository exists and you have access
    echo    3. Make sure you're logged into Git with correct credentials
    echo.
    echo 💡 Try running: git config --global user.name "Your Name"
    echo    And: git config --global user.email "your.email@example.com"
    pause
    exit /b 1
)

echo.
echo Press any key to continue...
pause >nul