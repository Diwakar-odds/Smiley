// routes/pushNotificationRoutes.js
import { Router } from "express";
import { 
  subscribeToPushNotifications, 
  unsubscribeFromPushNotifications, 
  sendTestPushNotification,
  getSubscriptionStatus 
} from "../controllers/pushNotificationController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

// All push notification routes require authentication and admin role
router.use(protect);
router.use(admin);

// @desc    Subscribe to push notifications
// @route   POST /api/push/subscribe
// @access  Private/Admin
router.post('/subscribe', subscribeToPushNotifications);

// @desc    Unsubscribe from push notifications
// @route   POST /api/push/unsubscribe
// @access  Private/Admin
router.post('/unsubscribe', unsubscribeFromPushNotifications);

// @desc    Send test push notification
// @route   POST /api/push/test
// @access  Private/Admin
router.post('/test', sendTestPushNotification);

// @desc    Get subscription status
// @route   GET /api/push/status
// @access  Private/Admin
router.get('/status', getSubscriptionStatus);

export default router;