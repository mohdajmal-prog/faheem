# 401 Unauthorized Error Fix Guide

## Problem Summary
The app is returning a **401 Unauthorized** error when trying to fetch orders. This means the authentication token is either not being sent or not being validated correctly.

## Root Causes Addressed

### 1. ✅ **Removed Stub API File**
- **Issue**: A placeholder `src/services/api.ts` file at the root level existed with fake API_BASE_URL and NO authentication logic
- **Fix**: Deleted this file to avoid confusion and ensure the correct `cafe/src/services/api.ts` is used

### 2. ✅ **Enhanced Authentication Debugging**
Added comprehensive logging to trace:
- Token storage/retrieval in AsyncStorage
- Token inclusion in API requests
- Backend token verification

## Changes Made

### Frontend (`cafe/src/services/api.ts`)

#### 1. Enhanced getAuthToken function
```typescript
const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    console.log('🔍 getAuthToken:', token ? `Token found (${token.substring(0, 20)}...)` : 'No token found');
    return token;
  } catch (error) {
    console.error('❌ getAuthToken error:', error);
    return null;
  }
};
```

#### 2. Enhanced setAuthToken function  
```typescript
const setAuthToken = async (token: string | null) => {
  try {
    if (token) {
      console.log('💾 setAuthToken: Storing token (', token.substring(0, 20), '...)');
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      console.log('✅ Token stored successfully');
    } else {
      console.log('🗑️  Clearing token');
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (error) {
    console.error('❌ setAuthToken error:', error);
  }
};
```

#### 3. Enhanced authFetch function
```typescript
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();
  console.log('🔐 authFetch - Token present:', !!token);
  if (!token) {
    console.warn('⚠️ WARNING: No token found in AsyncStorage! User may not be logged in.');
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('✅ authFetch - Added Authorization header');
  }

  console.log('📤 authFetch - Fetching from:', url);
  return fetch(url, { ...options, headers });
};
```

#### 4. Enhanced verifyOTP function
Added logging to track token reception and storage after login

#### 5. Enhanced getOrders function
Added logging to show when orders are being fetched

### Backend (`backend/routes/authMiddleware.js`)

Added comprehensive logging:
```javascript
console.log('🔐 AuthMiddleware - Authorization header:', authHeader ? `${authHeader.substring(0, 30)}...` : 'NOT PROVIDED');
console.log('🔍 AuthMiddleware - Verifying JWT token...');
console.log('✅ AuthMiddleware - Token decoded:', decoded);
console.log('❌ AuthMiddleware - Error:', error.message);
```

## Troubleshooting Steps

### Step 1: Check the Console Logs
Open the React Native/Expo app console and look for:

**When logging in**, you should see:
```
📤 Sending OTP to: +91...
📥 Response status: 200
🎫 verifyOTP - Token received, storing...
💾 setAuthToken: Storing token ( eyJhbGc...)
✅ Token stored successfully
```

**When fetching orders**, you should see:
```
📦 getOrders - Fetching orders...
🔐 authFetch - Token present: true
✅ authFetch - Added Authorization header
📤 authFetch - Fetching from: http://[IP]:3006/orders
📦 getOrders - Response status: 200
```

### Step 2: Check Backend Logs
Look for the debug messages in the backend console:

**On successful authentication:**
```
🔐 AuthMiddleware - Authorization header: Bearer eyJhbGc...
🔍 AuthMiddleware - Verifying JWT token...
✅ AuthMiddleware - Token decoded: { userId: '...', email: '...', phone: '...' }
✅ AuthMiddleware - User authenticated: [user-id]
```

### Step 3: Common Issues & Solutions

#### Issue A: "No token found" in authFetch logs
**Cause**: User is not logged in
**Solution**: 
- Make sure you completed the OTP verification
- Check that `verifyOTP` completed successfully
- Check App > Settings > Storage to clear app cache if needed

#### Issue B: "Authorization header: NOT PROVIDED"
**Cause**: Token is not being retrieved from AsyncStorage
**Solution**:
- Check if AsyncStorage is properly initialized
- Verify that the token key is correct (`authToken`)
- Check AsyncStorage permissions in app.json

#### Issue C: "Token decode failed" or "Invalid token"
**Cause**: JWT_SECRET mismatch between client and backend
**Solution**:
- Verify `JWT_SECRET` in `backend/.env` matches what's in `backend/routes/auth.js`
- Check: `JWT_SECRET=cafe_secret_2024_ajmal_xyz`
- Restart backend after any `.env` changes

#### Issue D: CORS errors
**Cause**: Browser/app blocking cross-origin requests
**Solution**:
- CORS is already enabled with `app.use(cors())` in `server.js`
- Verify API_BASE_URL is correct in `cafe/src/constants/api.ts`

## Environment Verification Checklist

- [ ] Backend is running on port 3006
- [ ] `API_BASE_URL` in `cafe/src/constants/api.ts` shows correct IP:port
- [ ] `JWT_SECRET` in `backend/.env` is: `cafe_secret_2024_ajmal_xyz`
- [ ] Supabase database is accessible (check backend startup logs)
- [ ] User successfully completes OTP verification before fetching orders
- [ ] Mobile device/emulator can reach backend IP address

## Quick Restart Guide

### 1. Kill any existing processes on port 3006
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3006).OwningProcess -Force -ErrorAction SilentlyContinue
```

### 2. Start fresh backend
```bash
cd backend
npm start
```

### 3. Expected startup output
```
✅ Connected to Supabase
🚀 WebSocket server initialized.
✅ Server running on http://localhost:3006
📱 Connect app to: http://[YOUR_IP]:3006
🔥 Supabase connected
```

## Token Storage Details

The app stores the JWT token in **AsyncStorage** with key `authToken`:
- **Storage**: React Native AsyncStorage
- **Key**: `authToken`
- **Format**: JWT token string
- **Expiration**: 30 days (set in backend `auth.js`)

When logging out, the token is removed from AsyncStorage automatically via `setAuthToken(null)`.

## API Endpoint Requirements

| Endpoint | Method | Auth Required | Notes |
|----------|--------|---------------|-------|
| `/auth/send-otp` | POST | ❌ No | Send OTP |
| `/auth/verify-otp` | POST | ❌ No | Login/Register, returns token |
| `/orders` | GET | ✅ **Yes** | Fetch user's orders |
| `/orders` | POST | ✅ **Yes** | Create new order |
| `/user/profile` | GET | ✅ **Yes** | Get user profile |
| `/menu` | GET | ❌ No | Get menu items |
| `/admin/pause` | GET | ✅ **Yes** | Get pause state |

## Next Steps

1. **Run the app and check console output** - The new logging will show exactly where the auth flow is breaking
2. **Share the console logs** - Include the debug output when seeking help
3. **Verify the fixes** - Test login → fetch orders should now work

If issues persist after these changes, the console logs will pinpoint the exact problem!
