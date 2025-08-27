import React, { useState } from 'react';
import client from '../../api/client.js';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiEdit } from 'react-icons/fi';

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

interface OrdersTableProps {
    orders: Order[];
    onSelectOrder: (order: Order) => void;
    onRefresh: () => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onSelectOrder, onRefresh }) => {
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');

    const handleStatusChange = async (orderId: string, status: string) => {
        try {
            setUpdatingStatus(orderId);
            await client.patch(`/orders/${orderId}`, { status });
            setNewStatus('');
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
            className="bg-white shadow-lg rounded-xl p-6 mb-8 overflow-x-auto"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders found</p>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order._id.slice(-6)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.user?.name || 'Anonymous'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {updatingStatus === order._id ? (
                                        <div className="flex items-center space-x-2">
                                            <select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                                className="text-sm border rounded px-2 py-1"
                                                aria-label="Change order status"
                                            >
                                                <option value="">Select Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            <button
                                                onClick={() => handleStatusChange(order._id, newStatus)}
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
                        px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                                                {order.status || 'Unknown'}
                                            </span>
                                            <button
                                                className="ml-2 text-gray-400 hover:text-blue-600"
                                                onClick={() => {
                                                    setUpdatingStatus(order._id);
                                                    setNewStatus(order.status);
                                                }}
                                                aria-label="Edit order status"
                                            >
                                                <FiEdit size={14} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ₹{order.totalPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => onSelectOrder(order)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                        aria-label="View order details"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </motion.div>
    );
};

export default OrdersTable;
