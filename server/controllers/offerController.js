import Offer from "../models/Offer.js";

// Create a new offer
export const createOffer = async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an offer
export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!offer) return res.status(404).json({ error: "Offer not found" });
    res.json(offer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an offer
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ error: "Offer not found" });
    res.json({ message: "Offer deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Import offers (scaffold)
export const importOffers = async (req, res) => {
  // To be implemented: bulk import logic
  res.status(501).json({ error: "Not implemented" });
};
