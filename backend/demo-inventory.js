const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function demonstrateInventorySystem() {
  console.log('🎯 Inventory Management Demo\n');

  try {
    // 1. Show current coffee stock
    const { data: coffee } = await supabase
      .from('menu_items')
      .select('id, name, quantity')
      .eq('name', 'Coffee')
      .single();

    if (!coffee) {
      console.log('❌ Coffee not found in menu');
      return;
    }

    console.log(`☕ Coffee Stock: ${coffee.quantity} units`);

    // 2. Simulate placing an order for 3 coffees
    console.log('\n📱 Customer orders 3 coffees...');
    
    const orderQuantity = 3;
    if (coffee.quantity >= orderQuantity) {
      // Deduct inventory
      const { data: updatedCoffee, error } = await supabase
        .from('menu_items')
        .update({ quantity: coffee.quantity - orderQuantity })
        .eq('id', coffee.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating inventory:', error);
        return;
      }

      console.log(`✅ Order successful!`);
      console.log(`📦 Inventory updated: ${coffee.quantity} → ${updatedCoffee.quantity} units`);
      console.log(`🧾 Deducted: ${orderQuantity} units`);

      // 3. Show stock status
      if (updatedCoffee.quantity === 0) {
        console.log('🚫 Status: OUT OF STOCK');
      } else if (updatedCoffee.quantity <= 5) {
        console.log('⚠️  Status: LOW STOCK');
      } else {
        console.log('✅ Status: IN STOCK');
      }

      // 4. Restore stock for demo
      console.log('\n🔄 Restoring stock for demo...');
      await supabase
        .from('menu_items')
        .update({ quantity: 50 })
        .eq('id', coffee.id);
      
      console.log('✅ Stock restored to 50 units');

    } else {
      console.log(`❌ Order failed: Insufficient stock (Available: ${coffee.quantity}, Requested: ${orderQuantity})`);
    }

    console.log('\n🎉 Demo completed!');
    console.log('\n💡 How it works:');
    console.log('   1. Customer sees quantity on menu cards');
    console.log('   2. System checks stock before allowing orders');
    console.log('   3. Inventory automatically deducts on successful orders');
    console.log('   4. Stock status updates in real-time');
    console.log('   5. Admin can manage inventory through admin panel');

  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

demonstrateInventorySystem().catch(console.error);