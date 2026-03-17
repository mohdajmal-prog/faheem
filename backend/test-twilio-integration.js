require('dotenv').config();
const twilioService = require('./services/twilioService');

async function testTwilio() {
  try {
    console.log('🧪 Testing Twilio integration...');
    console.log('📱 Account SID:', process.env.TWILIO_ACCOUNT_SID);
    console.log('📞 From Number:', process.env.TWILIO_PHONE_NUMBER);
    
    // Test OTP
    const testPhone = '+1234567890'; // Replace with your test number
    const testOTP = '123456';
    
    const result = await twilioService.sendOTP(testPhone, testOTP);
    console.log('✅ Test result:', result);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

if (require.main === module) {
  testTwilio();
}