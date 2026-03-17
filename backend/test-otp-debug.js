require('dotenv').config();
const twilioService = require('./services/twilioService');

async function testOTP() {
  console.log('🔧 Testing OTP Configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
  console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
  console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || '❌ Missing');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('');
  
  // Test phone number (replace with your actual number)
  const testPhone = '+919876543210'; // Replace with your phone number
  const testOTP = '123456';
  
  try {
    console.log('📱 Testing SMS send...');
    const result = await twilioService.sendOTP(testPhone, testOTP);
    console.log('✅ SMS Test Result:', result);
  } catch (error) {
    console.error('❌ SMS Test Failed:', error.message);
    console.error('Error details:', error);
  }
}

testOTP();