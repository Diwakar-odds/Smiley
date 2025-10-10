import React, { useState } from 'react';
import client from '../../api/client.js';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiEdit } from 'react-icons/fi';
import { OrderStatus } from '../../types/schema';

interface Order {
    id: number;
    user: {
        name: string;
        id: number;
    };
    User?: {
        name?: string;
        id?: number;
        email?: string;
    };
    name?: string;
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

interface OrdersTableProps {
    orders: Order[];
    onSelectOrder: (order: Order) => void;
    onRefresh: () => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onSelectOrder, onRefresh }) => {
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus>('pending'); // ✅ Using OrderStatus type

    const handleStatusChange = async (orderId: number, status: OrderStatus) => { // ✅ Using OrderStatus type
        try {
            setUpdatingStatus(orderId);
            await client.put(`/orders/${orderId}/status`, { status });
            setNewStatus('pending'); // Reset to default OrderStatus value
            onRefresh(); // Refresh orders after update
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status. Please try again.');
        } finally {
            setUpdatingStatus(null);
        }
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-white to-indigo-50 shadow-xl rounded-2xl p-6 mb-8 overflow-x-auto border border-indigo-100/40"
        >
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 mb-6">Recent Orders</h2>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders found</p>
            ) : (
                <table className="min-w-full divide-y divide-indigo-100 rounded-xl overflow-hidden">
                    <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-indigo-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <motion.tr 
                                key={order.id} 
                                className="hover:bg-indigo-50/50 transition-all duration-150"
                                whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.06)" }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-mono text-sm font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md">
                                        #{order.id}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                    {order.user?.name || order.User?.name || order.name || 'Anonymous'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {updatingStatus === order.id ? (
                                        <div className="flex items-center space-x-2">
                                            <select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                                                className="text-sm border rounded px-2 py-1"
                                                aria-label="Change order status"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="completed">Completed</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            <button
                                                onClick={() => handleStatusChange(order.id, newStatus)}
                                                className="text-green-500 hover:text-green-700"
                                                aria-label="Save status change"
                                            >
                                                <FiCheck />
                                            </button>
                                            <button
                                                onClick={() => setUpdatingStatus(null)}
                                                className="text-red-500 hover:text-red-700"
                                                aria-label="Cancel status change"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <span className={`
                        px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm
                                        ${order.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white' : ''}
                        ${order.status === 'accepted' ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white' : ''}
                        ${order.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : ''}
                        ${order.status === 'rejected' ? 'bg-gradient-to-r from-red-400 to-rose-500 text-white' : ''}
                      `}>
                                                {order.status || 'Unknown'}
                                            </span>
                                            <button
                                                className="ml-2 text-gray-400 hover:text-blue-600"
                                                onClick={() => {
                                                    setUpdatingStatus(order.id);
                                                    setNewStatus(order.status);
                                                }}
                                                aria-label="Edit order status"
                                            >
                                                <FiEdit size={14} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-semibold text-gray-800">₹{Number(order.totalPrice).toFixed(2)}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onSelectOrder(order)}
                                        className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium rounded-md shadow hover:shadow-md transition-all duration-200"
                                        aria-label="View order details"
                                    >
                                        View Details
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            )}
        </motion.div>
    );
};

export default OrdersTable;
