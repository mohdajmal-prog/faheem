-- Fix app_settings table
DROP TABLE IF EXISTS app_settings;

CREATE TABLE app_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default pause state
INSERT INTO app_settings (key, value) VALUES 
('app_paused', 'false');

-- Enable RLS and policy
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access settings" ON app_settings FOR ALL USING (true);