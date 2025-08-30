import { sequelize, MenuItem, Store } from "../models/sequelize/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const menuItems = [
  {
    name: "Classic Burger",
    category: "Lunch",
    description: "Juicy beef patty with lettuce, tomato, and cheese.",
    price: 199,
    imageUrl: "https://source.unsplash.com/400x300/?burger",
    available: true,
  },
  {
    name: "Veggie Pizza",
    category: "Dinner",
    description: "Loaded with fresh veggies and mozzarella cheese.",
    price: 249,
    imageUrl: "https://source.unsplash.com/400x300/?pizza",
    available: true,
  },
  {
    name: "Masala Dosa",
    category: "Breakfast",
    description: "Crispy dosa stuffed with spicy potato filling.",
    price: 120,
    imageUrl: "https://source.unsplash.com/400x300/?dosa",
    available: true,
  },
  {
    name: "Cold Coffee",
    category: "Drink",
    description: "Chilled coffee with ice cream and chocolate syrup.",
    price: 99,
    imageUrl: "https://source.unsplash.com/400x300/?coffee",
    available: true,
  },
];

async function seedMenu() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");

    // Create a default store if none exists
    let store = await Store.findOne();
    if (!store) {
      store = await Store.create({
        name: "Smiley Foods Main Branch",
        address: "123 Main St, Foodville",
        phone: "555-123-4567",
        email: "contact@smileyfoods.com",
        description: "Our flagship store serving all your favorite foods.",
        imageUrl: "https://source.unsplash.com/400x300/?restaurant",
      });
      console.log("Default store created");
    }

    // Clear existing menu items
    await MenuItem.destroy({ where: { storeId: store.id } });

    // Add storeId to each menu item
    const menuItemsWithStore = menuItems.map((item) => ({
      ...item,
      storeId: store.id,
    }));

    // Insert menu items
    await MenuItem.bulkCreate(menuItemsWithStore);
    console.log("Menu items seeded!");
  } catch (error) {
    console.error("PostgreSQL connection or seeding error:", error);
  } finally {
    await sequelize.close();
  }
}

seedMenu();
