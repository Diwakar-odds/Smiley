import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    hasPostgresUri: !!process.env.POSTGRES_URI,
    host: process.env.POSTGRES_HOST,
    db: process.env.POSTGRES_DB,
    uriLength: process.env.POSTGRES_URI ? process.env.POSTGRES_URI.length : 0,
    storeIds: 'Use GET /api/debug/stores to check if Store 2 exists'
  });
});

import { Store, MenuItem } from '../models/sequelize/index.js';

router.get('/stores', async (req, res) => {
  try {
    const stores = await Store.findAll();
    const items = await MenuItem.count();
    res.json({ stores, menuItemsCount: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

const seedItems = [
  { name: "Vanilla Cone", category: "softy", description: "Classic vanilla softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?vanilla-ice-cream", available: true },
  { name: "Strawberry Cone", category: "softy", description: "Strawberry flavored softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?strawberry-ice-cream", available: true },
  { name: "Chocolate Cone", category: "softy", description: "Chocolate flavored softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?chocolate-ice-cream", available: true },
  { name: "Blueberry Cone", category: "softy", description: "Blueberry flavored softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?blueberry-ice-cream", available: true },
  { name: "All Mix Flavour Cone", category: "softy", description: "All mix flavour softy cone.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?ice-cream", available: true },
  { name: "Chocolate Pastry", category: "pastry", description: "Rich chocolate pastry.", price: 40, imageUrl: "https://source.unsplash.com/400x300/?chocolate-pastry", available: true },
  { name: "Vanilla Pastry", category: "pastry", description: "Classic vanilla pastry.", price: 40, imageUrl: "https://source.unsplash.com/400x300/?vanilla-pastry", available: true },
  { name: "Strawberry Pastry", category: "pastry", description: "Strawberry pastry.", price: 40, imageUrl: "https://source.unsplash.com/400x300/?strawberry-pastry", available: true },
  { name: "Large Cup Corn", category: "corn", description: "Large cup of sweet corn.", price: 50, imageUrl: "https://source.unsplash.com/400x300/?corn", available: true },
  { name: "Small Cup Corn", category: "corn", description: "Small cup of sweet corn.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?corn-cup", available: true },
  { name: "Aloo Patties", category: "patties", description: "Potato filled patties.", price: 20, imageUrl: "https://source.unsplash.com/400x300/?aloo-patties", available: true },
  { name: "Masala Patties", category: "patties", description: "Spicy masala patties.", price: 30, imageUrl: "https://source.unsplash.com/400x300/?masala-patties", available: true },
  { name: "Paneer Patties", category: "patties", description: "Paneer filled patties.", price: 50, imageUrl: "https://source.unsplash.com/400x300/?paneer-patties", available: true },
  { name: "Combo Package (KIT Special Offer)", category: "combos", description: "Ice Cream Cone + Pastry", price: 59, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true },
  { name: "Smiley Best Combo (New Package)", category: "combos", description: "Aloo Patties or Sweet Corn + Cold Coffee", price: 49, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true },
  { name: "Smiley Special Combo", category: "combos", description: "Pastry + Patties", price: 50, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true },
  { name: "Smiley Best Combo", category: "combos", description: "Pastry + Ice Cream (Softy Cone) + Cold Coffee", price: 89, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true },
  { name: "Smiley Combo Menu", category: "combos", description: "Aloo Patties or Sweet Corn + Ice Cream (Softy Cone) + Cold Coffee", price: 79, imageUrl: "https://source.unsplash.com/400x300/?combo", available: true }
];

router.get('/seed', async (req, res) => {
  try {
    let [store] = await Store.findOrCreate({
      where: { id: 2 },
      defaults: {
        name: 'Main Store',
        address: 'Main Address',
        phone: '1234567890',
        email: 'store@example.com',
        description: 'Main store'
      }
    });
    
    await MenuItem.destroy({ where: { storeId: store.id }});
    
    const itemsToCreate = seedItems.map(item => ({ ...item, storeId: store.id }));
    await MenuItem.bulkCreate(itemsToCreate);
    
    res.json({ success: true, message: 'Seeded ' + itemsToCreate.length + ' items' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
