import smileyLogo from '../../assets/smiley-logo.png';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { CartItem } from '../../types/cart';
import './NavBar.css';

const Navbar = ({ cart, toggleCart }: { cart: CartItem[], toggleCart: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = ['Home', 'Menu', 'About', 'Testimonials', 'Contact',];
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
          setIsAdmin(false);
        } else if (username) {
          setLoggedInUser(username);
          if (payload.isAdmin) { // Assuming isAdmin is a boolean in the JWT payload
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch {
        // Invalid token, force logout
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("username");
        setLoggedInUser("");
        setIsAdmin(false);
      }
    } else {
      setLoggedInUser("");
      setIsAdmin(false);
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#f8f8f5] backdrop-blur-md shadow-lg' : 'bg-[#f8f8f5]'} `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-2 sm:px-4 lg:px-8">
          <div className="flex items-center space-x-2">
            {/* Back button, hidden on home page */}
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate(-1)}
                className="mr-2 p-2 rounded-full hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                aria-label="Go back"
                title="Go back"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <img src={smileyLogo} alt="Smiley Brand Logo" className="navbar-logo" />
              <span className="font-poppins font-bold text-xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Smiley Food
              </span>
            </motion.div>
          </div>
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
              title="Navigation Button"
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
            aria-label="Toggle Menu"
            title="Toggle Menu"
          >
            {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden h-screen"
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-900"
              onClick={() => setIsOpen(false)}
              aria-label="Close Menu"
              title="Close Menu"
            >
              <X size={24} aria-hidden="true" />
              <span className="sr-only">Close Menu</span>
            </button>
            {isAdmin && (
              <a
                href="/admin/menu"
                className="block px-4 py-3 text-white hover:bg-orange-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Admin Menu
              </a>
            )}
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
