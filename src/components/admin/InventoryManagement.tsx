import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import client from '../../api/client';

interface InventoryItem {
    _id: string;
    mealId: {
        _id: string;
        name: string;
    };
    stock: number;
    threshold: number;
}

const InventoryManagement: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [newStockValue, setNewStockValue] = useState<number>(0);
    const [newThresholdValue, setNewThresholdValue] = useState<number>(0);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const { data } = await client.get('/inventory');
            setInventory(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch inventory data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateInventory = async (itemId: string) => {
        try {
            await client.patch(`/inventory/${itemId}`, {
                stock: newStockValue,
                threshold: newThresholdValue
            });
            setEditingItem(null);
            fetchInventory(); // Refresh data
        } catch (err) {
            setError('Failed to update inventory');
            console.error(err);
        }
    };

    const getLowStockItems = () => {
        return inventory.filter(item => item.stock <= item.threshold);
    };

    const lowStockItems = getLowStockItems();

    if (loading) {
        return <div className="text-center py-10">Loading inventory data...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-lg rounded-xl p-6"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h2>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                                Low Stock Alert
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    {lowStockItems.map(item => (
                                        <li key={item._id}>
                                            <strong>{item.mealId.name}</strong>: {item.stock} left (below threshold of {item.threshold})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200" aria-label="Inventory items table">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Stock Threshold</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No inventory items found
                                </td>
                            </tr>
                        ) : (
                            inventory.map((item) => {
                                const isLowStock = item.stock <= item.threshold;

                                return (
                                    <tr key={item._id} className={isLowStock ? 'bg-yellow-50' : ''}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.mealId.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {editingItem === item._id ? (
                                                <input
                                                    type="number"
                                                    value={newStockValue}
                                                    onChange={(e) => setNewStockValue(Number(e.target.value))}
                                                    className="w-20 px-2 py-1 border rounded"
                                                    min="0"
                                                    aria-label={`New stock value for ${item.mealId.name}`}
                                                />
                                            ) : (
                                                <span className={isLowStock ? 'font-bold text-red-600' : ''}>
                                                    {item.stock}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {editingItem === item._id ? (
                                                <input
                                                    type="number"
                                                    value={newThresholdValue}
                                                    onChange={(e) => setNewThresholdValue(Number(e.target.value))}
                                                    className="w-20 px-2 py-1 border rounded"
                                                    min="0"
                                                    aria-label={`New threshold value for ${item.mealId.name}`}
                                                />
                                            ) : (
                                                item.threshold
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isLowStock
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {isLowStock ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {editingItem === item._id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateInventory(item._id)}
                                                        className="text-green-600 hover:text-green-900 mr-3"
                                                        aria-label="Save inventory changes"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingItem(null)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                        aria-label="Cancel inventory changes"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingItem(item._id);
                                                        setNewStockValue(item.stock);
                                                        setNewThresholdValue(item.threshold);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    aria-label={`Update stock for ${item.mealId.name}`}
                                                >
                                                    Update Stock
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default InventoryManagement;
