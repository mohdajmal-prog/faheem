const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function debugOrders() {
  try {
    // Check total orders count
    const { count, error: countError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    console.log('[DATA] Total orders in database:', count);
    
    // Get all orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[ERROR] Error fetching orders:', error);
      return;
    }
    
    console.log('[ORDERS] Orders found:', orders.length);
    
    if (orders.length > 0) {
      console.log('[SAMPLE] Sample order:', {
        id: orders[0].id,
        user_id: orders[0].user_id,
        status: orders[0].status,
        total_amount: orders[0].total_amount,
        created_at: orders[0].created_at
      });
      
      // Check users table
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, email, phone');
        
      console.log('[USERS] Users found:', users?.length || 0);
      if (users?.length > 0) {
        console.log('[SAMPLE] Sample user:', users[0]);
      }
    }
    
  } catch (error) {
    console.error('[ERROR] Debug failed:', error);
  }
}

debugOrders();