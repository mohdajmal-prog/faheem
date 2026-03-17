-- Fix OTP table column size for bcrypt hashes
-- Run this in Supabase SQL Editor

-- Drop existing table if it has wrong column size
DROP TABLE IF EXISTS otps;

-- Recreate with correct column sizes
CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  otp VARCHAR(255) NOT NULL,  -- Changed from VARCHAR(6) to support bcrypt hashes
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);
CREATE INDEX IF NOT EXISTS idx_otps_expires ON otps(expires_at);

-- Clean up expired OTPs (optional)
DELETE FROM otps WHERE expires_at < NOW();