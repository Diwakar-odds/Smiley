import React, { useState, useEffect } from 'react';
import AdminStats from '../components/admin/AdminStats';
import OrdersTable from '../components/admin/OrdersTable';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import MenuManagement from '../components/admin/MenuManagement';
import InventoryManagement from '../components/admin/InventoryManagement';
import UserManagement from '../components/admin/UserManagement';
import ReviewModeration from '../components/admin/ReviewModeration';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiGrid, FiShoppingCart, FiPieChart, FiUsers, FiList, FiPackage, FiStar } from 'react-icons/fi';
import { useOrderNotifications } from '../hooks/useOrderNotifications';

// Define MenuItem type for use with API responses
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

const EnhancedAdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'menu' | 'inventory' | 'analytics' | 'users' | 'reviews'>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Used in OrdersTable component
    const [salesOverview, setSalesOverview] = useState<SalesOverview | null>(null);
    const [customerBehavior, setCustomerBehavior] = useState<CustomerBehavior | null>(null);
    const [topItems, setTopItems] = useState<TopItem[]>([]);
    const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

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

    const refreshData = () => {
        // Re-fetch all data
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
                setError(null);
            } catch (err) {
                console.error('Dashboard refresh error:', err);
            }
        };

        fetchDashboardData();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
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
                    </>
                );
            case 'orders':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Order Management</h1>
                        <OrdersTable
                            orders={orders}
                            onSelectOrder={setSelectedOrder}
                            onRefresh={refreshData}
                        />
                    </>
                );
            case 'menu':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Menu Management</h1>
                        <MenuManagement />
                    </>
                );
            case 'inventory':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
                        <InventoryManagement />
                    </>
                );
            case 'analytics':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
                        <AdminStats
                            totalRevenue={salesOverview?.totalRevenue || 0}
                            totalOrders={salesOverview?.totalOrders || 0}
                            totalUsers={customerBehavior?.totalUsers || 0}
                            repeatCustomers={customerBehavior?.repeatCustomers || 0}
                        />
                        <AnalyticsCharts
                            topItems={topItems}
                            timeRange={timeRange}
                            onTimeRangeChange={setTimeRange}
                        />
                    </>
                );
            case 'users':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-6">User Management</h1>
                        <UserManagement />
                    </>
                );
            case 'reviews':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Review Moderation</h1>
                        <ReviewModeration />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={{ width: sidebarOpen ? '250px' : '0px' }}
                className={`bg-indigo-800 text-white h-full fixed lg:static ${sidebarOpen ? 'block' : 'hidden lg:block'
                    } lg:w-64 z-30 transition-all duration-300`}
            >
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Smiley Admin</h2>
                        <button 
                            className="lg:hidden" 
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close sidebar"
                            title="Close sidebar"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                    <div className="mt-8">
                        <ul className="space-y-2">
                            <SidebarItem
                                icon={<FiGrid />}
                                title="Dashboard"
                                active={activeTab === 'dashboard'}
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
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="px-4 py-4 flex justify-between items-center">
                        <button
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Open sidebar menu"
                            title="Open sidebar menu"
                        >
                            <FiMenu size={24} />
                        </button>
                        <div className="flex items-center space-x-4">
                            {notifications && notifications.length > 0 && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                    {notifications.length} new order{notifications.length !== 1 ? 's' : ''}
                                </span>
                            )}
                            <span className="font-medium">Admin Dashboard</span>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('jwtToken');
                                navigate('/login');
                            }}
                            className="text-sm text-gray-600 hover:text-gray-900"
                            aria-label="Log out of admin dashboard"
                            title="Log out"
                        >
                            Log out
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto">
                        {renderTabContent()}
                    </div>
                </main>
            </div>

            {/* Mobile overlay when sidebar is open */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
                    onClick={() => setSidebarOpen(false)}
                    role="presentation"
                    aria-hidden="true"
                ></div>
            )}
        </div>
    );
};

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
}) => {
    return (
        <li>
            <button
                onClick={onClick}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${active
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-100 hover:bg-indigo-700'
                    }`}
                title={`Go to ${title}`}
                aria-label={`Navigate to ${title} section`}
                aria-current={active ? 'page' : undefined}
            >
                <span className="mr-3" aria-hidden="true">{icon}</span>
                <span>{title}</span>
                {notificationCount ? (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" 
                          aria-label={`${notificationCount} new notifications`}>
                        {notificationCount}
                    </span>
                ) : null}
            </button>
        </li>
    );
};

export default EnhancedAdminDashboard;
