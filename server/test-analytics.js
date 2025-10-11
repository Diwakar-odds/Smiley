import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { connectDB, sequelize } from "./config/sqlDb.js";

const app = express();

app.use(cors());
app.use(express.json());

// Simple test route for analytics
app.get('/api/analytics/customer-behavior', async (req, res) => {
  try {
    // Count total users using raw SQL
    const totalUsersResult = await sequelize.query(
      'SELECT COUNT(*) as count FROM "Users"',
      { type: sequelize.QueryTypes.SELECT }
    );
    
    // Count repeat customers using raw SQL
    const repeatCustomersResult = await sequelize.query(
      `
      SELECT COUNT(*) as count
      FROM (
        SELECT u."id"
        FROM "Users" u
        JOIN "Orders" o ON u."id" = o."userId"
        WHERE o."status" = 'completed'
        GROUP BY u."id"
        HAVING COUNT(o."id") > 1
      ) as repeat_customers
      `,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    const totalUsers = parseInt(totalUsersResult[0]?.count || 0);
    const repeatCustomers = parseInt(repeatCustomersResult[0]?.count || 0);
    
    res.json({
      totalUsers,
      repeatCustomers,
      averageOrderValue: 0, // Placeholder
      ordersPerUser: [],    // Placeholder
      orderTimes: [],       // Placeholder
      // Backward compatibility
      userCount: totalUsers,
    });
    
  } catch (error) {
    console.error("Error in analytics:", error);
    res.status(500).json({
      message: "Error fetching analytics",
      error: error.message,
      stack: error.stack
    });
  }
});

const PORT = 5001; // Use different port

const startTestServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🧪 Test server running on 0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start test server:", error);
    process.exit(1);
  }
};

startTestServer();