const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupAdvertisements() {
  try {
    console.log('🚀 Setting up advertisements table...');
    
    // Insert default advertisements directly
    const defaultAds = [
      {
        title: 'Welcome to Ambis Cafe',
        description: 'Enjoy fresh coffee and delicious snacks daily!',
        gradient_colors: ['#8B4513', '#D4A574'],
        text_color: '#FFFFFF',
        is_active: true,
        priority: 1
      },
      {
        title: 'Special Offer',
        description: 'Get 20% off on all beverages this week!',
        image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
        gradient_colors: ['#D4A574', '#F5E6D3'],
        text_color: '#2C1810',
        is_active: true,
        priority: 2
      }
    ];

    // Check if table exists by trying to select
    const { data: existingAds, error: selectError } = await supabase
      .from('advertisements')
      .select('id')
      .limit(1);

    if (selectError && selectError.code === 'PGRST116') {
      console.log('❌ Table does not exist. Please create it manually in Supabase dashboard.');
      console.log('Run this SQL in your Supabase SQL editor:');
      console.log(`
CREATE TABLE advertisements (
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

CREATE INDEX idx_advertisements_active_priority ON advertisements(is_active, priority);
      `);
      return;
    }

    // Insert default ads if table exists
    const { error: insertError } = await supabase
      .from('advertisements')
      .upsert(defaultAds, { onConflict: 'title' });

    if (insertError) {
      console.log('ℹ️ Default ads setup:', insertError.message);
    } else {
      console.log('✅ Default advertisements ready');
    }

    console.log('🎉 Advertisements setup complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupAdvertisements();