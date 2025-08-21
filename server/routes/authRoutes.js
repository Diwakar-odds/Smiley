import express from 'express';
const router = express.Router();
import { register, login, sendOtp } from '../controllers/authController.js';

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);

export default router;