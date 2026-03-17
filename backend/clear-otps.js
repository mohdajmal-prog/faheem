require('dotenv').config();
const supabase = require('./config/supabase');

async function clearOldOTPs() {
  console.log('🧹 Clearing old OTPs...');
  
  try {
    // Delete all OTPs older than 1 hour
    const { data, error } = await supabase
      .from('otps')
      .delete()
      .lt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());
    
    if (error) {
      console.error('❌ Error clearing OTPs:', error);
    } else {
      console.log('✅ Old OTPs cleared successfully');
    }

    // Also clear all OTPs for the specific phone number
    const { error: phoneError } = await supabase
      .from('otps')
      .delete()
      .eq('phone', '+917603996934');
    
    if (phoneError) {
      console.error('❌ Error clearing phone OTPs:', phoneError);
    } else {
      console.log('✅ Phone-specific OTPs cleared');
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

clearOldOTPs();