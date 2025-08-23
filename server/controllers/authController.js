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
  const { name, email, mobile, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { mobile }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    user = new User({
      name,
      email,
      mobile,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { name, email, mobile, password, otp } = req.body;

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

    // For admin, require both password and OTP
    if (user.role === "admin") {
      if (!password || !otp) {
        return res
          .status(400)
          .json({ message: "Admin login requires both password and OTP." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const otpEntry = await Otp.findOne({ mobile: user.mobile, otp });
      if (!otpEntry) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
      // Clear OTPs once successfully verified
      await Otp.deleteMany({ mobile: user.mobile });
    } else {
      // For normal users, allow password OR OTP
      if (password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
      } else if (otp) {
        const otpEntry = await Otp.findOne({ mobile, otp });
        if (!otpEntry) {
          return res.status(400).json({ message: "Invalid OTP" });
        }
        await Otp.deleteMany({ mobile });
      } else {
        return res
          .status(400)
          .json({ message: "Please provide password or OTP" });
      }
    }

    // Create and return JWT token
    const payload = {
      _id: user._id,
      role: user.role,
    };

    jwt.sign(payload, "your_jwt_secret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
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
