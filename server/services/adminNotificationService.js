// services/adminNotificationService.js
import twilio from "twilio";
import { TWILIO_CONFIG } from "../config/twilioConfig.js";

// Initialize Twilio client
const twilioClient = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);

// Admin phone numbers - These should be set in environment variables
const ADMIN_PHONE_NUMBERS = [
  process.env.ADMIN_PHONE_1 || "", // Set in environment variables
  process.env.ADMIN_PHONE_2 || "", // Optional second admin
].filter(phone => phone && phone !== ""); // Remove empty entries

/**
 * Send SMS notification to admin(s) about new order
 * @param {Object} orderDetails - Order information
 * @param {string} orderDetails.orderId - Order ID
 * @param {string} orderDetails.customerName - Customer name
 * @param {string} orderDetails.customerPhone - Customer phone
 * @param {number} orderDetails.totalPrice - Total order amount
 * @param {Array} orderDetails.items - Order items
 */
export async function sendOrderNotificationSMS(orderDetails) {
  const { orderId, customerName, customerPhone, totalPrice, items } = orderDetails;
  
  // Create SMS message
  const itemsList = items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
  const message = `🍽️ NEW ORDER ALERT!\n\nOrder #${orderId}\nCustomer: ${customerName}\nPhone: ${customerPhone}\nTotal: ₹${totalPrice}\nItems: ${itemsList}\n\nPlease check admin dashboard for details.`;

  const results = [];

  // Send SMS to all admin phone numbers
  for (const adminPhone of ADMIN_PHONE_NUMBERS) {
    try {
      const result = await twilioClient.messages.create({
        body: message,
        from: TWILIO_CONFIG.phoneNumber,
        to: adminPhone,
      });
      
      console.log(`Order notification SMS sent to admin ${adminPhone}:`, result.sid);
      results.push({ phone: adminPhone, success: true, sid: result.sid });
    } catch (error) {
      console.error(`Error sending SMS to admin ${adminPhone}:`, error);
      results.push({ phone: adminPhone, success: false, error: error.message });
    }
  }

  return results;
}

/**
 * Send SMS notification about order status updates
 * @param {Object} orderDetails - Order information
 * @param {string} orderDetails.orderId - Order ID
 * @param {string} orderDetails.customerName - Customer name
 * @param {string} orderDetails.status - New order status
 * @param {string} adminPhone - Admin phone who updated the status
 */
export async function sendOrderStatusUpdateSMS(orderDetails, adminPhone) {
  const { orderId, customerName, status } = orderDetails;
  
  const statusEmojis = {
    pending: "⏳",
    accepted: "✅",
    completed: "🎉",
    rejected: "❌"
  };

  const message = `${statusEmojis[status]} Order #${orderId} status updated!\n\nCustomer: ${customerName}\nNew Status: ${status.toUpperCase()}\nUpdated by admin.`;

  // Send to other admins (exclude the one who made the update)
  const otherAdmins = ADMIN_PHONE_NUMBERS.filter(phone => phone !== adminPhone);
  
  const results = [];
  for (const phone of otherAdmins) {
    try {
      const result = await twilioClient.messages.create({
        body: message,
        from: TWILIO_CONFIG.phoneNumber,
        to: phone,
      });
      
      console.log(`Status update SMS sent to admin ${phone}:`, result.sid);
      results.push({ phone, success: true, sid: result.sid });
    } catch (error) {
      console.error(`Error sending status update SMS to admin ${phone}:`, error);
      results.push({ phone, success: false, error: error.message });
    }
  }

  return results;
}

/**
 * Test SMS functionality
 * @param {string} testPhone - Phone number to send test message
 */
export async function sendTestSMS(testPhone) {
  try {
    const result = await twilioClient.messages.create({
      body: "🧪 Test SMS from Smiley Admin Notification System. SMS notifications are working correctly!",
      from: TWILIO_CONFIG.phoneNumber,
      to: testPhone,
    });
    
    console.log("Test SMS sent successfully:", result.sid);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error("Error sending test SMS:", error);
    return { success: false, error: error.message };
  }
}