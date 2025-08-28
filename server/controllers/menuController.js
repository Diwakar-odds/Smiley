import MenuItem from "../models/MenuItem.js";

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find(
      {},
      "_id name description price imageUrl category"
    );
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      imageUrl,
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      menuItem.name = name;
      menuItem.description = description;
      menuItem.price = price;
      menuItem.category = category;
      menuItem.imageUrl = imageUrl;

      const updatedMenuItem = await menuItem.save();
      res.json(updatedMenuItem);
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
      await menuItem.remove();
      res.json({ message: "Menu item removed" });
    } else {
      res.status(404).json({ message: "Menu item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };
