import crypto from "crypto";
import nodemailer from "nodemailer";
// @desc    Request password reset
// @route   POST /api/auth/request-reset
// @access  Public
export const requestPasswordReset = async (req, res) => {
  const { email, mobile } = req.body;
  try {
    const user = await User.findOne(email ? { email } : { mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    // Send token via email (or SMS)
    if (email) {
      // Setup nodemailer (use your SMTP config)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: "your_email@gmail.com", pass: "your_email_password" },
      });
      await transporter.sendMail({
        from: "your_email@gmail.com",
        to: email,
        subject: "Password Reset",
        text: `Your password reset token: ${resetToken}`,
      });
    }
    // TODO: Add SMS sending for mobile
    res.json({ message: "Password reset token sent" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { email, mobile, resetToken, newPassword } = req.body;
  try {
    const user = await User.findOne(email ? { email } : { mobile });
    if (
      !user ||
      user.resetToken !== resetToken ||
      user.resetTokenExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, mobile, password, address, dateOfBirth } = req.body;

  // Basic validation
  if (!name || !password || (!email && !mobile)) {
    return res.status(400).json({
      message: "Name, password, and either email or mobile are required.",
    });
  }
  if (email && typeof email !== "string") {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (mobile && typeof mobile !== "string") {
    return res.status(400).json({ message: "Invalid mobile format." });
  }

  try {
    // Check if user already exists (only if email/mobile are provided and not empty)
    let user = await User.findOne({
      $or: [...(email ? [{ email }] : []), ...(mobile ? [{ mobile }] : [])],
    });
    if (user) {
      // More specific error message
      if (email && user.email === email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (mobile && user.mobile === mobile) {
        return res
          .status(400)
          .json({ message: "Mobile number already registered" });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    user = new User({
      name,
      email,
      mobile,
      password,
      address,
      dateOfBirth,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    // Handle duplicate key error from MongoDB
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ message: "Email already registered" });
      }
      if (error.keyPattern && error.keyPattern.mobile) {
        return res
          .status(400)
          .json({ message: "Mobile number already registered" });
      }
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).send("Server error");
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, mobile, password, otp } = req.body;
  try {
    let user;
    // Find user by email or mobile
    if (email) {
      user = await User.findOne({ email });
    } else if (mobile) {
      user = await User.findOne({ mobile });
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Password or OTP authentication
    let authenticated = false;
    if (password) {
      authenticated = await bcrypt.compare(password, user.password);
    } else if (otp) {
      const otpEntry = await Otp.findOne({ mobile, otp });
      if (otpEntry) {
        authenticated = true;
        await Otp.deleteMany({ mobile });
      }
    }
    if (!authenticated) {
      return res.status(400).json({ message: "Invalid credentials or OTP" });
    }
    // JWT payload includes _id, role, name, email, mobile
    const payload = {
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const userObj = user.toObject();
    delete userObj.password;
    res.json({ token, user: userObj });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc    Send OTP to user
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
  const { mobile } = req.body;

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await Otp.create({ mobile, otp });

    // TODO: Implement actual OTP sending logic (e.g., via SMS gateway)

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
