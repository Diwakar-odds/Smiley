// Test script for analytics endpoints
// server/scripts/testAnalytics.js

import { sequelize } from '../config/sqlDb.js';
import { User, Order } from '../models/sequelize/index.js';

async function testAnalytics() {
  console.log('🧪 Testing Analytics Functions...\n');
  
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Test total users count
    const totalUsers = await User.count();
    console.log(`📊 Total Users: ${totalUsers}`);
    
    // Test repeat customers calculation
    const repeatCustomersResult = await sequelize.query(
      `
      SELECT COUNT(*) as "repeatCount"
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
    
    const repeatCustomers = repeatCustomersResult[0]?.repeatCount || 0;
    console.log(`🔄 Repeat Customers: ${repeatCustomers}`);
    
    // Test total orders
    const totalOrders = await Order.count({ where: { status: 'completed' } });
    console.log(`📦 Total Completed Orders: ${totalOrders}`);
    
    // Test total revenue
    const totalRevenue = await Order.sum("totalPrice", { where: { status: 'completed' } });
    console.log(`💰 Total Revenue: ₹${totalRevenue || 0}`);
    
    // Test average order value
    const averageOrderValue = await Order.findOne({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("totalPrice")), "average"],
      ],
      where: { status: 'completed' },
      raw: true,
    });
    
    console.log(`📊 Average Order Value: ₹${averageOrderValue?.average || 0}`);
    
    console.log('\n✅ Analytics test completed successfully!');
    console.log('If you see values above, the analytics functions are working correctly.');
    
  } catch (error) {
    console.error('❌ Analytics test failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the test
testAnalytics();