require('dotenv').config();
const twilioService = require('./services/twilioService');

async function testUserPhone() {
  console.log('🔧 Testing OTP for your number...\n');
  
  // Your phone number with Indian country code
  const yourPhone = '+917603996934';
  const testOTP = '123456';
  
  console.log('📱 Testing SMS to:', yourPhone.replace(/\d(?=\d{4})/g, '*'));
  
  try {
    const result = await twilioService.sendOTP(yourPhone, testOTP);
    console.log('✅ SMS sent successfully!', result);
  } catch (error) {
    console.error('❌ SMS failed:', error.message);
    
    if (error.message.includes('unverified')) {
      console.log('\n🔧 SOLUTION:');
      console.log('1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
      console.log('2. Click "Add a new number"');
      console.log('3. Enter: +917603996934');
      console.log('4. Verify with the code Twilio sends');
      console.log('\n⚡ OR use demo mode:');
      console.log('Phone: +911234567890');
      console.log('OTP: 123456');
    }
  }
}

testUserPhone();