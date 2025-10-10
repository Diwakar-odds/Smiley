// Test script for notifications
// server/scripts/testNotifications.js

import { sendOrderNotificationSMS, sendTestSMS } from '../services/adminNotificationService.js';

async function testSMSNotification() {
  console.log('🧪 Testing SMS Notification System...\n');
  
  try {
    // Test with sample order data
    const sampleOrder = {
      orderId: 'TEST-001',
      customerName: 'Test Customer',
      customerPhone: '+1234567890',
      totalPrice: 150,
      items: [
        { name: 'Aloo Patty', quantity: 2 },
        { name: 'Chocolate Shake', quantity: 1 }
      ]
    };

    console.log('Sending test order notification SMS...');
    const results = await sendOrderNotificationSMS(sampleOrder);
    
    console.log('SMS Notification Results:');
    results.forEach((result, index) => {
      console.log(`  Admin ${index + 1} (${result.phone}): ${result.success ? '✅ Success' : '❌ Failed'}`);
      if (!result.success) {
        console.log(`    Error: ${result.error}`);
      }
    });

    console.log('\n📱 Test completed!');
    console.log('If you have configured valid admin phone numbers in your environment,');
    console.log('you should receive SMS notifications on those numbers.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testSMSNotification();
}

export { testSMSNotification };