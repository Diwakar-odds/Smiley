// Script to update a user's role to admin
import { sequelize } from "../config/sqlDb.js";
import UserModel from "../models/sequelize/User.js";

const User = UserModel(sequelize);

async function setAdminRole(email) {
  try {
    await sequelize.authenticate();
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found");
      process.exit(1);
    }
    user.role = "admin";
    await user.save();
    console.log(`Role updated to admin for user: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error("Error updating role:", err);
    process.exit(1);
  }
}

// Usage: node setAdminRole.js user@example.com
const email = process.argv[2];
if (!email) {
  console.log("Please provide an email as an argument.");
  process.exit(1);
}
setAdminRole(email);
