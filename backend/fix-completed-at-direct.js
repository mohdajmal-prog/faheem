const { Pool } = require('pg');
require('dotenv').config();

// Parse DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addCompletedAtColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Adding completed_at column to orders table...');
    
    // Check if column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders' AND column_name = 'completed_at'
    `);
    
    if (checkColumn.rows.length === 0) {
      // Add the column
      await client.query('ALTER TABLE orders ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE');
      console.log('✅ Added completed_at column');
      
      // Update existing completed orders
      const updateResult = await client.query(`
        UPDATE orders 
        SET completed_at = updated_at 
        WHERE status = 'completed' AND completed_at IS NULL
      `);
      console.log(`✅ Updated ${updateResult.rowCount} existing completed orders`);
      
      // Create indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_orders_status_completed_at ON orders(status, completed_at DESC)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_orders_payment_status_status ON orders(payment_status, status)');
      console.log('✅ Created indexes');
      
    } else {
      console.log('ℹ️ completed_at column already exists');
    }
    
    // Test the column
    const testResult = await client.query('SELECT id, status, completed_at FROM orders LIMIT 1');
    console.log('✅ Test query successful - completed_at column is working');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addCompletedAtColumn();