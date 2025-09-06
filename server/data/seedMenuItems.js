import { sequelize, MenuItem, Store } from "../models/sequelize/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const menuItems = [
  // Softy (Ice Cream)
  {
    name: "Vanilla",
    category: "softy",
    description: "Classic vanilla softy cone.",
    price: 30,
    imageUrl: "https://source.unsplash.com/400x300/?icecream",
    available: true,
  },
  {
    name: "Strawberry",
    category: "softy",
    description: "Strawberry softy cone.",
    price: 30,
    imageUrl: "https://source.unsplash.com/400x300/?icecream",
    available: true,
  },
  {
    name: "Chocolate",
    category: "softy",
    description: "Chocolate softy cone.",
    price: 30,
    imageUrl: "https://source.unsplash.com/400x300/?icecream",
    available: true,
  },
  {
    name: "Blueberry",
    category: "softy",
    description: "Blueberry softy cone.",
    price: 30,
    imageUrl: "https://source.unsplash.com/400x300/?icecream",
    available: true,
  },
  {
    name: "All Mix Flavour",
    category: "softy",
    description: "All mix flavour softy cone.",
    price: 30,
    imageUrl: "https://source.unsplash.com/400x300/?icecream",
    available: true,
  },

  // Pastries
  {
    name: "Chocolate Pastry",
    category: "pastry",
    description: "Chocolate pastry slice.",
    price: 40,
    imageUrl: "https://source.unsplash.com/400x300/?pastry",
    available: true,
  },
  {
    name: "Vanilla Pastry",
    category: "pastry",
    description: "Vanilla pastry slice.",
    price: 40,
    imageUrl: "https://source.unsplash.com/400x300/?pastry",
    available: true,
  },
  {
    name: "Strawberry Pastry",
    category: "pastry",
    description: "Strawberry pastry slice.",
    price: 40,
    imageUrl: "https://source.unsplash.com/400x300/?pastry",
    available: true,
  },

  // Corns
  {
    name: "Large Cup Corn",
    category: "corn",
    description: "Large cup of sweet corn.",
    price: 50,
    imageUrl: "https://source.unsplash.com/400x300/?corn",
    available: true,
  },
  {
    name: "Small Cup Corn",
    category: "corn",
    description: "Small cup of sweet corn.",
    price: 30,
    imageUrl: "https://source.unsplash.com/400x300/?corn",
    available: true,
  },

  // Patties
  {
    name: "Aloo Patties",
    category: "patties",
    description: "Classic aloo patties.",
    price: 20,
    imageUrl: "https://source.unsplash.com/400x300/?patties",
    available: true,
  },
  {
    name: "Masala Patties",
    category: "patties",
    description: "Spicy masala patties.",
    price: 30,
    imageUrl: "https://source.unsplash.com/400x300/?patties",
    available: true,
  },
  {
    name: "Paneer Patties",
    category: "patties",
    description: "Paneer stuffed patties.",
    price: 50,
    imageUrl: "https://source.unsplash.com/400x300/?patties",
    available: true,
  },

  // Shakes (Cold Coffee)
  {
    name: "Cold Coffee",
    category: "shakes",
    description: "Chilled cold coffee.",
    price: 40,
    imageUrl: "https://source.unsplash.com/400x300/?coffee",
    available: false,
  },

  // Combos
  {
    name: "Combo Package (KIT Special Offer)",
    category: "combos",
    description: "Ice Cream Cone + Pastry",
    price: 59,
    imageUrl: "https://source.unsplash.com/400x300/?combo",
    available: true,
  },
  {
    name: "Smiley Best Combo (New Package)",
    category: "combos",
    description: "Aloo Patties or Sweet Corn + Cold Coffee",
    price: 49,
    imageUrl: "https://source.unsplash.com/400x300/?combo",
    available: true,
  },
  {
    name: "Smiley Special Combo",
    category: "combos",
    description: "Pastry + Patties",
    price: 50,
    imageUrl: "https://source.unsplash.com/400x300/?combo",
    available: true,
  },
  {
    name: "Smiley Best Combo",
    category: "combos",
    description: "Pastry + Ice Cream (Softy Cone) + Cold Coffee",
    price: 89,
    imageUrl: "https://source.unsplash.com/400x300/?combo",
    available: true,
  },
  {
    name: "Smiley Combo Menu",
    category: "combos",
    description:
      "Aloo Patties or Sweet Corn + Ice Cream (Softy Cone) + Cold Coffee",
    price: 79,
    imageUrl: "https://source.unsplash.com/400x300/?combo",
    available: true,
  },
  {
    name: "Masala Patties",
    category: "patties",
    description: "Spicy masala patties.",
    price: 30,
    imageUrl: "https://source.unsplash.com/400x300/?patties",
    available: true,
  },
  {
    name: "Paneer Patties",
    category: "patties",
    description: "Paneer stuffed patties.",
    price: 50,
    imageUrl: "https://source.unsplash.com/400x300/?patties",
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
