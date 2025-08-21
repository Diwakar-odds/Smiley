const Store = require('../models/Store');

// @desc    Get store profile
// @route   GET /api/store/profile
// @access  Public
const getStoreProfile = async (req, res) => {
  try {
    const store = await Store.findOne(); // Assuming only one store profile
    if (store) {
      res.json(store);
    } else {
      res.status(404).json({ message: 'Store profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update store profile
// @route   PUT /api/store/profile
// @access  Private/Admin
const updateStoreProfile = async (req, res) => {
  const { name, address, phone, email, description, imageUrl } = req.body;

  try {
    let store = await Store.findOne();

    if (store) {
      store.name = name || store.name;
      store.address = address || store.address;
      store.phone = phone || store.phone;
      store.email = email || store.email;
      store.description = description || store.description;
      store.imageUrl = imageUrl || store.imageUrl;

      const updatedStore = await store.save();
      res.json(updatedStore);
    } else {
      // If no store profile exists, create one
      store = new Store({
        name,
        address,
        phone,
        email,
        description,
        imageUrl,
      });
      const createdStore = await store.save();
      res.status(201).json(createdStore);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStoreProfile,
  updateStoreProfile,
};