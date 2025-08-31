import { sequelize } from "../config/sqlDb.js";

async function resetDatabase() {
  try {
    // 1. Truncate all tables and reset identity
    await sequelize.query(`
      TRUNCATE "OrderItems", "Orders", "Reviews", "PaymentMethods", "Otps", "Inventories", "MenuItems", "Offers", "Addresses", "Stores", "Users" RESTART IDENTITY CASCADE;
    `);
    console.log("✅ All tables truncated.");

    // 2. Alter Users table to set NOT NULL constraints
    await sequelize.query(`
      ALTER TABLE "Users"
      ALTER COLUMN "mobile" SET NOT NULL,
      ALTER COLUMN "email" SET NOT NULL;
    `);
    console.log("✅ Users table constraints updated.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during reset:", error.message);
    process.exit(1);
  }
}

resetDatabase();
