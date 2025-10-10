import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import client from "../api/client";

export type AdminNotificationStatus = "new" | "acknowledged" | "handled" | "escalated";

export interface AdminNotificationMetadataItem {
    id: number;
    name: string;
    quantity: number;
}

export interface AdminNotificationMetadata {
    orderId: number;
    customer?: string;
    totalPrice: number;
    createdAt: string;
    items: AdminNotificationMetadataItem[];
}

export interface AdminNotification {
    id: number;
    orderId: number;
    message: string;
    status: AdminNotificationStatus;
    unread: boolean;
    escalationLevel: number;
    readAt?: string | null;
    handledAt?: string | null;
    escalatedAt?: string | null;
    metadata?: AdminNotificationMetadata;
    createdAt: string;
    updatedAt: string;
}

const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL ?? "/api";

function upsertNotification(
    current: AdminNotification[],
    incoming: AdminNotification
): AdminNotification[] {
    const existingIndex = current.findIndex((item) => item.id === incoming.id);
    if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = { ...updated[existingIndex], ...incoming };
        return updated;
    }
    return [incoming, ...current].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function useOrderNotifications(token: string | null) {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const { data } = await client.get<AdminNotification[]>("/notifications", {
                params: {
                    limit: 100,
                },
            });
            setNotifications(
                data.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
            );
            setError(null);
        } catch (err) {
            console.error("Failed to fetch admin notifications", err);
            setError("Failed to fetch order notifications");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            setNotifications([]);
            return undefined;
        }

        fetchNotifications();

        if (typeof window === "undefined" || !("EventSource" in window)) {
            return undefined;
        }

            const url = `${API_BASE_URL.replace(/\/$/, "")}/notifications/stream?token=${encodeURIComponent(
                token
            )}`;
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        const handleMessage = (event: MessageEvent) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload?.notification) {
                    setNotifications((current) =>
                        upsertNotification(current, payload.notification)
                    );
                }
            } catch (parseError) {
                console.error("Failed to parse SSE payload", parseError);
            }
        };

        const newListener = (event: MessageEvent) => handleMessage(event);
        const updateListener = (event: MessageEvent) => handleMessage(event);

        eventSource.addEventListener("notification:new", newListener);
        eventSource.addEventListener("notification:update", updateListener);

        eventSource.onerror = (evt) => {
            console.warn("Order notification stream error", evt);
            eventSource.close();
            eventSourceRef.current = null;
            setTimeout(() => {
                if (token) {
                    fetchNotifications();
                }
            }, 3000);
        };

        return () => {
            eventSource.removeEventListener("notification:new", newListener);
            eventSource.removeEventListener("notification:update", updateListener);
            eventSource.close();
            eventSourceRef.current = null;
        };
    }, [token, fetchNotifications]);

    const markAsRead = useCallback(
        async (notificationId: number) => {
            try {
                await client.patch(`/notifications/${notificationId}/read`);
                setNotifications((current) =>
                    current.map((notification) =>
                        notification.id === notificationId
                            ? {
                                    ...notification,
                                    unread: false,
                                    status:
                                        notification.status === "new"
                                            ? "acknowledged"
                                            : notification.status,
                                }
                            : notification
                    )
                );
            } catch (err) {
                console.error("Failed to mark notification as read", err);
                throw err;
            }
        },
        []
    );

    const markAsHandled = useCallback(async (notificationId: number) => {
        try {
            await client.patch(`/notifications/${notificationId}/handled`);
            setNotifications((current) =>
                current.map((notification) =>
                    notification.id === notificationId
                        ? {
                                ...notification,
                                unread: false,
                                status: "handled",
                            }
                        : notification
                )
            );
        } catch (err) {
            console.error("Failed to mark notification as handled", err);
            throw err;
        }
    }, []);

    const unreadCount = useMemo(
        () => notifications.filter((notification) => notification.unread).length,
        [notifications]
    );

    return {
        notifications,
        unreadCount,
        error,
        loading,
        markAsRead,
        markAsHandled,
        refresh: fetchNotifications,
    };
}
