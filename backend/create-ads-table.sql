-- Create advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  gradient_colors JSONB DEFAULT '["#8B4513", "#D4A574"]',
  text_color VARCHAR(7) DEFAULT '#FFFFFF',
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default advertisements
INSERT INTO advertisements (title, description, image_url, gradient_colors, text_color, is_active, priority) VALUES
('Special Offer', 'Get 20% off on all beverages this week!', null, '["#8B4513", "#D4A574"]', '#FFFFFF', true, 1),
('New Arrival', 'Try our delicious new dessert collection', 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/iced-coffee-latte-ads-design-template-7e0e2a396956196c53f82ee277d61a1e_screen.jpg?ts=1661763339', '["#D4A574", "#F5E6D3"]', '#2C1810', true, 2),
('Loyalty Rewards', 'Earn points on every order and redeem them', null, '["#A0522D", "#DEB887"]', '#FFFFFF', true, 3),
('Happy Hour', '50% discount on selected items 3-5 PM daily', null, '["#8B7500", "#F0E68C"]', '#2C1810', true, 4);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_advertisements_active_priority ON advertisements(is_active, priority);