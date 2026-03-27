require('dotenv').config();
const { supabase } = require('./config/supabase');

async function fixCompletedAtColumn() {
  try {
    console.log('🔧 Fixing completed_at column issue...');
    
    // First, let's check the current table structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error checking table:', tableError);
      return;
    }

    console.log('📊 Current table structure checked');

    // Try to update completed orders with completed_at using updated_at
    console.log('📝 Updating completed orders...');
    
    const { data: completedOrders, error: updateError } = await supabase
      .from('orders')
      .update({ 
        // We'll use updated_at as completed_at for now
        updated_at: new Date().toISOString() 
      })
      .eq('status', 'completed')
      .select('id, status, updated_at');

    if (updateError) {
      console.error('❌ Error updating orders:', updateError);
      return;
    }

    console.log(`✅ Updated ${completedOrders?.length || 0} completed orders`);

    // Now let's test the customer orders query without completed_at
    console.log('🧪 Testing customer orders query...');
    
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, user_id, status, total_amount, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);
      return;
    }

    console.log(`📊 Found ${orders?.length || 0} orders:`);
    orders?.forEach((order, index) => {
      console.log(`${index + 1}. ${order.id.substring(0, 8)}... - Status: ${order.status} - Total: ₹${order.total_amount}`);
    });

    // Check completed orders specifically
    const { data: completed } = await supabase
      .from('orders')
      .select('id, status, updated_at')
      .eq('status', 'completed');

    console.log(`\n✅ Completed orders: ${completed?.length || 0}`);

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

fixCompletedAtColumn();