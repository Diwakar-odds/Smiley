import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';

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

export default Navbar;
