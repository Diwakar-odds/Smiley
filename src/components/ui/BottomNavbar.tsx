import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Menu, Orders, Profile } from "./icons"; // Replace with your actual icons or use text

const navItems = [
    { to: "/", label: "Home", icon: Home, match: ["/"] },
    { to: "/menu", label: "Menu", icon: Menu, match: ["/menu"] },
    { to: "/orders", label: "Orders", icon: Orders, match: ["/orders"] },
    { to: "/profile", label: "Profile", icon: Profile, match: ["/profile"] },
];

const BottomNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow flex justify-around items-center h-20 z-50 md:hidden">
            {/* Back button, hidden on home page */}
            {location.pathname !== '/' && (
                <button
                    onClick={() => navigate(-1)}
                    className="flex flex-col items-center justify-center transition-colors duration-200 rounded-lg px-4 py-2 min-w-[64px] min-h-[56px] active:scale-95 text-gray-700 hover:text-orange-500"
                    aria-label="Go back"
                    title="Go back"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="text-xs">Back</span>
                </button>
            )}
            {navItems.map(({ to, label, icon: Icon, match }) => {
                const isActive = match.some((m) => location.pathname === m || location.pathname.startsWith(m + "/"));
                return (
                    <Link
                        key={to}
                        to={to}
                        className={`flex flex-col items-center justify-center transition-colors duration-200 rounded-lg px-4 py-2 min-w-[64px] min-h-[56px] active:scale-95 ${
                            isActive ? "text-orange-500 bg-orange-50" : "text-gray-700 hover:text-orange-500"
                        }`}
                        style={{ touchAction: 'manipulation' }}
                    >
                        <Icon className={`w-7 h-7 mb-1 ${isActive ? "scale-110" : ""}`} />
                        <span className={`text-sm ${isActive ? "font-semibold" : ""}`}>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNavbar;
