import { useEffect, useState } from "react";
import client from "../api/client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

interface PushSetupOptions {
  enabled: boolean;
}

export function usePushNotifications({ enabled }: PushSetupOptions) {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" ? Notification.permission : "default"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setError("Push notifications are not supported in this browser.");
      return;
    }

    async function setupPush() {
      try {
        if (Notification.permission === "default") {
          const result = await Notification.requestPermission();
          setPermission(result);
          if (result !== "granted") {
            return;
          }
        } else {
          setPermission(Notification.permission);
          if (Notification.permission !== "granted") {
            return;
          }
        }

        const registration = await navigator.serviceWorker.register("/service-worker.js");
        const { data } = await client.get<{ vapidPublicKey: string }>("/notifications/config");
        if (!data.vapidPublicKey) {
          setError("Push notifications are not configured on the server.");
          return;
        }

        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await client.post("/notifications/subscribe", { subscription: existingSubscription });
          return;
        }

        const applicationServerKey = urlBase64ToUint8Array(data.vapidPublicKey);
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        await client.post("/notifications/subscribe", { subscription });
      } catch (err) {
        console.error("Failed to configure push notifications", err);
        setError("Failed to enable push notifications");
      }
    }

    setupPush();
  }, [enabled]);

  return { permission, error };
}

export default usePushNotifications;
