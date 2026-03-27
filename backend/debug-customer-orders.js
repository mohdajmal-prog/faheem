require('dotenv').config();
const { supabase } = require('./config/supabase');

async function debugCustomerOrders() {
  try {
    console.log('🔍 Debugging customer orders...');
    
    // Get all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, user_id, status, total_amount, created_at, updated_at, completed_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching orders:', error);
      return;
    }

    console.log(`📊 Found ${orders?.length || 0} orders:`);
    
    orders?.forEach((order, index) => {
      console.log(`\n${index + 1}. Order ID: ${order.id.substring(0, 8)}...`);
      console.log(`   User ID: ${order.user_id}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total: ₹${order.total_amount}`);
      console.log(`   Created: ${order.created_at}`);
      console.log(`   Updated: ${order.updated_at}`);
      console.log(`   Completed: ${order.completed_at || 'Not completed'}`);
    });

    // Check for completed orders specifically
    const { data: completedOrders } = await supabase
      .from('orders')
      .select('id, status, completed_at')
      .eq('status', 'completed');

    console.log(`\n✅ Completed orders count: ${completedOrders?.length || 0}`);
    
    if (completedOrders?.length > 0) {
      console.log('Recent completed orders:');
      completedOrders.slice(0, 3).forEach(order => {
        console.log(`- ${order.id.substring(0, 8)}... (completed: ${order.completed_at})`);
      });
    }

  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugCustomerOrders();