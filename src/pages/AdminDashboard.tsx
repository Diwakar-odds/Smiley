import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

interface SalesOverview {
  totalOrders: number;
  totalRevenue: number;
}

interface TopItem {
  _id: string;
  name: string;
  count: number;
}

interface CustomerBehavior {
  totalUsers: number;
  repeatCustomers: number;
}

const AdminDashboard = () => {
  const [salesOverview, setSalesOverview] = useState<SalesOverview | null>(null);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [customerBehavior, setCustomerBehavior] = useState<CustomerBehavior | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        const headers = { Authorization: `Bearer ${token}` };

        const [salesRes, itemsRes, customerRes] = await Promise.all([
          axios.get('http://localhost:5000/api/analytics/sales-overview', { headers }),
          axios.get('http://localhost:5000/api/analytics/top-items', { headers }),
          axios.get('http://localhost:5000/api/analytics/customer-behavior', { headers }),
        ]);

        setSalesOverview(salesRes.data);
        // Join topItems with details
        const populatedItems = itemsRes.data.topItems.map(item => {
            const detail = itemsRes.data.details.find(d => d._id === item._id);
            return { ...item, name: detail?.name || 'Unknown Item' };
        });
        setTopItems(populatedItems);
        setCustomerBehavior(customerRes.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading Dashboard...</div>;
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
        Admin Dashboard
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FiDollarSign />} title="Total Revenue" value={`₹${salesOverview?.totalRevenue.toFixed(2)}`} />
        <StatCard icon={<FiShoppingCart />} title="Total Orders" value={salesOverview?.totalOrders} />
        <StatCard icon={<FiUsers />} title="Total Users" value={customerBehavior?.totalUsers} />
        <StatCard icon={<FiTrendingUp />} title="Repeat Customers" value={customerBehavior?.repeatCustomers} />
      </div>

      {/* Top Items */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Top Selling Items</h2>
        <ul>
          {topItems.map((item, index) => (
            <li key={item._id} className="flex justify-between items-center py-2 border-b">
              <span>{index + 1}. {item.name}</span>
              <span className="font-bold">{item.count} sold</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
    <motion.div 
        className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4"
        whileHover={{ scale: 1.05 }}
    >
        <div className="text-3xl text-orange-500">{icon}</div>
        <div>
            <p className="text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </motion.div>
);

export default AdminDashboard;
