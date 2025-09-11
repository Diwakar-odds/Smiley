import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderDetails from '../components/ui/OrderDetails';
import AdminStats from '../components/admin/AdminStats';
import OrdersTable from '../components/admin/OrdersTable';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import { OrderStatus } from '../types/schema';
import client from '../api/client';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiGrid, FiShoppingCart, FiPieChart, FiUsers, FiList, FiPackage, FiStar, FiGift, FiMoon, FiSun } from 'react-icons/fi';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
import AdminNotification from '../components/ui/AdminNotification';
import { useOrderNotifications } from '../hooks/useOrderNotifications';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { ContentSkeleton } from '../components/ui/SkeletonLoaders';

const AdminDashboard = () => {

    // Sidebar and tab state
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Sidebar item component
    interface SidebarItemProps {
        icon: React.ReactNode;
        title: string;
        active: boolean;
        onClick: () => void;
        notificationCount?: number;
    }
    const SidebarItem: React.FC<SidebarItemProps> = ({
        icon,
        title,
        active,
        onClick,
        notificationCount,
    }) => (
        <li>
            <button
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 ${active ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-200'}`}
                onClick={onClick}
            >
                <span className="mr-3 text-xl">{icon}</span>
                <span className="flex-1 text-left">{title}</span>
                {notificationCount && notificationCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{notificationCount}</span>
                )}
            </button>
        </li>
    );

// Lazy load components
const AdminOffers = React.lazy(() => import('./AdminOffers'));
const MenuManagement = React.lazy(() => import('../components/admin/MenuManagement'));
const InventoryManagement = React.lazy(() => import('../components/admin/InventoryManagement'));
const UserManagement = React.lazy(() => import('../components/admin/UserManagement'));
const ReviewModeration = React.lazy(() => import('../components/admin/ReviewModeration'));

// Type Definitions
interface Order {
    id: number;
    user: {
        name: string;
        id: number;
    };
    status: OrderStatus;
    totalPrice: number;
    createdAt: string;
    items: {
        menuItemId: number;
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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    // Adapter for OrdersTable onSelectOrder prop

    const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
    const [salesOverview, setSalesOverview] = useState<SalesOverview | null>(null);
    const [customerBehavior, setCustomerBehavior] = useState<CustomerBehavior | null>(null);
    const [topItems, setTopItems] = useState<TopItem[]>([]);
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
    const [salesChartData, setSalesChartData] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] });
    const [showNotif, setShowNotif] = useState<boolean>(true);

    // Hooks
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const { notifications } = useOrderNotifications(token);
    const { toggleTheme, isDark } = useTheme();
    const { showToast } = useToast();
    
    useSessionTimeout({
        timeout: 30 * 60 * 1000, // 30 minutes
        warningTime: 5 * 60 * 1000, // 5 minutes warning
        onWarning: () => showToast('info', 'Your session will expire soon. Please refresh to extend.', 10000),
    });

    // Auth check
    useEffect(() => {
        if (!token) {
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
            if (!payload || payload.role !== 'admin') {
                navigate('/login');
            }
        } catch (e) {
            navigate('/login');
        }
    }, [token, navigate]);

    // Fetch data
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
                // Prepare sales chart data for AnalyticsCharts
                if (salesRes.data && salesRes.data.dailySales) {
                    // Group daily sales into weeks for 'weekly' view
                    const daily = salesRes.data.dailySales;
                    if (timeRange === 'weekly') {
                        // Assume daily is sorted by date ASC
                        const weeks: { [key: string]: number } = {};
                        let weekIndex = 1;
                        let weekSum = 0;
                        let dayCount = 0;
                        daily.forEach((d: any, i: number) => {
                            weekSum += Number(d.dailyRevenue || 0);
                            dayCount++;
                            if (dayCount === 7 || i === daily.length - 1) {
                                weeks[`Week ${weekIndex}`] = weekSum;
                                weekIndex++;
                                weekSum = 0;
                                dayCount = 0;
                            }
                        });
                        setSalesChartData({ labels: Object.keys(weeks), values: Object.values(weeks) });
                    } else if (timeRange === 'daily') {
                        setSalesChartData({
                            labels: daily.map((d: any) => new Date(d.date).toLocaleDateString()),
                            values: daily.map((d: any) => Number(d.dailyRevenue || 0)),
                        });
                    } else {
                        // Monthly: group by month
                        const months: { [key: string]: number } = {};
                        daily.forEach((d: any) => {
                            const month = new Date(d.date).toLocaleString('default', { month: 'short', year: 'numeric' });
                            months[month] = (months[month] || 0) + Number(d.dailyRevenue || 0);
                        });
                        setSalesChartData({ labels: Object.keys(months), values: Object.values(months) });
                    }
                }
                setCustomerBehavior(customerRes.data);

                let processedTopItems: TopItem[] = [];
                if (Array.isArray(topItemsRes.data)) {
                    processedTopItems = topItemsRes.data.map((item: any) => ({
                        _id: item.id || item._id,
                        name: item.name || 'Unknown Item',
                        count: item.totalSold || item.count || 0
                    }));
                } else if (topItemsRes.data?.topItems) {
                    processedTopItems = topItemsRes.data.topItems.map((item: any) => {
                        const details = topItemsRes.data.details?.find((d: any) => d._id === item._id);
                        return {
                            _id: item._id,
                            name: details?.name || 'Unknown Item',
                            count: item.count
                        };
                    });
                }
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

    // Refresh function
    const refreshData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [salesRes, customerRes, topItemsRes, ordersRes] = await Promise.all([
                client.get('/analytics/sales-overview'),
                client.get('/analytics/customer-behavior'),
                client.get('/analytics/top-items'),
                client.get('/orders'),
            ]);

            setSalesOverview(salesRes.data);
            setCustomerBehavior(customerRes.data);

            let processedTopItems: TopItem[] = [];
            if (Array.isArray(topItemsRes.data)) {
                processedTopItems = topItemsRes.data.map((item: any) => ({
                    _id: item.id || item._id,
                    name: item.name || 'Unknown Item',
                    count: item.totalSold || item.count || 0
                }));
            } else if (topItemsRes.data?.topItems) {
                processedTopItems = topItemsRes.data.topItems.map((item: any) => {
                    const details = topItemsRes.data.details?.find((d: any) => d._id === item._id);
                    return {
                        _id: item._id,
                        name: details?.name || 'Unknown Item',
                        count: item.count
                    };
                });
            }
            setTopItems(processedTopItems);
            setOrders(ordersRes.data);
            setShowNotif(false);
            setLoading(false);
            showToast('success', 'Dashboard data refreshed successfully!');
        } catch (err: any) {
            console.error('Dashboard refresh error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to load dashboard data. Please try again.';
            setError(errorMessage);
            setLoading(false);
            showToast('error', errorMessage);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
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
            <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-center justify-center h-screen">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md"
                    >
                        <div className="text-red-500 text-6xl mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Error Loading Dashboard</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
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

    // Animation variants
    const tabVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
    };

    // Render tab content
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
                        <AdminStats
                            totalRevenue={salesOverview?.totalRevenue || 0}
                            totalOrders={salesOverview?.totalOrders || 0}
                            totalUsers={customerBehavior?.totalUsers || 0}
                            repeatCustomers={customerBehavior?.repeatCustomers || 0}
                        />
                        <OrdersTable
                            orders={orders.slice(0, 5)}
                            onSelectOrder={setSelectedOrder}
                            onRefresh={refreshData}
                        />
                        <AnalyticsCharts
                            topItems={topItems}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                            salesData={salesChartData}
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
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8">
                                {orderDetailsLoading ? (
                                    <div className="text-center py-8 text-lg text-indigo-600">Loading order details...</div>
                                ) : (
                                    <OrderDetails order={selectedOrder} onBack={() => setSelectedOrder(null)} />
                                )}
                            </div>
                        ) : (
                            <OrdersTable
                                orders={orders}
                                onSelectOrder={async (order) => {
                                    setOrderDetailsLoading(true);
                                    try {
                                        const res = await client.get(`/orders/${order.id}`);
                                        setSelectedOrder(res.data);
                                    } catch (err) {
                                        setSelectedOrder(order); // fallback to existing data
                                    } finally {
                                        setOrderDetailsLoading(false);
                                    }
                                }}
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
                        <Suspense fallback={<ContentSkeleton />}>
                            <MenuManagement />
                        </Suspense>
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
                        <Suspense fallback={<ContentSkeleton />}>
                            <InventoryManagement />
                        </Suspense>
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
                        <Suspense fallback={<ContentSkeleton />}>
                            <UserManagement />
                        </Suspense>
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
                        <Suspense fallback={<ContentSkeleton />}>
                            <ReviewModeration />
                        </Suspense>
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
                        <Suspense fallback={<ContentSkeleton />}>
                            <AdminOffers />
                        </Suspense>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={{ width: sidebarOpen ? '280px' : '0px', opacity: sidebarOpen ? 1 : 0 }}
                className={`bg-gradient-to-br from-indigo-800 to-purple-700 text-white h-full fixed lg:relative ${sidebarOpen ? 'block shadow-2xl' : 'hidden lg:block lg:shadow-xl'
                    } lg:w-72 z-50 transition-all duration-300 ease-in-out border-r border-gray-900`}
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
                            <SidebarItem
                                icon={<FiGrid />}
                                title="Dashboard"
                                active={activeTab === 'dashboard' || activeTab === 'overview'}
                                onClick={() => {
                                    setActiveTab('dashboard');
                                    setSidebarOpen(false);
                                }}
                            />
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
                            <SidebarItem
                                icon={<FiList />}
                                title="Menu"
                                active={activeTab === 'menu'}
                                onClick={() => {
                                    setActiveTab('menu');
                                    setSidebarOpen(false);
                                }}
                            />
                            <SidebarItem
                                icon={<FiPackage />}
                                title="Inventory"
                                active={activeTab === 'inventory'}
                                onClick={() => {
                                    setActiveTab('inventory');
                                    setSidebarOpen(false);
                                }}
                            />
                            <SidebarItem
                                icon={<FiPieChart />}
                                title="Analytics"
                                active={activeTab === 'analytics'}
                                onClick={() => {
                                    setActiveTab('analytics');
                                    setSidebarOpen(false);
                                }}
                            />
                            <SidebarItem
                                icon={<FiUsers />}
                                title="Users"
                                active={activeTab === 'users'}
                                onClick={() => {
                                    setActiveTab('users');
                                    setSidebarOpen(false);
                                }}
                            />
                            <SidebarItem
                                icon={<FiStar />}
                                title="Reviews"
                                active={activeTab === 'reviews'}
                                onClick={() => {
                                    setActiveTab('reviews');
                                    setSidebarOpen(false);
                                }}
                            />
                            <SidebarItem
                                icon={<FiGift />}
                                title="Festive Offers"
                                active={activeTab === 'offers'}
                                onClick={() => {
                                    setActiveTab('offers');
                                    setSidebarOpen(false);
                                }}
                            />
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto relative bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-gray-800/30 text-gray-900 dark:text-gray-100">
                {/* Header */}
                <header className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg z-40 border-b border-gray-900 dark:border-gray-100">
                    <div className="px-6 py-4 flex justify-between items-center bg-gradient-to-r from-transparent to-indigo-50/50 dark:to-gray-800/50">
                        <div className="flex items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="lg:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-200"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <FiMenu size={24} />
                            </motion.button>
                            <span className="font-semibold text-lg ml-3 lg:ml-0 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-indigo-700 dark:from-gray-200 dark:to-indigo-400">Admin Dashboard</span>
                        </div>
                        <div className="flex items-center space-x-5">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={refreshData}
                                className="flex items-center text-sm font-medium px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-600 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:shadow-sm transition-all duration-200"
                                disabled={loading}
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
                                onClick={toggleTheme}
                                className="p-2 rounded-lg border border-indigo-200 dark:border-indigo-600 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:shadow-sm transition-all duration-200"
                            >
                                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    localStorage.removeItem('jwtToken');
                                    navigate('/login');
                                }}
                                className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200"
                            >
                                Log out
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="p-6 md:p-8 text-gray-900 dark:text-gray-100">
                    {showNotif && notifications && notifications.length > 0 && (
                        <AdminNotification
                            message={`You have ${notifications.length} new order${notifications.length !== 1 ? 's' : ''}!`}
                            onClose={() => setShowNotif(false)}
                        />
                    )}
                    {renderTabContent()}
                </div>
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
