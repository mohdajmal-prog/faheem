const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching menu items...');
    const start = Date.now();
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('TimeoutError: The operation was aborted due to timeout')), 8000);
    });
    
    const queryPromise = supabase
      .from('menu_items')
      .select('id, name, description, price, category, image_url, available')
      .eq('available', true)
      .limit(50);
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('❌ Menu query error:', error);
      throw error;
    }
    
    console.log(`⏱️ Query took ${Date.now() - start}ms`);
    
    // Transform to match frontend format
    const items = (data || []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      price: parseFloat(item.price),
      category: item.category || 'Other',
      image: item.image_url || 'https://via.placeholder.com/150',
      rating: 4.5,
      reviews: 0,
      time: '5 min',
      discount: 0,
      available: item.available
    }));
    
    console.log(`✅ Returning ${items.length} items`);
    res.json(items);
  } catch (error) {
    console.error('❌ Menu error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
