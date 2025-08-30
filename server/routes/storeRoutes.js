import express from "express";
const router = express.Router();
import {
  getStoreProfile,
  updateStoreProfile,
} from "../controllers/storeController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/profile")
  .get(getStoreProfile)
  .put(protect, admin, updateStoreProfile);

export default router;
