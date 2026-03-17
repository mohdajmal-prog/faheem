const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runDatabaseFix() {
  try {
    console.log('🔧 Starting database fix...');
    
    // Read the SQL fix file
    const sqlFile = path.join(__dirname, 'fix-database-issues.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL commands (basic splitting by semicolon)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Executing ${commands.length} SQL commands...`);
    
    // Execute each command
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`⚡ Executing command ${i + 1}/${commands.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          if (error) {
            console.warn(`⚠️ Warning on command ${i + 1}:`, error.message);
          }
        } catch (err) {
          console.warn(`⚠️ Warning on command ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('✅ Database fix commands executed');
    
    // Verify the fixes
    console.log('🔍 Verifying fixes...');
    
    // Test OTP table
    try {
      const { error: otpError } = await supabase
        .from('otps')
        .insert({
          phone: '+1234567890',
          otp: 'test_long_otp_value_that_would_fail_with_varchar_6_constraint',
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        });
      
      if (otpError) {
        console.error('❌ OTP table still has constraint issue:', otpError.message);
      } else {
        console.log('✅ OTP table constraint fixed');
        // Clean up test data
        await supabase.from('otps').delete().eq('phone', '+1234567890');
      }
    } catch (err) {
      console.error('❌ OTP table test failed:', err.message);
    }
    
    // Test app_settings table
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('❌ App settings table issue:', error.message);
      } else {
        console.log('✅ App settings table working:', data);
      }
    } catch (err) {
      console.error('❌ App settings test failed:', err.message);
    }
    
    // Test menu performance
    try {
      const start = Date.now();
      const { data, error } = await supabase
        .from('menu_items')
        .select('id, name, price')
        .eq('available', true)
        .limit(10);
      
      const duration = Date.now() - start;
      
      if (error) {
        console.error('❌ Menu query failed:', error.message);
      } else {
        console.log(`✅ Menu query performance: ${duration}ms (${data?.length || 0} items)`);
        if (duration > 2000) {
          console.warn('⚠️ Menu query still slow, consider adding more data or checking connection');
        }
      }
    } catch (err) {
      console.error('❌ Menu performance test failed:', err.message);
    }
    
    console.log('🎉 Database fix completed!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Test OTP functionality');
    console.log('3. Check menu loading performance');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
    process.exit(1);
  }
}

// Run the fix
runDatabaseFix();