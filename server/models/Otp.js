import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  otp: { type: String, required: true },
  expires: { type: Date, required: true },
});

export default mongoose.model("Otp", otpSchema);
