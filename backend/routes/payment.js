const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /payment/create-order
// @desc    Create a Razorpay order for payment
router.post('/create-order', async (req, res) => {
  try {
    console.log('💳 Payment order creation request received');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    const { amount, currency = 'INR', orderId, userId } = req.body;
    console.log('📊 Extracted data:', { amount, currency, orderId, userId });

    if (!amount || !orderId) {
      console.error('❌ Missing required fields:', { amount: !!amount, orderId: !!orderId });
      return res.status(400).json({ error: 'Amount and orderId are required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `cafe_${orderId.substring(0, 8)}_${Date.now().toString().slice(-6)}`, // Keep under 40 chars
      payment_capture: 1, // Auto-capture payment
      notes: {
        order_id: orderId,
        user_id: userId || 'guest'
      }
    };
    
    console.log('🔧 Razorpay options:', JSON.stringify(options, null, 2));
    console.log('🔑 Razorpay credentials check:', {
      key_id: process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING',
      key_secret: process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'MISSING'
    });

    console.log('📞 Calling Razorpay API...');
    const razorpayOrder = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', razorpayOrder.id);
    
    // Store payment order in database
    console.log('💾 Storing in database...');
    const { error: dbError } = await supabase
      .from('payment_orders')
      .insert({
        razorpay_order_id: razorpayOrder.id,
        order_id: orderId,
        user_id: userId,
        amount: amount,
        currency: currency,
        status: 'created',
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('⚠️ Database error (non-critical):', dbError);
    } else {
      console.log('✅ Stored in database successfully');
    }
    
    const response = {
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    };
    
    console.log('📤 Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('❌ Razorpay create order error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create payment order',
      details: error.message 
    });
  }
});

// @route   POST /payment/verify
// @desc    Verify Razorpay payment signature and update order status
router.post('/verify', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      order_id
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        error: 'Missing required payment verification parameters' 
      });
    }

    // Generate signature to verify
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment verified successfully - Update database
      const updates = [];
      
      // Update payment order status
      const { error: paymentError } = await supabase
        .from('payment_orders')
        .update({
          razorpay_payment_id: razorpay_payment_id,
          status: 'completed',
          verified_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', razorpay_order_id);

      if (paymentError) {
        console.error('Payment update error:', paymentError);
      }

      // Update main order status to paid
      if (order_id) {
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('id', order_id);

        if (orderError) {
          console.error('Order update error:', orderError);
        }
      }

      res.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id
      });
    } else {
      // Signature mismatch - Update as failed
      await supabase
        .from('payment_orders')
        .update({
          status: 'failed',
          failure_reason: 'Signature verification failed'
        })
        .eq('razorpay_order_id', razorpay_order_id);

      res.status(400).json({
        success: false,
        verified: false,
        error: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Razorpay verify error:', error);
    res.status(500).json({ 
      error: 'Payment verification failed',
      details: error.message 
    });
  }
});

// @route   GET /payment/key
// @desc    Get Razorpay key for frontend
router.get('/key', (req, res) => {
  res.json({
    key: process.env.RAZORPAY_KEY_ID
  });
});

// @route   GET /payment/status/:orderId
// @desc    Get payment status for an order
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const { data, error } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      success: true,
      payment: data
    });
  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ 
      error: 'Failed to get payment status',
      details: error.message 
    });
  }
});

module.exports = router;
