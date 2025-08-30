import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminOffers from './AdminOffers';
import OrderDetails from '../components/ui/OrderDetails';
import AdminStats from '../components/admin/AdminStats';
import OrdersTable from '../components/admin/OrdersTable';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import MenuManagement from '../components/admin/MenuManagement';
import InventoryManagement from '../components/admin/InventoryManagement';
import UserManagement from '../components/admin/UserManagement';
import ReviewModeration from '../components/admin/ReviewModeration';
// Import client with a type assertion to handle the import error
// @ts-expect-error - Import client with a type assertion to handle the import error
import client from '../api/client';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiGrid, FiShoppingCart, FiPieChart, FiUsers, FiList, FiPackage, FiStar, FiGift, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { FaSmile } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
import smileyLogo from '../assets/smiley-logo.png';
import AdminNotification from '../components/ui/AdminNotification';
import { useOrderNotifications } from '../hooks/useOrderNotifications';

// #region Type Definitions
interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
}

interface Order {
    _id: string;
    user: {
        name: string;
        _id: string;
    };
    status: string;
    totalPrice: number;
    createdAt: string;
    items: {
        menuItemId: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

interface SalesOverview {
    totalOrders: number;
    totalRevenue: number;
}

interface CustomerBehavior {
    totalUsers: number;
    repeatCustomers: number;
}

interface TopItem {
    _id: string;
    name: string;
    count: number;
}

interface TopItemResponse {
    _id: string;
    count: number;
}

interface ItemDetails {
    _id: string;
    name: string;
}
// #endregion

// Sidebar Item Component
const SidebarItem = ({
    icon,
    title,
    active,
    onClick,
    notificationCount,
}: {
    icon: React.ReactNode;
    title: string;
    active: boolean;
    onClick: () => void;
    notificationCount?: number;
}) => {
    return (
        <li>
            <button
                onClick={onClick}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${active
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10'
                    }`}
            >
                <span className={`text-lg ${active ? 'text-white' : 'text-white/70'}`}>
                    {icon}
                </span>
                <span className={`ml-4 text-sm font-semibold ${active ? 'text-white' : ''}`}>{title}</span>
                {notificationCount && notificationCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {notificationCount}
                    </span>
                )}
            </button>
        </li>
    );
};

// Scroll to Top Button Component
const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the scroll event listener
    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top handler
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <motion.button
            className={`fixed bottom-6 right-6 p-3 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30 z-30 ${!isVisible && 'hidden'}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Scroll to top"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
        </motion.button>
    );
};

const AdminDashboard: React.FC = () => {
    // Tab navigation state
    const [activeTab, setActiveTab] = useState<'dashboard' | 'overview' | 'orders' | 'menu' | 'inventory' | 'analytics' | 'users' | 'reviews' | 'offers'>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    // Data states
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [salesOverview, setSalesOverview] = useState<SalesOverview | null>(null);
    const [customerBehavior, setCustomerBehavior] = useState<CustomerBehavior | null>(null);
    const [topItems, setTopItems] = useState<TopItem[]>([]);
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
    const [showNotif, setShowNotif] = useState<boolean>(true);

    // Navigation and auth
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const { notifications } = useOrderNotifications(token);

    // Check admin authentication
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

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) return;

            try {
                setLoading(true);
                const [salesRes, customerRes, topItemsRes, ordersRes] = await Promise.all([
                    client.get('/analytics/sales-overview'),
                    client.get('/analytics/customer-behavior'),
                    client.get('/analytics/top-items'),
                    client.get('/orders'),
                ]);

                setSalesOverview(salesRes.data);
                setCustomerBehavior(customerRes.data);

                // Process top items data
                const processedTopItems = topItemsRes.data.topItems.map((item: TopItemResponse) => {
                    const details = topItemsRes.data.details.find((d: ItemDetails) => d._id === item._id);
                    return {
                        _id: item._id,
                        name: details?.name || 'Unknown Item',
                        count: item.count
                    };
                });

                setTopItems(processedTopItems);
                setOrders(ordersRes.data);
                setError(null);
            } catch (err: unknown) {
                console.error('Dashboard data fetch error:', err);
                const error = err as { response?: { status?: number } };
                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    localStorage.removeItem('jwtToken');
                    navigate('/login');
                } else {
                    setError('Failed to load dashboard data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, navigate]);

    // Refresh data function
    const refreshData = () => {
        setLoading(true);
        setError(null);

        const fetchDashboardData = async () => {
            try {
                const [salesRes, customerRes, topItemsRes, ordersRes] = await Promise.all([
                    client.get('/analytics/sales-overview'),
                    client.get('/analytics/customer-behavior'),
                    client.get('/analytics/top-items'),
                    client.get('/orders'),
                ]);

                setSalesOverview(salesRes.data);
                setCustomerBehavior(customerRes.data);

                // Process top items data
                const processedTopItems = topItemsRes.data.topItems.map((item: TopItemResponse) => {
                    const details = topItemsRes.data.details.find((d: ItemDetails) => d._id === item._id);
                    return {
                        _id: item._id,
                        name: details?.name || 'Unknown Item',
                        count: item.count
                    };
                });

                setTopItems(processedTopItems);
                setOrders(ordersRes.data);
                setShowNotif(false); // Hide notifications after refresh
                setLoading(false);
            } catch (err: any) {
                console.error('Dashboard refresh error:', err);
                setError(err.response?.data?.message || 'Failed to load dashboard data. Please try again.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
                <div className="flex items-center justify-center h-screen">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 mb-4 mx-auto">
                            <svg className="animate-spin -ml-1 mr-3 h-24 w-24 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <p className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">Loading Dashboard...</p>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50">
                <div className="flex items-center justify-center h-screen">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md"
                    >
                        <div className="text-red-500 text-6xl mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={refreshData}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                        >
                            Try Again
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }
    // Animation variants for tab transitions
    const tabVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    // Render tab content based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
            case 'overview':
                return (
                    <motion.div
                        key="dashboard-tab"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                    >
                        {/* <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                            <h1 className="text-3xl font-bold mb-4 md:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 drop-shadow-sm">Dashboard Overview</h1>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => refreshData()}
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                                >
                                    Refresh Data
                                </button>
                            </div>
                        </div> */}

                        {/* Stats Cards */}
                        <AdminStats
                            totalRevenue={salesOverview?.totalRevenue || 0}
                            totalOrders={salesOverview?.totalOrders || 0}
                            totalUsers={customerBehavior?.totalUsers || 0}
                            repeatCustomers={customerBehavior?.repeatCustomers || 0}
                        />
                        <OrdersTable
                            orders={orders.slice(0, 5)} // Show only the 5 most recent orders
                            onSelectOrder={setSelectedOrder}
                            onRefresh={refreshData}
                        />
                        <AnalyticsCharts
                            topItems={topItems}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                        />
                    </motion.div>
                );
            case 'orders':
                return (
                    <motion.div
                        key="orders-tab"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                    >
                        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 drop-shadow-sm">Order Management</h1>
                        {selectedOrder ? (
                            <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
                                <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />
                            </div>
                        ) : (
                            <OrdersTable
                                orders={orders}
                                onSelectOrder={setSelectedOrder}
                                onRefresh={refreshData}
                            />
                        )}
                    </motion.div>
                );
            case 'menu':
                return (
                    <motion.div
                        key="menu-tab"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                    >
                        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 drop-shadow-sm">Menu Management</h1>
                        <MenuManagement />
                    </motion.div>
                );
            case 'inventory':
                return (
                    <motion.div
                        key="inventory-tab"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                    >
                        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 drop-shadow-sm">Inventory Management</h1>
                        <InventoryManagement />
                    </motion.div>
                );
            case 'analytics':
                return (
                    <motion.div
                        key="analytics-tab"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                    >
                        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 drop-shadow-sm">Analytics</h1>
                        <AnalyticsCharts
                            topItems={topItems}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                        />
                    </motion.div>
                );
            case 'users':
                return (
                    <motion.div
                        key="users-tab"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                    >
                        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 drop-shadow-sm">User Management</h1>
                        <UserManagement />
                    </motion.div>
                );
            case 'reviews':
                return (
                    <motion.div
                        key="reviews-tab"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                    >
                        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 drop-shadow-sm">Review Moderation</h1>
                        <ReviewModeration />
                    </motion.div>
                );
            case 'offers':
                return (
                    <motion.div
                        key="offers-tab"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={tabVariants}
                    >
                        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 drop-shadow-sm">Festive Offers</h1>
                        <AdminOffers />
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={{ width: sidebarOpen ? '280px' : '0px', opacity: sidebarOpen ? 1 : 0 }}
                className={`bg-gradient-to-br from-indigo-800 to-purple-700 text-white h-full fixed lg:relative ${sidebarOpen ? 'block shadow-2xl' : 'hidden lg:block lg:shadow-xl'
                    } lg:w-72 z-50 transition-all duration-300 ease-in-out border-r border-indigo-900/10`}
            >
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 drop-shadow-sm">
                            Smiley Admin
                        </h2>
                        <button
                            className="lg:hidden p-2 hover:bg-indigo-700 rounded-full transition-all duration-200"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close sidebar"
                            title="Close sidebar"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                    <div className="mt-10">
                        <ul className="space-y-3">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            >
                                <SidebarItem
                                    icon={<FiGrid />}
                                    title="Dashboard"
                                    active={activeTab === 'dashboard' || activeTab === 'overview'}
                                    onClick={() => {
                                        setActiveTab('dashboard');
                                        setSidebarOpen(false);
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <SidebarItem
                                    icon={<FiShoppingCart />}
                                    title="Orders"
                                    active={activeTab === 'orders'}
                                    onClick={() => {
                                        setActiveTab('orders');
                                        setSidebarOpen(false);
                                    }}
                                    notificationCount={notifications?.length}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <SidebarItem
                                    icon={<FiList />}
                                    title="Menu"
                                    active={activeTab === 'menu'}
                                    onClick={() => {
                                        setActiveTab('menu');
                                        setSidebarOpen(false);
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                <SidebarItem
                                    icon={<FiPackage />}
                                    title="Inventory"
                                    active={activeTab === 'inventory'}
                                    onClick={() => {
                                        setActiveTab('inventory');
                                        setSidebarOpen(false);
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                            >
                                <SidebarItem
                                    icon={<FiPieChart />}
                                    title="Analytics"
                                    active={activeTab === 'analytics'}
                                    onClick={() => {
                                        setActiveTab('analytics');
                                        setSidebarOpen(false);
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.6 }}
                            >
                                <SidebarItem
                                    icon={<FiUsers />}
                                    title="Users"
                                    active={activeTab === 'users'}
                                    onClick={() => {
                                        setActiveTab('users');
                                        setSidebarOpen(false);
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.7 }}
                            >
                                <SidebarItem
                                    icon={<FiStar />}
                                    title="Reviews"
                                    active={activeTab === 'reviews'}
                                    onClick={() => {
                                        setActiveTab('reviews');
                                        setSidebarOpen(false);
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.8 }}
                            >
                                <SidebarItem
                                    icon={<FiGift />}
                                    title="Festive Offers"
                                    active={activeTab === 'offers'}
                                    onClick={() => {
                                        setActiveTab('offers');
                                        setSidebarOpen(false);
                                    }}
                                />
                            </motion.div>
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto relative bg-gradient-to-br from-white to-indigo-50/30">
                {/* Header */}
                <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-lg z-40 border-b border-indigo-100/50">
                    <div className="px-6 py-4 flex justify-between items-center bg-gradient-to-r from-transparent to-indigo-50/50">
                        <div className="flex items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="lg:hidden p-2 rounded-full text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                aria-label="Open sidebar menu"
                                title="Open sidebar menu"
                            >
                                <FiMenu size={24} />
                            </motion.button>
                            <span className="font-semibold text-lg ml-3 lg:ml-0 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-indigo-700">Admin Dashboard</span>
                        </div>
                        <div className="flex items-center space-x-5">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={refreshData}
                                className="flex items-center text-sm font-medium px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:shadow-sm transition-all duration-200"
                                disabled={loading}
                                aria-label="Refresh dashboard data"
                                title="Refresh data"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {loading ? 'Refreshing...' : 'Refresh Data'}
                            </motion.button>

                            {notifications && notifications.length > 0 && (
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="relative cursor-pointer"
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => {
                                        setActiveTab('orders');
                                        setShowNotif(false);
                                    }}
                                >
                                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                                        {notifications.length} new order{notifications.length !== 1 ? 's' : ''}
                                    </span>
                                </motion.div>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    localStorage.removeItem('jwtToken');
                                    navigate('/login');
                                }}
                                className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                                aria-label="Log out of admin dashboard"
                                title="Log out"
                            >
                                Log out
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="p-6 md:p-8">
                    {showNotif && notifications && notifications.length > 0 && (
                        <AdminNotification
                            message={`You have ${notifications.length} new order${notifications.length !== 1 ? 's' : ''}!`}
                            onClose={() => setShowNotif(false)}
                        />
                    )}
                    {renderTabContent()}
                </div>

                {/* Scroll to top button */}
                <ScrollToTopButton />
            </div>

            {/* Mobile overlay when sidebar is open */}
            {sidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black lg:hidden z-40"
                    onClick={() => setSidebarOpen(false)}
                    role="presentation"
                    aria-hidden="true"
                ></motion.div>
            )}
        </div>
    );
};

export default AdminDashboard;
