const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addCompletedAtColumn() {
  try {
    console.log('🔧 Adding completed_at column to orders table...');
    
    // First, let's check current table structure
    const { data: currentOrders, error: checkError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('❌ Error checking orders table:', checkError);
      return;
    }
    
    console.log('Current orders table columns:', Object.keys(currentOrders[0] || {}));
    
    // Try to query with completed_at to see if it exists
    const { data: testData, error: testError } = await supabase
      .from('orders')
      .select('id, status, completed_at')
      .limit(1);
    
    if (testError && testError.code === '42703') {
      console.log('❌ completed_at column missing, need to add it manually in Supabase dashboard');
      console.log('');
      console.log('🔧 MANUAL FIX REQUIRED:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to Table Editor > orders table');
      console.log('3. Click "Add Column" and add:');
      console.log('   - Name: completed_at');
      console.log('   - Type: timestamptz (timestamp with timezone)');
      console.log('   - Default: NULL');
      console.log('   - Nullable: Yes');
      console.log('');
      console.log('Or run this SQL in the SQL Editor:');
      console.log('ALTER TABLE orders ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;');
      
    } else if (testError) {
      console.error('❌ Other error:', testError);
    } else {
      console.log('✅ completed_at column already exists and working!');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

addCompletedAtColumn();