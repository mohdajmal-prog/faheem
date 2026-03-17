-- Create advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    gradient_colors JSONB DEFAULT '["#8B4513", "#D4A574"]'::jsonb,
    text_color VARCHAR(7) DEFAULT '#FFFFFF',
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active advertisements
CREATE INDEX IF NOT EXISTS idx_advertisements_active_priority ON advertisements(is_active, priority);

-- Insert sample advertisements
INSERT INTO advertisements (title, description, gradient_colors, text_color, is_active, priority) VALUES
('Welcome to Ambis Cafe', 'Enjoy fresh coffee and delicious snacks', '["#8B4513", "#D4A574"]'::jsonb, '#FFFFFF', true, 1),
('Special Offer', 'Get 20% off on your first order', '["#FF6B6B", "#FF8E53"]'::jsonb, '#FFFFFF', true, 2),
('Fresh Daily', 'Made with love, served with care', '["#4ECDC4", "#44A08D"]'::jsonb, '#FFFFFF', true, 3)
ON CONFLICT (id) DO NOTHING;