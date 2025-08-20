import React, { useEffect, useState } from "react";

const Profile = () => {
    const [user, setUser] = useState<{ name: string; email?: string; mobile?: string } | null>(null);

    useEffect(() => {
        const name = localStorage.getItem("username");
        // You can extend this to fetch more user info from backend
        setUser({ name });
    }, []);

    if (!user) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="mb-2"><strong>Name:</strong> {user.name}</div>
            {user.email && <div className="mb-2"><strong>Email:</strong> {user.email}</div>}
            {user.mobile && <div className="mb-2"><strong>Mobile:</strong> {user.mobile}</div>}
            {/* Add more user info and edit options here */}
        </div>
    );
};

export default Profile;
