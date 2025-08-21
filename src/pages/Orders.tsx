import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Order[]>('/api/orders');
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // Re-fetch to get updated data
    } catch (err) {
      setError('Failed to update order status.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading Orders...</div>;
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
        Order Management
      </motion.h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">All Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Order ID</th>
                <th className="py-2 px-4 border-b text-left">Customer</th>
                <th className="py-2 px-4 border-b text-left">Items</th>
                <th className="py-2 px-4 border-b text-left">Total</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border-b">{order._id}</td>
                  <td className="py-2 px-4 border-b">{order.user.name} ({order.user.email})</td>
                  <td className="py-2 px-4 border-b">
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>{item.name} (x{item.quantity}) - ₹{item.price}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border-b">₹{order.totalPrice}</td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;