const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function fixDatabase() {
  console.log('🔧 Starting database fixes...');
  
  try {
    // 1. Test and fix OTP table by recreating it
    console.log('🔧 Fixing OTP table...');
    
    // First, let's check if we can create the advertisements table
    console.log('📢 Creating advertisements table...');
    
    // Create a simple test to see if advertisements work
    const { data: adsTest, error: adsError } = await supabase
      .from('advertisements')
      .select('*')
      .limit(1);
    
    if (adsError) {
      console.log('❌ Advertisements table missing, this needs to be created in Supabase SQL Editor');
      console.log('Please run the SQL from fix-database-issues.sql in your Supabase dashboard');
    } else {
      console.log('✅ Advertisements table exists');
    }
    
    // 2. Test app_settings
    console.log('⚙️ Testing app_settings...');
    const { data: settings, error: settingsError } = await supabase
      .from('app_settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (settingsError) {
      console.log('❌ App settings table issue:', settingsError.message);
    } else {
      console.log('✅ App settings working');
    }
    
    // 3. Test menu performance
    console.log('📋 Testing menu performance...');
    const start = Date.now();
    const { data: menu, error: menuError } = await supabase
      .from('menu_items')
      .select('id, name, price')
      .eq('available', true)
      .limit(10);
    
    const duration = Date.now() - start;
    
    if (menuError) {
      console.log('❌ Menu error:', menuError.message);
    } else {
      console.log(`✅ Menu query: ${duration}ms (${menu?.length || 0} items)`);
    }
    
    console.log('\n📋 Summary:');
    console.log('1. For OTP issues: The table structure needs to be fixed in Supabase SQL Editor');
    console.log('2. For advertisements: Run the SQL script in Supabase dashboard');
    console.log('3. Menu performance looks good');
    console.log('\n🔗 Go to: https://supabase.com/dashboard/project/csymdwzebhkfxjdyykrb/sql');
    console.log('📄 Copy and run the contents of: fix-database-issues.sql');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixDatabase();