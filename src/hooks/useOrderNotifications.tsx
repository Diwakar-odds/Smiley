import { useEffect, useState } from "react";
import axios from "axios";

export interface OrderNotification {
    _id: string;
    customer: string;
    items: string;
    status: string;
    createdAt: string;
}

export function useOrderNotifications(token: string | null) {
    const [notifications, setNotifications] = useState<OrderNotification[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        const fetchOrders = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotifications(res.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch order notifications");
            }
        };
        fetchOrders();
        // Optionally poll every 30s for new orders
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [token]);

    return { notifications, error };
}
