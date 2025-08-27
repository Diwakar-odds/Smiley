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

// GET low stock items - specific routes should come before parameter routes
router.get("/alerts/low-stock", getLowStock);

// GET inventory by mealId
router.get("/:mealId", getInventoryByMeal);

// PATCH update inventory item
router.patch("/:inventoryId", updateStock);

export default router;
