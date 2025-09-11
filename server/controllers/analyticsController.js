// Analytics controller for PostgreSQL
import { sequelize } from "../config/sqlDb.js";
import { Order, MenuItem, User } from "../models/sequelize/index.js";
import { Op } from "sequelize";

// 📊 Sales Overview
export async function getSalesOverview(req, res) {
  try {
    const totalOrders = await Order.count({ where: { status: 'completed' } });

    // Calculate total revenue
    const totalRevenue = await Order.sum("totalPrice", { where: { status: 'completed' } });

    // Get sales by date for trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = await Order.findAll({
      attributes: [
        [sequelize.fn("date_trunc", "day", sequelize.col("createdAt")), "date"],
        [sequelize.fn("count", sequelize.col("id")), "orderCount"],
        [sequelize.fn("sum", sequelize.col("totalPrice")), "dailyRevenue"],
      ],
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
      group: [sequelize.fn("date_trunc", "day", sequelize.col("createdAt"))],
      order: [
        [sequelize.fn("date_trunc", "day", sequelize.col("createdAt")), "ASC"],
      ],
      raw: true,
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue || 0,
      dailySales,
    });
  } catch (error) {
    console.error("Error fetching sales overview:", error);
    res
      .status(500)
      .json({ message: "Error fetching sales overview", error: error.message });
  }
}

// 🥗 Top-selling items
export async function getTopItems(req, res) {
  try {
    // We need to use a join with the OrderItems junction table
    const topItems = await sequelize.query(
      `
      SELECT 
        mi."id", 
        mi."name", 
        mi."category",
        mi."price",
        SUM(oi."quantity") as "totalSold", 
        SUM(oi."quantity" * oi."price") as "revenue"
      FROM "MenuItems" mi
      JOIN "OrderItems" oi ON mi."id" = oi."menuItemId"
      JOIN "Orders" o ON oi."orderId" = o."id"
      WHERE o."status" = 'completed'
      GROUP BY mi."id", mi."name", mi."category", mi."price"
      ORDER BY "totalSold" DESC
      LIMIT 10
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json(topItems);
  } catch (error) {
    console.error("Error fetching top items:", error);
    res
      .status(500)
      .json({ message: "Error fetching top items", error: error.message });
  }
}

// 👥 Customer behavior analytics
export async function getCustomerBehavior(req, res) {
  try {
    // Count of users
    const userCount = await User.count();

    // Average order value

    const averageOrderValue = await Order.findOne({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("totalPrice")), "average"],
      ],
      where: { status: 'completed' },
      raw: true,
    });

    // Orders per user (only completed orders)
    const ordersPerUser = await sequelize.query(
      `
      SELECT 
        u."id", 
        u."name", 
        COUNT(o."id") as "orderCount",
        SUM(o."totalPrice") as "totalSpent"
      FROM "Users" u
      LEFT JOIN "Orders" o ON u."id" = o."userId" AND o."status" = 'completed'
      GROUP BY u."id", u."name"
      ORDER BY "orderCount" DESC
      LIMIT 10
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    // Most popular order times (hour of day, only completed orders)
    const orderTimes = await sequelize.query(
      `
      SELECT 
        EXTRACT(HOUR FROM "createdAt") as "hour",
        COUNT(*) as "orderCount"
      FROM "Orders"
      WHERE "status" = 'completed'
      GROUP BY EXTRACT(HOUR FROM "createdAt")
      ORDER BY "hour"
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json({
      userCount,
      averageOrderValue: averageOrderValue?.average || 0,
      ordersPerUser,
      orderTimes,
    });
  } catch (error) {
    console.error("Error fetching customer behavior:", error);
    res
      .status(500)
      .json({
        message: "Error fetching customer behavior",
        error: error.message,
      });
  }
}
