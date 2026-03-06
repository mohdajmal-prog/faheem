const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupAdvertisements() {
  try {
    console.log('🚀 Setting up advertisements table...');
    
    // Create advertisements table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
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
        
        CREATE INDEX IF NOT EXISTS idx_advertisements_active_priority 
        ON advertisements(is_active, priority);
      `
    });

    if (createError) {
      console.error('❌ Error creating table:', createError);
      return;
    }

    // Insert default advertisements
    const defaultAds = [
      {
        title: 'Special Offer',
        description: 'Get 20% off on all beverages this week!',
        gradient_colors: ['#8B4513', '#D4A574'],
        text_color: '#FFFFFF',
        is_active: true,
        priority: 1
      },
      {
        title: 'New Arrival',
        description: 'Try our delicious new dessert collection',
        image_url: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/iced-coffee-latte-ads-design-template-7e0e2a396956196c53f82ee277d61a1e_screen.jpg?ts=1661763339',
        gradient_colors: ['#D4A574', '#F5E6D3'],
        text_color: '#2C1810',
        is_active: true,
        priority: 2
      },
      {
        title: 'Loyalty Rewards',
        description: 'Earn points on every order and redeem them',
        gradient_colors: ['#A0522D', '#DEB887'],
        text_color: '#FFFFFF',
        is_active: true,
        priority: 3
      },
      {
        title: 'Happy Hour',
        description: '50% discount on selected items 3-5 PM daily',
        gradient_colors: ['#8B7500', '#F0E68C'],
        text_color: '#2C1810',
        is_active: true,
        priority: 4
      }
    ];

    const { error: insertError } = await supabase
      .from('advertisements')
      .insert(defaultAds);

    if (insertError) {
      console.log('ℹ️ Default ads might already exist:', insertError.message);
    } else {
      console.log('✅ Default advertisements inserted');
    }

    console.log('🎉 Advertisements setup complete!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupAdvertisements();