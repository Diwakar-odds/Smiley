import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import client from '../../api/client';

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
}

interface MenuManagementProps {
    initialMenuItems?: MenuItem[];
}

const MenuManagement: React.FC<MenuManagementProps> = ({ initialMenuItems = [] }) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
    const [loading, setLoading] = useState<boolean>(initialMenuItems.length === 0);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Form state for new/edit item
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<MenuItem>({
        _id: '',
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: ''
    });

    // Fetch menu items if not provided
    useEffect(() => {
        if (initialMenuItems.length === 0) {
            fetchMenuItems();
        }
    }, [initialMenuItems]);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await client.get('/menu');
            setMenuItems(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch menu items');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setCurrentItem({
            _id: '',
            name: '',
            description: '',
            price: 0,
            category: '',
            imageUrl: ''
        });
        setIsEditing(false);
        setIsFormOpen(true);
    };

    const handleEdit = (item: MenuItem) => {
        setCurrentItem({ ...item });
        setIsEditing(true);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await client.delete(`/menu/${id}`);
            setMenuItems(menuItems.filter(item => item._id !== id));
        } catch (err) {
            setError('Failed to delete menu item');
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing) {
                // Update existing item
                const response = await client.put(`/menu/${currentItem._id}`, currentItem);
                setMenuItems(menuItems.map(item =>
                    item._id === currentItem._id ? response.data : item
                ));
            } else {
                // Create new item
                const response = await client.post('/menu', currentItem);
                setMenuItems([...menuItems, response.data]);
            }

            setIsFormOpen(false);
        } catch (err) {
            setError(`Failed to ${isEditing ? 'update' : 'create'} menu item`);
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem({
            ...currentItem,
            [name]: name === 'price' ? parseFloat(value) : value
        });
    };

    // Filter menu items based on search
    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && menuItems.length === 0) {
        return <div className="text-center py-10">Loading menu items...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow-lg rounded-xl p-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>

                <div className="flex space-x-2">
                    <div className="relative">
                        <label htmlFor="searchMenu" className="sr-only">Search menu items</label>
                        <input
                            id="searchMenu"
                            type="text"
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            aria-label="Search menu items"
                        />
                        <FiSearch className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
                    </div>

                    <button
                        onClick={handleAddNew}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
                        aria-label="Add new menu item"
                    >
                        <FiPlus className="mr-1" aria-hidden="true" /> Add Item
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Menu Items Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200" aria-label="Menu items table">
                    <thead>
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No menu items found
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="h-12 w-12 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{item.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                            aria-label={`Edit ${item.name}`}
                                        >
                                            <FiEdit2 className="inline mr-1" aria-hidden="true" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-600 hover:text-red-900"
                                            aria-label={`Delete ${item.name}`}
                                        >
                                            <FiTrash2 className="inline mr-1" aria-hidden="true" /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
                    >
                        <h3 className="text-lg font-bold mb-4">
                            {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="menuItemName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    id="menuItemName"
                                    type="text"
                                    name="name"
                                    value={currentItem.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="menuItemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="menuItemDescription"
                                    name="description"
                                    value={currentItem.description}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="menuItemPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                        Price (₹)
                                    </label>
                                    <input
                                        id="menuItemPrice"
                                        type="number"
                                        name="price"
                                        value={currentItem.price}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="menuItemCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="menuItemCategory"
                                        name="category"
                                        value={currentItem.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="softy">Softy</option>
                                        <option value="patties">Patties</option>
                                        <option value="shakes">Shakes</option>
                                        <option value="combos">Combos</option>
                                        <option value="corn">Corn</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="menuItemImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL (optional)
                                </label>
                                <input
                                    id="menuItemImageUrl"
                                    type="text"
                                    name="imageUrl"
                                    value={currentItem.imageUrl || ''}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-700"
                                    aria-label="Cancel form"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                                    aria-label={isEditing ? 'Save menu item changes' : 'Add new menu item'}
                                >
                                    {isEditing ? 'Save Changes' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default MenuManagement;
