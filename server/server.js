import { fileURLToPath } from 'url';
import path from 'path';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { validateEnvironment } from "./utils/envValidation.js";
import { connectDB, sequelize } from "./config/sqlDb.js";
import { syncModels } from "./models/sequelize/index.js";

// Validate environment variables on startup
validateEnvironment();
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";

const app = express();

// CORS Configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://your-netlify-site.netlify.app'
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import pushNotificationRoutes from "./routes/pushNotificationRoutes.js";
import logRoutes from "./routes/logRoutes.js";

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/push", pushNotificationRoutes);
app.use("/api/logs", logRoutes);

// Basic health check for Render
app.get('/', (req, res) => {
  res.status(200).send("Smiley Food API is running!");
});

// Handle 404s for any unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ message: "API Route Not Found" });
});

const PORT = process.env.PORT || 5000;

// Connect to PostgreSQL database
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Sync all models with the database
    // TEMPORARY FIX: We are setting force: true to wipe the corrupted PaymentMethods table.
    // Make sure to change this back to false after it successfully deploys!
    await syncModels({ force: false });

    // Listen on all network interfaces so Codespaces / container port forwarding works
    const HOST = process.env.HOST || "0.0.0.0";
    app.listen(PORT, HOST, () =>
      console.log(`🚀 Server running on ${HOST}:${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
