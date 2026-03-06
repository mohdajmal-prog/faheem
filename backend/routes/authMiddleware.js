const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 AuthMiddleware - Authorization header:', authHeader ? `${authHeader.substring(0, 30)}...` : 'NOT PROVIDED');
    
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      console.error('❌ AuthMiddleware - No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('🔍 AuthMiddleware - Verifying JWT token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ AuthMiddleware - Token decoded:', decoded);
    console.log('🔍 AuthMiddleware - Looking up user with ID:', decoded.userId);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error) {
      console.error('❌ AuthMiddleware - Database error:', error);
      console.error('❌ AuthMiddleware - Error code:', error.code);
      console.error('❌ AuthMiddleware - Error message:', error.message);
      return res.status(401).json({ error: 'User lookup failed' });
    }
    
    if (!user) {
      console.error('❌ AuthMiddleware - User not found with ID:', decoded.userId);
      return res.status(401).json({ error: 'User not found' });
    }

    console.log('✅ AuthMiddleware - User authenticated:', user.id);
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ AuthMiddleware - Error:', error.message);
    console.error('❌ AuthMiddleware - Error type:', error.name);
    console.error('❌ AuthMiddleware - Full error:', error);
    
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
