import React from "react";
import { Home, Menu, Orders, Profile } from "./icons"; // Replace with your actual icons or use text

const BottomNavbar = () => (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow flex justify-around items-center h-16 z-50 md:hidden">
        <a href="/" className="flex flex-col items-center text-gray-700 hover:text-orange-500">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
        </a>
        <a href="/menu" className="flex flex-col items-center text-gray-700 hover:text-orange-500">
            <Menu className="w-6 h-6" />
            <span className="text-xs">Menu</span>
        </a>
        <a href="/orders" className="flex flex-col items-center text-gray-700 hover:text-orange-500">
            <Orders className="w-6 h-6" />
            <span className="text-xs">Orders</span>
        </a>
        <a href="/profile" className="flex flex-col items-center text-gray-700 hover:text-orange-500">
            <Profile className="w-6 h-6" />
            <span className="text-xs">Profile</span>
        </a>
    </nav>
);

export default BottomNavbar;
