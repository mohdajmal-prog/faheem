const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (this.accountSid && this.authToken && this.phoneNumber) {
      this.client = twilio(this.accountSid, this.authToken);
      console.log('✅ Twilio service initialized');
    } else {
      console.log('⚠️ Twilio credentials missing - SMS disabled');
      this.client = null;
    }
  }

  async sendOTP(toPhoneNumber, otp) {
    if (!this.client) {
      console.log('📱 SMS service disabled - OTP would be sent to:', toPhoneNumber.replace(/\d(?=\d{4})/g, '*'));
      console.log('🔑 OTP would be:', otp);
      return { success: true, messageId: 'disabled', status: 'disabled' };
    }

    try {
      const message = await this.client.messages.create({
        body: `Your Ambis Cafe verification code is: ${otp}. Valid for 5 minutes.`,
        from: this.phoneNumber,
        to: toPhoneNumber
      });
      
      console.log('✅ OTP sent successfully:', message.sid);
      return { success: true, messageId: message.sid, status: message.status };
    } catch (error) {
      console.error('❌ Failed to send OTP:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendOrderConfirmation(toPhoneNumber, orderId, totalAmount) {
    if (!this.client) {
      console.log('📱 SMS service disabled - Order confirmation would be sent to:', toPhoneNumber.replace(/\d(?=\d{4})/g, '*'));
      return { success: true, messageId: 'disabled' };
    }

    try {
      const message = await this.client.messages.create({
        body: `Order #${orderId} confirmed! Total: ₹${totalAmount}. Thank you for choosing Ambis Cafe!`,
        from: this.phoneNumber,
        to: toPhoneNumber
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('❌ Failed to send order confirmation:', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendOrderStatus(toPhoneNumber, orderId, status) {
    if (!this.client) {
      console.log('📱 SMS service disabled - Status update would be sent to:', toPhoneNumber.replace(/\d(?=\d{4})/g, '*'));
      return { success: true, messageId: 'disabled' };
    }

    try {
      const statusMessages = {
        preparing: 'Your order is being prepared',
        ready: 'Your order is ready for pickup',
        completed: 'Your order has been completed'
      };
      
      const message = await this.client.messages.create({
        body: `Order #${orderId}: ${statusMessages[status] || status}. Ambis Cafe`,
        from: this.phoneNumber,
        to: toPhoneNumber
      });
      
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('❌ Failed to send status update:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new TwilioService();