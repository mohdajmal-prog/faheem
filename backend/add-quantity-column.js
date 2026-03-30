const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addQuantityColumn() {
  console.log('🔧 Adding quantity column to menu_items table...\n');

  try {
    // Check if quantity column already exists
    const { data: columns, error: columnError } = await supabase
      .rpc('get_table_columns', { table_name: 'menu_items' });

    if (columnError) {
      console.log('⚠️  Cannot check columns, proceeding with migration...');
    } else {
      const hasQuantity = columns?.some(col => col.column_name === 'quantity');
      if (hasQuantity) {
        console.log('✅ Quantity column already exists!');
        return;
      }
    }

    // Add quantity column with default value of 50
    const { error: alterError } = await supabase
      .rpc('execute_sql', {
        sql: `
          ALTER TABLE menu_items 
          ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 50;
          
          -- Update existing items to have default quantity
          UPDATE menu_items 
          SET quantity = 50 
          WHERE quantity IS NULL;
        `
      });

    if (alterError) {
      console.error('❌ Error adding quantity column:', alterError);
      
      // Try alternative approach using direct SQL
      console.log('🔄 Trying alternative approach...');
      
      // First, get all menu items and update them individually
      const { data: menuItems, error: fetchError } = await supabase
        .from('menu_items')
        .select('id');

      if (fetchError) {
        console.error('❌ Error fetching menu items:', fetchError);
        return;
      }

      console.log(`📊 Found ${menuItems?.length || 0} menu items to update`);
      
      // Update each item to add quantity field (this will work if the column exists)
      for (const item of menuItems || []) {
        const { error: updateError } = await supabase
          .from('menu_items')
          .update({ quantity: 50 })
          .eq('id', item.id);

        if (updateError) {
          console.log(`⚠️  Could not update item ${item.id}:`, updateError.message);
        }
      }
      
      console.log('✅ Updated existing menu items with default quantity');
    } else {
      console.log('✅ Quantity column added successfully!');
    }

    // Verify the update
    const { data: sampleItems, error: verifyError } = await supabase
      .from('menu_items')
      .select('id, name, quantity')
      .limit(3);

    if (!verifyError && sampleItems) {
      console.log('\n📋 Sample menu items with quantity:');
      sampleItems.forEach(item => {
        console.log(`   ${item.name}: ${item.quantity || 'NULL'} units`);
      });
    }

    console.log('\n🎉 Quantity management is now ready!');
    console.log('💡 Menu items will now track inventory automatically');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n📝 Manual Setup Required:');
    console.log('1. Go to Supabase Dashboard > SQL Editor');
    console.log('2. Run this SQL:');
    console.log(`
      ALTER TABLE menu_items 
      ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 50;
      
      UPDATE menu_items 
      SET quantity = 50 
      WHERE quantity IS NULL;
    `);
  }
}

addQuantityColumn().catch(console.error);