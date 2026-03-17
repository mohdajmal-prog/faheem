require('dotenv').config();
const supabase = require('./config/supabase');

async function setupAdvertisements() {
  console.log('🎯 Setting up advertisements...');
  
  try {
    // Check if advertisements exist
    const { data: existing, error: checkError } = await supabase
      .from('advertisements')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Table check error:', checkError);
      return;
    }
    
    if (existing && existing.length > 0) {
      console.log('✅ Advertisements table already has data');
      console.log(`📊 Found ${existing.length} advertisements`);
      return;
    }
    
    // Insert sample advertisements
    const sampleAds = [
      {
        title: 'Welcome to Ambis Cafe',
        description: 'Enjoy fresh coffee and delicious snacks',
        gradient_colors: ['#8B4513', '#D4A574'],
        text_color: '#FFFFFF',
        is_active: true,
        priority: 1
      },
      {
        title: 'Special Offer',
        description: 'Get 20% off on your first order',
        gradient_colors: ['#FF6B6B', '#FF8E53'],
        text_color: '#FFFFFF',
        is_active: true,
        priority: 2
      },
      {
        title: 'Fresh Daily',
        description: 'Made with love, served with care',
        gradient_colors: ['#4ECDC4', '#44A08D'],
        text_color: '#FFFFFF',
        is_active: true,
        priority: 3
      }
    ];
    
    const { data, error } = await supabase
      .from('advertisements')
      .insert(sampleAds)
      .select();
    
    if (error) {
      console.error('❌ Insert error:', error);
    } else {
      console.log('✅ Sample advertisements inserted');
      console.log(`📊 Created ${data.length} advertisements`);
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
}

setupAdvertisements();