import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { motion } from 'framer-motion';

interface StoreProfileData {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  imageUrl: string;
}

const StoreProfile = () => {
  const [profile, setProfile] = useState<StoreProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StoreProfileData>({ // Initialize with empty strings
    _id: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    fetchStoreProfile();
  }, []);

  const fetchStoreProfile = async () => {
    try {
      setLoading(true);
      const { data } = await client.get<StoreProfileData>('/store/profile');
      setProfile(data);
      setFormData(data); // Set form data for editing
      setError(null);
    } catch (err) {
      setError('Failed to fetch store profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.put('/store/profile', formData);
      setIsEditing(false);
      fetchStoreProfile(); // Re-fetch to get updated data
    } catch (err) {
      setError('Failed to update store profile.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading Store Profile...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Store Profile
      </motion.h1>

      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 lg:p-8 w-full">
        {profile && !isEditing ? (
          <div>
            <img src={profile.imageUrl} alt={profile.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 object-cover" />
            <h2 className="text-2xl font-semibold text-center mb-2">{profile.name}</h2>
            <p className="text-center text-gray-600 mb-4">{profile.description}</p>
            <div className="space-y-2">
              <p><strong>Address:</strong> {profile.address}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Email:</strong> {profile.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-900"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StoreProfile;