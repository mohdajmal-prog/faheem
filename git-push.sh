#!/bin/bash
# Quick GitHub push script

echo "🚀 Pushing to GitHub..."

# Initialize git if needed
if [ ! -d ".git" ]; then
    git init
    git branch -M main
fi

# Add all files
git add .

# Commit with message
git commit -m "feat: Complete Ambis Cafe with Twilio OTP and icon system

- Replaced all emojis with Ionicons
- Real Twilio SMS OTP integration  
- Advertisement system with fallbacks
- Enhanced error handling"

echo "✅ Ready to push!"
echo "Run: git remote add origin YOUR_REPO_URL"
echo "Then: git push -u origin main"