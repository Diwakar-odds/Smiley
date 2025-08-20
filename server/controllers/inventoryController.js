import Inventory from "../models/Inventory.js";
import Meal from "../models/Meal.js";

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

// 👉 Add or update stock for a meal
export async function updateStock(req, res) {
  try {
    const { mealId } = req.params;
    const { stock } = req.body;

    if (stock == null)
      return res.status(400).json({ message: "Stock value is required" });

    let inventory = await Inventory.findOne({ mealId });
    if (!inventory) {
      // Create new record if not exists
      inventory = await Inventory.create({ mealId, stock });
    } else {
      inventory.stock = stock;
      await inventory.save();
    }

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
    res
      .status(500)
      .json({
        message: "Error fetching low stock items",
        error: error.message,
      });
  }
}
