import express from "express";
import {
  getSalesOverview,
  getTopItems,
  getCustomerBehavior,
} from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 📊 Sales overview (total sales, revenue, trends)
router.get("/sales-overview", authMiddleware, getSalesOverview);

// 🥗 Top-selling items
router.get("/top-items", authMiddleware, getTopItems);

// 👥 Customer behavior (e.g., repeat customers, frequency)
router.get("/customer-behavior", authMiddleware, getCustomerBehavior);

export default router;
