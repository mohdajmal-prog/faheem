// Test script to verify API connection
const API_BASE_URL = 'http://10.200.66.35:3006';

async function testConnection() {
  console.log('🔧 Testing API Connection...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    
    // Test 2: Razorpay key
    console.log('\n2. Testing Razorpay key endpoint...');
    const keyResponse = await fetch(`${API_BASE_URL}/payment/key`);
    const keyData = await keyResponse.json();
    console.log('✅ Razorpay key:', keyData.key);
    
    // Test 3: Menu endpoint
    console.log('\n3. Testing menu endpoint...');
    const menuResponse = await fetch(`${API_BASE_URL}/menu`);
    const menuData = await menuResponse.json();
    console.log('✅ Menu items count:', menuData.length);
    
    console.log('\n🎉 All tests passed! Your backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure backend server is running: cd backend && node server.js');
    console.log('2. Check if IP address 10.200.66.35 is correct');
    console.log('3. Make sure port 3006 is not blocked by firewall');
  }
}

testConnection();