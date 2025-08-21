const express = require('express');
const router = express.Router();
const {
  getStoreProfile,
  updateStoreProfile,
} = require('../controllers/storeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/profile').get(getStoreProfile).put(protect, admin, updateStoreProfile);

module.exports = router;