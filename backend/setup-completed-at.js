require('dotenv').config();
const supabase = require('./config/supabase');

async function addCompletedAtColumn() {
  try {
    console.log('🔄 Adding completed_at column to orders table...');
    
    // Try to add the column using raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE orders 
        ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
        
        UPDATE orders 
        SET completed_at = updated_at 
        WHERE status = 'completed' AND completed_at IS NULL;
      `
    });
    
    if (error) {
      console.error('❌ Failed to add column via RPC:', error);
      
      // Alternative: Try using Supabase client directly
      console.log('🔄 Trying alternative method...');
      
      // Check if column exists by trying to select it
      const { data: testData, error: testError } = await supabase
        .from('orders')
        .select('completed_at')
        .limit(1);
      
      if (testError && testError.message.includes('column "completed_at" does not exist')) {
        console.log('❌ Column does not exist and cannot be added automatically');
        console.log('📝 Please add the column manually in Supabase dashboard:');
        console.log('   1. Go to Table Editor > orders');
        console.log('   2. Add new column: completed_at (timestamp with timezone, nullable)');
        console.log('   3. Run this script again');
        return false;
      } else if (!testError) {
        console.log('✅ Column already exists!');
        return true;
      }
    } else {
      console.log('✅ Column added successfully');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  addCompletedAtColumn().then((success) => {
    if (success) {
      console.log('✅ Setup complete!');
    } else {
      console.log('❌ Manual intervention required');
    }
    process.exit(0);
  });
}

module.exports = { addCompletedAtColumn };