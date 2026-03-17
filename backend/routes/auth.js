const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Basic phone validation
function isValidPhone(phone) {
  return phone && phone.length >= 10 && /^[+]?[0-9\s-()]+$/.test(phone);
}

// Simple login with phone number only (no OTP)
router.post('/login', async (req, res) => {
  try {
    console.log('📱 Login request for phone:', req.body.phone?.replace(/\d(?=\d{4})/g, '*'));
    const { phone, name } = req.body;
    
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Valid phone number required' });
    }

    // Normalize phone number
    const normalizedPhone = phone.replace(/[^+0-9]/g, '');
    const sanitizedName = name ? name.trim().substring(0, 100) : null;

    console.log(`🔍 Looking for user with phone: ${normalizedPhone.replace(/\d(?=\d{4})/g, '*')}`);

    // Check if user exists
    const { data: userArray } = await supabase
      .from('users')
      .select('*')
      .eq('phone', normalizedPhone);
    let user = userArray && userArray.length > 0 ? userArray[0] : null;
    console.log('👤 Existing user found:', !!user);

    if (!user) {
      console.log('👤 Creating new user...');
      const userData = { 
        name: sanitizedName || 'User',
        phone: normalizedPhone,
        email: `phone_${normalizedPhone.replace(/[^0-9]/g, '')}@temp.local`,
        is_admin: false
      };

      const { data: newUserArray, error: userError } = await supabase
        .from('users')
        .insert(userData)
        .select();
      const newUser = newUserArray && newUserArray.length > 0 ? newUserArray[0] : null;

      if (userError) {
        console.error('❌ Error creating user:', userError);
        throw userError;
      }
      user = newUser;
      console.log('✅ New user created:', user.id);
    } else if (sanitizedName && sanitizedName !== user.name) {
      // Update existing user with new name if provided and different
      console.log('👤 Updating existing user...');
      const { data: updatedUserArray } = await supabase
        .from('users')
        .update({ name: sanitizedName })
        .eq('id', user.id)
        .select();
      
      user = updatedUserArray && updatedUserArray.length > 0 ? updatedUserArray[0] : user;
      console.log('✅ User updated');
    }

    // Generate JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      isAdmin: user.is_admin || false
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { 
      expiresIn: '7d',
      issuer: 'cafe-app',
      audience: 'cafe-users'
    });
    console.log('🎫 JWT token generated');

    // Return user data without sensitive information
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      is_admin: user.is_admin || false,
      created_at: user.created_at
    };

    res.json({ token, user: safeUser });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Keep legacy OTP endpoints for backward compatibility (but simplified)
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Valid phone number required' });
    }

    // Just return success without actually sending OTP
    res.json({ 
      message: 'OTP sent successfully',
      otp: '123456' // Fixed OTP for demo
    });
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name } = req.body;

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Valid phone number required' });
    }

    // Accept any OTP for demo purposes
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ error: 'Valid 6-digit OTP required' });
    }

    // Normalize phone number
    const normalizedPhone = phone.replace(/[^+0-9]/g, '');
    const sanitizedName = name ? name.trim().substring(0, 100) : null;

    console.log(`🔍 Looking for user with phone: ${normalizedPhone.replace(/\d(?=\d{4})/g, '*')}`);

    // Check if user exists
    const { data: userArray } = await supabase
      .from('users')
      .select('*')
      .eq('phone', normalizedPhone);
    let user = userArray && userArray.length > 0 ? userArray[0] : null;
    console.log('👤 Existing user found:', !!user);

    if (!user) {
      console.log('👤 Creating new user...');
      const userData = { 
        name: sanitizedName || 'User',
        phone: normalizedPhone,
        email: `phone_${normalizedPhone.replace(/[^0-9]/g, '')}@temp.local`,
        is_admin: false
      };

      const { data: newUserArray, error: userError } = await supabase
        .from('users')
        .insert(userData)
        .select();
      const newUser = newUserArray && newUserArray.length > 0 ? newUserArray[0] : null;

      if (userError) {
        console.error('❌ Error creating user:', userError);
        throw userError;
      }
      user = newUser;
      console.log('✅ New user created:', user.id);
    } else if (sanitizedName && sanitizedName !== user.name) {
      // Update existing user with new name if provided and different
      console.log('👤 Updating existing user...');
      const { data: updatedUserArray } = await supabase
        .from('users')
        .update({ name: sanitizedName })
        .eq('id', user.id)
        .select();
      
      user = updatedUserArray && updatedUserArray.length > 0 ? updatedUserArray[0] : user;
      console.log('✅ User updated');
    }

    // Generate JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      isAdmin: user.is_admin || false
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { 
      expiresIn: '7d',
      issuer: 'cafe-app',
      audience: 'cafe-users'
    });
    console.log('🎫 JWT token generated');

    // Return user data without sensitive information
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      is_admin: user.is_admin || false,
      created_at: user.created_at
    };

    res.json({ token, user: safeUser });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

module.exports = router;