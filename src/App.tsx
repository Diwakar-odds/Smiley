import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import smileyLogo from './assets/smiley-logo.png';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import { performanceMonitor } from './services/performanceMonitor';
import { logger } from './services/logger';
import { CartItem, MenuItemData } from './types/cart';
import pushNotificationService from './services/pushNotificationService';
const LoginRegister = React.lazy(() => import('./pages/LoginRegister'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const StoreProfile = React.lazy(() => import('./pages/StoreProfile'));
const AdminMenu = React.lazy(() => import('./pages/AdminMenu'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.default })));
import { motion } from 'framer-motion';
import Navbar from './components/ui/Navbar';
import BottomNavbar from './components/ui/BottomNavbar';
import CartFab from './components/ui/CartFab';
import Hero from './components/ui/Hero';
import MenuSection from './pages/Menu';
import AboutSection from './components/ui/AboutSection';
import TestimonialsSection from './components/ui/TestimonialsSection';
import ContactSection from './components/ui/ContactSection';
import Footer from './components/ui/Footer';
import Cart from './components/ui/Cart';

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
  const location = useLocation();

  useEffect(() => {
    // Initialize monitoring services
    performanceMonitor.start();
    logger.info('Application started');
    
    // Simulate loading for 2 seconds
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Close cart when route changes
  useEffect(() => {
    setShowCart(false);
  }, [location.pathname]);

  // Initialize push notifications for admin users
  useEffect(() => {
    const initializePushNotifications = async () => {
      const token = localStorage.getItem('jwtToken');
      const userRole = localStorage.getItem('role');

      // Only initialize push notifications for admin users
      if (token && userRole === 'admin') {
        try {
          await pushNotificationService.initialize();
        } catch (error) {
          console.error('Failed to initialize push notifications:', error);
        }
      }
    };

    initializePushNotifications();
  }, []);

  // Add item to cart
  const addToCart = (item: MenuItemData, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        const newCartItem: CartItem = {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity,
          imageUrl: item.imageUrl,
          category: item.category
        };
        return [...prevCart, newCartItem];
      }
    });
  };

  const removeFromCart = (item: MenuItemData) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prevCart.filter(cartItem => cartItem.id !== item.id);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Hide cart and cart button on login page (and optionally add more routes)
  const hideCartRoutes = ['/login'];
  const shouldHideCart = hideCartRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideCart && showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          clearCart={clearCart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      )}
      {/* Floating Cart Button for mobile */}
      {!shouldHideCart && !showCart && (
        <div className="md:hidden">
          <CartFab onClick={() => setShowCart(true)} itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        </div>
      )}
      <React.Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
    </>
  );
};

const AppWithProviders: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <App />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default AppWithProviders;