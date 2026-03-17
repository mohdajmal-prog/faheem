require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function fixOTPColumn() {
  console.log('🔧 Fixing OTP column size...\n');

  try {
    // First, check if the table exists and what its current structure is
    console.log('1️⃣ Checking current otps table structure...');
    
    // Try to get a sample OTP record to see current state
    const { data: sampleOTP, error: sampleError } = await supabase
      .from('otps')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.log('   ⚠️ Could not read from otps table:', sampleError.message);
      console.log('   This might mean the table needs to be created first.');
    } else {
      console.log('   ✅ otps table is accessible');
    }

    // Try to alter the column using rpc (if available) or direct SQL
    // Since we can't run raw SQL easily with Supabase JS client,
    // we'll need to use a different approach
    
    // Try inserting with hashed OTP to see if it works now
    console.log('\n2️⃣ Testing OTP insert with bcrypt hash...');
    
    const testPhone = '+91TEST9999999';
    const testOTP = '123456';
    const bcrypt = require('bcrypt');
    const hashedOTP = await bcrypt.hash(testOTP, 10);
    
    console.log('   Plain OTP length:', testOTP.length);
    console.log('   Hashed OTP length:', hashedOTP.length);
    
    // Try to insert
    const { error: insertError } = await supabase.from('otps').insert({
      phone: testPhone,
      otp: hashedOTP,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });
    
    if (insertError) {
      console.log('   ❌ Insert failed:', insertError.message);
      console.log('   ❌ Error code:', insertError.code);
      
      // Check if it's a length issue
      if (insertError.message.includes('too long') || 
          insertError.code === '22001' ||
          insertError.message.includes('character')) {
        console.log('\n   ⚠️ Confirmed: OTP column is too small for bcrypt hash!');
        console.log('\n   📝 FIX REQUIRED: Run the following in Supabase SQL Editor:');
        console.log('   ```sql');
        console.log('   -- Drop and recreate otps table with correct column size');
        console.log('   DROP TABLE IF EXISTS otps;');
        console.log('   ');
        console.log('   CREATE TABLE otps (');
        console.log('     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),');
        console.log('     email VARCHAR(255),');
        console.log('     phone VARCHAR(20),');
        console.log('     otp VARCHAR(255) NOT NULL,  -- Changed from VARCHAR(6)');
        console.log('     expires_at TIMESTAMP NOT NULL,');
        console.log('     created_at TIMESTAMP DEFAULT NOW()');
        console.log('   );');
        console.log('   ```');
        return false;
      }
    } else {
      console.log('   ✅ Insert succeeded! The column size is correct now.');
      
      // Clean up test record
      await supabase.from('otps').delete().eq('phone', testPhone);
      console.log('   🧹 Test record cleaned up');
      return true;
    }

  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
    return false;
  }
  
  return false;
}

fixOTPColumn()
  .then(success => {
    if (success) {
      console.log('\n✅ OTP column fix verified!');
    } else {
      console.log('\n❌ Manual fix required - see instructions above');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });

