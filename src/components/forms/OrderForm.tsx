import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartItem } from '../../types/cart';

interface OrderFormProps {
  cart: CartItem[];
  total: number;
  clearCart: () => void;
}

const OrderForm = ({ cart, total, clearCart }: OrderFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online' | 'LAST'>('COD');
  const [lastPaymentMethod, setLastPaymentMethod] = useState<any>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
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

  // Fetch last payment method and user profile on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) return;
      
      try {
        // Fetch last payment method
        const paymentRes = await fetch('/api/payments/last', {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          setLastPaymentMethod(paymentData);
        }

        // Fetch user profile to auto-populate name and phone
        const profileRes = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setFormData(prev => ({
            ...prev,
            name: profileData.name || '',
            phone: profileData.mobile || ''
          }));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!razorpayLoaded) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    }
  }, [razorpayLoaded]);

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
        const orderRes = await fetch('/api/orders/razorpay', {
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
        let paymentMethodToSend: string | 'COD' | 'Online' = paymentMethod;
        if (paymentMethod === 'LAST' && lastPaymentMethod && lastPaymentMethod.id) {
          paymentMethodToSend = lastPaymentMethod.id;
        }
        const totalPriceNum = typeof total === 'number' ? total : Number(total);
        // Submit order with validated total
        
        if (isNaN(totalPriceNum) || totalPriceNum <= 0) {
          alert('Invalid total price. Please refresh the page and try again.');
          return;
        }
        
        const response = await fetch('/api/orders', {
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
            paymentMethod: paymentMethodToSend,
            paymentStatus,
            razorpayPaymentId,
            storeId: 2, // Use correct integer storeId
            totalPrice: totalPriceNum
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
            {(formData.name || formData.phone) && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm flex items-center">
                  <span className="mr-2">✓</span>
                  Your name and phone have been pre-filled from your profile to save time!
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="payment-method" className="block font-inter font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Payment Method</label>
                <select
                  id="payment-method"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as 'COD' | 'Online' | 'LAST')}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Online">Online Payment (Razorpay)</option>
                  {lastPaymentMethod && lastPaymentMethod.cardNumber && (
                    <option value="LAST">Use Last Payment Method (****{lastPaymentMethod.cardNumber.slice(-4)})</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block font-inter font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">
                  Name {formData.name && <span className="text-green-600 text-xs">(from your profile)</span>}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base bg-white text-gray-900"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block font-inter font-medium text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">
                  Phone {formData.phone && <span className="text-green-600 text-xs">(from your profile)</span>}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base bg-white text-gray-900"
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base bg-white text-gray-900"
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base bg-white text-gray-900"
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