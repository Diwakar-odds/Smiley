import express from "express";
import { register, sendOtp, verifyOtp } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;
