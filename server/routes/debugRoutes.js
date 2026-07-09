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
