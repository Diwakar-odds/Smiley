// Removed duplicate import of sequelize
import UserModel from "./User.js";
import OrderModel from "./Order.js";
import StoreModel from "./Store.js";
import AddressModel from "./Address.js";
import MenuItemModel from "./MenuItem.js";
import InventoryModel from "./Inventory.js";
import OfferModel from "./Offer.js";
import OtpModel from "./Otp.js";
import PaymentMethodModel from "./PaymentMethod.js";
import ReviewModel from "./Review.js";
import OrderItemModel from "./OrderItem.js";

import { sequelize } from "../../config/sqlDb.js";
const User = UserModel(sequelize);
const Order = OrderModel(sequelize);
const Store = StoreModel(sequelize);
const Address = AddressModel(sequelize);
const MenuItem = MenuItemModel(sequelize);
const Inventory = InventoryModel(sequelize);
const Offer = OfferModel(sequelize);
const Otp = OtpModel(sequelize);
const PaymentMethod = PaymentMethodModel(sequelize);
const Review = ReviewModel(sequelize);
const OrderItem = OrderItemModel(sequelize);

// Associations
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Address, { foreignKey: "userId" });
Address.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(MenuItem, { foreignKey: "storeId" });
MenuItem.belongsTo(Store, { foreignKey: "storeId" });

Store.hasMany(Inventory, { foreignKey: "storeId" });
Inventory.belongsTo(Store, { foreignKey: "storeId" });

MenuItem.hasMany(Inventory, { foreignKey: "menuItemId" });
Inventory.belongsTo(MenuItem, { foreignKey: "menuItemId" });

Store.hasMany(Offer, { foreignKey: "storeId" });
Offer.belongsTo(Store, { foreignKey: "storeId" });

User.hasMany(PaymentMethod, { foreignKey: "userId" });
PaymentMethod.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

MenuItem.hasMany(Review, { foreignKey: "menuItemId" });
Review.belongsTo(MenuItem, { foreignKey: "menuItemId" });

Store.hasMany(Review, { foreignKey: "storeId" });
Review.belongsTo(Store, { foreignKey: "storeId" });

// Order <-> MenuItem many-to-many through OrderItem
Order.belongsToMany(MenuItem, {
  through: OrderItem,
  foreignKey: "orderId",
  otherKey: "menuItemId",
});
MenuItem.belongsToMany(Order, {
  through: OrderItem,
  foreignKey: "menuItemId",
  otherKey: "orderId",
});

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
MenuItem.hasMany(OrderItem, { foreignKey: "menuItemId" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

Store.hasMany(Order, { foreignKey: "storeId" });
Order.belongsTo(Store, { foreignKey: "storeId" });

// Utility to sync all models
async function syncModels(options = {}) {
  await sequelize.sync(options);
}

export {
  sequelize,
  User,
  Order,
  Store,
  Address,
  MenuItem,
  Inventory,
  Offer,
  Otp,
  PaymentMethod,
  Review,
  OrderItem,
  syncModels,
};
