require('dotenv').config();
const express = require('express');
const cors = require('cors');
const os = require('os');
const http = require('http');
const { supabase } = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 3006;

console.log('✅ Connected to Supabase');
console.log('🔐 Environment Check:');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET (using default)');
console.log('   JWT_SECRET length:', process.env.JWT_SECRET?.length || 'N/A');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('   PORT:', PORT);

// Validate JWT secret strength
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters for production!');
}

// CORS configuration - more restrictive for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? function (origin, callback) {
        const allowedOrigins = ['https://yourdomain.com', 'https://www.yourdomain.com'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    : true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers middleware (basic implementation)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

const authMiddleware = require('./routes/authMiddleware');
const adminMiddleware = require('./routes/adminMiddleware');
const websocketService = require('./services/websocketService');

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', authMiddleware, require('./routes/orders'));
app.use('/api/user', authMiddleware, require('./routes/user'));
app.use('/api/admin', authMiddleware, adminMiddleware, require('./routes/admin'));
app.use('/api/pause', require('./routes/pause'));
app.use('/api/advertisements', require('./routes/advertisements'));
app.use('/api/student', require('./routes/student'));
app.use('/payment', require('./routes/payment'));
app.use('/payment-link', require('./routes/payment-link'));

// Keep legacy routes for backward compatibility
app.use('/menu', require('./routes/menu'));
app.use('/orders', authMiddleware, require('./routes/orders'));
app.use('/user', authMiddleware, require('./routes/user'));
app.use('/admin', authMiddleware, adminMiddleware, require('./routes/admin'));
app.use('/pause', require('./routes/pause'));
app.use('/advertisements', require('./routes/advertisements'));
app.use('/student', require('./routes/student'));

// Debug endpoint to test authentication
app.get('/debug/token-info', authMiddleware, (req, res) => {
  res.json({
    message: 'Token is valid!',
    userId: req.user?.id,
    userName: req.user?.name,
    userEmail: req.user?.email,
    userPhone: req.user?.phone,
  });
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Cafe Backend API is running (Supabase connected)', status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const errorMessage = isDevelopment ? err.message : 'Something went wrong!';
  
  res.status(err.status || 500).json({ 
    error: errorMessage,
    ...(isDevelopment && { stack: err.stack })
  });
});

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Initialize the WebSocket service and attach it to the server
websocketService.init(server);

server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📱 Connect app to: http://${localIp}:${PORT}`);
  console.log('🔥 Supabase connected\n');
});