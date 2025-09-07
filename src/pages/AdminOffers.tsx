import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const AdminOffers = () => {
  const { user, token } = useAuth();
  const [offers, setOffers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    bannerImage: '',
    startDate: '',
    endDate: '',
    discountPercentage: '',
    storeId: user?.storeId || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(`/api/offers?storeId=${user?.storeId}`, config);
        setOffers(data);
      } catch (error) {
        setError('Failed to fetch offers.');
      }
    };

    if (user?.storeId) {
      fetchOffers();
    }
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      if (isEditing) {
        await axios.put(`/api/offers/${formData.id}`, formData, config);
        setSuccess('Offer updated successfully!');
      } else {
        await axios.post('/api/offers', formData, config);
        setSuccess('Offer created successfully!');
      }

      // Refresh offers
      const { data } = await axios.get(`/api/offers?storeId=${user?.storeId}`, config);
      setOffers(data);

      // Reset form
      setFormData({
        id: '',
        name: '',
        description: '',
        bannerImage: '',
        startDate: '',
        endDate: '',
        discountPercentage: '',
        storeId: user?.storeId || '',
      });
      setIsEditing(false);
    } catch (error) {
      setError('Failed to save offer. Please try again.');
    }
  };

  const handleEdit = (offer: any) => {
    setFormData({
      id: offer.id,
      name: offer.name,
      description: offer.description,
      bannerImage: offer.bannerImage,
      startDate: new Date(offer.startDate).toISOString().split('T')[0],
      endDate: new Date(offer.endDate).toISOString().split('T')[0],
      discountPercentage: offer.discountPercentage,
      storeId: offer.storeId,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`/api/offers/${id}`, config);
      setSuccess('Offer deleted successfully!');
      // Refresh offers
      const { data } = await axios.get(`/api/offers?storeId=${user?.storeId}`, config);
      setOffers(data);
    } catch (error) {
      setError('Failed to delete offer. Please try again.');
    }
  };

  if (!user || !user.isAdmin) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Offer' : 'Add New Offer'}</h2>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{success}</div>}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Offer Name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          <input type="text" name="bannerImage" placeholder="Banner Image URL" value={formData.bannerImage} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          <input type="number" name="discountPercentage" placeholder="Discount %" value={formData.discountPercentage} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
        </div>
        <button type="submit" className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">{isEditing ? 'Update Offer' : 'Add Offer'}</button>
        {isEditing && <button type="button" onClick={() => setIsEditing(false)} className="mt-2 w-full bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500">Cancel Edit</button>}
      </form>

      <h2 className="text-2xl font-bold mb-4">Existing Offers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">End Date</th>
              <th className="py-2 px-4 border-b">Discount</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id}>
                <td className="py-2 px-4 border-b">{offer.name}</td>
                <td className="py-2 px-4 border-b">{offer.description}</td>
                <td className="py-2 px-4 border-b">{new Date(offer.startDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{new Date(offer.endDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{offer.discountPercentage}%</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleEdit(offer)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(offer.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOffers;