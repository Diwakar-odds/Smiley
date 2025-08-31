import { sequelize } from '../config/sqlDb.js';

async function truncateAllTables() {
  try {
    await sequelize.query(
      'TRUNCATE "OrderItems", "Orders", "Reviews", "PaymentMethods", "Otps", "Inventories", "MenuItems", "Offers", "Addresses", "Stores", "Users" RESTART IDENTITY CASCADE;'
    );
    console.log('✅ All tables truncated.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error truncating tables:', error.message);
    process.exit(1);
  }
}

truncateAllTables();
