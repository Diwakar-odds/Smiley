import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartItem } from '../../types/cart';

interface OrderFormProps {
  cart: CartItem[];
  total: number;
  clearCart: () => void;
}

const OrderForm = ({ cart, total, clearCart }: OrderFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  React.useEffect(() => {
    if (!razorpayLoaded) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    }
  }, [razorpayLoaded]);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-close modal on route change
  useEffect(() => {
    setShowDetailsForm(false);
  }, [location.pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Please add items to cart');
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
    let paymentStatus: string = 'Pending';
    let razorpayPaymentId: string = '';
    try {
      if (paymentMethod === 'Online') {
        if (!razorpayLoaded) {
          alert('Razorpay is not loaded yet. Please wait.');
          setIsSubmitting(false);
          return;
        }
        // Create order on backend for Razorpay
        const orderRes = await fetch('http://localhost:5000/api/orders/razorpay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify({ amount: total * 100 }) // Razorpay expects amount in paise
        });
        const orderData: { id?: string; amount?: number } = await orderRes.json();
        if (!orderRes.ok || !orderData.id) {
          alert('Failed to initiate payment.');
          setIsSubmitting(false);
          return;
        }
        // Open Razorpay modal
        const options = {
          key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key
          amount: orderData.amount,
          currency: 'INR',
          name: 'Smiley Food',
          description: 'Order Payment',
          order_id: orderData.id,
          handler: async function (response: { razorpay_payment_id: string;[key: string]: unknown }) {
            paymentStatus = 'Paid';
            razorpayPaymentId = response.razorpay_payment_id;
            await submitOrder(paymentStatus, razorpayPaymentId);
            setShowDetailsForm(false);
          },
          prefill: {
            name: formData.name,
            contact: formData.phone,
          },
          theme: { color: '#F59E42' },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            }
          }
        };
        // @ts-expect-error: Razorpay is not typed in window object
        const rzp = new window.Razorpay(options);
        rzp.open();
        // Don't set isSubmitting false here, let modal handle it
        return;
      } else {
        paymentStatus = 'COD';
        await submitOrder(paymentStatus, razorpayPaymentId);
        setShowDetailsForm(false);
      }
    } catch {
      alert('Order submission failed.');
    }
    setIsSubmitting(false);

    async function submitOrder(paymentStatus: string, razorpayPaymentId: string) {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify({
            items: cart.map(item => ({ menuItemId: item.id, quantity: item.quantity })),
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            specialRequests: formData.specialRequests,
            paymentMethod,
            paymentStatus,
            razorpayPaymentId,
            storeId: "00000000-0000-0000-0000-000000000001", // Default storeId, replace as needed
            totalPrice: total
          }),
        });

        if (response.ok) {
          setShowSuccess(true);
          setFormData({ name: '', phone: '', address: '', specialRequests: '' });
          clearCart();
          setTimeout(() => setShowSuccess(false), 5000);
        } else {
          await response.json(); // Read the error response but don't use it
          alert('Failed to submit order. Please try again.');
        }
      } catch {
        alert('Failed to submit order. Please try again.');
      }
    }
  };

  return (
    <div>
      <motion.button
        type="button"
  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-poppins font-semibold py-3 sm:py-4 rounded-lg mb-3 sm:mb-4 text-base sm:text-lg"
        onClick={() => setShowDetailsForm(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Enter Delivery Details
      </motion.button>

      {showDetailsForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md relative"
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
              onClick={() => setShowDetailsForm(false)}
              tabIndex={0}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="payment-method" className="block font-inter font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Payment Method</label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as 'COD' | 'Online')}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Online">Online Payment (Razorpay)</option>
                </select>
              </div>
              <div>
                <label className="block font-inter font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block font-inter font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div>
                <label className="block font-inter font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="Enter your address"
                  required
                />
              </div>
              <div>
                <label className="block font-inter font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                  placeholder="Any special instructions or requests..."
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-poppins font-semibold py-3 sm:py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
                whileHover={{ scale: cart.length > 0 ? 1.02 : 1 }}
                whileTap={{ scale: cart.length > 0 ? 0.98 : 1 }}
              >
                {isSubmitting ? 'Submitting...' : `Place Order (${total.toFixed(2)})`}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-100 border border-green-300 rounded-lg text-sm sm:text-base"
        >
          <p className="text-green-800 font-medium">
            🎉 Order submitted successfully! We'll contact you shortly.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default OrderForm;