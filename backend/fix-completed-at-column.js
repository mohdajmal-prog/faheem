require('dotenv').config();
const { supabase } = require('./config/supabase');

async function addCompletedAtColumn() {
  try {
    console.log('🔧 Adding completed_at column to orders table...');
    
    // Add the completed_at column
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE orders 
        ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
      `
    });

    if (error) {
      console.error('❌ Error adding column:', error);
      return;
    }

    console.log('✅ completed_at column added successfully');

    // Update existing completed orders to have completed_at timestamp
    const { data: completedOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, updated_at')
      .eq('status', 'completed');

    if (fetchError) {
      console.error('❌ Error fetching completed orders:', fetchError);
      return;
    }

    if (completedOrders && completedOrders.length > 0) {
      console.log(`📝 Updating ${completedOrders.length} completed orders...`);
      
      for (const order of completedOrders) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ completed_at: order.updated_at })
          .eq('id', order.id);

        if (updateError) {
          console.error(`❌ Error updating order ${order.id}:`, updateError);
        }
      }
      
      console.log('✅ All completed orders updated with completed_at timestamp');
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

addCompletedAtColumn();