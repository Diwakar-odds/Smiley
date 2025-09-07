import express from "express";
const router = express.Router();
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getOfferById,
} from "../controllers/offerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getOffers).post(protect, admin, createOffer);
router
  .route("/:id")
  .get(getOfferById)
  .put(protect, admin, updateOffer)
  .delete(protect, admin, deleteOffer);

export default router;