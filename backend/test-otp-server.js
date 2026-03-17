require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3006;

console.log('🚀 Starting OTP Test Server...');
console.log('📱 Twilio Phone Number:', process.env.TWILIO_PHONE_NUMBER);
console.log('🔑 Twilio Account SID:', process.env.TWILIO_ACCOUNT_SID ? 'Configured' : 'Missing');
console.log('🔐 Twilio Auth Token:', process.env.TWILIO_AUTH_TOKEN ? 'Configured' : 'Missing');

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('\n📋 Test the OTP functionality:');
  console.log(`1. Send OTP: POST http://localhost:${PORT}/auth/send-otp`);
  console.log('   Body: {"phone": "+911234567890"}');
  console.log(`2. Verify OTP: POST http://localhost:${PORT}/auth/verify-otp`);
  console.log('   Body: {"phone": "+911234567890", "otp": "123456", "name": "Test User"}');
  console.log('\n💡 Replace +911234567890 with your actual phone number');
  console.log('💡 For Twilio trial accounts, verify your phone number first');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  process.exit(0);
});