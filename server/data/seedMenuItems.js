import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js";
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
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);
    console.log("Menu items seeded!");
  } catch (error) {
    console.error("MongoDB connection or seeding error:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedMenu();
