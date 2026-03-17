const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// Get active advertisements for users
router.get('/advertisements', async (req, res) => {
  try {
    console.log('📢 Fetching advertisements...');
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });
    
    const queryPromise = supabase
      .from('advertisements')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('❌ Advertisements query error:', error);
      // Return empty array instead of throwing error
      return res.json([]);
    }
    
    console.log(`✅ Returning ${(data || []).length} advertisements`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Advertisements error:', error);
    // Return empty array for graceful degradation
    res.json([]);
  }
});

module.exports = router;