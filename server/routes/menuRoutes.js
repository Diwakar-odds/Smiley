const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getMenuItems).post(protect, admin, createMenuItem);
router
  .route('/:id')
  .put(protect, admin, updateMenuItem)
  .delete(protect, admin, deleteMenuItem);

module.exports = router;