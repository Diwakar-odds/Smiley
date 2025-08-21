// This is just demo logic – replace with real DB queries later
import Order from "../models/Order.js";
import Meal from "../models/MenuItem.js";
import User from "../models/User.js";

// 📊 Sales Overview
export async function getSalesOverview(req, res) {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales overview", error });
  }
}

// 🥗 Top Items
export async function getTopItems(req, res) {
  try {
    const topItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.mealId",
          count: { $sum: "$items.quantity" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const populated = await Meal.find({
      _id: { $in: topItems.map((i) => i._id) },
    });

    res.json({ topItems, details: populated });
  } catch (error) {
    res.status(500).json({ message: "Error fetching top items", error });
  }
}

// 👥 Customer Behavior
export async function getCustomerBehavior(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const repeatCustomers = await Order.aggregate([
      { $group: { _id: "$userId", orders: { $sum: 1 } } },
      { $match: { orders: { $gt: 1 } } },
    ]);

    res.json({
      totalUsers,
      repeatCustomers: repeatCustomers.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching customer behavior", error });
  }
}
