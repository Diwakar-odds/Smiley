import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import OrderForm from '../forms/OrderForm';
import { CartItem } from '../../types/cart';
import { MenuItemData } from '../../data/menuData';

interface CartProps {
  cart: CartItem[];
  onClose: () => void;
  clearCart: () => void;
  addToCart: (item: MenuItemData, quantity?: number) => void;
  removeFromCart: (item: MenuItemData) => void;
}

const Cart = ({ cart, onClose, clearCart, addToCart, removeFromCart }: CartProps) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-md h-full bg-white shadow-lg flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold">Your Cart</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" title="Close Cart">
              <X size={24} />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center">
              <p className="text-gray-500 text-lg">Your cart is empty.</p>
              <span className="text-4xl mt-4">🛒</span>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">₹{Number(item.price).toFixed(2)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button onClick={() => removeFromCart(item)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300" title="Remove from Cart">
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300" title="Add to Cart">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="font-bold">₹{(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div className="p-4 border-t space-y-4">
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>₹{Number(total).toFixed(2)}</span>
              </div>
              <OrderForm cart={cart} total={total} clearCart={clearCart} />
              <div className="flex space-x-2">
                <button onClick={clearCart} className="w-full py-3 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                  <Trash2 size={20} />
                  <span>Clear Cart</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Cart;