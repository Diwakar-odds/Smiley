import express from "express";
const router = express.Router();
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getUserOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.route("/user").get(protect, getUserOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

export default router;
