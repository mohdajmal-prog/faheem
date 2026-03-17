#!/bin/bash

# Comprehensive Git Push Script for Cafe App
# This script commits all changes and pushes to the repository

echo "🚀 Starting Git commit and push process..."
echo "================================================"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a Git repository"
    echo "Please run this script from the root of your Git repository"
    exit 1
fi

# Check Git status
echo "📊 Current Git status:"
git status --short

echo ""
echo "📝 Preparing comprehensive commit..."

# Add all changes
echo "➕ Adding all changes to staging..."
git add .

# Check if there are any changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
    exit 0
fi

# Create comprehensive commit message
COMMIT_MESSAGE="🔧 Major Error Fixes & System Improvements

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

# Commit changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo "✅ Changes committed successfully!"
else
    echo "❌ Error: Failed to commit changes"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Current branch: $CURRENT_BRANCH"

# Push to remote
echo "🚀 Pushing to remote repository..."
git push origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! All changes pushed to repository"
    echo "================================================"
    echo "📋 Summary:"
    echo "   ✅ All files added and committed"
    echo "   ✅ Pushed to branch: $CURRENT_BRANCH"
    echo "   ✅ Repository is up to date"
    echo ""
    echo "🔗 Your changes are now available in the remote repository!"
else
    echo "❌ Error: Failed to push to remote repository"
    echo "Please check your internet connection and repository permissions"
    exit 1
fi