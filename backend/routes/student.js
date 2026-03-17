const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// Get app status for students
router.get('/app-status', async (req, res) => {
  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });
    
    const queryPromise = supabase
      .from('app_settings')
      .select('paused')
      .eq('id', 1)
      .single();
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) {
      console.error('App status error:', error);
      return res.json({ paused: false });
    }

    res.json({ paused: data?.paused || false });
  } catch (error) {
    console.error('App status error:', error);
    res.json({ paused: false });
  }
});

module.exports = router;