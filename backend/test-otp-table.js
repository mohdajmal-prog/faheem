require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function fixOTPTable() {
  console.log('🔧 Testing OTP table...');

  try {
    // Test with a regular OTP first
    const testPhone = '+91TEST9999999';
    const testOTP = '123456';
    
    const { error: insertError } = await supabase.from('otps').insert({
      phone: testPhone,
      otp: testOTP,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });
    
    if (insertError) {
      console.log('❌ OTP table needs fixing:', insertError.message);
      console.log('\n📝 Run this SQL in Supabase SQL Editor:');
      console.log('ALTER TABLE otps ALTER COLUMN otp TYPE VARCHAR(255);');
    } else {
      console.log('✅ OTP table is working');
      await supabase.from('otps').delete().eq('phone', testPhone);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixOTPTable();