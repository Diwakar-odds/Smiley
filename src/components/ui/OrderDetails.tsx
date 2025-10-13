import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { OrderStatus, OrderItem } from "../../types/schema";
import { motion } from "framer-motion";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  OrderItem?: {
    quantity: number;
    price: number;
  };
}

interface Order {
  id: number;
  items?: OrderItem[];
  MenuItems?: MenuItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onBack }) => {
  // Debug logging to see what data we're receiving
  console.log('OrderDetails received order:', order);
  console.log('Order items:', order.items);
  console.log('Order MenuItems:', (order as any).MenuItems);
  console.log('OrderItems extracted:', order.items || (order as any).MenuItems || []);
  
  // Add safety check for order object
  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-xl">
        <div className="text-center">
          <p className="text-lg text-gray-900">Order not found</p>
          <Button onClick={onBack} className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  // Safely extract order data with fallbacks
  const orderId = order.id || 'N/A';
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const orderStatus = order.status || 'pending';
  const orderTotal = order.totalPrice || 0;
  // Handle both possible data structures: items array or MenuItems from Sequelize
  const orderItems = order.items || (order as any).MenuItems || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="shadow-2xl hover:shadow-3xl transition-shadow duration-300 rounded-3xl border-0 bg-white backdrop-blur-2xl animate-fadein w-full text-gray-900">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl py-4 px-8 shadow-xl">
        <CardTitle className="flex items-center justify-between text-white text-2xl font-extrabold tracking-tight">
          <span>Order #{orderId}</span>
          <Button 
            className="bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold shadow-md hover:scale-110 active:scale-95 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-transform duration-200"
            size="sm" 
            onClick={onBack}
          >
            Back to Orders
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 sm:p-10 lg:p-12">
        <div className="space-y-6">
          {/* Order Information */}
          <div className="bg-gradient-to-r from-orange-100 via-pink-100 to-red-100 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Order Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Order Date</p>
                <p className="text-lg font-semibold text-gray-900">{orderDate.toLocaleDateString()}</p>
                <p className="text-sm text-gray-700">{orderDate.toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                  orderStatus === 'completed' ? 'bg-green-200 text-green-800' :
                  orderStatus === 'accepted' ? 'bg-yellow-200 text-yellow-800' :
                  orderStatus === 'rejected' ? 'bg-red-200 text-red-800' :
                  orderStatus === 'pending' ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {orderStatus}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-400">
              <p className="text-sm font-medium text-gray-700">Total Amount</p>
              <p className="text-3xl font-bold text-pink-700">₹{orderTotal.toFixed ? orderTotal.toFixed(2) : orderTotal}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gradient-to-r from-orange-100 via-pink-100 to-red-100 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-orange-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              {orderItems && orderItems.length > 0 ? (
                orderItems.map((item: OrderItem | MenuItem, index: number) => {
                  // Handle both data structures
                  const itemName = ('name' in item) ? item.name : `Item #${('menuItemId' in item) ? item.menuItemId : 'Unknown'}`;
                  const itemQuantity = ('quantity' in item) ? item.quantity : (item as MenuItem).OrderItem?.quantity || 0;
                  const itemPrice = ('price' in item) ? item.price : (item as MenuItem).OrderItem?.price || 0;
                  
                  return (
                    <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4 shadow backdrop-blur-sm">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{itemName}</p>
                        <p className="text-sm text-gray-700">Quantity: {itemQuantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-700">₹{typeof itemPrice === 'number' ? itemPrice.toFixed(2) : itemPrice}</p>
                        <p className="text-sm text-gray-700">per item</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-700 py-4">
                  No items found in this order
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default OrderDetails;
