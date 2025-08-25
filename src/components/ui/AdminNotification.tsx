import React from "react";

interface AdminNotificationProps {
    message: string;
    onClose?: () => void;
}

const AdminNotification: React.FC<AdminNotificationProps> = ({ message, onClose }) => (
    <div className="fixed top-6 right-6 z-50 bg-orange-100 border border-orange-400 rounded-lg shadow-lg px-6 py-4 flex items-center gap-3 animate-slide-in">
        <span className="text-orange-700 font-semibold">{message}</span>
        {onClose && (
            <button
                className="ml-4 px-2 py-1 rounded bg-orange-400 text-white hover:bg-orange-500 transition"
                onClick={onClose}
            >
                Close
            </button>
        )}
    </div>
);

export default AdminNotification;
