const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addCompletedAtColumn() {
  try {
    console.log('🔧 Adding completed_at column to orders table...');
    
    // Add the column
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'orders' AND column_name = 'completed_at'
            ) THEN
                ALTER TABLE orders ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
                RAISE NOTICE 'Added completed_at column to orders table';
            ELSE
                RAISE NOTICE 'completed_at column already exists in orders table';
            END IF;
        END $$;
        
        -- Update existing completed orders
        UPDATE orders 
        SET completed_at = updated_at 
        WHERE status = 'completed' AND completed_at IS NULL;
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_orders_status_completed_at ON orders(status, completed_at DESC);
        CREATE INDEX IF NOT EXISTS idx_orders_payment_status_status ON orders(payment_status, status);
      `
    });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Successfully added completed_at column and indexes');
    
    // Test the fix
    const { data: testQuery, error: testError } = await supabase
      .from('orders')
      .select('id, status, completed_at')
      .limit(1);
      
    if (testError) {
      console.error('❌ Test query failed:', testError);
    } else {
      console.log('✅ Test query successful - completed_at column is working');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

addCompletedAtColumn();