require('dotenv').config();
const Razorpay = require('razorpay');

async function testRazorpayIntegration() {
  console.log('🧪 Testing Razorpay Integration...\n');

  // Check environment variables
  console.log('1. Checking environment variables...');
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || keyId === 'your_razorpay_key_id') {
    console.log('❌ RAZORPAY_KEY_ID not set or using placeholder');
    console.log('   Please update your .env file with actual Razorpay Key ID');
    return;
  }

  if (!keySecret || keySecret === 'your_razorpay_key_secret') {
    console.log('❌ RAZORPAY_KEY_SECRET not set or using placeholder');
    console.log('   Please update your .env file with actual Razorpay Key Secret');
    return;
  }

  console.log('✅ Environment variables configured');
  console.log(`   Key ID: ${keyId.substring(0, 8)}...`);

  // Initialize Razorpay
  console.log('\n2. Initializing Razorpay...');
  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log('✅ Razorpay initialized successfully');

    // Test creating an order
    console.log('\n3. Testing order creation...');
    const orderOptions = {
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      receipt: `test_order_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(orderOptions);
    console.log('✅ Test order created successfully');
    console.log(`   Order ID: ${order.id}`);
    console.log(`   Amount: ₹${order.amount / 100}`);
    console.log(`   Status: ${order.status}`);

    // Test fetching the order
    console.log('\n4. Testing order fetch...');
    const fetchedOrder = await razorpay.orders.fetch(order.id);
    console.log('✅ Order fetched successfully');
    console.log(`   Fetched Order ID: ${fetchedOrder.id}`);

    console.log('\n🎉 Razorpay integration test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Test payment endpoints via your app');
    console.log('   3. Monitor payments in Razorpay dashboard');

  } catch (error) {
    console.log('❌ Razorpay test failed');
    console.error('Error details:', error.message);
    
    if (error.statusCode === 401) {
      console.log('\n💡 This usually means:');
      console.log('   - Invalid Key ID or Key Secret');
      console.log('   - Keys are not activated in Razorpay dashboard');
      console.log('   - Using test keys in production mode or vice versa');
    }
  }
}

// Run the test
if (require.main === module) {
  testRazorpayIntegration();
}

module.exports = { testRazorpayIntegration };