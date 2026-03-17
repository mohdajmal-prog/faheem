require('dotenv').config();
const supabase = require('./config/supabase');
const fs = require('fs');

async function setupAdvertisements() {
  console.log('🎯 Setting up advertisements table...');
  
  try {
    // Read and execute the SQL file
    const sql = fs.readFileSync('./create-advertisements-table.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('📝 Executing:', statement.substring(0, 50) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement.trim() });
        if (error) {
          console.error('❌ SQL Error:', error);
        }
      }
    }
    
    // Verify the table was created
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Verification error:', error);
    } else {
      console.log('✅ Advertisements table created successfully');
      console.log(`📊 Found ${data.length} advertisements`);
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
}

setupAdvertisements();