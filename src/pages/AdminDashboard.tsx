import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminOffers from './AdminOffers';
import OrderDetails from '../components/ui/OrderDetails';
import client from '../api/client';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { FaSmile } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
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

interface DashboardOrder {
    _id: string;
    user?: { name?: string };
    createdAt: string;
    status?: string;
    totalPrice: number;
    items: { name?: string; quantity: number; price?: number; menuItemId?: string }[];
}

const AdminDashboard = () => {
    const [salesOverview, setSalesOverview] = useState<SalesOverview | null>(null);
    const [topItems, setTopItems] = useState<TopItem[]>([]);
    const [customerBehavior, setCustomerBehavior] = useState<CustomerBehavior | null>(null);
    const [orders, setOrders] = useState<DashboardOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showNotif, setShowNotif] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'offers'>('overview');
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const { notifications: orderNotifications } = useOrderNotifications(token);

    // Robust admin authentication check
    useEffect(() => {
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
            return;
        }
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join('')
            );
            const payload = JSON.parse(jsonPayload);
            console.log('Decoded JWT payload:', payload);
            if (!payload || payload.role !== 'admin') {
                console.log('Role is not admin, redirecting to login');
                navigate('/login');
            }
        } catch (e) {
            console.log('JWT decode error:', e);
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [salesRes, itemsRes, customerRes, ordersRes] = await Promise.all([
                    client.get('/analytics/sales-overview'),
                    client.get('/analytics/top-items'),
                    client.get('/analytics/customer-behavior'),
                    client.get('/orders'),
                ]);
                setSalesOverview(salesRes.data);
                const populatedItems = itemsRes.data.topItems.map((item: TopItem) => {
                    const detail = itemsRes.data.details.find((d: { _id: string; name?: string }) => d._id === item._id);
                    return { ...item, name: detail?.name || 'Unknown Item' };
                });
                setTopItems(populatedItems);
                setCustomerBehavior(customerRes.data);
                setOrders(ordersRes.data);
                setError(null);
            } catch (err: any) {
                if (err?.response?.data?.message === 'Invalid or expired token' || err?.response?.status === 403) {
                    localStorage.removeItem('jwtToken');
                    navigate('/login');
                }
                setError('Failed to fetch dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate, token]);

    // UI rendering
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-100 to-red-50 font-sans">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-orange-700 flex items-center gap-2">
                        <FaSmile className="text-yellow-500" /> Admin Dashboard
                    </h1>
                    <div className="flex gap-2">
                        <button className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border border-orange-500'}`} onClick={() => setActiveTab('overview')}>Overview</button>
                        <button className={`px-4 py-2 rounded ${activeTab === 'offers' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border border-orange-500'}`} onClick={() => setActiveTab('offers')}>Offers</button>
                    </div>
                </div>
                {showNotif && orderNotifications?.length > 0 && (
                    <AdminNotification message={`You have ${orderNotifications.length} new order(s)!`} onClose={() => setShowNotif(false)} />
                )}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="bg-white rounded-lg shadow p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiDollarSign /> Sales Overview</h2>
                                <div className="flex gap-8">
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-bold text-orange-600">{salesOverview?.totalOrders ?? 0}</span>
                                        <span className="text-sm text-gray-500">Total Orders</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-bold text-orange-600">₹{salesOverview?.totalRevenue?.toFixed ? salesOverview.totalRevenue.toFixed(2) : salesOverview?.totalRevenue ?? 0}</span>
                                        <span className="text-sm text-gray-500">Total Revenue</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiTrendingUp /> Top Items</h2>
                                <ul className="list-disc list-inside">
                                    {topItems.map(item => (
                                        <li key={item._id} className="mb-2">
                                            <span className="font-semibold">{item.name}</span> <span className="text-gray-500">(x{item.count})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiUsers /> Customer Behavior</h2>
                                <div className="flex gap-8">
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-bold text-orange-600">{customerBehavior?.totalUsers ?? 0}</span>
                                        <span className="text-sm text-gray-500">Total Users</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-bold text-orange-600">{customerBehavior?.repeatCustomers ?? 0}</span>
                                        <span className="text-sm text-gray-500">Repeat Customers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white rounded-lg shadow p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiShoppingCart /> Orders</h2>
                                {selectedOrder ? (
                                    <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {orders.map(order => (
                                            <li key={order._id} className="py-4 cursor-pointer hover:bg-orange-50 transition" onClick={() => setSelectedOrder(order)}>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold">Order #{order._id}</span>
                                                    <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className="flex gap-4 mt-2">
                                                    <span className="text-sm text-gray-600">Status: {order.status || 'N/A'}</span>
                                                    <span className="text-sm text-gray-600">Total: ₹{order.totalPrice?.toFixed ? order.totalPrice.toFixed(2) : order.totalPrice}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'offers' && <AdminOffers />}
            </div>
        </div>
    );
    // Error and selectedOrder returns must be inside the component
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
    if (selectedOrder) {
        return <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
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
                {/* Tabs for Overview and Festive Offers */}
                <div className="flex gap-4 mb-8">
                    <button
                        className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'overview' ? 'bg-orange-500 text-white shadow' : 'bg-white text-orange-500 border border-orange-300'}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'offers' ? 'bg-pink-500 text-white shadow' : 'bg-white text-pink-500 border border-pink-300'}`}
                        onClick={() => setActiveTab('offers')}
                    >
                        Festive Offers
                    </button>
                </div>
                {activeTab === 'overview' && (
                    <>
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

                        {/* Orders Section */}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="bg-white/80 shadow-xl rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-pink-500 mb-6 font-poppins">All Orders</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-xl">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b text-left">Order ID</th>
                                            <th className="py-2 px-4 border-b text-left">Customer</th>
                                            <th className="py-2 px-4 border-b text-left">Date</th>
                                            <th className="py-2 px-4 border-b text-left">Status</th>
                                            <th className="py-2 px-4 border-b text-left">Total</th>
                                            <th className="py-2 px-4 border-b text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 ? (
                                            <tr><td colSpan={6} className="text-center py-4 text-gray-400">No orders found.</td></tr>
                                        ) : (
                                            orders.map((order) => (
                                                <tr key={order._id} className="hover:bg-orange-50 transition">
                                                    <td className="py-2 px-4 border-b">{order._id}</td>
                                                    <td className="py-2 px-4 border-b">{order.user?.name || 'Unknown'}</td>
                                                    <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
                                                    <td className="py-2 px-4 border-b">{order.status || 'N/A'}</td>
                                                    <td className="py-2 px-4 border-b">₹{order.totalPrice}</td>
                                                    <td className="py-2 px-4 border-b">
                                                        <button
                                                            className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold py-1 px-3 rounded shadow hover:scale-105 transition"
                                                            onClick={() => setSelectedOrder(order)}
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* Top Items & Pie Chart */}
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="bg-white/80 shadow-xl rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-orange-500 mb-6 font-poppins">Menu Items Sold</h2>
                            {topItems.length === 0 ? (
                                <div className="text-gray-400 italic">No sales data yet.</div>
                            ) : (
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-full md:w-1/2">
                                        <Pie
                                            data={{
                                                labels: topItems.map(item => item.name),
                                                datasets: [
                                                    {
                                                        label: 'Items Sold',
                                                        data: topItems.map(item => item.count),
                                                        backgroundColor: [
                                                            'rgba(245, 158, 66, 0.7)', // orange
                                                            'rgba(244, 114, 182, 0.7)', // pink
                                                            'rgba(255, 99, 132, 0.7)', // red
                                                            'rgba(132, 204, 22, 0.7)', // green
                                                            'rgba(59, 130, 246, 0.7)', // blue
                                                            'rgba(251, 191, 36, 0.7)', // yellow
                                                        ],
                                                        borderColor: [
                                                            'rgba(245, 158, 66, 1)',
                                                            'rgba(244, 114, 182, 1)',
                                                            'rgba(255, 99, 132, 1)',
                                                            'rgba(132, 204, 22, 1)',
                                                            'rgba(59, 130, 246, 1)',
                                                            'rgba(251, 191, 36, 1)',
                                                        ],
                                                        borderWidth: 2,
                                                    },
                                                ],
                                            }}
                                            options={{
                                                plugins: {
                                                    legend: {
                                                        position: 'bottom',
                                                        labels: {
                                                            color: '#F59E42',
                                                            font: { size: 16, family: 'Poppins' },
                                                        },
                                                    },
                                                    tooltip: {
                                                        callbacks: {
                                                            label: function (context) {
                                                                return `${context.label}: ${context.parsed} sold`;
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <ul>
                                            {topItems.map((item, index) => (
                                                <li key={item._id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                                                    <span className="font-semibold text-gray-700 font-inter">{index + 1}. {item.name}</span>
                                                    <span className="font-bold text-orange-500">{item.count} sold</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Footer */}
                        <div className="text-center text-gray-400 text-sm mt-8 font-inter">
                            &copy; {new Date().getFullYear()} Smiley Admin. All rights reserved.
                        </div>
                    </>
                )}
                {activeTab === 'offers' && <AdminOffers />}
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
