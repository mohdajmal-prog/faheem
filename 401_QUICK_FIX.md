# 401 Error - Quick Fixes

## The Error
```
ERROR Failed to fetch orders: [Error: Server returned an error: 401. Check console for details.]
```

## 3-Minute Fixes

### ✅ Fix 1: Restart Backend Server
```bash
cd backend
npm start
```
**Why:** Environment variables might not be loaded, or server crashed.

### ✅ Fix 2: Check JWT_SECRET is Set
```bash
# In backend directory
cat .env | grep JWT_SECRET

# Must show:
# JWT_SECRET=cafe_secret_2024_ajmal_xyz
```
**Why:** Without matching JWT_SECRET, tokens can't be verified.

### ✅ Fix 3: Complete Login Flow
1. Close the app completely
2. Reopen it
3. Go to login screen
4. Enter phone: `+91 1234567890`
5. Enter OTP: `123456`
6. Wait for "Login successful"

**Why:** You might still be logged out in the app.

### ✅ Fix 4: Check Token is Actually Stored
Add this to your login component after successful login:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// After login
const token = await AsyncStorage.getItem('authToken');
console.log('Token stored:', token ? 'YES' : 'NO');
```

**Why:** Token might not be saving to storage.

---

## 15-Minute Deep Dive

Run this test:
```bash
cd backend
node test-token-debug.js
```

You should see ✅ everywhere:
```
✅ Token created successfully
✅ Token verified successfully
✅ User table accessible
```

If you see ❌, the message tells you exactly what's wrong.

---

## Check the Detailed Error

In the backend console, after attempting to fetch orders:
```
🔐 AuthMiddleware - Authorization header: Bearer...    ✅ Good
🔍 AuthMiddleware - Verifying JWT token...             ⏳ Checking
✅ AuthMiddleware - Token decoded: { userId: '...' }   ✅ Valid token
🔍 AuthMiddleware - Looking up user with ID: ...       ⏳ Checking DB
❌ AuthMiddleware - User not found with ID: ...        ❌ PROBLEM!
```

The 401 happens at the ❌ step. The error message tells you exactly why.

---

## One-Line Diagnostic

In the backend directory:
```bash
npm start 2>&1 | grep -E "(JWT_SECRET|AuthMiddleware|❌)"
```

This shows only the relevant logs.

---

## Nuclear Option: Complete Reset

```bash
# 1. Kill the backend server (Ctrl+C if running)

# 2. Clear environment
rm backend/.env

# 3. Recreate with known good values
echo "SUPABASE_URL=https://csymdwzebhkfxjdyykrb.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeW1kd3plYmhrZnhqZHl5a3JiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQwMjU3MSwiZXhwIjoyMDg2OTc4NTcxfQ.yApFlbcpCOF_QVSdtrLaqcg2EoiHri7LymmTLeye0-c
JWT_SECRET=cafe_secret_2024_ajmal_xyz
DATABASE_URL=postgresql://postgres:AmbisCafe47$@db.csymdwzebhkfxjdyykrb.supabase.co:5432/postgres
PORT=3006" > backend/.env

# 4. Restart
npm start
```

---

## Still Stuck?

1. **Screenshot the error** - Share the full console output
2. **Run the test** - Run `node test-token-debug.js` and share output
3. **Check your .env** - Verify ALL three variables:
   - [ ] SUPABASE_URL
   - [ ] SUPABASE_SERVICE_KEY  
   - [ ] JWT_SECRET

4. **Verify login worked** - Check Supabase dashboard:
   - Login to https://app.supabase.com
   - Go to your project
   - Check "Tables" → "users" → should have your phone number

---

## Expected Console Output (Success Case)

**Frontend logs:**
```
📦 getOrders - Fetching orders...
🔍 getAuthToken: Token found (eyJhbGci...)
🔐 authFetch - Token present: true
✅ authFetch - Added Authorization header
📤 authFetch - Fetching from: http://10.200.66.35:3006/orders
```

**Backend logs:**
```
🔐 AuthMiddleware - Authorization header: Bearer eyJhbGci...
🔍 AuthMiddleware - Verifying JWT token...
✅ AuthMiddleware - Token decoded: { userId: '123', email: '...', phone: '...' }
🔍 AuthMiddleware - Looking up user with ID: 123
✅ AuthMiddleware - User authenticated: 123
```

If yours doesn't match, something is wrong.

