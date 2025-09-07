import { Offer, Store } from "../models/sequelize/index.js";

// @desc    Fetch all offers
// @route   GET /api/offers
// @access  Public
export const getOffers = async (req, res) => {
  try {
    const { storeId } = req.query;
    let queryOptions = {};

    if (storeId) {
      queryOptions.storeId = storeId;
    }

    const offers = await Offer.findAll({
      where: queryOptions,
      include: [
        {
          model: Store,
          attributes: ["id", "name"],
        },
      ],
    });

    res.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Fetch single offer
// @route   GET /api/offers/:id
// @access  Public
export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id, {
      include: [
        {
          model: Store,
          attributes: ["id", "name", "address"],
        },
      ],
    });

    if (offer) {
      res.json(offer);
    } else {
      res.status(404).json({ message: "Offer not found" });
    }
  } catch (error) {
    console.error("Error fetching offer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create an offer
// @route   POST /api/offers
// @access  Private/Admin
export const createOffer = async (req, res) => {
  const { name, description, bannerImage, startDate, endDate, discountPercentage, storeId } =
    req.body;

  try {
    const offer = await Offer.create({
      name,
      description,
      bannerImage,
      startDate,
      endDate,
      discountPercentage,
      storeId,
    });

    res.status(201).json(offer);
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update an offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
export const updateOffer = async (req, res) => {
  const { name, description, bannerImage, startDate, endDate, discountPercentage } = req.body;

  try {
    const offer = await Offer.findByPk(req.params.id);

    if (offer) {
      offer.name = name || offer.name;
      offer.description = description || offer.description;
      offer.bannerImage = bannerImage || offer.bannerImage;
      offer.startDate = startDate || offer.startDate;
      offer.endDate = endDate || offer.endDate;
      offer.discountPercentage = discountPercentage || offer.discountPercentage;

      const updatedOffer = await offer.save();
      res.json(updatedOffer);
    } else {
      res.status(404).json({ message: "Offer not found" });
    }
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete an offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);

    if (offer) {
      await offer.destroy();
      res.json({ message: "Offer removed" });
    } else {
      res.status(404).json({ message: "Offer not found" });
    }
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};