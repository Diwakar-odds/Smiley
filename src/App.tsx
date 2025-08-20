import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginRegister from './LoginRegister';
import Profile from './Profile';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart, Phone, MapPin, Clock, Star, Users, Award, Smile } from 'lucide-react';



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

const LoadingSpinner = () => (
  <motion.div
    className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-400 via-pink-400 to-yellow-400"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      animate={{
        y: [-20, -40, -20],
        rotate: [0, 360, 720]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="text-6xl"
    >
      😊
    </motion.div>
  </motion.div>
);

const Navbar = ({ cart, toggleCart }: { cart: CartItem[], toggleCart: () => void }) => {
  const navigate = useNavigate();
  const navItems = ['Home', 'Menu', 'About', 'Testimonials', 'Contact',];
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      // Decode JWT and check expiry
      try {
        const payload = JSON.parse(atob(jwtToken.split('.')[1]));
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          // Token expired
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("username");
          setLoggedInUser("");
        } else if (username) {
          setLoggedInUser(username);
        }
      } catch {
        // Invalid token, force logout
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
        setLoggedInUser("");
      }
    } else {
      setLoggedInUser("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    setLoggedInUser("");
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#f8f8f5] backdrop-blur-md shadow-lg' : 'bg-[#f8f8f5]'} `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">😊</span>
            <span className="font-poppins font-bold text-xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Smiley Food
            </span>
          </motion.div>
          {/* <motion.button
            onClick={() => navigate('/login')}
            className="ml-4 px-6 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button> */}

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200"
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.toLowerCase());
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item}
              </motion.a>
            ))}
            <motion.button
              onClick={toggleCart}
              className="relative p-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </motion.button>
            {loggedInUser ? (
              <>
                <span className="ml-4 px-6 py-2 rounded-full bg-green-500 text-white font-semibold shadow cursor-pointer" onClick={() => navigate('/profile')}>{loggedInUser}</span>
                <motion.button
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-full bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => navigate('/login')}
                className="ml-4 px-6 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white rounded-b-lg shadow-lg flex flex-col"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  const element = document.getElementById(item.toLowerCase());
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item}
              </a>
            ))}
            <div className="px-4 py-3">
              <motion.button
                onClick={toggleCart}
                className="relative p-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full w-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </motion.button>
            </div>
            <div className="px-4 py-3">
              {loggedInUser ? (
                <>
                  <span className="block w-full text-center px-6 py-2 rounded-full bg-green-500 text-white font-semibold shadow cursor-pointer" onClick={() => navigate('/profile')}>{loggedInUser}</span>
                  <motion.button
                    onClick={handleLogout}
                    className="mt-2 w-full px-4 py-2 rounded-full bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => navigate('/login')}
                  className="w-full px-6 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

const Hero = () => (
  <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
    <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover opacity-40" />
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-white/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>

    <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <span className="text-8xl">😊</span>
      </motion.div>

      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-poppins font-bold text-5xl md:text-7xl mb-6 opacity-100 text-black"
      >
        Smiley Food
      </motion.h1>

      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="font-inter text-xl md:text-2xl mb-8 opacity-100 text-black"
      >
        Delicious Softy, Juicy Patties, Refreshing Shakes!
      </motion.p>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        className="bg-white text-orange-500 font-poppins font-semibold px-8 py-4 rounded-full text-[1.5rem] shadow-lg"
        onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Order Now
      </motion.button>
    </div>
  </section>
);

const MenuSection = ({ menuItems, addToCart }: { menuItems: MenuItem[], addToCart: (item: MenuItem) => void }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'softy', name: 'Softy', icon: '🍦' },
    { id: 'patties', name: 'Patties', icon: '🥟' },
    { id: 'shakes', name: 'Shakes', icon: '🥤' },
  ];

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Our Menu
          </h2>
          <p className="font-inter text-gray-600 text-lg">
            Choose from our delicious selection of treats
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === category.id
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-100'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="font-poppins font-semibold text-xl mb-2 text-gray-800">
                  {item.name}
                </h3>
                <p className="font-inter text-gray-600 mb-4 text-sm">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-poppins font-bold text-2xl text-orange-500">
                    ₹{item.price}
                  </span>
                  <motion.button
                    onClick={() => addToCart(item)}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section id="about" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Our Story
          </h2>
          <p className="font-inter text-gray-600 text-lg mb-6 leading-relaxed">
            At Smiley Food, we believe that great food brings smiles to faces. Since our founding, we've been dedicated to creating the most delicious soft serves, crispy patties, and refreshing shakes that make every moment special.
          </p>
          <p className="font-inter text-gray-600 text-lg mb-8 leading-relaxed">
            Our commitment to quality ingredients and innovative recipes has made us a favorite among students, families, and food lovers everywhere. Every bite is crafted with love and served with a smile!
          </p>

          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Users, number: '10K+', label: 'Happy Customers' },
              { icon: Award, number: '50+', label: 'Menu Items' },
              { icon: Smile, number: '99%', label: 'Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="text-orange-500" size={28} />
                </div>
                <div className="font-poppins font-bold text-2xl text-gray-800 mb-1">
                  {stat.number}
                </div>
                <div className="font-inter text-gray-600 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <img
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
            alt="Our kitchen"
            className="rounded-2xl shadow-2xl w-full"
          />
          <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
            <div className="text-3xl mb-2">😊</div>
            <div className="font-poppins font-semibold">Fresh & Delicious</div>
            <div className="font-inter text-sm opacity-90">Made with love</div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "The best ice cream in town! The soft serves are incredibly creamy and the patties are always crispy and fresh.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      name: "Mike Chen",
      rating: 5,
      text: "Amazing shakes and great service! My kids absolutely love coming here for their favorite treats.",
      image: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      name: "Emily Davis",
      rating: 5,
      text: "Smiley Food never fails to make me smile! The variety and quality are outstanding. Highly recommended!",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-pink-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            What Our Customers Say
          </h2>
          <p className="font-inter text-gray-600 text-lg">
            Don't just take our word for it
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-poppins font-semibold text-gray-800">
                    {testimonial.name}
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-inter text-gray-600 italic">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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

const Footer = () => (
  <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-3xl">😊</span>
            <span className="font-poppins font-bold text-2xl">Smiley Food</span>
          </div>
          <p className="font-inter text-gray-300 mb-4">
            Bringing smiles to your taste buds with the freshest and most delicious treats in town.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-poppins font-semibold text-lg mb-4">Quick Links</h4>
          <div className="space-y-2">
            {['Home', 'Menu', 'About', 'Contact'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="block font-inter text-gray-300 hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="font-poppins font-semibold text-lg mb-4">Contact</h4>
          <div className="space-y-2 font-inter text-gray-300">
            <p>123 Food Street</p>
            <p>Taste City, TC 12345</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>

        {/* Social Links & App Store */}
        <div>
          <h4 className="font-poppins font-semibold text-lg mb-3">Social Links</h4>
          <div className="flex space-x-3 mb-4">
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="LinkedIn"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" className="w-6 h-6" /></a>
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="Instagram"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/instagram/instagram-original.svg" alt="Instagram" className="w-6 h-6" /></a>
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="YouTube"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/youtube/youtube-original.svg" alt="YouTube" className="w-6 h-6" /></a>
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="Facebook"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" className="w-6 h-6" /></a>
            <a href="#" className="bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors" aria-label="X"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg" alt="X" className="w-6 h-6" /></a>
          </div>
          <div className="flex flex-col gap-3 items-start">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-10" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-10" />
            </a>
          </div>
        </div>

        {/* Social Links & App Store */}
        <div>
          <h4 className="font-poppins font-semibold text-lg mb-3">Social Links</h4>
          <div className="flex space-x-3 mb-4">
            {/* Add your social icons here */}
          </div>
          <div className="flex flex-col gap-3 items-start">
            {/* App Store buttons here */}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu');
        const data = await response.json();
        if (data.success) {
          setMenuItems(data.data.all);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        // Fallback menu data if backend is not available
        setMenuItems([]);
      }
      setTimeout(() => setIsLoading(false), 2000);
    };

    fetchMenu();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/"
          element={
            <div className="min-h-screen">
              <Navbar cart={cart} toggleCart={() => setShowCart(!showCart)} />
              <Hero />
              <MenuSection menuItems={menuItems} addToCart={addToCart} />
              <AboutSection />
              <TestimonialsSection />
              <ContactSection cart={cart} clearCart={clearCart} />
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );

  return (
    <div className="min-h-screen">
      <Navbar cart={cart} toggleCart={() => setShowCart(!showCart)} />
      <Hero />
      <MenuSection menuItems={menuItems} addToCart={addToCart} />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection cart={cart} clearCart={clearCart} />
      {/* Download App Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 mb-8 rounded-3xl bg-gradient-to-br from-pink-50 to-white flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="flex-1 text-center md:text-left mb-8 md:mb-0">
          <h2 className="font-poppins font-bold text-3xl mb-4 text-gray-900">Download the app now!</h2>
          <p className="font-inter text-lg text-gray-700 mb-6">Experience seamless online ordering only on the Smiley Food app</p>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-12" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-12" />
            </a>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center">
            <span className="font-inter text-gray-700 mb-2">Scan the QR code to download the app</span>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://your-app-link.com" alt="QR Code" className="w-36 h-36" />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default App;