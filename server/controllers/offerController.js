import { Offer } from "../models/sequelize/index.js";

// Import multiple offers
export const importOffers = async (req, res) => {
  try {
    const offersData = req.body;

    if (!Array.isArray(offersData)) {
      return res
        .status(400)
        .json({ message: "Request body must be an array of offers" });
    }

    const createdOffers = await Offer.bulkCreate(offersData);
    res.status(201).json(createdOffers);
  } catch (error) {
    console.error("Error importing offers:", error);
    res
      .status(500)
      .json({ message: "Error importing offers", error: error.message });
  }
};

// Create a new offer
export const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
  } catch (error) {
    console.error("Error creating offer:", error);
    res
      .status(500)
      .json({ message: "Error creating offer", error: error.message });
  }
};

// Get all offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll();
    res.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res
      .status(500)
      .json({ message: "Error fetching offers", error: error.message });
  }
};

// Get offer by ID
export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json(offer);
  } catch (error) {
    console.error("Error fetching offer:", error);
    res
      .status(500)
      .json({ message: "Error fetching offer", error: error.message });
  }
};

// Update an offer
export const updateOffer = async (req, res) => {
  try {
    const [updated] = await Offer.update(req.body, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedOffer = await Offer.findByPk(req.params.id);
      return res.json(updatedOffer);
    }

    return res.status(404).json({ message: "Offer not found" });
  } catch (error) {
    console.error("Error updating offer:", error);
    res
      .status(500)
      .json({ message: "Error updating offer", error: error.message });
  }
};

// Delete an offer
export const deleteOffer = async (req, res) => {
  try {
    const deleted = await Offer.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      return res.json({ message: "Offer deleted" });
    }

    return res.status(404).json({ message: "Offer not found" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res
      .status(500)
      .json({ message: "Error deleting offer", error: error.message });
  }
};
