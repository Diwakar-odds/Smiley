import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { addSseClient, removeSseClient } from "../events/orderEvents.js";
import {
  AdminNotification,
  Order,
  User,
  MenuItem,
} from "../models/sequelize/index.js";
import {
  markNotificationRead,
  markNotificationHandled,
  upsertPushSubscription,
} from "../services/notificationService.js";

const JWT_SECRET = process.env.JWT_SECRET || "abc123";
const MAX_STREAM_CONNECTION_AGE_MS = 1000 * 60 * 60 * 6; // 6 hours

function buildWhereClause(query) {
  const where = {};
  if (query.status) {
    const statuses = Array.isArray(query.status)
      ? query.status
      : String(query.status)
          .split(",")
          .map((status) => status.trim())
          .filter(Boolean);
    if (statuses.length) {
      where.status = { [Op.in]: statuses };
    }
  }
  if (query.unread === "true") {
    where.unread = true;
  }
  return where;
}

export async function streamNotifications(req, res) {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(401).json({ message: "Missing token" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findByPk(decoded.id);
    if (!admin || admin.role !== "admin") {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    const clientId = `${admin.id}-${Date.now()}`;
    addSseClient(clientId, res);
  res.write("event: connected\ndata: {}\n\n");

    const timer = setTimeout(() => {
      clearInterval(heartbeat);
      removeSseClient(clientId);
    }, MAX_STREAM_CONNECTION_AGE_MS);

    const heartbeat = setInterval(() => {
      try {
        res.write(": heartbeat\n\n");
      } catch (writeError) {
        clearInterval(heartbeat);
        clearTimeout(timer);
        removeSseClient(clientId);
      }
    }, 25000);

    req.on("close", () => {
      clearTimeout(timer);
      clearInterval(heartbeat);
      removeSseClient(clientId);
    });
  } catch (error) {
    console.error("Failed to initialize stream:", error);
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function listAdminNotifications(req, res) {
  try {
    const where = buildWhereClause(req.query);
    const limit = Math.min(Number(req.query.limit) || 50, 200);

    const notifications = await AdminNotification.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      include: [
        {
          model: Order,
          include: [
            { model: User, attributes: ["id", "name", "email", "mobile"] },
            {
              model: MenuItem,
              through: { attributes: ["quantity", "price"] },
            },
          ],
        },
      ],
    });

    res.json(
      notifications.map((notification) => ({
        ...notification.toJSON(),
      }))
    );
  } catch (error) {
    console.error("Failed to list admin notifications:", error);
    res.status(500).json({ message: "Failed to list notifications" });
  }
}

export async function acknowledgeNotification(req, res) {
  try {
    const notification = await markNotificationRead(req.params.id, req.user.id);
    res.json(notification);
  } catch (error) {
    console.error("Failed to acknowledge notification:", error);
    res.status(500).json({ message: error.message || "Failed to update" });
  }
}

export async function resolveNotification(req, res) {
  try {
    const notification = await markNotificationHandled(req.params.id, req.user.id);
    res.json(notification);
  } catch (error) {
    console.error("Failed to mark notification handled:", error);
    res.status(500).json({ message: error.message || "Failed to update" });
  }
}

export async function registerPushSubscription(req, res) {
  try {
    const { subscription } = req.body;
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      res.status(400).json({ message: "Invalid subscription payload" });
      return;
    }

    const record = await upsertPushSubscription(req.user.id, subscription);
    res.status(201).json(record);
  } catch (error) {
    console.error("Failed to save push subscription:", error);
    res.status(500).json({ message: "Failed to save subscription" });
  }
}

export async function getNotificationConfig(req, res) {
  const {
    VAPID_PUBLIC_KEY = "",
    ORDER_ESCALATION_MINUTES = "5",
  } = process.env;

  res.json({
    vapidPublicKey: VAPID_PUBLIC_KEY,
    escalationMinutes: Number(ORDER_ESCALATION_MINUTES) || 5,
  });
}
