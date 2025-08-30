import express from "express";
const router = express.Router();
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  requestPasswordReset,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/request-reset", requestPasswordReset);

export default router;
