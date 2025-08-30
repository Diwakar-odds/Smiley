import { Inventory, MenuItem } from "../models/sequelize/index.js";
import { Op } from "sequelize";

// 👉 Get all inventory items
export async function getInventory(req, res) {
  try {
    const inventory = await Inventory.findAll({
      include: [
        {
          model: MenuItem,
          attributes: ["name"],
        },
      ],
    });
    res.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
}

// 👉 Get inventory for a specific menu item
export async function getInventoryByMeal(req, res) {
  try {
    const { menuItemId } = req.params;
    const inventory = await Inventory.findOne({
      where: { menuItemId },
      include: [
        {
          model: MenuItem,
          attributes: ["name"],
        },
      ],
    });

    if (!inventory) {
      return res
        .status(404)
        .json({ message: "No inventory found for this menu item" });
    }

    res.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory by meal:", error);
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
}

// 👉 Update inventory item
export async function updateStock(req, res) {
  try {
    const { inventoryId } = req.params;
    const { stock, threshold } = req.body;

    if (stock == null && threshold == null) {
      return res
        .status(400)
        .json({ message: "Stock or threshold value is required" });
    }

    const inventory = await Inventory.findByPk(inventoryId);

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Update only provided fields
    const updateFields = {};
    if (stock != null) {
      updateFields.stock = stock;
    }
    if (threshold != null) {
      updateFields.threshold = threshold;
    }

    // Always update lastUpdated
    updateFields.lastUpdated = new Date();

    await inventory.update(updateFields);

    res.json({ message: "Stock updated", inventory });
  } catch (error) {
    console.error("Error updating stock:", error);
    res
      .status(500)
      .json({ message: "Error updating stock", error: error.message });
  }
}

// 👉 Get low stock items
export async function getLowStock(req, res) {
  try {
    const lowStockItems = await Inventory.findAll({
      where: {
        stock: {
          [Op.lt]: sequelize.col("threshold"),
        },
      },
      include: [
        {
          model: MenuItem,
          attributes: ["name"],
        },
      ],
    });

    res.json(lowStockItems);
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({
      message: "Error fetching low stock items",
      error: error.message,
    });
  }
}

// 👉 Create a new inventory item
export async function createInventoryItem(req, res) {
  try {
    const { menuItemId, stock, threshold, storeId } = req.body;

    // Check if menu item exists
    const menuItem = await MenuItem.findByPk(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Check if inventory for this item already exists
    const existingInventory = await Inventory.findOne({
      where: { menuItemId, storeId },
    });

    if (existingInventory) {
      return res
        .status(400)
        .json({ message: "Inventory for this menu item already exists" });
    }

    const inventory = await Inventory.create({
      menuItemId,
      storeId,
      stock: stock || 0,
      threshold: threshold || 10,
      lastUpdated: new Date(),
    });

    res.status(201).json(inventory);
  } catch (error) {
    console.error("Error creating inventory item:", error);
    res
      .status(500)
      .json({ message: "Error creating inventory item", error: error.message });
  }
}
