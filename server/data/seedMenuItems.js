import { sequelize, MenuItem, Store } from "../models/sequelize/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const menuItems = [
  // Ice Cream (Per Cone)
  { name: "Vanilla Cone", category: "softy", description: "Classic vanilla softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?vanilla-ice-cream", available: true },
  { name: "Strawberry Cone", category: "softy", description: "Strawberry flavored softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?strawberry-ice-cream", available: true },
  { name: "Chocolate Cone", category: "softy", description: "Chocolate flavored softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?chocolate-ice-cream", available: true },
  { name: "Blueberry Cone", category: "softy", description: "Blueberry flavored softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?blueberry-ice-cream", available: true },
  { name: "All Mix Flavour Cone", category: "softy", description: "All mix flavour softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?ice-cream", available: true },

  // Pastries
  { name: "Chocolate Pastry", category: "pastry", description: "Rich chocolate pastry.", price: 40, imageUrl: "https://source.unsplash.com/400x300/?chocolate-pastry", available: true },
  { name: "Vanilla Pastry", category: "pastry", description: "Classic vanilla pastry.", price: 40, imageUrl: "https://source.unsplash.com/400x300/?vanilla-pastry", available: true },
  { name: "Strawberry Pastry", category: "pastry", description: "Strawberry pastry.", price: 40, imageUrl: "https://source.unsplash.com/400x300/?strawberry-pastry", available: true },

  // Corn
  { name: "Large Cup Corn", category: "corn", description: "Large cup of sweet corn.", price: 50, imageUrl: "https://source.unsplash.com/400x300/?corn", available: true },
  { name: "Small Cup Corn", category: "corn", description: "Small cup of sweet corn.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?corn-cup", available: true },

  // Patties
  { name: "Aloo Patties", category: "patties", description: "Potato filled patties.", price: 20, imageUrl: "https://source.unsplash.com/400x300/?aloo-patties", available: true },
  { name: "Masala Patties", category: "patties", description: "Spicy masala patties.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?masala-patties", available: true },
  { name: "Paneer Patties", category: "patties", description: "Paneer filled patties.", price: 50, imageUrl: "https://source.unsplash.com/400x300/?paneer-patties", available: true },

  // Cold Coffee (no direct price, only in combos)
  // { name: "Cold Coffee", category: "Drink", description: "Chilled cold coffee (see combos for offers).", price: null, imageUrl: "https://source.unsplash.com/400x300/?cold-coffee", available: true },

  // Combos
  { name: "Combo Package (KIT Special Offer)", category: "combos", description: "Ice Cream Cone + Pastry", price: 59, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true },
  { name: "Smiley Best Combo (New Package)", category: "combos", description: "Aloo Patties or Sweet Corn + Cold Coffee", price: 49, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true },
  { name: "Smiley Special Combo", category: "combos", description: "Pastry + Patties", price: 50, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true },
  { name: "Smiley Best Combo", category: "combos", description: "Pastry + Ice Cream (Softy Cone) + Cold Coffee", price: 89, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true },
  { name: "Smiley Combo Menu", category: "combos", description: "Aloo Patties or Sweet Corn + Ice Cream (Softy Cone) + Cold Coffee", price: 79, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true },

  // Offer
  // { name: "Cold Coffee Offer", category: "Offer", description: "Buy 2 Cold Coffee → Get 1 Aloo Patties FREE", price: null, imageUrl: "https://source.unsplash.com/400x300/?cold-coffee-offer", available: true },
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
