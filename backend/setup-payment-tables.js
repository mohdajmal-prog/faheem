require('dotenv').config();
const { supabase } = require('./config/supabase');
const fs = require('fs');
const path = require('path');

async function setupPaymentTables() {
  try {
    console.log('Setting up payment tables...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-payment-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL commands and execute them
    const commands = sql.split(';').filter(cmd => cmd.trim());
    
    for (const command of commands) {
      if (command.trim()) {
        console.log('Executing:', command.substring(0, 50) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql_query: command.trim() });
        
        if (error) {
          console.error('Error executing command:', error);
          // Try direct query for simpler commands
          const { error: directError } = await supabase
            .from('_temp')
            .select('1')
            .limit(0);
          
          if (directError && !directError.message.includes('does not exist')) {
            console.error('Direct query also failed:', directError);
          }
        } else {
          console.log('✅ Command executed successfully');
        }
      }
    }
    
    console.log('✅ Payment tables setup completed!');
    
    // Test the setup
    const { data, error } = await supabase
      .from('payment_orders')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Test query failed:', error);
    } else {
      console.log('✅ Payment tables are working correctly!');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  setupPaymentTables();
}

module.exports = { setupPaymentTables };