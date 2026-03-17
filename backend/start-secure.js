#!/usr/bin/env node

/**
 * Production Security Startup Script
 * Validates security configuration before starting the server
 */

require('dotenv').config();

// Security validation checks
function validateSecurityConfig() {
  const errors = [];
  const warnings = [];

  // Check JWT Secret
  if (!process.env.JWT_SECRET) {
    errors.push('JWT_SECRET is not set');
  } else if (process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  } else if (process.env.JWT_SECRET === 'your_strong_jwt_secret_here_minimum_32_characters_long') {
    errors.push('JWT_SECRET is still using default placeholder value');
  }

  // Check Supabase configuration
  if (!process.env.SUPABASE_URL || process.env.SUPABASE_URL === 'your_supabase_url_here') {
    errors.push('SUPABASE_URL is not properly configured');
  }

  if (!process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY === 'your_supabase_service_key_here') {
    errors.push('SUPABASE_SERVICE_KEY is not properly configured');
  }

  // Check production environment settings
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.ALLOWED_ORIGINS) {
      warnings.push('ALLOWED_ORIGINS not set - CORS will block all origins in production');
    }

    if (process.env.JWT_EXPIRY && process.env.JWT_EXPIRY !== '24h') {
      warnings.push(`JWT_EXPIRY is set to ${process.env.JWT_EXPIRY} - consider shorter expiry for production`);
    }
  }

  // Check rate limiting configuration
  const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 50;
  if (rateLimitMax > 100) {
    warnings.push(`Rate limit (${rateLimitMax}) might be too high for production`);
  }

  return { errors, warnings };
}

// Display security status
function displaySecurityStatus() {
  console.log('\n🔒 PRODUCTION SECURITY VALIDATION');
  console.log('================================');

  const { errors, warnings } = validateSecurityConfig();

  if (errors.length > 0) {
    console.log('\n❌ CRITICAL SECURITY ERRORS:');
    errors.forEach(error => console.log(`   • ${error}`));
    
    if (process.env.NODE_ENV === 'production') {
      console.log('\n🚨 Cannot start in production mode with security errors!');
      process.exit(1);
    } else {
      console.log('\n⚠️  Development mode - continuing with warnings...');
    }
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  SECURITY WARNINGS:');
    warnings.forEach(warning => console.log(`   • ${warning}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All security checks passed!');
  }

  // Display current security configuration
  console.log('\n📊 CURRENT SECURITY CONFIGURATION:');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   JWT Expiry: ${process.env.JWT_EXPIRY || '24h'}`);
  console.log(`   OTP Expiry: ${process.env.OTP_EXPIRY_MINUTES || 5} minutes`);
  console.log(`   Max Login Attempts: ${process.env.MAX_LOGIN_ATTEMPTS || 3}`);
  console.log(`   Rate Limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 50} requests per ${Math.floor((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 60000)} minutes`);
  console.log(`   Auth Rate Limit: ${process.env.AUTH_RATE_LIMIT_MAX || 3} attempts per 15 minutes`);
  console.log(`   OTP Rate Limit: ${process.env.OTP_RATE_LIMIT_MAX || 2} requests per 5 minutes`);
  console.log(`   BCRYPT Rounds: ${process.env.BCRYPT_ROUNDS || 12}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`   CORS Origins: ${process.env.ALLOWED_ORIGINS || 'NOT SET'}`);
  }

  console.log('\n================================\n');
}

// Run security validation
displaySecurityStatus();

// Start the server
require('./server.js');