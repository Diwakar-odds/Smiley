import express from "express";
const router = express.Router();
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getMenuItems).post(protect, admin, createMenuItem);
router
  .route("/:id")
  .put(protect, admin, updateMenuItem)
  .delete(protect, admin, deleteMenuItem);


export default router;
