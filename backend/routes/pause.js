const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get pause state
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Pause state error:', error);
      return res.json({
        is_app_paused: false,
        pause_reason: '',
        paused_at: null,
        resumed_at: null
      });
    }

    if (!data) {
      return res.json({
        is_app_paused: false,
        pause_reason: '',
        paused_at: null,
        resumed_at: null
      });
    }

    res.json({
      is_app_paused: data.paused || false,
      pause_reason: '',
      paused_at: null,
      resumed_at: null
    });
  } catch (error) {
    console.error('Pause state error:', error);
    res.json({
      is_app_paused: false,
      pause_reason: '',
      paused_at: null,
      resumed_at: null
    });
  }
});

// Set pause state
router.put('/', async (req, res) => {
  try {
    const { is_app_paused } = req.body;

    const { data, error } = await supabase
      .from('app_settings')
      .update({ paused: is_app_paused })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;

    res.json({
      is_app_paused: data.paused,
      pause_reason: '',
      paused_at: null,
      resumed_at: null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
