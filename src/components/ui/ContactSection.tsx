import { motion } from 'framer-motion';
import { Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const ContactSection = ({ cart, clearCart }: { cart: CartItem[], clearCart: () => void }) => {
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

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Place Your Order
          </h2>
          <p className="font-inter text-gray-600 text-lg">
            Get your delicious treats delivered fresh!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-8 rounded-2xl">
              <h3 className="font-poppins font-semibold text-2xl mb-6 text-gray-800">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="text-orange-500 mr-4" size={24} />
                  <span className="font-inter text-gray-700">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-orange-500 mr-4" size={24} />
                  <span className="font-inter text-gray-700">Kanpur Institute of Technology</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-orange-500 mr-4" size={24} />
                  <span className="font-inter text-gray-700">Mon-sat: 10AM - 5PM</span>
                </div>
              </div>

              {cart.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-poppins font-semibold text-xl mb-4 text-gray-800">
                    Your Order
                  </h4>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-inter text-gray-700">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-poppins font-semibold text-orange-500">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-poppins font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-orange-500">₹{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
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
                {isSubmitting ? 'Submitting...' : `Place Order ${cart.length > 0 ? `(${totalPrice.toFixed(2)})` : ''}`}
              </motion.button>
            </form>

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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
