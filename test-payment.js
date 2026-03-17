const API_BASE_URL = 'http://10.200.66.35:3006';

async function testPaymentOrder() {
  console.log('🧪 Testing Payment Order Creation...\n');
  
  try {
    // Test data similar to what the app would send
    const testOrderData = {
      amount: 100,
      orderId: 'test-order-123',
      userId: 'test-user'
    };
    
    console.log('📤 Sending payment order request...');
    console.log('Data:', JSON.stringify(testOrderData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrderData)
    });
    
    console.log('📊 Response status:', response.status);
    
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('✅ Parsed response:', data);
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPaymentOrder();