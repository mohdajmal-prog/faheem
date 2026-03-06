# 401 Unauthorized Error - Troubleshooting Guide

## The Problem
Your Expo/React Native app is getting a **401 Unauthorized** error when trying to fetch orders or other authenticated endpoints.

The logs show:
- ✅ Token is found  
- ✅ Authorization header is added
- ❌ But the server returns 401

## Root Causes & Solutions

### 1. **Backend Server Not Running**
Check that your backend server is actually running.

```bash
cd backend
npm start
```

Look for these messages in the console:
```
✅ Connected to Supabase
🔐 Environment Check:
   JWT_SECRET: ✅ SET
```

---

### 2. **JWT_SECRET Mismatch**
The backend uses `JWT_SECRET` to sign and verify tokens. If it doesn't match between:
- Where tokens are **created** (in `auth.js`)
- Where tokens are **verified** (in `authMiddleware.js`)

...then verification will fail.

#### Check Your `.env`:
```bash
# backend/.env
JWT_SECRET=cafe_secret_2024_ajmal_xyz
```

If you don't have a `.env` file, create it with the above value.

**Verify it's being loaded:**
```bash
# Run this in the backend directory
node test-token-debug.js
```

---

### 3. **Token Not Being Stored Correctly**
Even if the token is created during login, it might not be stored in AsyncStorage correctly.

#### Check Frontend Logs:
Look for these logs in your console:
```
🔍 getAuthToken: Token found (eyJhbGc...)    ✅ Good
🔍 getAuthToken: No token found              ❌ Problem
```

If "No token found" appears, the user isn't logged in.

**Solution:** Make sure you're logging in first:
1. Open the app
2. Go to the login screen
3. Enter a phone number and OTP
4. Wait for "Login successful"
5. Then try to fetch orders

---

### 4. **User Doesn't Exist in Database**
After login, the token is created with a `userId`. The backend then looks up this user in Supabase's `users` table. If the user doesn't exist, you get 401.

#### Check the Backend Logs:
After sending a request with an auth token, look for:

**Good case:**
```
✅ AuthMiddleware - Token decoded: { userId: '...' }
✅ AuthMiddleware - User authenticated: user-id-123
```

**Bad case:**
```
❌ AuthMiddleware - User not found with ID: some-id
```

**Solution:** 
- Make sure you completed the OTP login flow
- Check that the user was created in Supabase
- Check [backend logs via Supabase dashboard](https://app.supabase.com)

---

### 5. **Token Expired**
Tokens expire after 30 days. If you've had a token for longer, it won't work.

#### Check the Backend Logs:
```
❌ AuthMiddleware - Error: TokenExpiredError
```

**Solution:** 
Log in again to get a fresh token.

---

### 6. **Authorization Header Format Issue**
The backend expects: `Authorization: Bearer <token>`

But if your code sends something else, it will fail.

#### Verify in Frontend (in `api.ts`):
```typescript
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

This is already correct in your code.

---

## Debugging Steps

### Step 1: Verify Backend Configuration
Run the debug test:
```bash
cd backend
npm install
node test-token-debug.js
```

This will show:
- ✅ JWT_SECRET is set correctly
- ✅ Can create tokens
- ✅ Can verify tokens
- ✅ Can connect to Supabase
- ✅ Can find users in database

### Step 2: Check Backend Logs When Making Request
With the improved middleware:
1. Start the backend: `npm start`
2. Make an authenticated request from the app
3. Look for detailed logs like:
   ```
   🔐 AuthMiddleware - Authorization header: Bearer...
   🔍 AuthMiddleware - Verifying JWT token...
   ✅ AuthMiddleware - Token decoded: { userId: '...' }
   🔍 AuthMiddleware - Looking up user with ID: user-id
   ✅ AuthMiddleware - User authenticated: user-id
   ```

If you see ❌ logs, note the exact error message.

### Step 3: Test Token Endpoint
The backend now has a test endpoint. You can call it from the Expo app:

In `api.ts`, add a test function:
```typescript
testToken: async () => {
  const res = await authFetch(`${API_BASE_URL}/debug/token-info`);
  return handleResponse(res);
}
```

Then call it:
```typescript
const result = await api.testToken();
console.log('Token info:', result);
```

If this succeeds, your token is valid!

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `No token provided` | User not logged in | Complete login flow first |
| `Invalid token format` | JWT_SECRET mismatch | Check `backend/.env` |
| `Token has expired` | Token too old (30+ days) | Log in again |
| `User not found` | User not created in DB | Complete OTP verification |
| `User lookup failed` | Database error | Check Supabase connectivity |

---

## Quick Checklist

- [ ] Backend server is running (`npm start` in `/backend`)
- [ ] `backend/.env` has `JWT_SECRET=cafe_secret_2024_ajmal_xyz`
- [ ] You've completed the login flow (OTP verification)
- [ ] Check frontend logs show "Token found"
- [ ] Check backend logs show successful user authentication
- [ ] Run `node test-token-debug.js` to verify setup

---

## Still Not Working?

1. **Share the backend console logs** - Look for ❌ errors after the request
2. **Run the debug test** - `node test-token-debug.js`  
3. **Check Supabase dashboard** - Verify users table has entries
4. **Check JWT_SECRET matches** - Between `.env` and what's being used

