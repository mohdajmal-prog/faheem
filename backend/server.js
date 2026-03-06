require('dotenv').config();
const express = require('express');
const cors = require('cors');
const os = require('os');
const http = require('http');
const supabase = require('./config/supabase');

const app = express();
const PORT = process.env.PORT || 3006;

console.log('✅ Connected to Supabase');
console.log('🔐 Environment Check:');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ NOT SET (using default)');
console.log('   JWT_SECRET length:', process.env.JWT_SECRET?.length || 'N/A');
console.log('   PORT:', PORT);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authMiddleware = require('./routes/authMiddleware');
const adminMiddleware = require('./routes/adminMiddleware');
const websocketService = require('./services/websocketService');

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/menu', require('./routes/menu'));
app.use('/orders', authMiddleware, require('./routes/orders'));
app.use('/user', authMiddleware, require('./routes/user'));
app.use('/admin', authMiddleware, adminMiddleware, require('./routes/admin'));
app.use('/pause', require('./routes/pause'));
app.use('/api', require('./routes/advertisements'));
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
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
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
