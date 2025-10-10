// services/pushNotificationService.ts
const VAPID_PUBLIC_KEY = 'BM8EEfrZjgUoGo8U70Wc-xbWqmtkDPaLByJcFZpcHPjzK7l67eInGTsD0Kx2VdFn9En4QHUsO7yWHxTvPqNiHMQ';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: any;
  orderId?: string | number;
  tag?: string;
}

class PushNotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Initialize push notifications
   */
  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    try {
      // Register service worker
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', this.swRegistration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    // Request permission
    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error('Service Worker not registered');
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource
      });

      console.log('Push subscription successful:', subscription);

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        // Remove subscription from server
        await this.removeSubscriptionFromServer(subscription);
        console.log('Successfully unsubscribed from push notifications');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  /**
   * Get current subscription status
   */
  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      return null;
    }

    try {
      return await this.swRegistration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  /**
   * Show local notification (for testing)
   */
  showLocalNotification(payload: NotificationPayload): void {
    if (!this.isSupported || Notification.permission !== 'granted') {
      console.warn('Cannot show notification: permission not granted');
      return;
    }

    const options: NotificationOptions = {
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      badge: payload.badge || '/favicon.ico',
      data: payload.data,
      tag: payload.tag || 'local-notification',
      requireInteraction: true
    };

    new Notification(payload.title, options);
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const token = localStorage.getItem('jwtToken');
      
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent
        })
      });

      console.log('Subscription sent to server successfully');
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  /**
   * Remove subscription from server
   */
  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      const token = localStorage.getItem('jwtToken');
      
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscription: subscription.toJSON()
        })
      });

      console.log('Subscription removed from server successfully');
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /**
   * Check if push notifications are supported
   */
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();
export default pushNotificationService;