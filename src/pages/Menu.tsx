import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import MenuItem from '../components/ui/MenuItem';
import axios from 'axios';
import { menuData, MenuItemData } from '../data/menuData';

const MenuSection = ({ addToCart }: { addToCart: (item: MenuItemData) => void }) => {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data: dbItems } = await axios.get('/api/menu');
        setMenuItems(dbItems);
        setError(null);
      } catch (error) {
        setError("Failed to load menu items from database.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'softy', name: 'Softy', icon: '🍦' },
    { id: 'patties', name: 'Patties', icon: '🥟' },
    { id: 'shakes', name: 'Shakes', icon: '🥤' },
    { id: 'Corn', name: 'Corns', icon: '🌽' },
    { id: 'combos', name: 'Combos', icon: '🎁' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 sm:px-6 lg:px-8">
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

          {/* Categories */}
          {/* Categories */}
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
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 break-words ${activeCategory === category.id
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

          {/* Items */}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuItem key={item._id} {...item} addToCart={addToCart} />
              ))}
            </div>
          )}

          {/* Error info (non-blocking) */}
          {error && (
            <div className="text-center text-yellow-600 mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;