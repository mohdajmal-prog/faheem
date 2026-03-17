// Twilio service disabled - SMS functionality removed
// This file is kept for backward compatibility

class OTPService {
  async sendOTP(toPhoneNumber, otp) {
    console.log('📱 SMS service disabled - OTP would be sent to:', toPhoneNumber.replace(/\d(?=\d{4})/g, '*'));
    console.log('🔑 OTP would be:', otp);
    return { success: true, messageId: 'disabled', status: 'disabled' };
  }

  async sendOrderConfirmation(toPhoneNumber, orderId, totalAmount) {
    console.log('📱 SMS service disabled - Order confirmation would be sent to:', toPhoneNumber.replace(/\d(?=\d{4})/g, '*'));
    return { success: true, messageId: 'disabled' };
  }

  async sendOrderStatus(toPhoneNumber, orderId, status) {
    console.log('📱 SMS service disabled - Status update would be sent to:', toPhoneNumber.replace(/\d(?=\d{4})/g, '*'));
    return { success: true, messageId: 'disabled' };
  }
}

module.exports = new OTPService();