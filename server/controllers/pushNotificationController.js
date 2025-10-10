// controllers/pushNotificationController.js
import webpush from 'web-push';

// In production, you should store subscriptions in a database
// For now, we'll use in-memory storage
const subscriptions = new Map();

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BM8EEfrZjgUoGo8U70Wc-xbWqmtkDPaLByJcFZpcHPjzK7l67eInGTsD0Kx2VdFn9En4QHUsO7yWHxTvPqNiHMQ';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '--MuVPBZA6Fhdn6AXAXc13sNNGjUECuMXV1JNsKVsTE';

webpush.setVapidDetails(
  'mailto:admin@smiley.com', // Replace with your email
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// @desc    Subscribe to push notifications
// @route   POST /api/push/subscribe
// @access  Private/Admin
export const subscribeToPushNotifications = async (req, res) => {
  try {
    const { subscription, userAgent } = req.body;
    const userId = req.user.id;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ message: 'Invalid subscription data' });
    }

    // Store subscription with user info
    subscriptions.set(userId, {
      subscription,
      userAgent,
      userId,
      subscribedAt: new Date(),
      isActive: true
    });

    console.log(`Push notification subscription added for user ${userId}`);
    res.status(201).json({ message: 'Successfully subscribed to push notifications' });

    // Send a welcome notification
    try {
      await sendPushNotification(userId, {
        title: '🎉 Push Notifications Enabled!',
        body: 'You will now receive instant alerts for new orders.',
        icon: '/favicon.ico',
        tag: 'welcome-notification'
      });
    } catch (pushError) {
      console.error('Failed to send welcome notification:', pushError);
    }
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    res.status(500).json({ message: 'Failed to subscribe to push notifications' });
  }
};

// @desc    Unsubscribe from push notifications
// @route   POST /api/push/unsubscribe
// @access  Private/Admin
export const unsubscribeFromPushNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    if (subscriptions.has(userId)) {
      subscriptions.delete(userId);
      console.log(`Push notification subscription removed for user ${userId}`);
      res.json({ message: 'Successfully unsubscribed from push notifications' });
    } else {
      res.status(404).json({ message: 'No active subscription found' });
    }
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    res.status(500).json({ message: 'Failed to unsubscribe from push notifications' });
  }
};

// @desc    Send test push notification
// @route   POST /api/push/test
// @access  Private/Admin
export const sendTestPushNotification = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!subscriptions.has(userId)) {
      return res.status(404).json({ message: 'No active subscription found. Please enable push notifications first.' });
    }

    await sendPushNotification(userId, {
      title: '🧪 Test Notification',
      body: 'This is a test notification from Smiley Admin Dashboard!',
      icon: '/favicon.ico',
      tag: 'test-notification'
    });

    res.json({ message: 'Test notification sent successfully' });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ message: 'Failed to send test notification' });
  }
};

// @desc    Get subscription status
// @route   GET /api/push/status
// @access  Private/Admin
export const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscription = subscriptions.get(userId);

    res.json({
      isSubscribed: !!subscription,
      subscribedAt: subscription?.subscribedAt,
      userAgent: subscription?.userAgent
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ message: 'Failed to get subscription status' });
  }
};

/**
 * Send push notification to specific user
 * @param {string} userId - User ID to send notification to
 * @param {Object} payload - Notification payload
 */
export const sendPushNotification = async (userId, payload) => {
  try {
    const userSubscription = subscriptions.get(userId);
    
    if (!userSubscription || !userSubscription.isActive) {
      console.log(`No active subscription found for user ${userId}`);
      return false;
    }

    const notificationPayload = JSON.stringify(payload);

    await webpush.sendNotification(userSubscription.subscription, notificationPayload);
    console.log(`Push notification sent to user ${userId}:`, payload.title);
    return true;
  } catch (error) {
    console.error(`Error sending push notification to user ${userId}:`, error);
    
    // If the subscription is invalid, mark it as inactive
    if (error.statusCode === 410) {
      const userSubscription = subscriptions.get(userId);
      if (userSubscription) {
        userSubscription.isActive = false;
        console.log(`Marked subscription as inactive for user ${userId}`);
      }
    }
    
    return false;
  }
};

/**
 * Send push notification to all subscribed admin users
 * @param {Object} payload - Notification payload
 */
export const sendPushNotificationToAllAdmins = async (payload) => {
  const results = [];
  
  for (const [userId, userSubscription] of subscriptions.entries()) {
    if (userSubscription.isActive) {
      try {
        const success = await sendPushNotification(userId, payload);
        results.push({ userId, success });
      } catch (error) {
        console.error(`Failed to send notification to user ${userId}:`, error);
        results.push({ userId, success: false, error: error.message });
      }
    }
  }

  return results;
};

/**
 * Send order notification to all admins
 * @param {Object} orderDetails - Order information
 */
export const sendOrderPushNotification = async (orderDetails) => {
  const { orderId, customerName, totalPrice, items } = orderDetails;
  
  const itemsList = items.map(item => `${item.name} (${item.quantity}x)`).join(', ');
  
  const payload = {
    title: '🍽️ New Order Alert!',
    body: `Order #${orderId} from ${customerName} - ₹${totalPrice}`,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    image: '/images/order-notification.png',
    data: {
      orderId,
      customerName,
      totalPrice,
      items: itemsList,
      url: '/admin/orders'
    },
    tag: `order-${orderId}`,
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/view-icon.png'
      }
    ]
  };

  return await sendPushNotificationToAllAdmins(payload);
};