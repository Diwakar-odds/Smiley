import { MenuItem, Store } from "../models/sequelize/index.js";
import { Op } from "sequelize";

// @desc    Fetch all menu items
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res) => {
  try {
    const { category, search, storeId } = req.query;
    let queryOptions = {};

    // Filter by category if provided
    if (category) {
      queryOptions.category = category;
    }

    // Filter by store if provided
    if (storeId) {
      queryOptions.storeId = storeId;
    }

    // Search by name if search term provided
    if (search) {
      queryOptions.name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    const menuItems = await MenuItem.findAll({
      where: queryOptions,
      attributes: [
        "id",
        "name",
        "category",
        "description",
        "price",
        "imageUrl",
        "available",
        "storeId",
        "createdAt",
        "updatedAt"
      ],
      include: [
        {
          model: Store,
          attributes: ["id", "name"],
        },
      ],
    });

    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Fetch single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id, {
      include: [
        {
          model: Store,
          attributes: ["id", "name", "address"],
        },
      ],
    });

    if (menuItem) {
      res.json(menuItem);
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = async (req, res) => {
  const { name, category, description, price, imageUrl, available, storeId } =
    req.body;

  try {
    const menuItem = await MenuItem.create({
      name,
      category,
      description,
      price,
      imageUrl,
      available,
      storeId,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = async (req, res) => {
  const { name, category, description, price, imageUrl, available } = req.body;

  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.category = category || menuItem.category;
      menuItem.description = description || menuItem.description;
      menuItem.price = price !== undefined ? price : menuItem.price;
      menuItem.imageUrl = imageUrl || menuItem.imageUrl;
      menuItem.available =
        available !== undefined ? available : menuItem.available;

      const updatedItem = await menuItem.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);

    if (menuItem) {
      await menuItem.destroy();
      res.json({ message: "Menu item removed" });
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
