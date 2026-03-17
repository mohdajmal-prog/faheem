require('dotenv').config();
const twilioService = require('./services/twilioService');

async function testTwilioOTP() {
  console.log('🧪 Testing Twilio OTP Service...');
  
  // Check if Twilio credentials are configured
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.error('❌ Twilio credentials not configured in .env file');
    console.log('Required environment variables:');
    console.log('- TWILIO_ACCOUNT_SID');
    console.log('- TWILIO_AUTH_TOKEN');
    console.log('- TWILIO_PHONE_NUMBER');
    return;
  }

  console.log('✅ Twilio credentials found');
  console.log('📞 From number:', process.env.TWILIO_PHONE_NUMBER);
  
  // Test phone number (replace with your verified phone number)
  const testPhone = '+917603996934'; // Updated with your phone number
  const testOTP = '123456';
  
  console.log(`📱 Sending test OTP to: ${testPhone}`);
  console.log('💡 Make sure this number is verified in your Twilio console!');
  console.log('💡 Visit: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
  
  try {
    const result = await twilioService.sendOTP(testPhone, testOTP);
    console.log('✅ SMS sent successfully!');
    console.log('📧 Message ID:', result.messageId);
  } catch (error) {
    console.error('❌ SMS sending failed:', error.message);
    
    // Common error troubleshooting
    if (error.message.includes('not a valid phone number')) {
      console.log('💡 Tip: Make sure phone number includes country code (e.g., +911234567890)');
    } else if (error.message.includes('not verified')) {
      console.log('💡 Tip: For trial accounts, verify the recipient phone number in Twilio console');
    } else if (error.message.includes('insufficient funds')) {
      console.log('💡 Tip: Add credits to your Twilio account');
    }
  }
}

// Run the test
testTwilioOTP();