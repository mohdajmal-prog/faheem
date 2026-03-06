-- Migrate app_settings table to correct structure
DROP TABLE IF EXISTS app_settings;

CREATE TABLE app_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert pause state
INSERT INTO app_settings (key, value) VALUES 
('pause_state', '{"is_app_paused": false, "pause_reason": "", "paused_at": null, "resumed_at": null}');

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access settings" ON app_settings FOR ALL USING (true);