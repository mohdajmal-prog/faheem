require('dotenv').config();
const jwt = require('jsonwebtoken');
const supabase = require('./config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

console.log('\n=== TOKEN DEBUG TEST ===\n');
console.log('1️⃣ Environment Configuration:');
console.log('   JWT_SECRET set:', !!process.env.JWT_SECRET);
console.log('   JWT_SECRET value:', JWT_SECRET);
console.log('   JWT_SECRET length:', JWT_SECRET.length);
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ SET' : '❌ NOT SET');
console.log('   SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ SET' : '❌ NOT SET');

async function testTokenFlow() {
  try {
    console.log('\n2️⃣ Creating test token...');
    
    // Create a test token
    const testUserId = 'test-user-' + Date.now();
    const testToken = jwt.sign(
      { 
        userId: testUserId, 
        email: 'test@example.com', 
        phone: '+1234567890' 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('✅ Token created successfully');
    console.log('   Token (first 50 chars):', testToken.substring(0, 50) + '...');
    console.log('   Token length:', testToken.length);
    
    console.log('\n3️⃣ Verifying token...');
    const decoded = jwt.verify(testToken, JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('   Decoded:', decoded);
    
    console.log('\n4️⃣ Testing database user lookup...');
    console.log('   Looking for user in database...');
    
    // Try to find a real user
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (usersError) {
      console.error('❌ Database error:', usersError);
      console.log('\n⚠️ ISSUE FOUND: Cannot connect to users table');
      console.log('   Check if:');
      console.log('   - Supabase database is running');
      console.log('   - users table exists');
      console.log('   - SUPABASE_SERVICE_KEY has proper permissions');
    } else if (users && users.length > 0) {
      console.log('✅ User table accessible');
      console.log('   Found user:', users[0].id);
      console.log('   User phone:', users[0].phone);
      console.log('   User email:', users[0].email);
      
      // Now test lookup with a real user ID
      console.log('\n5️⃣ Testing token verification with real user...');
      const realToken = jwt.sign(
        { 
          userId: users[0].id, 
          email: users[0].email, 
          phone: users[0].phone 
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      const decoded2 = jwt.verify(realToken, JWT_SECRET);
      console.log('✅ Real user token created and verified');
      console.log('   User ID:', decoded2.userId);
      
      const { data: foundUser, error: lookupError } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded2.userId)
        .single();
      
      if (lookupError) {
        console.error('❌ Lookup error:', lookupError);
        console.log('\n⚠️ ISSUE FOUND: Cannot find user by ID');
      } else if (foundUser) {
        console.log('✅ User found in database by ID');
        console.log('   Name:', foundUser.name);
      }
    } else {
      console.log('⚠️ No users found in database');
      console.log('   This is expected if it\'s a fresh setup');
    }
    
    console.log('\n6️⃣ Summary:');
    console.log('✅ All basic token operations working');
    console.log('\nIf you still get 401 errors:');
    console.log('- Check that you\'re logging in first (to create a user)');
    console.log('- Check that the token is being sent in the Authorization header');
    console.log('- Verify "Bearer <token>" format in the header');
    console.log('- Check backend logs for detailed error messages');
    
  } catch (error) {
    console.error('\n❌ ERROR during test:');
    console.error('   Name:', error.name);
    console.error('   Message:', error.message);
    console.error('   Stack:', error.stack);
    
    if (error.name === 'TokenExpiredError') {
      console.log('\n⚠️ Your test token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      console.log('\n⚠️ JWT verification failed - possible JWT_SECRET mismatch');
    }
  }
}

testTokenFlow().then(() => {
  console.log('\n=== TEST COMPLETE ===\n');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
