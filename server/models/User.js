import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  mobile: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  address: { type: String },
  dateOfBirth: { type: Date },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

export default mongoose.model("User", userSchema);
