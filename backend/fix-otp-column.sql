-- Fix OTP column size to store bcrypt hashed OTPs
-- bcrypt hashes are 60 characters long

-- Drop the old otps table if it exists and recreate with correct schema
-- This is necessary because VARCHAR(6) cannot store bcrypt hashes

-- First, backup any existing data (optional - drop if you want a clean slate)
-- DROP TABLE IF EXISTS otps;

-- Create the otps table with proper column sizes
CREATE TABLE IF NOT EXISTS otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  phone VARCHAR(20),
  otp VARCHAR(255) NOT NULL,  -- Changed from VARCHAR(6) to VARCHAR(255) to store bcrypt hashes
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Create indexes (drop and recreate to ensure they exist)
DROP INDEX IF EXISTS idx_otps_email;
DROP INDEX IF EXISTS idx_otps_phone;

CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);

-- Enable Row Level Security
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- Service role bypass (backend uses service key)
DROP POLICY IF EXISTS "Service role full access otps" ON otps;
CREATE POLICY "Service role full access otps" ON otps FOR ALL USING (true);

-- Note: This script assumes the database has RLS policies set up for the service role
-- If you get permission errors, run this with your Supabase service role key

