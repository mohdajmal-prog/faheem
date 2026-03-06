const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get app status for students
router.get('/app-status', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('paused')
      .eq('id', 1)
      .single();

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