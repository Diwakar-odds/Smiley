import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { FaSmile } from 'react-icons/fa';
import smileyLogo from '../assets/smiley-logo.png';
import AdminNotification from '../components/ui/AdminNotification';
import { useOrderNotifications } from '../hooks/useOrderNotifications';

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
    const token = localStorage.getItem('jwtToken');
    const { notifications: orderNotifications } = useOrderNotifications(token);
    const [showNotif, setShowNotif] = useState(true);

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
                const populatedItems = itemsRes.data.topItems.map((item: TopItem) => {
                    const detail = itemsRes.data.details.find((d: { _id: string; name?: string }) => d._id === item._id);
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
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-red-50 font-sans">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <FaSmile className="text-6xl text-orange-400 mb-4 animate-bounce" />
                    <span className="text-xl font-bold text-orange-500 animate-pulse">Loading Admin Dashboard...</span>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-red-50 font-sans">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <FaSmile className="text-6xl text-red-400 mb-4 animate-bounce" />
                    <span className="text-xl font-bold text-red-500">Error: {error}</span>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-red-50 font-sans">
            {showNotif && orderNotifications.length > 0 && (
                <AdminNotification
                    message={`New order received from ${orderNotifications[0].customer || 'customer'}!`}
                    onClose={() => setShowNotif(false)}
                />
            )}
            <div className="max-w-5xl mx-auto py-10 px-4">
                {/* Logo and Title */}
                <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex flex-col items-center mb-8">
                    <img src={smileyLogo} alt="Smiley Brand Logo" className="h-12 w-12 rounded-full shadow border-2 border-orange-300 bg-white p-1" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 tracking-tight mb-2 font-poppins">Smiley Admin Dashboard</h1>
                    <span className="text-lg text-gray-500 font-inter">Manage your business with a smile!</span>
                </motion.div>

                {/* Stats Cards */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard icon={<FiDollarSign />} title="Total Revenue" value={`₹${salesOverview?.totalRevenue?.toFixed(2) ?? '0.00'}`} color="from-orange-400 to-pink-400" />
                    <StatCard icon={<FiShoppingCart />} title="Total Orders" value={salesOverview?.totalOrders ?? 0} color="from-yellow-400 to-orange-500" />
                    <StatCard icon={<FiUsers />} title="Total Users" value={customerBehavior?.totalUsers ?? 0} color="from-lime-400 to-green-400" />
                    <StatCard icon={<FiTrendingUp />} title="Repeat Customers" value={customerBehavior?.repeatCustomers ?? 0} color="from-pink-400 to-red-400" />
                </motion.div>

                {/* Top Items */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="bg-white/80 shadow-xl rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-orange-500 mb-6 font-poppins">Top Selling Items</h2>
                    <ul>
                        {topItems.length === 0 ? (
                            <li className="text-gray-400 italic">No sales data yet.</li>
                        ) : (
                            topItems.map((item, index) => (
                                <li key={item._id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                    <span className="font-semibold text-gray-700 font-inter">{index + 1}. {item.name}</span>
                                    <span className="font-bold text-orange-500">{item.count} sold</span>
                                </li>
                            ))
                        )}
                    </ul>
                </motion.div>

                {/* Footer */}
                <div className="text-center text-gray-400 text-sm mt-8 font-inter">
                    &copy; {new Date().getFullYear()} Smiley Admin. All rights reserved.
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
}

const StatCard = ({ icon, title, value, color }: StatCardProps) => (
    <motion.div
        className={`bg-gradient-to-br ${color} shadow-lg rounded-xl p-6 flex items-center space-x-4 transition-all duration-300 hover:scale-105`}
        whileHover={{ scale: 1.07 }}
    >
        <div className="text-4xl text-white drop-shadow-lg">{icon}</div>
        <div>
            <p className="text-white/80 font-inter text-lg">{title}</p>
            <p className="text-3xl font-extrabold text-white font-poppins">{value}</p>
        </div>
    </motion.div>
);

export default AdminDashboard;
