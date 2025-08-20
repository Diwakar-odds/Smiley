import express from "express";
import {
  getInventory,
  getInventoryByMeal,
  updateStock,
  getLowStock,
} from "../controllers/inventoryController.js";

const router = express.Router();

// GET all inventory
router.get("/", getInventory);

// GET inventory by mealId
router.get("/:mealId", getInventoryByMeal);

// PATCH update stock
router.patch("/:mealId", updateStock);

// GET low stock items
router.get("/alerts/low-stock", getLowStock);

export default router;
