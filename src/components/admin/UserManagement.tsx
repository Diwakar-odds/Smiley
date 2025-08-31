import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiUserCheck, FiUserX, FiStar } from 'react-icons/fi';
import client from '../../api/client.js';

interface User {
    _id: string;
    name: string;
    email?: string;
    mobile?: string;
    role: string;
    isBlocked?: boolean;
    dateOfBirth?: string;
    createdAt: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await client.get('/users');
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId: string, currentStatus: boolean) => {
        try {
            await client.patch(`/users/${userId}`, { isBlocked: !currentStatus });
            setUsers(users.map(user =>
                user._id === userId ? { ...user, isBlocked: !currentStatus } : user
            ));
        } catch (err) {
            setError('Failed to update user status');
            console.error(err);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await client.patch(`/users/${userId}`, { role: newRole });
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));
        } catch (err) {
            setError('Failed to update user role');
            console.error(err);
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.mobile && user.mobile.includes(searchTerm))
    );

    if (loading) {
        return <div className="text-center py-10">Loading users...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-lg rounded-xl p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>

                <div className="relative">
                    <label htmlFor="user-search" className="sr-only">Search users</label>
                    <input
                        id="user-search"
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 pl-10 pr-4 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Search users"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FiUser className="text-gray-400" aria-hidden="true" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                {user.role === 'admin' ? (
                                                    <FiStar className="text-yellow-500" />
                                                ) : (
                                                    <div className="text-gray-500 font-medium">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email || 'N/A'}</div>
                                        <div className="text-sm text-gray-500">{user.mobile || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="text-sm border rounded px-2 py-1"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isBlocked
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                            }`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleBlockUser(user._id, !!user.isBlocked)}
                                            className={`flex items-center ${user.isBlocked
                                                    ? 'text-green-600 hover:text-green-900'
                                                    : 'text-red-600 hover:text-red-900'
                                                }`}
                                        >
                                            {user.isBlocked ? (
                                                <>
                                                    <FiUserCheck className="mr-1" /> Unblock
                                                </>
                                            ) : (
                                                <>
                                                    <FiUserX className="mr-1" /> Block
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default UserManagement;
