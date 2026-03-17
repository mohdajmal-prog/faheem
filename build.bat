@echo off
REM Build script for deployment platforms (Windows)
echo 🔧 Starting build process for Ambis Cafe Backend...

REM Navigate to backend directory
cd backend

REM Install dependencies
echo 📦 Installing backend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

REM Verify installation
echo 🔍 Verifying installation...
node -e "console.log('✅ Node.js is working'); console.log('📦 Dependencies installed');"

if %errorlevel% neq 0 (
    echo ❌ Node.js verification failed
    exit /b 1
)

echo ✅ Build completed successfully!
echo 🎉 Backend is ready for deployment!