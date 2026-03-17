require('dotenv').config();
const supabase = require('./config/supabase');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔄 Running database migration for completed_at column...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'add-completed-at-column.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      return;
    }
    
    console.log('✅ Migration completed successfully');
    console.log('📊 Result:', data);
    
    // Verify the column exists
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'orders')
      .eq('column_name', 'completed_at');
    
    if (columnError) {
      console.warn('⚠️ Could not verify column creation:', columnError);
    } else if (columns && columns.length > 0) {
      console.log('✅ Verified: completed_at column exists');
    } else {
      console.log('❌ Column verification failed - may need manual creation');
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

// Run if called directly
if (require.main === module) {
  runMigration().then(() => process.exit(0));
}

module.exports = { runMigration };