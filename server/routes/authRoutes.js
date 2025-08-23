import express from "express";
const router = express.Router();
import { register, login, sendOtp } from "../controllers/authController.js";
import {
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
