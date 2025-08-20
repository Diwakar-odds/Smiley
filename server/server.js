import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/smiley", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// In-memory storage for orders
let orders = [];

// Menu data
const menuData = {
  softy: [
    {
      id: 1,
      name: "Classic Vanilla Softy",
      description: "Creamy vanilla soft serve in a crispy cone",
      price: 30,
      image:
        "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      category: "softy",
    },
    {
      id: 2,
      name: "Chocolate Swirl Softy",
      description: "Rich chocolate and vanilla swirl soft serve",
      price: 40,
      image:
        "https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      category: "softy",
    },
    {
      id: 3,
      name: "Strawberry Delight Softy",
      description: "Fresh strawberry flavored soft serve",
      price: 40,
      image:
        "https://images.pexels.com/photos/1056555/pexels-photo-1056555.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      category: "softy",
    },
  ],
  patties: [
    {
      id: 4,
      name: "Spicy Aloo Patty",
      description: "Crispy chicken patty with spicy seasoning",
      price: 20,
      image:
        "https://tse4.mm.bing.net/th/id/OIP.V5UtUagVH8ROvnBR5d0zhQHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
      category: "patties",
    },
    {
      id: 5,
      name: "Masala Patty",
      description: "Golden-fried vegetable patty with herbs",
      price: 30,
      image:
        "https://th.bing.com/th/id/R.97f73b5fd1f15cef2fdb966e9140ffe9?rik=MSmLQ1vQfHdSjg&pid=ImgRaw&r=0",
      category: "patties",
    },
    {
      id: 6,
      name: "Paneer Patty",
      description: "Crispy patty filled with melted cheese",
      price: 50,
      image:
        "https://nandinifoods.in/wp-content/uploads/2024/11/maxresdefault-2.jpg",
      category: "patties",
    },
  ],
  shakes: [
    {
      id: 7,
      name: "Mango Tango Shake",
      description: "Fresh mango shake with a tropical twist",
      price: 50,
      image:
        "https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      category: "shakes",
    },
    {
      id: 8,
      name: "Chocolate Oreo Shake",
      description: "Rich chocolate shake with Oreo cookies",
      price: 50,
      image:
        "https://tse1.mm.bing.net/th/id/OIP.2y9vvYcIWpQmdi5MG-IxiQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
      category: "shakes",
    },
    {
      id: 9,
      name: "Cold Coffee",
      description: "Creamy vanilla shake with mixed berries",
      price: 50,
      image:
        "https://th.bing.com/th/id/R.4d1ee81e616ace2041414b95d50fff51?rik=sI%2bB40i1pc2QcQ&pid=ImgRaw&r=0",
      category: "shakes",
    },
  ],
};

// Routes
app.get("/api/menu", (req, res) => {
  const allMenuItems = [
    ...menuData.softy,
    ...menuData.patties,
    ...menuData.shakes,
  ];
  res.json({
    success: true,
    data: {
      all: allMenuItems,
      categories: menuData,
    },
  });
});

app.post("/api/orders", (req, res) => {
  const { name, phone, items, specialRequests } = req.body;

  if (!name || !phone || !items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, phone, and items",
    });
  }

  const order = {
    id: orders.length + 1,
    name,
    phone,
    items,
    specialRequests: specialRequests || "",
    timestamp: new Date().toISOString(),
    status: "received",
  };

  orders.push(order);

  console.log("New order received:", order);

  res.json({
    success: true,
    message: "Order received successfully!",
    orderId: order.id,
    data: order,
  });
});

app.get("/api/orders", (req, res) => {
  res.json({
    success: true,
    data: orders,
  });
});

app.listen(PORT, () => {
  console.log(`🍦 Smiley Food Server running on port ${PORT}`);
});
