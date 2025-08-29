import { useState, useEffect } from "react";
import client from "../api/client";
import { motion } from "framer-motion";

interface OrderItem {
  name?: string;
  quantity: number;
  price?: number;
  menuItemId?: string;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
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
  address?: string;
  specialRequests?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  status: string;
  createdAt: string;
}


const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = localStorage.getItem("role") || "customer"; // fallback to customer

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

const fetchOrders = async () => {
  try {
    setLoading(true);
    const jwtToken = localStorage.getItem("jwtToken");
    const { data } = await client.get<Order[]>("/orders", {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    setOrders(data);
    setError(null);
  } catch (err) {
  setError("Failed to fetch orders.");
  console.error(err);
} finally {
  setLoading(false);
}
  };

const fetchMenuItems = async () => {
  try {
    const { data } = await client.get("/menu");
    setMenuItems(data);
  } catch (err) {
    console.error("Failed to fetch menu items", err);
  }
};

const handleUpdateStatus = async (orderId: string, newStatus: string) => {
  try {
    await client.put(`/orders/${orderId}/status`, { status: newStatus });
    fetchOrders(); // refresh
  } catch (err) {
    setError("Failed to update order status.");
    console.error(err);
  }
};

if (loading) return <div className="text-center py-10">Loading Orders...</div>;
if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

return (
  <div className="container mx-auto p-6">
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-3xl font-bold mb-6 text-center"
    >
      {role === "admin" ? "Order Management" : "My Orders"}
    </motion.h1>

    {role === "admin" ? (
      // ========== ADMIN TABLE VIEW ==========
      <div className="bg-white shadow-md rounded-lg p-6">
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
                  <td className="py-2 px-4 border-b">
                    {order.user.name} ({order.user.email})
                  </td>
                  <td className="py-2 px-4 border-b">
                    <ul>
                      {order.items.map((item, index) => {
                        // Try to find the menu item from the fetched menuItems
                        const menuItem = menuItems.find((m) => m._id === item.menuItemId);
                        return (
                          <li key={index}>
                            {menuItem ? (
                              <>
                                {menuItem.name} (x{item.quantity}) - ₹{menuItem.price}
                              </>
                            ) : (
                              <>
                                {item.name || "Unknown Item"} (x{item.quantity}) - ₹{item.price}
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border-b">₹{order.totalPrice}</td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      title="Order Status Selector"
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order._id, e.target.value)
                      }
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
    ) : (
      // ========== CUSTOMER CARD VIEW ==========
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <ul>
            {orders.map((order) => (
              <li
                key={order._id}
                className="mb-4 p-4 border rounded-lg shadow-sm"
              >
                <div className="font-semibold">Order ID: {order._id}</div>
                <div>Total: ₹{order.totalPrice}</div>
                <div>Status: {order.status}</div>
                <div>Address: {order.address || order.shippingAddress}</div>
                {order.specialRequests && (
                  <div>Special Requests: {order.specialRequests}</div>
                )}
                <ul className="mt-2">
                  {order.items.map((item, idx) => {
                    const menuItem = menuItems.find((m) => m._id === item.menuItemId);
                    return (
                      <li key={idx}>
                        {menuItem ? (
                          <>
                            {menuItem.name} (x{item.quantity}) - ₹{menuItem.price}
                          </>
                        ) : (
                          <>
                            {item.name || "Unknown Item"} (x{item.quantity}) - ₹{item.price}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
);
};

export default Orders;
