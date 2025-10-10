import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiBellOff, FiSmartphone, FiMessageSquare, FiCheck, FiX, FiSettings } from 'react-icons/fi';
import pushNotificationService from '../../services/pushNotificationService';
import { useToast } from '../../contexts/ToastContext';

interface NotificationSettingsProps {
  className?: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className = '' }) => {
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    const supported = pushNotificationService.isNotificationSupported();
    setPushSupported(supported);

    if (supported) {
      setPushPermission(pushNotificationService.getPermissionStatus());
      
      // Initialize service worker
      const initialized = await pushNotificationService.initialize();
      
      if (initialized) {
        // Check current subscription status
        const subscription = await pushNotificationService.getSubscription();
        setIsSubscribed(!!subscription);
      }
    }
  };

  const handleEnablePushNotifications = async () => {
    setLoading(true);
    try {
      // Request permission first
      const permission = await pushNotificationService.requestPermission();
      setPushPermission(permission);

      if (permission === 'granted') {
        // Subscribe to notifications
        const subscription = await pushNotificationService.subscribe();
        
        if (subscription) {
          setIsSubscribed(true);
          showToast('success', 'Push notifications enabled successfully! You will now receive order alerts.');
          
          // Show a test notification
          pushNotificationService.showLocalNotification({
            title: '🎉 Notifications Enabled!',
            body: 'You will now receive instant alerts for new orders.',
            icon: '/favicon.ico'
          });
        } else {
          showToast('error', 'Failed to enable push notifications. Please try again.');
        }
      } else if (permission === 'denied') {
        showToast('error', 'Push notifications are blocked. Please enable them in your browser settings.');
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      showToast('error', 'Failed to enable push notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisablePushNotifications = async () => {
    setLoading(true);
    try {
      const success = await pushNotificationService.unsubscribe();
      
      if (success) {
        setIsSubscribed(false);
        showToast('info', 'Push notifications disabled successfully.');
      } else {
        showToast('error', 'Failed to disable push notifications. Please try again.');
      }
    } catch (error) {
      console.error('Error disabling push notifications:', error);
      showToast('error', 'Failed to disable push notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = () => {
    if (isSubscribed) {
      pushNotificationService.showLocalNotification({
        title: '🧪 Test Notification',
        body: 'This is a test notification from Smiley Admin Dashboard!',
        icon: '/favicon.ico',
        tag: 'test-notification'
      });
      showToast('info', 'Test notification sent!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      <div className="flex items-center mb-6">
        <FiSettings className="text-xl text-indigo-600 dark:text-indigo-400 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Notification Settings
        </h3>
      </div>

      <div className="space-y-6">
        {/* SMS Notifications */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center">
            <FiMessageSquare className="text-lg text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">SMS Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive SMS alerts for new orders
              </p>
            </div>
          </div>
          <div className="flex items-center text-green-600">
            <FiCheck className="mr-1" />
            <span className="text-sm font-medium">Active</span>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FiSmartphone className="text-lg text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Browser Push Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get instant browser notifications for new orders
                </p>
              </div>
            </div>
            {isSubscribed ? (
              <div className="flex items-center text-green-600">
                <FiCheck className="mr-1" />
                <span className="text-sm font-medium">Enabled</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <FiX className="mr-1" />
                <span className="text-sm font-medium">Disabled</span>
              </div>
            )}
          </div>

          {!pushSupported && (
            <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-600 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Push notifications are not supported in this browser.
              </p>
            </div>
          )}

          {pushSupported && pushPermission === 'denied' && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-600 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                Push notifications are blocked. Please enable them in your browser settings and refresh the page.
              </p>
            </div>
          )}

          {pushSupported && (
            <div className="flex gap-3">
              {!isSubscribed ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnablePushNotifications}
                  disabled={loading || pushPermission === 'denied'}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <FiBell className="mr-2" />
                  )}
                  {loading ? 'Enabling...' : 'Enable Push Notifications'}
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTestNotification}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <FiBell className="mr-2" />
                    Test Notification
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDisablePushNotifications}
                    disabled={loading}
                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    ) : (
                      <FiBellOff className="mr-2" />
                    )}
                    {loading ? 'Disabling...' : 'Disable'}
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-600 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How it works:</h5>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• SMS notifications are automatically sent to configured admin phone numbers</li>
            <li>• Push notifications work even when the browser tab is not active</li>
            <li>• Notifications include order details and quick action buttons</li>
            <li>• You can test notifications to make sure they're working properly</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;