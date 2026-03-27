require('dotenv').config();
const { supabase } = require('./config/supabase');

async function checkOrderStatuses() {
  try {
    console.log('🔍 Checking all order statuses...');
    
    // Get all unique statuses
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, payment_status, id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching orders:', error);
      return;
    }

    // Count statuses
    const statusCounts = {};
    const paymentStatusCounts = {};
    
    orders?.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      paymentStatusCounts[order.payment_status] = (paymentStatusCounts[order.payment_status] || 0) + 1;
    });

    console.log('\n📊 Order Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} orders`);
    });

    console.log('\n💳 Payment Status Distribution:');
    Object.entries(paymentStatusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} orders`);
    });

    console.log('\n📋 Recent Orders:');
    orders?.slice(0, 10).forEach((order, index) => {
      console.log(`${index + 1}. ${order.id.substring(0, 8)}... - Status: ${order.status} - Payment: ${order.payment_status}`);
    });

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkOrderStatuses();