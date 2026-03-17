-- Fix Database Issues: OTP constraint, App Settings, and Advertisements
-- Run this in Supabase SQL Editor

-- 1. Fix OTP table constraint issue
-- Drop and recreate OTP table with correct column size
DROP TABLE IF EXISTS otps CASCADE;

CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  phone VARCHAR(20),
  otp VARCHAR(255) NOT NULL,  -- Fixed: Changed from VARCHAR(6) to VARCHAR(255)
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);
CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_otps_expires ON otps(expires_at);

-- Enable RLS and policies
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access otps" ON otps FOR ALL USING (true);

-- 2. Fix app_settings table structure
-- Drop and recreate with correct structure
DROP TABLE IF EXISTS app_settings CASCADE;

CREATE TABLE app_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB,
  paused BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO app_settings (id, key, paused) VALUES (1, 'app_status', false)
ON CONFLICT (id) DO UPDATE SET paused = EXCLUDED.paused;

-- Enable RLS and policies
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access settings" ON app_settings FOR ALL USING (true);

-- 3. Create advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  gradient_colors JSONB DEFAULT '["#FF6B6B", "#4ECDC4"]'::jsonb,
  text_color VARCHAR(7) DEFAULT '#FFFFFF',
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for advertisements
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements(is_active);
CREATE INDEX IF NOT EXISTS idx_advertisements_priority ON advertisements(priority);

-- Enable RLS for advertisements
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access advertisements" ON advertisements FOR ALL USING (true);

-- Insert sample advertisements
INSERT INTO advertisements (title, description, gradient_colors, text_color, is_active, priority) VALUES
('Welcome to Our Cafe!', 'Enjoy fresh coffee and delicious meals', '["#FF6B6B", "#4ECDC4"]'::jsonb, '#FFFFFF', true, 1),
('Daily Special', 'Try our chef''s special menu today', '["#A8E6CF", "#88D8C0"]'::jsonb, '#2C3E50', true, 2)
ON CONFLICT DO NOTHING;

-- 4. Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_users_phone_lookup ON users(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- 5. Clean up expired OTPs (maintenance)
DELETE FROM otps WHERE expires_at < NOW();

-- 6. Analyze tables for better query performance
ANALYZE menu_items;
ANALYZE users;
ANALYZE orders;
ANALYZE otps;
ANALYZE app_settings;
ANALYZE advertisements;