import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

async function createAdminUser() {
  await mongoose.connect("mongodb://localhost:27017/smiley");

  // Accept args: node createAdminUser.js name email password mobile
  const args = process.argv.slice(2);
  const name = args[0] || "Admin";
  const email = args[1] || "admin@example.com";
  const password = args[2] || "admin123";
  const mobile = args[3] || "";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists.");
    process.exit(0);
  }

  const adminUser = new User({
    name,
    email,
    password: hashedPassword,
    mobile,
    role: "admin",
  });
  await adminUser.save();
  console.log("Admin user created:", email);
  process.exit(0);
}

createAdminUser();
