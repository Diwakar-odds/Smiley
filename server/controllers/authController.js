// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOtp, verifyOtp } from "../services/otpService.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// 👉 Send OTP
export async function sendOtp(req, res) {
  try {
    const { mobile } = req.body;
    if (!mobile)
      return res.status(400).json({ message: "Mobile number required" });

    const otp = await generateOtp(mobile);

    // TODO: integrate SMS service
    console.log(`OTP for ${mobile}: ${otp}`); // demo only

    res.json({ message: "OTP sent to your mobile number" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
}

// 👉 Login
export async function loginUser(req, res) {
  try {
    const { name, mobile, password, otp, email } = req.body;

    // Mobile + OTP login
    if (mobile && otp) {
      const valid = await verifyOtp(mobile, otp);
      if (!valid)
        return res.status(401).json({ message: "Invalid or expired OTP" });

      const user = await User.findOne({ mobile, name });
      if (!user) return res.status(401).json({ message: "User not found" });

      const token = jwt.sign({ name, mobile }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token });
    }

    // Mobile + Password login
    if (mobile && password) {
      const user = await User.findOne({ mobile, name });
      if (!user) return res.status(401).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ name, mobile }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token });
    }

    // Email + Password login
    if (email && password) {
      const user = await User.findOne({ email, name });
      if (!user) return res.status(401).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ name, email }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token });
    }

    return res.status(400).json({ message: "Invalid login request" });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
}
// 👉 Register
export async function registerUser(req, res) {
  try {
    const { name, mobile, email, password } = req.body;
    if (!name || !mobile || !password) {
      return res
        .status(400)
        .json({ message: "Name, mobile, and password required" });
    }

    const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, mobile, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
}

// 👉 Profile (Protected)
export async function getProfile(req, res) {
  res.json({ user: req.user });
}
