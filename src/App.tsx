import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import smileyLogo from './assets/smiley-logo.png';
const LoginRegister = React.lazy(() => import('./pages/LoginRegister'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const StoreProfile = React.lazy(() => import('./pages/StoreProfile'));
const AdminMenu = React.lazy(() => import('./pages/AdminMenu'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const EnhancedAdminDashboard = React.lazy(() => import('./pages/EnhancedAdminDashboard'));
import { motion } from 'framer-motion';
import Navbar from './components/ui/Navbar';
import BottomNavbar from './components/ui/BottomNavbar';
import Hero from './components/ui/Hero';
import MenuSection from './pages/Menu';
import AboutSection from './components/ui/AboutSection';
import TestimonialsSection from './components/ui/TestimonialsSection';
import ContactSection from './components/ui/ContactSection';
import Footer from './components/ui/Footer';
import Cart from './components/ui/Cart';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
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
      <img src={smileyLogo} alt="Smiley Brand Logo" className="h-16 w-16 rounded-full shadow-lg border-2 border-orange-300 bg-white p-2 animate-spin" />
    </motion.div>
  </motion.div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    // Simulate loading for 2 seconds
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter(cartItem => cartItem._id !== item._id);
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
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          clearCart={clearCart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      )}
      <React.Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/admin/dashboard" element={<EnhancedAdminDashboard />} />
          <Route path="/admin/dashboard-old" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin/menu" element={<AdminMenu />} />
          <Route path="/store-profile" element={<StoreProfile />} />
          <Route
            path="/"
            element={
              <div className="min-h-screen">
                {/* Top Navbar for desktop */}
                <div className="hidden md:block">
                  <Navbar cart={cart} toggleCart={() => setShowCart(!showCart)} />
                </div>
                {/* Bottom Navbar for mobile */}
                <div className="md:hidden">
                  <BottomNavbar />
                </div>
                <Hero />
                <MenuSection addToCart={addToCart} />
                <AboutSection />
                <TestimonialsSection />
                <ContactSection />
                <Footer />
              </div>
            }
          />
        </Routes>
      </React.Suspense>
    </Router>
  );
};

export default App;