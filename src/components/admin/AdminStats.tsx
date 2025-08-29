import React from 'react';
import { FiUsers, FiShoppingCart, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface StatsProps {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    repeatCustomers: number;
}

const AdminStats: React.FC<StatsProps> = ({
    totalRevenue,
    totalOrders,
    totalUsers,
    repeatCustomers
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
            <StatCard
                icon={<FiDollarSign />}
                title="Total Revenue"
                value={`₹${totalRevenue?.toFixed(2) ?? '0.00'}`}
                color="from-orange-400 to-pink-500"
            />
            <StatCard
                icon={<FiShoppingCart />}
                title="Total Orders"
                value={totalOrders ?? 0}
                color="from-blue-400 to-blue-600"
            />
            <StatCard
                icon={<FiUsers />}
                title="Total Users"
                value={totalUsers ?? 0}
                color="from-green-400 to-green-600"
            />
            <StatCard
                icon={<FiRefreshCw />}
                title="Repeat Customers"
                value={repeatCustomers ?? 0}
                color="from-purple-400 to-purple-600"
            />
        </motion.div>
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
        className={`bg-gradient-to-br ${color} shadow-lg hover:shadow-xl hover:shadow-${color.split('-')[1]}-500/20 rounded-2xl p-6 flex items-center space-x-5 transition-all duration-300`}
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm text-4xl text-white drop-shadow-lg">{icon}</div>
        <div>
            <p className="text-white/80 font-medium text-sm mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
);

export default AdminStats;
