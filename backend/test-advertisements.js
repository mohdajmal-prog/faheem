require('dotenv').config();
const supabase = require('./config/supabase');

async function testAdvertisements() {
  console.log('🧪 Testing advertisements...');
  
  try {
    // Test direct database query
    console.log('1. Testing database query...');
    const { data: dbData, error: dbError } = await supabase
      .from('advertisements')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });
    
    if (dbError) {
      console.error('❌ Database error:', dbError);
    } else {
      console.log('✅ Database query successful');
      console.log(`📊 Found ${dbData.length} active advertisements`);
      dbData.forEach(ad => {
        console.log(`   - ${ad.title}: ${ad.description}`);
      });
    }
    
    // Test API endpoint
    console.log('\n2. Testing API endpoint...');
    const response = await fetch('http://localhost:3006/api/advertisements');
    
    if (response.ok) {
      const apiData = await response.json();
      console.log('✅ API endpoint successful');
      console.log(`📊 API returned ${apiData.length} advertisements`);
    } else {
      console.error('❌ API endpoint failed:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAdvertisements();