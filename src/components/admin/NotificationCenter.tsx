import { useMemo, useState } from "react";
import { AdminNotification } from "../../hooks/useOrderNotifications";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationCenterProps {
  notifications: AdminNotification[];
  onAcknowledge: (notificationId: number) => Promise<void> | void;
  onResolve: (notificationId: number) => Promise<void> | void;
  loading?: boolean;
}

const tabs: Array<{ label: string; value: "all" | "new" | "escalated" | "handled" }> = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Escalated", value: "escalated" },
  { label: "Handled", value: "handled" },
];

export function NotificationCenter({ notifications, onAcknowledge, onResolve, loading }: NotificationCenterProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["value"]>("all");

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "new":
        return notifications.filter((notification) => notification.status === "new");
      case "escalated":
        return notifications.filter((notification) => notification.status === "escalated");
      case "handled":
        return notifications.filter((notification) => notification.status === "handled");
      default:
        return notifications;
    }
  }, [activeTab, notifications]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-indigo-100 dark:border-indigo-900/40 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Notification Center</h2>
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                activeTab === tab.value
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading notifications...</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
                className={`rounded-lg border p-4 flex flex-col gap-3 ${
                  notification.status === "escalated"
                    ? "border-red-400 bg-red-50/60 dark:bg-red-900/20"
                    : notification.unread
                    ? "border-indigo-400 bg-indigo-50/60 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      #{notification.orderId} · {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {notification.metadata?.items?.length ? (
                      <ul className="text-xs text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                        {notification.metadata.items.map((item) => (
                          <li key={`${notification.id}-${item.id}`}>
                            {item.name} × {item.quantity}
                          </li>)
                        )}
                      </ul>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        notification.status === "handled"
                          ? "bg-emerald-100 text-emerald-700"
                          : notification.status === "escalated"
                          ? "bg-red-100 text-red-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {notification.status.toUpperCase()}
                    </span>
                    {notification.escalationLevel > 0 ? (
                      <span className="text-[10px] text-red-600 font-semibold">
                        Escalation {notification.escalationLevel}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-3 justify-end text-sm">
                  {notification.unread && (
                    <button
                      type="button"
                      className="px-3 py-1 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
                      onClick={() => onAcknowledge(notification.id)}
                    >
                      Acknowledge
                    </button>
                  )}
                  {notification.status !== "handled" && (
                    <button
                      type="button"
                      className="px-3 py-1 rounded-md border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      onClick={() => onResolve(notification.id)}
                    >
                      Mark handled
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {!filteredNotifications.length && (
            <div className="py-6 text-center text-sm text-gray-500">
              No notifications in this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
