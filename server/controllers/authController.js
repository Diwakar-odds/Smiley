import { User, Otp } from "../models/sequelize/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import { TWILIO_CONFIG } from "../config/twilioConfig.js";
import { generateOtp as generateOtpSvc, verifyOtp as verifyOtpSvc } from "../services/otpService.js";

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, mobile, password, address, dateOfBirth } = req.body;
    if (!name || !email || !mobile || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }
    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ message: "Email already registered." });
    }
    if (await User.findOne({ where: { mobile } })) {
      return res.status(400).json({ message: "Mobile already registered." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      address,
      dateOfBirth,
    });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile and password required." });
    }
    const user = await User.findOne({ where: { mobile } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Send OTP for mobile verification
export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile)
      return res.status(400).json({ message: "Mobile is required." });
    const user = await User.findOne({ where: { mobile } });
    if (!user) return res.status(404).json({ message: "User not found." });
    const client = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);
    const to = mobile.startsWith("+91") ? mobile : `+91${mobile}`;
    if (TWILIO_CONFIG.verifyServiceSid) {
      // Use Twilio Verify Service
      await client.verify.v2
        .services(TWILIO_CONFIG.verifyServiceSid)
        .verifications.create({ to, channel: "sms" });
      return res.status(200).json({ message: "OTP sent via Verify" });
    } else {
      // Fallback: use our service to generate+persist OTP and try to send via Messages API.
      const otp = await generateOtpSvc(mobile);
      return res.status(200).json({
        message: "OTP sent (fallback dev)",
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP for mobile verification
export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp)
      return res.status(400).json({ message: "Mobile and OTP required." });
    const to = mobile.startsWith("+91") ? mobile : `+91${mobile}`;
    if (TWILIO_CONFIG.verifyServiceSid) {
      // Verify via Twilio Verify Service
      const client = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);
      const check = await client.verify.v2
        .services(TWILIO_CONFIG.verifyServiceSid)
        .verificationChecks.create({ to, code: otp });
      if (check.status !== "approved") {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }
    } else {
      // Fallback: verify via our service + cleanup handled inside service
      const ok = await verifyOtpSvc(mobile, otp);
      if (!ok) return res.status(400).json({ message: "Invalid or expired OTP." });
    }
    const user = await User.findOne({ where: { mobile } });
    if (!user) return res.status(404).json({ message: "User not found." });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
};
