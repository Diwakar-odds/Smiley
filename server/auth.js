import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust path if needed
import Otp from "../models/Otp.js"; // adjust path if needed

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// 📌 Send OTP (mock SMS for now)
router.post("/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile)
      return res.status(400).json({ message: "Mobile number required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ mobile }); // remove old OTPs
    await Otp.create({ mobile, otp, expires });

    // 🚧 TODO: Integrate with real SMS API
    console.log(`OTP for ${mobile}: ${otp}`);

    res.json({ message: "OTP sent to your mobile number" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📌 Login (supports OTP, password, or email)
router.post("/login", async (req, res) => {
  try {
    const { name, mobile, password, otp, email } = req.body;

    // 🔑 Mobile + OTP login
    if (mobile && otp) {
      const otpRecord = await Otp.findOne({ mobile, otp });
      if (!otpRecord || otpRecord.expires < new Date()) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
      }
      const user = await User.findOne({ mobile, name });
      if (!user) return res.status(401).json({ message: "User not found" });

      const token = jwt.sign({ name, mobile }, JWT_SECRET, { expiresIn: "1h" });
      await Otp.deleteMany({ mobile });
      return res.json({ token });
    }

    // 🔑 Mobile + password login
    if (mobile && password) {
      const user = await User.findOne({ mobile, name });
      if (!user) return res.status(401).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ name, mobile }, JWT_SECRET, { expiresIn: "1h" });
      return res.json({ token });
    }

    // 🔑 Email + password login
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
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📌 Register new user
router.post("/register", async (req, res) => {
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
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📌 Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 📌 Example protected route
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
