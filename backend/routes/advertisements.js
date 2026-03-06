const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get active advertisements for users
router.get('/advertisements', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;