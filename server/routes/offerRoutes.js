import express from "express";
import * as offerController from "../controllers/offerController.js";
const router = express.Router();

// Create a new offer
router.post("/", offerController.createOffer);

// Get all offers
router.get("/", offerController.getOffers);

// Update an offer
router.put("/:id", offerController.updateOffer);

// Delete an offer
router.delete("/:id", offerController.deleteOffer);

// Import offers (scaffold)
router.post("/import", offerController.importOffers);

export default router;
