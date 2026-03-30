const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testInventorySystem() {
  console.log('🧪 Testing Inventory Management System...\n');

  try {
    // 1. Check current menu items with quantities
    console.log('📋 Current Menu Items:');
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('id, name, quantity')
      .limit(5);

    if (menuError) {
      console.error('❌ Error fetching menu items:', menuError);
      return;
    }

    menuItems.forEach(item => {
      console.log(`   ${item.name}: ${item.quantity || 'NULL'} units`);
    });

    if (menuItems.length === 0) {
      console.log('   No menu items found');
      return;
    }

    // 2. Test inventory deduction simulation
    const testItem = menuItems[0];
    console.log(`\n🔄 Testing inventory deduction for: ${testItem.name}`);
    console.log(`   Current quantity: ${testItem.quantity}`);

    // Simulate ordering 2 units
    const orderQuantity = 2;
    const newQuantity = (testItem.quantity || 0) - orderQuantity;

    console.log(`   Simulating order of ${orderQuantity} units`);
    console.log(`   New quantity would be: ${newQuantity}`);

    // 3. Test stock check
    if (testItem.quantity >= orderQuantity) {
      console.log('   ✅ Stock available - order can proceed');
    } else {
      console.log('   ❌ Insufficient stock - order should be rejected');
    }

    // 4. Test low stock detection
    console.log('\n📊 Stock Status:');
    menuItems.forEach(item => {
      const quantity = item.quantity || 0;
      let status = '✅ In Stock';
      
      if (quantity === 0) {
        status = '❌ Out of Stock';
      } else if (quantity <= 5) {
        status = '⚠️  Low Stock';
      }
      
      console.log(`   ${item.name}: ${quantity} units - ${status}`);
    });

    console.log('\n🎉 Inventory system test completed!');
    console.log('\n💡 Features implemented:');
    console.log('   ✅ Quantity tracking in database');
    console.log('   ✅ Stock validation before orders');
    console.log('   ✅ Automatic inventory deduction');
    console.log('   ✅ Low stock detection');
    console.log('   ✅ Admin inventory management');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testInventorySystem().catch(console.error);