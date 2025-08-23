import express from 'express';
import { addReview, getReviews, deleteReview } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addReview);
router.get('/:menuItemId', getReviews);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
