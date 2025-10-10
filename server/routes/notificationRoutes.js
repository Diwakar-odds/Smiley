import express from "express";
import {
  acknowledgeNotification,
  getNotificationConfig,
  listAdminNotifications,
  registerPushSubscription,
  resolveNotification,
  streamNotifications,
} from "../controllers/adminNotificationController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stream", streamNotifications);
router.get("/config", protect, admin, getNotificationConfig);
router.get("/", protect, admin, listAdminNotifications);
router.patch("/:id/read", protect, admin, acknowledgeNotification);
router.patch("/:id/handled", protect, admin, resolveNotification);
router.post("/subscribe", protect, admin, registerPushSubscription);

export default router;
