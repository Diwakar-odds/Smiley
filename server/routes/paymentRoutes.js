import express from 'express';
import { addPaymentMethod, getPaymentMethods, deletePaymentMethod } from '../controllers/paymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addPaymentMethod);
router.get('/', authMiddleware, getPaymentMethods);
router.delete('/:id', authMiddleware, deletePaymentMethod);

export default router;
