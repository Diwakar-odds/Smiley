import Inventory from "../models/Inventory.js";
import Meal from "../models/MenuItem.js";

// 👉 Get all inventory items
export async function getInventory(req, res) {
  try {
    const inventory = await Inventory.find().populate("mealId", "name");
    res.json(inventory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
}

// 👉 Get inventory for a specific meal
export async function getInventoryByMeal(req, res) {
  try {
    const { mealId } = req.params;
    const inventory = await Inventory.findOne({ mealId }).populate(
      "mealId",
      "name"
    );
    if (!inventory)
      return res
        .status(404)
        .json({ message: "No inventory found for this meal" });

    res.json(inventory);
  } catch (error) {
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

    if (stock == null && threshold == null)
      return res.status(400).json({ message: "Stock or threshold value is required" });

    let inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" });
    } 
    
    // Update only provided fields
    if (stock != null) {
      inventory.stock = stock;
    }
    if (threshold != null) {
      inventory.threshold = threshold;
    }
    
    await inventory.save();

    res.json({ message: "Stock updated", inventory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating stock", error: error.message });
  }
}

// 👉 Get low stock items
export async function getLowStock(req, res) {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ["$stock", "$threshold"] },
    }).populate("mealId", "name");

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching low stock items",
      error: error.message,
    });
  }
}
