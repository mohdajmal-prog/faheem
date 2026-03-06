require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🧪 Testing Supabase Connection...\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('1️⃣ Configuration Check:');
console.log('   SUPABASE_URL:', supabaseUrl ? '✅ SET' : '❌ NOT SET');
console.log('   SUPABASE_SERVICE_KEY:', supabaseKey ? '✅ SET' : '❌ NOT SET');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials in .env');
  process.exit(1);
}

console.log('\n2️⃣ Creating Supabase Client...');
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: {
    fetch: (...args) => {
      const [url, options = {}] = args;
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
    }
  }
});
console.log('✅ Supabase client created');

async function testConnection() {
  try {
    console.log('\n3️⃣ Testing basic connection (health check)...');
    
    // Try a simple query with timeout
    console.log('   Fetching first 1 user from database...');
    const { data, error } = await Promise.race([
      supabase.from('users').select('id').limit(1),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000)
      )
    ]);

    if (error) {
      console.error('❌ Database error:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      return false;
    }

    console.log('✅ Successfully connected to users table');
    console.log('   Users found:', data?.length || 0);

    if (data && data.length > 0) {
      console.log('\n4️⃣ Database has users:');
      console.log('   ✅ Users table is working');
    } else {
      console.log('\n4️⃣ Database is empty:');
      console.log('   ⚠️ No users in database yet (expected for fresh setup)');
    }

    return true;

  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('timeout')) {
      console.error('\n   This is a CONNECTION TIMEOUT');
      console.error('   Possible causes:');
      console.error('   - Network connectivity issue');
      console.error('   - Firewall blocking Supabase');
      console.error('   - Supabase service unreachable');
      console.error('   - Invalid Supabase URL');
    } else if (error.message.includes('401') || error.message.includes('401')) {
      console.error('\n   This is an AUTHENTICATION ERROR');
      console.error('   The SUPABASE_SERVICE_KEY may be invalid');
    }
    
    return false;
  }
}

testConnection().then(() => {
  console.log('\n=== TEST COMPLETE ===\n');
  process.exit(0);
}).catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
