require('dotenv').config();
const { supabase } = require('./config/supabase');

async function setupOTPsTable() {
  try {
    console.log('🔧 Setting up OTPs table...');
    
    // Create OTPs table if it doesn't exist
    const { error } = await supabase.rpc('create_otps_table', {});
    
    if (error && !error.message.includes('already exists')) {
      console.error('❌ Error creating OTPs table:', error);
      
      // Try alternative approach - direct SQL
      console.log('🔄 Trying direct SQL approach...');
      const { error: sqlError } = await supabase
        .from('otps')
        .select('*')
        .limit(1);
      
      if (sqlError && sqlError.code === 'PGRST116') {
        console.log('📝 Table does not exist. Please run this SQL in Supabase dashboard:');
        console.log(`
CREATE TABLE IF NOT EXISTS otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);
CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON otps(expires_at);

-- Enable RLS
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed)
CREATE POLICY "Allow all operations on otps" ON otps FOR ALL USING (true);
        `);
        return;
      }
    }
    
    console.log('✅ OTPs table setup completed');
    
    // Test the table
    const { data, error: testError } = await supabase
      .from('otps')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error testing OTPs table:', testError);
    } else {
      console.log('✅ OTPs table is working correctly');
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
}

setupOTPsTable();