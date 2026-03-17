const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');

// @route   POST /payment/create-payment-link
// @desc    Create payment link for order
router.post('/create-payment-link', async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required' });
    }

    const paymentLink = process.env.RAZORPAY_PAYMENT_LINK;
    
    if (!paymentLink) {
      return res.status(500).json({ error: 'Payment link not configured' });
    }

    // Create payment URL with amount
    const paymentUrl = `${paymentLink}/${amount}`;

    // Store payment link request in database
    const { error: dbError } = await supabase
      .from('payment_orders')
      .insert({
        razorpay_order_id: `link_${orderId}_${Date.now()}`,
        order_id: orderId,
        amount: amount,
        currency: 'INR',
        status: 'link_created',
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    res.json({
      success: true,
      paymentUrl: paymentUrl,
      amount: amount
    });

  } catch (error) {
    console.error('Payment link creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create payment link',
      details: error.message 
    });
  }
});

// @route   POST /payment/confirm-payment
// @desc    Confirm payment completion (manual confirmation)
router.post('/confirm-payment', async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Update payment status
    const { error: paymentError } = await supabase
      .from('payment_orders')
      .update({
        razorpay_payment_id: paymentId || `manual_${Date.now()}`,
        status: 'completed',
        verified_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (paymentError) {
      console.error('Payment update error:', paymentError);
    }

    // Update order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (orderError) {
      console.error('Order update error:', orderError);
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully'
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ 
      error: 'Failed to confirm payment',
      details: error.message 
    });
  }
});

module.exports = router;