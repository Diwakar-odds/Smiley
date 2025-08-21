import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface SalesOverview {
  totalOrders: number;
  totalRevenue: number;
}

interface TopItem {
  _id: string;
  count: number;
  details: { name: string }; // Assuming details will be populated with item name
}

interface CustomerBehavior {
  totalUsers: number;
  repeatCustomers: number;
}

const Analytics = () => {
  const [salesOverview, setSalesOverview] = useState<SalesOverview | null>(null);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [customerBehavior, setCustomerBehavior] = useState<CustomerBehavior | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [salesRes, topItemsRes, customerRes] = await Promise.all([
          axios.get<SalesOverview>('/api/analytics/sales-overview'),
          axios.get<{ topItems: TopItem[]; details: { _id: string; name: string }[] }>('/api/analytics/top-items'),
          axios.get<CustomerBehavior>('/api/analytics/customer-behavior'),
        ]);

        setSalesOverview(salesRes.data);
        // Map details to topItems for easier display
        const populatedTopItems = topItemsRes.data.topItems.map(item => ({
          ...item,
          details: topItemsRes.data.details.find(detail => detail._id === item._id) || { name: 'Unknown' }
        }));
        setTopItems(populatedTopItems);
        setCustomerBehavior(customerRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading Analytics...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Business Analytics
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Overview */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Sales Overview</h2>
          {salesOverview && (
            <div className="space-y-2">
              <p>Total Orders: <span className="font-bold">{salesOverview.totalOrders}</span></p>
              <p>Total Revenue: <span className="font-bold">₹{salesOverview.totalRevenue.toFixed(2)}</span></p>
            </div>
          )}
        </div>

        {/* Top Selling Items */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Top Selling Items</h2>
          {topItems.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {topItems.map((item, index) => (
                <li key={index}>{item.details.name} - {item.count} sold</li>
              ))}
            </ul>
          ) : (
            <p>No top items data available.</p>
          )}
        </div>

        {/* Customer Behavior */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Customer Behavior</h2>
          {customerBehavior && (
            <div className="space-y-2">
              <p>Total Users: <span className="font-bold">{customerBehavior.totalUsers}</span></p>
              <p>Repeat Customers: <span className="font-bold">{customerBehavior.repeatCustomers}</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;