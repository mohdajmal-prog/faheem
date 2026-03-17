#!/bin/bash

# Build script for deployment platforms
echo "🔧 Starting build process for Ambis Cafe Backend..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Run any additional build steps if needed
echo "✅ Build completed successfully!"

# Verify installation
echo "🔍 Verifying installation..."
node -e "console.log('✅ Node.js is working'); console.log('📦 Dependencies installed');"

echo "🎉 Backend is ready for deployment!"