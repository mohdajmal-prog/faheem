require('dotenv').config();
const { supabase } = require('./config/supabase');

async function testInventoryUpdate() {
  try {
    // Get a menu item first
    const { data: items, error: selectError } = await supabase
      .from('menu_items')
      .select('id, name, quantity')
      .limit(1);
    
    if (selectError) throw selectError;
    
    if (items && items.length > 0) {
      const item = items[0];
      console.log('Before update:', item);
      
      // Test the correct way to decrement quantity
      const { data: updated, error: updateError } = await supabase
        .from('menu_items')
        .update({ quantity: item.quantity - 1 })
        .eq('id', item.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Update error:', updateError);
      } else {
        console.log('After update:', updated);
        
        // Restore original quantity
        await supabase
          .from('menu_items')
          .update({ quantity: item.quantity })
          .eq('id', item.id);
        console.log('Quantity restored');
      }
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

testInventoryUpdate();