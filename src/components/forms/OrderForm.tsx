import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
}

interface OrderFormProps {
  cart: CartItem[];
  total: number;
  clearCart: () => void;
}

const OrderForm = ({ cart, total, clearCart }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || cart.length === 0) {
      alert('Please fill in all required fields and add items to cart');
      return;
    }
    // Check for JWT token in localStorage
    const jwtToken = localStorage.getItem('jwtToken');
    if (!jwtToken) {
      alert('Please login to place your order.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          items: cart,
          specialRequests: formData.specialRequests
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', phone: '', specialRequests: '' });
        clearCart();
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        alert('Failed to submit order. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-inter font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="block font-inter font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="Your phone number"
        />
      </div>

      <div>
        <label className="block font-inter font-medium text-gray-700 mb-2">
          Special Requests
        </label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          placeholder="Any special instructions or requests..."
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting || cart.length === 0}
        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-poppins font-semibold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: cart.length > 0 ? 1.02 : 1 }}
        whileTap={{ scale: cart.length > 0 ? 0.98 : 1 }}
      >
        {isSubmitting ? 'Submitting...' : `Place Order (${total.toFixed(2)})`}
      </motion.button>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg"
        >
          <p className="text-green-800 font-medium">
            🎉 Order submitted successfully! We'll contact you shortly.
          </p>
        </motion.div>
      )}
    </form>
  );
};

export default OrderForm;