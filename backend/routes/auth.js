const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    console.log('📨 Send OTP request body:', JSON.stringify(req.body));
    const { phone } = req.body;
    
    if (!phone) {
      console.error('❌ No phone provided. Body:', req.body);
      return res.status(400).json({ error: 'Phone number required' });
    }

    // Demo credentials
    const DEMO_PHONE = '+91 1234567890';
    const DEMO_OTP = '123456';

    let otp = generateOTP();
    
    // Use demo OTP for demo phone
    if (phone === DEMO_PHONE || phone === '1234567890' || phone === '+911234567890') {
      otp = DEMO_OTP;
      console.log('🎯 DEMO MODE - Using fixed OTP');
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log(`🔑 Generated OTP: ${otp} for ${phone}`);

    // Delete old OTPs for this phone
    await supabase.from('otps').delete().eq('phone', phone);
    
    // Save OTP to database
    const { error } = await supabase.from('otps').insert({
      phone,
      otp,
      expires_at: expiresAt.toISOString()
    });

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    console.log('✅ OTP saved to database');
    console.log('📋 OTP Code:', otp);

    res.json({ 
      message: 'OTP sent successfully',
      otp: otp
    });
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP and login/register
router.post('/verify-otp', async (req, res) => {
  try {
    console.log('🔍 Verify OTP request:', JSON.stringify(req.body));
    const { phone, otp, name } = req.body;

    if (!phone || !otp) {
      console.error('❌ Missing phone or OTP');
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    console.log(`🔍 Looking for OTP: ${otp} for phone: ${phone}`);

    const { data: otpDataArray, error: otpError } = await supabase
      .from('otps')
      .select('*')
      .eq('phone', phone)
      .eq('otp', otp)
      .gt('expires_at', new Date().toISOString());
    
    const otpData = otpDataArray && otpDataArray.length > 0 ? otpDataArray[0] : null;
    
    if (otpError || !otpData) {
      console.error('❌ Invalid or expired OTP:', otpError);
      console.error('Phone:', phone, 'OTP entered:', otp);
      console.error('Looking for OTP in DB...');
      
      // Debug: Check what OTPs exist
      const { data: allOtps } = await supabase.from('otps').select('*').eq('phone', phone);
      console.error('OTPs in DB for this phone:', allOtps);
      
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    console.log('✅ OTP verified successfully');

    // Check if user exists
    const { data: userArray } = await supabase.from('users').select('*').eq('phone', phone);
    let user = userArray && userArray.length > 0 ? userArray[0] : null;
    console.log('👤 Existing user found:', !!user);

    if (!user) {
      console.log('👤 Creating new user...');
      const userData = { 
        name: name || 'User',
        phone,
        email: `phone_${phone.replace(/[^0-9]/g, '')}@temp.local`
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
    } else if (name) {
      // Update existing user with new name if provided
      console.log('👤 Updating existing user...');
      const { data: updatedUserArray } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id)
        .select();
      
      user = updatedUserArray && updatedUserArray.length > 0 ? updatedUserArray[0] : user;
      console.log('✅ User updated');
    }

    // Clean up OTP
    await supabase.from('otps').delete().eq('phone', phone);
    console.log('🧹 OTP cleaned up');

    const token = jwt.sign({ userId: user.id, email: user.email, phone: user.phone }, JWT_SECRET, { expiresIn: '30d' });
    console.log('🎫 JWT token generated');

    res.json({ token, user });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

module.exports = router;
