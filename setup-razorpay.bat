@echo off
echo ========================================
echo    Razorpay Payment Integration Setup
echo ========================================
echo.

echo Step 1: Installing Razorpay backend dependency...
cd backend
call npm install razorpay
echo ✅ Backend Razorpay installed

echo.
echo Step 2: Installing React Native Razorpay...
cd ..\cafe
call npm install react-native-razorpay
echo ✅ Frontend Razorpay installed

echo.
echo Step 3: Setting up database tables...
cd ..\backend
call node setup-payment-tables.js
echo ✅ Database setup attempted

echo.
echo ========================================
echo    IMPORTANT: Manual Configuration Required
echo ========================================
echo.
echo 1. Update your Razorpay credentials in backend\.env:
echo    RAZORPAY_KEY_ID=your_actual_key_id
echo    RAZORPAY_KEY_SECRET=your_actual_key_secret
echo.
echo 2. Get your Razorpay credentials from:
echo    https://dashboard.razorpay.com/app/keys
echo.
echo 3. For React Native, you may need to:
echo    - Run: npx expo install expo-linking
echo    - Add Razorpay to your app.json plugins if needed
echo.
echo 4. Create payment_orders table in Supabase:
echo    - Go to your Supabase dashboard
echo    - Run the SQL from: create-payment-tables.sql
echo.
echo 5. Test the integration:
echo    - Start backend: npm start
echo    - Start app: npx expo start
echo    - Try making a payment
echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Your Razorpay integration is ready!
echo Don't forget to update your credentials.
echo.
pause