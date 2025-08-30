import { Address } from "../models/sequelize/index.js";

export const addAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,
      userId: req.user.id, // Note: Using id instead of _id in Sequelize
    });
    res.status(201).json(address);
  } catch (error) {
    console.error("Error adding address:", error);
    res
      .status(500)
      .json({ message: "Error adding address", error: error.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user.id },
    });
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res
      .status(500)
      .json({ message: "Error fetching addresses", error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const [updated] = await Address.update(req.body, {
      where: { id: req.params.id, userId: req.user.id },
    });

    if (updated) {
      const updatedAddress = await Address.findOne({
        where: { id: req.params.id },
      });
      return res.json(updatedAddress);
    }

    return res.status(404).json({ message: "Address not found" });
  } catch (error) {
    console.error("Error updating address:", error);
    res
      .status(500)
      .json({ message: "Error updating address", error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (deleted) {
      return res.json({ message: "Address deleted successfully" });
    }

    return res.status(404).json({ message: "Address not found" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res
      .status(500)
      .json({ message: "Error deleting address", error: error.message });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (address) {
      return res.json(address);
    }

    return res.status(404).json({ message: "Address not found" });
  } catch (error) {
    console.error("Error fetching address:", error);
    res
      .status(500)
      .json({ message: "Error fetching address", error: error.message });
  }
};
