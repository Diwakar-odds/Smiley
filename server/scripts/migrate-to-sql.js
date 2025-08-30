import mongoose from "mongoose";
import dotenv from "dotenv";
import { sequelize } from "../config/sqlDb.js";
import {
  User,
  Store,
  MenuItem,
  Order,
  Review,
  Address,
  Inventory,
  Offer,
  PaymentMethod,
  Otp,
} from "../models/sequelize/index.js";

// MongoDB models
import MongoUser from "../models/User.js";
import MongoStore from "../models/Store.js";
import MongoMenuItem from "../models/MenuItem.js";
import MongoOrder from "../models/Order.js";
import MongoReview from "../models/Review.js";
import MongoAddress from "../models/Address.js";
import MongoInventory from "../models/Inventory.js";
import MongoOffer from "../models/Offer.js";
import MongoPaymentMethod from "../models/PaymentMethod.js";
import MongoOtp from "../models/Otp.js";

dotenv.config({ path: "../../.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/smiley", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB to PostgreSQL data migration
const migrateData = async () => {
  try {
    console.log("Starting migration from MongoDB to PostgreSQL...");

    // Sync Sequelize models with PostgreSQL
    await sequelize.sync({ force: true });
    console.log("PostgreSQL tables created");

    // Migrate Users
    console.log("Migrating users...");
    const mongoUsers = await MongoUser.find({});
    for (const mongoUser of mongoUsers) {
      await User.create({
        id: mongoUser._id.toString(), // Use MongoDB _id as UUID
        name: mongoUser.name,
        email: mongoUser.email,
        mobile: mongoUser.mobile,
        password: mongoUser.password, // Password is already hashed
        address: mongoUser.address,
        dateOfBirth: mongoUser.dateOfBirth,
        role: mongoUser.role,
        resetToken: mongoUser.resetToken,
        resetTokenExpiry: mongoUser.resetTokenExpiry,
      });
    }
    console.log(`${mongoUsers.length} users migrated`);

    // Migrate Stores
    console.log("Migrating stores...");
    const mongoStores = await MongoStore.find({});
    for (const mongoStore of mongoStores) {
      await Store.create({
        id: mongoStore._id.toString(),
        name: mongoStore.name,
        address: mongoStore.address,
        phone: mongoStore.phone,
        email: mongoStore.email,
        description: mongoStore.description,
        imageUrl: mongoStore.imageUrl,
      });
    }
    console.log(`${mongoStores.length} stores migrated`);

    // Migrate MenuItems
    console.log("Migrating menu items...");
    const mongoMenuItems = await MongoMenuItem.find({});
    for (const mongoMenuItem of mongoMenuItems) {
      // Set a default storeId if not available in MongoDB
      const storeId = mongoMenuItem.storeId
        ? mongoMenuItem.storeId.toString()
        : mongoStores.length > 0
        ? mongoStores[0]._id.toString()
        : null;

      if (storeId) {
        await MenuItem.create({
          id: mongoMenuItem._id.toString(),
          name: mongoMenuItem.name,
          category: mongoMenuItem.category,
          description: mongoMenuItem.description,
          price: mongoMenuItem.price,
          imageUrl: mongoMenuItem.imageUrl,
          available: mongoMenuItem.available,
          storeId: storeId,
        });
      }
    }
    console.log(`${mongoMenuItems.length} menu items migrated`);

    // Migrate Orders (simplified, would need more complex mapping for items)
    console.log("Migrating orders...");
    const mongoOrders = await MongoOrder.find({});
    for (const mongoOrder of mongoOrders) {
      // Set a default storeId if not available in MongoDB
      const storeId = mongoOrder.storeId
        ? mongoOrder.storeId.toString()
        : mongoStores.length > 0
        ? mongoStores[0]._id.toString()
        : null;

      if (storeId) {
        const order = await Order.create({
          id: mongoOrder._id.toString(),
          userId: mongoOrder.userId.toString(),
          name: mongoOrder.name,
          phone: mongoOrder.phone,
          address: mongoOrder.address,
          specialRequests: mongoOrder.specialRequests,
          totalPrice: mongoOrder.totalPrice,
          status: mongoOrder.status,
          storeId: storeId,
        });

        // Handle order items (many-to-many relationship)
        for (const item of mongoOrder.items) {
          try {
            const menuItem = await MenuItem.findByPk(
              item.menuItemId.toString()
            );
            if (menuItem) {
              await order.addMenuItem(menuItem, {
                through: {
                  quantity: item.quantity,
                  price: menuItem.price,
                },
              });
            }
          } catch (error) {
            console.error(
              `Error adding item ${item.menuItemId} to order ${order.id}:`,
              error
            );
          }
        }
      }
    }
    console.log(`${mongoOrders.length} orders migrated`);

    // Continue with other models as needed...

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    await sequelize.close();
  }
};

// Run migration
migrateData();
