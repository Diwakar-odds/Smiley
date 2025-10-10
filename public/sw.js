// Service worker for push notifications
const CACHE_NAME = 'smiley-admin-v1';
const VAPID_PUBLIC_KEY = 'BM8EEfrZjgUoGo8U70Wc-xbWqmtkDPaLByJcFZpcHPjzK7l67eInGTsD0Kx2VdFn9En4QHUsO7yWHxTvPqNiHMQ';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  let notificationData;
  try {
    notificationData = event.data.json();
  } catch (e) {
    notificationData = {
      title: 'New Order',
      body: event.data.text() || 'A new order has been placed',
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    };
  }

  const options = {
    body: notificationData.body || 'A new order has been placed',
    icon: notificationData.icon || '/favicon.ico',
    badge: notificationData.badge || '/favicon.ico',
    image: notificationData.image,
    vibrate: [200, 100, 200],
    sound: '/notification-sound.mp3',
    data: notificationData.data || {
      url: '/admin/orders',
      orderId: notificationData.orderId
    },
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/view-icon.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/close-icon.png'
      }
    ],
    tag: notificationData.tag || 'new-order',
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'New Order Alert 🍽️', 
      options
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'view') {
    // Open the admin dashboard orders page
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        // Check if admin dashboard is already open
        const adminClient = clients.find((client) =>
          client.url.includes('/admin') || client.url.includes('/dashboard')
        );

        if (adminClient) {
          // Focus existing admin tab and navigate to orders
          adminClient.focus();
          return adminClient.navigate('/admin/orders');
        } else {
          // Open new admin dashboard window
          return self.clients.openWindow('/admin/dashboard');
        }
      })
    );
  } else if (event.action === 'close') {
    // Just close the notification (already done above)
    return;
  } else {
    // Default click action - open admin dashboard
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        const adminClient = clients.find((client) =>
          client.url.includes('/admin') || client.url.includes('/dashboard')
        );

        if (adminClient) {
          adminClient.focus();
          return adminClient.navigate('/admin/orders');
        } else {
          return self.clients.openWindow('/admin/dashboard');
        }
      })
    );
  }
});

// Handle background sync for offline order notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncOrders() {
  try {
    // This would sync with your backend when connection is restored
    const response = await fetch('/api/orders/pending');
    const pendingOrders = await response.json();
    
    if (pendingOrders.length > 0) {
      self.registration.showNotification(`${pendingOrders.length} Pending Orders`, {
        body: 'You have pending orders to process',
        icon: '/favicon.ico',
        tag: 'pending-orders'
      });
    }
  } catch (error) {
    console.error('Failed to sync orders:', error);
  }
}

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});