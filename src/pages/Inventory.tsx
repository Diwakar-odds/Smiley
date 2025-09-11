import { useState, useEffect } from 'react';
import client from '../api/client';
import { motion } from 'framer-motion';

interface InventoryItem {
  _id: string;
  mealId: {
    _id: string;
    name: string;
  };
  stock: number;
  threshold: number;
}

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await client.get<InventoryItem[]>('/inventory');
      setInventory(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (mealId: string) => {
    try {
      await client.patch(`/inventory/${mealId}`, { stock: newStockValue });
      setEditingStock(null);
      setNewStockValue(0);
      fetchInventory(); // Re-fetch to get updated data
    } catch (err) {
      setError('Failed to update stock.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading Inventory...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Inventory Management
      </motion.h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Stock</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Item Name</th>
                <th className="py-2 px-4 border-b text-left">Current Stock</th>
                <th className="py-2 px-4 border-b text-left">Threshold</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className={item.stock <= item.threshold ? 'bg-red-100' : ''}>
                  <td className="py-2 px-4 border-b">{item.mealId.name}</td>
                  <td className="py-2 px-4 border-b">
                    {editingStock === item.mealId._id ? (
                      <input title="Inventory Input"
                        type="number"
                        value={newStockValue}
                        onChange={(e) => setNewStockValue(Number(e.target.value))}
                        className="w-24 p-1 border rounded"
                      />
                    ) : (
                      item.stock
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{item.threshold}</td>
                  <td className="py-2 px-4 border-b">
                    {item.stock <= item.threshold ? (
                      <span className="text-red-600 font-semibold">Low Stock!</span>
                    ) : (
                      <span className="text-green-600">In Stock</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editingStock === item.mealId._id ? (
                      <button
                        onClick={() => handleUpdateStock(item.mealId._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingStock(item.mealId._id);
                          setNewStockValue(item.stock);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                      >
                        Edit Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;