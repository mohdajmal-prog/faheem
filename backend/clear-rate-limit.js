require('dotenv').config();
const { supabase } = require('./config/supabase');

async function clearRateLimit() {
  console.log('🧹 Clearing rate limit for your phone number...');
  
  try {
    // Clear OTPs for your specific phone number
    const { error } = await supabase
      .from('otps')
      .delete()
      .eq('phone', '+917603996934');
    
    if (error) {
      console.error('❌ Error:', error);
    } else {
      console.log('✅ Rate limit cleared! You can now request OTP again.');
    }
  } catch (error) {
    console.error('❌ Failed to clear rate limit:', error.message);
  }
}

clearRateLimit();