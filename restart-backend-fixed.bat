@echo off
echo 🔄 Restarting backend server...
cd /d "d:\Github_clone\cafe_2\backend"

echo 📋 Killing existing Node processes...
taskkill /f /im node.exe 2>nul

echo 🚀 Starting server...
start "Cafe Backend" cmd /k "npm start"

echo ✅ Backend server restarted!
echo 🌐 Server should be running on http://localhost:3006
pause