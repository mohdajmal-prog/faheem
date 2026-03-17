const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[AUTH] Authorization header:', authHeader ? `${authHeader.substring(0, 30)}...` : 'NOT PROVIDED');
    
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.error('[ERROR] No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('[AUTH] Verifying JWT token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[SUCCESS] Token decoded:', decoded);
    console.log('[AUTH] Looking up user with ID:', decoded.userId);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error) {
      console.error('[ERROR] Database error:', error);
      console.error('[ERROR] Error code:', error.code);
      console.error('[ERROR] Error message:', error.message);
      return res.status(401).json({ error: 'User lookup failed' });
    }
    
    if (!user) {
      console.error('[ERROR] User not found with ID:', decoded.userId);
      return res.status(401).json({ error: 'User not found' });
    }

    console.log('[SUCCESS] User authenticated:', user.id);
    req.user = user;
    next();
  } catch (error) {
    console.error('[ERROR] Auth error:', error.message);
    console.error('[ERROR] Error type:', error.name);
    console.error('[ERROR] Full error:', error);
    
    // Provide more specific error messages for debugging
    let errorMsg = 'Authentication failed';
    if (error.name === 'JsonWebTokenError') {
      errorMsg = 'Invalid token format';
    } else if (error.name === 'TokenExpiredError') {
      errorMsg = 'Token has expired';
    }
    
    res.status(401).json({ error: errorMsg });
  }
};
