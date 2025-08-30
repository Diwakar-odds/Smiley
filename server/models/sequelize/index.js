import { sequelize } from "../../config/sqlDb.js";
import User from "./User.js";
import Store from "./Store.js";
import Address from "./Address.js";
import Inventory from "./Inventory.js";
import MenuItem from "./MenuItem.js";
import Offer from "./Offer.js";
import Order from "./Order.js";
import Otp from "./Otp.js";
import PaymentMethod from "./PaymentMethod.js";
import Review from "./Review.js";

// Define associations
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Address, { foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

User.hasMany(PaymentMethod, { foreignKey: "userId" });
PaymentMethod.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(MenuItem, { foreignKey: "storeId" });
MenuItem.belongsTo(Store, { foreignKey: "storeId" });

Store.hasMany(Inventory, { foreignKey: "storeId" });
Inventory.belongsTo(Store, { foreignKey: "storeId" });

Store.hasMany(Order, { foreignKey: "storeId" });
Order.belongsTo(Store, { foreignKey: "storeId" });

Store.hasMany(Review, { foreignKey: "storeId" });
Review.belongsTo(Store, { foreignKey: "storeId" });

Store.hasMany(Offer, { foreignKey: "storeId" });
Offer.belongsTo(Store, { foreignKey: "storeId" });

// Define many-to-many relationships via junction tables
// Order and MenuItem (through OrderItems junction table)
Order.belongsToMany(MenuItem, { through: "OrderItems", foreignKey: "orderId" });
MenuItem.belongsToMany(Order, {
  through: "OrderItems",
  foreignKey: "menuItemId",
});

// Initialize models
const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // In production, use { force: false }
    console.log("Database & tables synced");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

export {
  sequelize,
  User,
  Store,
  Address,
  Inventory,
  MenuItem,
  Offer,
  Order,
  Otp,
  PaymentMethod,
  Review,
  syncModels,
};
