require('dotenv').config();
const { supabase } = require('./config/supabase');

async function testOrdersEndpoint() {
  try {
    console.log('🧪 Testing orders endpoint logic...');
    
    // Get sample orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, total_amount, status, payment_status, created_at, updated_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching orders:', error);
      return;
    }

    console.log(`📊 Found ${orders?.length || 0} orders to test`);

    // Apply the same mapping logic as the endpoint
    const mapOrderStatus = (status, paymentStatus) => {
      if (paymentStatus !== 'paid') {
        return 'pending';
      }
      
      switch (status) {
        case 'pending':
        case 'confirmed':
        case 'approved':
          return 'preparing';
        case 'paid':
          return 'completed';
        case 'denied':
          return 'cancelled';
        default:
          return status;
      }
    };

    console.log('\n📋 Order Status Mapping:');
    const statusCounts = {};
    
    orders?.forEach((order, index) => {
      const mappedStatus = mapOrderStatus(order.status, order.payment_status);
      statusCounts[mappedStatus] = (statusCounts[mappedStatus] || 0) + 1;
      
      console.log(`${index + 1}. ${order.id.substring(0, 8)}... - Original: ${order.status}/${order.payment_status} → Mapped: ${mappedStatus}`);
    });

    console.log('\n📊 Final Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} orders`);
    });

    // Test filtering logic (same as customer app)
    const formattedOrders = orders?.map(order => ({
      id: order.id,
      status: mapOrderStatus(order.status, order.payment_status),
      total: parseFloat(order.total_amount)
    })) || [];

    const activeOrders = formattedOrders.filter((o) => ["pending", "preparing", "ready"].includes(o.status));
    const pastOrders = formattedOrders.filter((o) => ["completed", "delivered", "cancelled"].includes(o.status));

    console.log(`\n✅ Active orders: ${activeOrders.length}`);
    console.log(`✅ Past orders: ${pastOrders.length}`);

    if (pastOrders.length > 0) {
      console.log('\n🎉 SUCCESS: Completed orders will now show in the Past Orders section!');
      pastOrders.forEach(order => {
        console.log(`  - Order ${order.id.substring(0, 8)}... (${order.status}) - ₹${order.total}`);
      });
    } else {
      console.log('\n⚠️  No completed orders found in test data');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testOrdersEndpoint();