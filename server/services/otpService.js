// services/otpService.js
import Otp from "../models/Otp.js";
import { OTP_EXPIRY_MINUTES } from "../config/otpConfig.js";

// 👉 Generate and save OTP
export async function generateOtp(mobile) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min validity

  // Remove old OTPs for this mobile
  await Otp.deleteMany({ mobile });

  // Save new OTP
  await Otp.create({ mobile, otp, expires });
  // TODO: replace with SMS API integration
  console.log(`OTP for ${mobile}: ${otp}`);

  return otp; // return so controller can use it
}

// 👉 Verify OTP
export async function verifyOtp(mobile, otp) {
  const record = await Otp.findOne({ mobile, otp });

  if (!record || record.expires < new Date()) {
    return false;
  }

  // Clear OTPs once successfully verified
  await Otp.deleteMany({ mobile });
  return true;
}
