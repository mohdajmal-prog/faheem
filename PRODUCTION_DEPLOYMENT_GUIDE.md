# 🚀 Production Deployment Guide - Enhanced Security

## 🔒 Security Implementation Complete

Your cafe app has been upgraded to production-level security. Here's what was implemented:

### ✅ Security Enhancements Applied

1. **Enhanced Rate Limiting**
   - General API: 50 requests per 15 minutes
   - Authentication: 3 attempts per 15 minutes  
   - OTP requests: 2 requests per 5 minutes
   - Per-phone OTP cooldown: 2 minutes

2. **Strengthened Authentication**
   - JWT expiry reduced to 24 hours (configurable)
   - OTP expiry reduced to 5 minutes
   - Max login attempts reduced to 3
   - Bcrypt rounds set to 12

3. **Security Headers & Middleware**
   - Helmet with CSP, HSTS, XSS protection
   - Request sanitization (XSS prevention)
   - CORS origin restrictions for production
   - IP validation and logging
   - Payload size limits (1MB)

4. **Input Validation**
   - Phone number format validation
   - OTP format validation (6 digits)
   - Name sanitization and length limits
   - Script tag removal from inputs

## 🔧 Required Configuration Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Generate Strong JWT Secret
```bash
# Generate a cryptographically secure JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Update Environment Variables
Edit `backend/.env` and replace these values:

```env
# Replace with your actual Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_actual_service_key_here

# Use the generated JWT secret from step 2
JWT_SECRET=your_generated_32_character_secret_here

# Set your production domains (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Ensure production environment
NODE_ENV=production
```

### 4. Test Security Configuration
```bash
# Run security validation
npm run start:secure
```

## 🚨 Critical Security Checklist

Before going live, ensure:

- [ ] JWT_SECRET is 32+ characters and cryptographically secure
- [ ] SUPABASE_URL and SUPABASE_SERVICE_KEY are set correctly
- [ ] ALLOWED_ORIGINS contains your actual domain(s)
- [ ] NODE_ENV is set to "production"
- [ ] SSL/TLS certificate is configured
- [ ] Database RLS policies are enabled in Supabase

## 🛡️ Security Features Active

### Rate Limiting
- **API Requests**: 50 per 15 minutes per IP
- **Authentication**: 3 attempts per 15 minutes per IP
- **OTP Requests**: 2 per 5 minutes per IP
- **Phone-specific OTP**: 2 minute cooldown between requests

### Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled

### Input Protection
- Phone number format validation
- OTP format validation (6 digits only)
- XSS prevention (script tag removal)
- Request payload sanitization
- Size limits (1MB max payload)

### Authentication Security
- JWT tokens expire in 24 hours
- OTP codes expire in 5 minutes
- Bcrypt hashing with 12 rounds
- Limited token payload information

## 📊 Monitoring & Maintenance

### Security Logs to Monitor
- Failed authentication attempts
- Rate limit violations
- Invalid OTP attempts
- Suspicious request patterns
- CORS violations

### Regular Security Tasks
- Monitor authentication failure rates
- Review and update rate limits based on usage
- Rotate JWT secrets periodically
- Update dependencies regularly
- Review access logs for anomalies

## 🚀 Deployment Commands

### Development with Security
```bash
npm run dev:secure
```

### Production Deployment
```bash
npm run start:secure
```

### Security Validation Only
```bash
npm run security-check
```

## 🔍 Testing Security Features

### Test Rate Limiting
```bash
# Test general rate limiting
for i in {1..60}; do curl http://localhost:3006/; done

# Test auth rate limiting  
for i in {1..5}; do curl -X POST http://localhost:3006/auth/send-otp -d '{"phone":"1234567890"}' -H "Content-Type: application/json"; done
```

### Test Input Validation
```bash
# Test invalid phone format
curl -X POST http://localhost:3006/auth/send-otp \
  -d '{"phone":"invalid"}' \
  -H "Content-Type: application/json"

# Test XSS prevention
curl -X POST http://localhost:3006/auth/verify-otp \
  -d '{"phone":"1234567890","otp":"123456","name":"<script>alert(1)</script>"}' \
  -H "Content-Type: application/json"
```

## 🆘 Troubleshooting

### Common Issues

1. **"JWT_SECRET is still using default placeholder value"**
   - Generate a new JWT secret and update .env file

2. **"CORS will block all origins in production"**
   - Set ALLOWED_ORIGINS in .env file

3. **Rate limiting too strict**
   - Adjust RATE_LIMIT_MAX_REQUESTS in .env file

4. **OTP not working**
   - Check OTP_EXPIRY_MINUTES and rate limiting settings

### Security Validation Errors
The startup script will prevent the server from starting if critical security issues are detected. Fix all errors before deployment.

## 📞 Support

If you encounter issues:
1. Check the security validation output
2. Review the PRODUCTION_SECURITY_CHECKLIST.md
3. Ensure all environment variables are properly set
4. Test with the provided security test commands

Your app is now ready for production with enterprise-level security! 🔒