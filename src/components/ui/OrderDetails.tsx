import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "../../types/schema";
import { motion } from "framer-motion";

interface Order {
  id: number;           // Changed from _id: string
  createdAt: string;
  status?: OrderStatus; // ✅ Now using typed enum instead of string
  totalPrice: number;
  items: { name?: string; quantity: number; price?: number; menuItemId?: number }[];  // Changed menuItemId to number
}

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="shadow-2xl hover:shadow-3xl transition-shadow duration-300 rounded-3xl border-0 bg-white/80 backdrop-blur-2xl animate-fadein w-full">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl py-4 px-8 shadow-xl">
        <CardTitle className="flex items-center justify-between text-white text-2xl font-extrabold tracking-tight">
          <span>Order #{order.id}</span>
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
            <h3 className="text-xl font-bold text-orange-700 mb-4">Order Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Order Date</p>
                <p className="text-lg font-semibold text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                  order.status === 'completed' ? 'bg-green-200 text-green-800' :
                  order.status === 'accepted' ? 'bg-yellow-200 text-yellow-800' :
                  order.status === 'rejected' ? 'bg-red-200 text-red-800' :
                  order.status === 'pending' ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {order.status || 'pending'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-pink-600">₹{order.totalPrice?.toFixed ? order.totalPrice.toFixed(2) : order.totalPrice}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gradient-to-r from-orange-100 via-pink-100 to-red-100 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-orange-700 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white/60 rounded-lg p-4 shadow backdrop-blur-sm">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name || `Item #${item.menuItemId}` || 'Unknown Item'}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600">₹{item.price?.toFixed ? item.price.toFixed(2) : (item.price || 'N/A')}</p>
                    <p className="text-sm text-gray-500">per item</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default OrderDetails;
