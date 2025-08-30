import express from "express";
import {
  getInventory,
  getInventoryByMeal,
  updateStock,
  getLowStock,
  createInventoryItem,
} from "../controllers/inventoryController.js";

const router = express.Router();

// GET all inventory
router.get("/", getInventory);

// GET low stock items - specific routes should come before parameter routes
router.get("/alerts/low-stock", getLowStock);

// POST create new inventory item
router.post("/", createInventoryItem);

// GET inventory by menuItemId (renamed from mealId)
router.get("/:menuItemId", getInventoryByMeal);

// PATCH update inventory item
router.patch("/:inventoryId", updateStock);

export default router;
