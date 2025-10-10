import webPush from "web-push";
import twilio from "twilio";
import { Op } from "sequelize";
import { orderEvents } from "../events/orderEvents.js";
import {
  AdminNotification,
  AdminPushSubscription,
  Order,
  User,
  MenuItem,
} from "../models/sequelize/index.js";
import { TWILIO_CONFIG } from "../config/twilioConfig.js";

const {
  VAPID_PUBLIC_KEY = "",
  VAPID_PRIVATE_KEY = "",
  VAPID_CONTACT_EMAIL = "alerts@example.com",
  ADMIN_ALERT_NUMBERS = "",
  ORDER_ESCALATION_MINUTES = "5",
} = process.env;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(`mailto:${VAPID_CONTACT_EMAIL}`, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

const hasTwilioCredentials =
  TWILIO_CONFIG.accountSid &&
  TWILIO_CONFIG.authToken &&
  !TWILIO_CONFIG.accountSid.startsWith("your_") &&
  !TWILIO_CONFIG.authToken.startsWith("your_");

const twilioClient = hasTwilioCredentials
  ? twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken)
  : null;

const escalationMinutes = Number(ORDER_ESCALATION_MINUTES) || 5;
const escalationIntervalMs = Math.max(escalationMinutes, 1) * 60 * 1000;

function getAdminAlertNumbers() {
  return ADMIN_ALERT_NUMBERS
    ? ADMIN_ALERT_NUMBERS.split(",")
        .map((num) => num.trim())
        .filter(Boolean)
    : [];
}

async function buildNotificationMessage(orderInstance) {
  const order = orderInstance;
  const items = await order.getMenuItems();
  const summaryItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.OrderItem?.quantity ?? 0,
  }));

  return {
    message: `New order #${order.id} from ${order.name || order.User?.name || "Unknown"} (₹${order.totalPrice})`,
    metadata: {
      orderId: order.id,
      customer: order.name || order.User?.name,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      items: summaryItems,
    },
  };
}

async function sendPushNotifications(payload) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return;
  }

  const subscriptions = await AdminPushSubscription.findAll({ where: { active: true } });
  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        const pushPayload = JSON.stringify({
          title: payload.title || "New Order",
          body: payload.body,
          data: payload.data,
        });
        await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dhKey,
              auth: subscription.authKey,
            },
          },
          pushPayload
        );
        subscription.lastNotifiedAt = new Date();
        await subscription.save();
      } catch (error) {
        if (error.statusCode === 410 || error.statusCode === 404) {
          subscription.active = false;
          await subscription.save();
        } else {
          console.error("Failed to send push notification:", error);
        }
      }
    })
  );
}

async function sendSmsAlerts(body, level = 0) {
  if (!twilioClient) {
    return;
  }
  if (!TWILIO_CONFIG.phoneNumber || TWILIO_CONFIG.phoneNumber.startsWith("your_")) {
    return;
  }
  const numbers = getAdminAlertNumbers();
  if (!numbers.length) {
    return;
  }
  await Promise.all(
    numbers.map(async (number) => {
      try {
        await twilioClient.messages.create({
          to: number.startsWith("+") ? number : `+${number}`,
          from: TWILIO_CONFIG.phoneNumber,
          body: level > 0 ? `[Escalation ${level}] ${body}` : body,
        });
      } catch (error) {
        console.error("Failed to send SMS alert:", error);
      }
    })
  );
}

async function createAdminNotification(order) {
  const enrichedOrder = await Order.findByPk(order.id, {
    include: [
      { model: User, attributes: ["id", "name", "email", "mobile"] },
      { model: MenuItem },
    ],
  });

  if (!enrichedOrder) {
    throw new Error("Order not found for notification");
  }

  const { message, metadata } = await buildNotificationMessage(enrichedOrder);

  const notification = await AdminNotification.create({
    orderId: enrichedOrder.id,
    message,
    metadata,
    status: "new",
    unread: true,
  });

  orderEvents.emit("notification:new", {
    type: "order",
    notification: notification.toJSON(),
  });

  await sendPushNotifications({
    title: "New Order",
    body: message,
    data: { orderId: enrichedOrder.id },
  });

  await sendSmsAlerts(message);

  return notification;
}

async function markNotificationRead(notificationId, adminId) {
  const notification = await AdminNotification.findByPk(notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }
  notification.unread = false;
  notification.status = notification.status === "new" ? "acknowledged" : notification.status;
  notification.readAt = new Date();
  notification.acknowledgedBy = adminId;
  await notification.save();

  orderEvents.emit("notification:update", {
    type: "status",
    notification: notification.toJSON(),
  });
  return notification;
}

async function markNotificationHandled(notificationId, adminId) {
  const notification = await AdminNotification.findByPk(notificationId);
  if (!notification) {
    throw new Error("Notification not found");
  }
  notification.unread = false;
  notification.status = "handled";
  notification.handledAt = new Date();
  notification.handledBy = adminId;
  await notification.save();

  orderEvents.emit("notification:update", {
    type: "status",
    notification: notification.toJSON(),
  });
  return notification;
}

async function escalateStaleNotifications() {
  const cutoff = new Date(Date.now() - escalationIntervalMs);
  const staleNotifications = await AdminNotification.findAll({
    where: {
      status: "new",
      createdAt: { [Op.lte]: cutoff },
    },
  });

  await Promise.all(
    staleNotifications.map(async (notification) => {
      notification.status = "escalated";
      notification.escalationLevel += 1;
      notification.escalatedAt = new Date();
      await notification.save();

      const body = `Order #${notification.orderId} is still unacknowledged.`;
      await sendPushNotifications({
        title: "Order Escalation",
        body,
        data: { orderId: notification.orderId, escalationLevel: notification.escalationLevel },
      });
      await sendSmsAlerts(body, notification.escalationLevel);

      orderEvents.emit("notification:update", {
        type: "escalation",
        notification: notification.toJSON(),
      });
    })
  );
}

function startEscalationScheduler() {
  setInterval(() => {
    escalateStaleNotifications().catch((error) => {
      console.error("Failed to process escalations:", error);
    });
  }, escalationIntervalMs);
}

async function upsertPushSubscription(adminId, subscription) {
  const existing = await AdminPushSubscription.findOne({ where: { endpoint: subscription.endpoint } });

  if (existing) {
    existing.p256dhKey = subscription.keys.p256dh;
    existing.authKey = subscription.keys.auth;
    existing.active = true;
    existing.adminId = adminId;
    await existing.save();
    return existing;
  }

  return AdminPushSubscription.create({
    adminId,
    endpoint: subscription.endpoint,
    p256dhKey: subscription.keys.p256dh,
    authKey: subscription.keys.auth,
    active: true,
  });
}

export {
  createAdminNotification,
  markNotificationRead,
  markNotificationHandled,
  escalateStaleNotifications,
  startEscalationScheduler,
  upsertPushSubscription,
};
