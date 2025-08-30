import { Store } from "../models/sequelize/index.js";

// Get store profile
export const getStoreProfile = async (req, res) => {
  try {
    // Get the first store (or by ID in a multi-store setup)
    const store = await Store.findOne();

    if (!store) {
      return res.status(404).json({ message: "Store profile not found" });
    }

    res.json(store);
  } catch (error) {
    console.error("Error fetching store profile:", error);
    res
      .status(500)
      .json({ message: "Error fetching store profile", error: error.message });
  }
};

// Update store profile
export const updateStoreProfile = async (req, res) => {
  try {
    // Get the first store (or by ID in a multi-store setup)
    const store = await Store.findOne();

    if (!store) {
      return res.status(404).json({ message: "Store profile not found" });
    }

    // Update store with request body
    await store.update(req.body);

    res.json(store);
  } catch (error) {
    console.error("Error updating store profile:", error);
    res
      .status(500)
      .json({ message: "Error updating store profile", error: error.message });
  }
};

// Create store profile (admin only)
export const createStoreProfile = async (req, res) => {
  try {
    // Check if a store already exists
    const existingStore = await Store.findOne();

    if (existingStore) {
      return res.status(400).json({ message: "Store profile already exists" });
    }

    // Create new store
    const store = await Store.create(req.body);

    res.status(201).json(store);
  } catch (error) {
    console.error("Error creating store profile:", error);
    res
      .status(500)
      .json({ message: "Error creating store profile", error: error.message });
  }
};
