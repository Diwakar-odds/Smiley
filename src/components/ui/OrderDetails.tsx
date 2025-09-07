import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "../../types/schema";

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order Details</span>
          <Button variant="outline" size="sm" onClick={onBack}>
            Back to Orders
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Order ID: {order.id}</h3>
            <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Status: {order.status || 'N/A'}</p>
            <p className="text-sm text-gray-500">Total: ₹{order.totalPrice?.toFixed ? order.totalPrice.toFixed(2) : order.totalPrice}</p>
          </div>
          <div>
            <h3 className="font-semibold">Items</h3>
            <ul className="list-disc list-inside">
              {order.items.map((item, index) => (
                <li key={index}>
                  {(item.name || item.menuItemId || 'Unknown Item')} (x{item.quantity}) - ₹{item.price?.toFixed ? item.price.toFixed(2) : (item.price || 'N/A')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
