import { fileURLToPath } from 'url';
import path from 'path';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { connectDB, sequelize } from "./config/sqlDb.js";
import { syncModels } from "./models/sequelize/index.js";
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Resolve the root directory for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Serve static files from the Vite build directory
app.use(express.static(path.join(root, 'dist')));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/store", storeRoutes);
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import pushNotificationRoutes from "./routes/pushNotificationRoutes.js";

app.use("/api/addresses", addressRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/push", pushNotificationRoutes);

// Catch-all route to serve the frontend for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(root, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

// Connect to PostgreSQL database
const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Sync all models with the database (less aggressive sync)
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
