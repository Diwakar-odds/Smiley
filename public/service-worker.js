self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }
  const payload = event.data.json();
  const title = payload.title || "Smiley Alerts";
  const options = {
    body: payload.body,
    data: payload.data || {},
    icon: "/images/icons/icon-192x192.png",
    badge: "/images/icons/icon-96x96.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const destination = event.notification?.data?.orderId
    ? `/admin/orders?orderId=${event.notification.data.orderId}`
    : "/admin/orders";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(destination) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(destination);
        }
        return undefined;
      })
  );
});
