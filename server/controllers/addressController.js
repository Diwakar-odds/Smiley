import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    const address = new Address({ ...req.body, userId: req.user._id });
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses", error });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await Address.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address", error });
  }
};
