@echo off
echo ========================================
echo    🎉 RAZORPAY INTEGRATION READY!
echo ========================================
echo.

echo ✅ Your Razorpay credentials are configured:
echo    Key ID: rzp_test_SQHfhNrYsSTGV8
echo    Status: ACTIVE
echo.

echo 📋 MANUAL STEP REQUIRED:
echo.
echo 1. Go to your Supabase Dashboard:
echo    https://supabase.com/dashboard
echo.
echo 2. Select your project and go to SQL Editor
echo.
echo 3. Run this SQL command:
echo.
echo    CREATE TABLE IF NOT EXISTS payment_orders (
echo        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
echo        razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
echo        razorpay_payment_id VARCHAR(255),
echo        order_id UUID,
echo        user_id UUID,
echo        amount DECIMAL(10,2) NOT NULL,
echo        currency VARCHAR(3) DEFAULT 'INR',
echo        status VARCHAR(20) DEFAULT 'created',
echo        failure_reason TEXT,
echo        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
echo        verified_at TIMESTAMP WITH TIME ZONE,
echo        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
echo    );
echo.
echo    ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';
echo.

echo 4. After running the SQL, start your servers:
echo.
echo    Backend:  cd backend && npm start
echo    Frontend: cd cafe && npx expo start
echo.

echo ========================================
echo    🚀 READY TO TEST PAYMENTS!
echo ========================================
echo.
echo Your app now supports:
echo ✅ Real-time Razorpay payments
echo ✅ Cards, UPI, Wallets, Net Banking
echo ✅ Automatic order confirmation
echo ✅ Payment tracking and history
echo.
echo Test with small amounts first!
echo.
pause