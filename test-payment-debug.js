const API_BASE_URL = 'http://10.200.66.35:3006';

async function testPaymentWithRealData() {
  console.log('🧪 Testing Payment with Real App Data...\n');
  
  try {
    // Simulate the exact data structure the app sends
    const orderData = {
      amount: 150, // Example amount
      orderId: 'b0237ab4-8848-48bb-b537-fbe49c8cd5e3', // Real UUID from your logs
      userId: 'guest'
    };
    
    console.log('📤 Testing payment order creation...');
    console.log('URL:', `${API_BASE_URL}/payment/create-order`);
    console.log('Data:', JSON.stringify(orderData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📥 Raw response body:', responseText);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Success! Parsed response:', data);
      } catch (parseError) {
        console.error('❌ Failed to parse successful response as JSON');
      }
    } else {
      console.error('❌ Request failed with status:', response.status);
      try {
        const errorData = JSON.parse(responseText);
        console.error('❌ Error details:', errorData);
      } catch (parseError) {
        console.error('❌ Error response is not JSON:', responseText);
      }
    }
    
  } catch (error) {
    console.error('❌ Network/Fetch error:', error.message);
    console.error('❌ Full error:', error);
  }
}

// Also test if the server is reachable
async function testServerHealth() {
  console.log('🏥 Testing server health...');
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    console.log('✅ Server is healthy:', data.message);
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
  }
}

async function runTests() {
  await testServerHealth();
  console.log('\n' + '='.repeat(50) + '\n');
  await testPaymentWithRealData();
}

runTests();