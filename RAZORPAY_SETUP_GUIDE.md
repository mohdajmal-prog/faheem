# 🚀 Razorpay Payment Integration Guide

## 📋 You Have 2 Options:

### Option 1: Full API Integration (Recommended)
- Real-time payment processing
- Better user experience
- Automatic order updates

### Option 2: Payment Link Integration (Quick Setup)
- Uses your existing payment link
- Manual confirmation required
- Faster to implement

---

## 🔧 Option 1: Full API Integration

### Step 1: Get API Keys
1. Go to: https://dashboard.razorpay.com/
2. Login with your account
3. Navigate to: **Settings → API Keys**
4. Click **"Generate Test Key"** (for development)
5. Copy both:
   - **Key ID**: `rzp_test_xxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxx`

### Step 2: Update Environment Variables
Edit `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
```

### Step 3: Test Integration
```bash
cd backend
node test-razorpay-integration.js
```

---

## ⚡ Option 2: Payment Link Integration (Using Your Link)

### Step 1: Already Done!
Your payment link is already configured:
```
https://razorpay.me/@mohamedajmalmohamedrabi
```

### Step 2: Update App to Use Payment Link
Replace the PaymentComponent import in `cafe/app/payment.tsx`:

```javascript
// Change this line:
import PaymentComponent from "../src/components/PaymentComponent";

// To this:
import PaymentComponent from "../src/components/PaymentLinkComponent";
```

### Step 3: Test Payment Link
1. Start your app
2. Add items to cart
3. Go to payment
4. Select "Razorpay" option
5. It will open your payment link

---

## 🗄️ Database Setup (Required for Both Options)

### Run this SQL in your Supabase Dashboard:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Run this SQL:

```sql
-- Create payment_orders table
CREATE TABLE IF NOT EXISTS payment_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
    razorpay_payment_id VARCHAR(255),
    order_id UUID,
    user_id UUID,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'created',
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add payment_status to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON payment_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
```

---

## 🧪 Testing Your Setup

### Test Backend:
```bash
cd backend
npm start
```

### Test Frontend:
```bash
cd cafe
npx expo start
```

### Test Payment Flow:
1. Add items to cart
2. Go to checkout
3. Select payment method
4. Complete payment
5. Verify order status updates

---

## 🔄 Quick Start Commands

### Option 1 (API Integration):
```bash
# 1. Get your API keys from Razorpay dashboard
# 2. Update backend/.env with your keys
# 3. Run setup
setup-razorpay.bat
```

### Option 2 (Payment Link):
```bash
# Already configured! Just start your servers:
cd backend && npm start
cd cafe && npx expo start
```

---

## 📱 What Users Will See:

### Option 1 (API):
- Native payment interface
- Multiple payment options (Cards, UPI, Wallets)
- Instant confirmation

### Option 2 (Payment Link):
- Redirects to your Razorpay.me page
- Manual confirmation required
- Same payment options

---

## 🆘 Need Help?

### Common Issues:
1. **"Invalid API Key"** → Check your credentials in .env
2. **"Payment failed"** → Verify test mode vs live mode
3. **"Database error"** → Run the SQL setup in Supabase

### Quick Test:
```bash
cd backend
node test-razorpay-integration.js
```

---

## 🎯 Recommendation:

**Start with Option 2 (Payment Link)** since you already have it set up, then upgrade to Option 1 (API Integration) later for better user experience.

Your payment link integration is ready to use right now! 🚀