// services/otpService.js
import { Otp } from "../models/sequelize/index.js";
import twilio from "twilio";
import { TWILIO_CONFIG } from "../config/twilioConfig.js";

// Initialize Twilio client
const twilioClient = twilio(TWILIO_CONFIG.accountSid, TWILIO_CONFIG.authToken);

// Send SMS using Twilio
async function sendSmsViaTwilio(to, message) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_CONFIG.phoneNumber,
      to: to,
    });
    console.log("SMS sent successfully:", result.sid);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    // Still return the OTP even if SMS fails - for fallback
    return false;
  }
}

// Generate and save OTP
export async function generateOtp(mobile) {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Set expiry time (5 minutes from now)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    // Delete any existing OTPs for this mobile
    await Otp.destroy({ where: { mobile } });

    // Create new OTP record
    await Otp.create({
      mobile,
      otp,
      expiresAt,
    });

    // Format mobile number if needed (ensure it has country code)
    const formattedMobile = mobile.startsWith("+") ? mobile : `+${mobile}`;

    // Send OTP via Twilio SMS
    const message = `Your Smiley verification code is: ${otp}. Valid for 5 minutes.`;
    const smsSent = await sendSmsViaTwilio(formattedMobile, message);

    // Always log in development, log only failures in production
    if (process.env.NODE_ENV !== "production" || !smsSent) {
      console.log(`OTP for ${mobile}: ${otp}`);
    }

    return otp;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw new Error("Failed to generate OTP");
  }
}

// Verify OTP
export async function verifyOtp(mobile, otp) {
  try {
    // Find OTP record
    const otpRecord = await Otp.findOne({
      where: {
        mobile,
        otp,
      },
    });

    // Check if OTP exists and is not expired
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return false;
    }

    // Delete the OTP after verification
    await Otp.destroy({ where: { mobile } });

    return true;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("Failed to verify OTP");
  }
}
