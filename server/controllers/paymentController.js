// Get last used payment method for a user
import { User } from "../models/sequelize/index.js";

export const getLastPaymentMethod = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.lastPaymentMethodId) {
      return res.status(404).json({ message: "No last payment method found" });
    }
    const paymentMethod = await PaymentMethod.findByPk(user.lastPaymentMethodId);
    if (!paymentMethod) {
      return res.status(404).json({ message: "Last payment method not found" });
    }
    res.json(paymentMethod);
  } catch (error) {
    console.error("Error fetching last payment method:", error);
    res.status(500).json({ message: "Error fetching last payment method", error: error.message });
  }
};
import { PaymentMethod } from "../models/sequelize/index.js";

// Add a new payment method
export const addPaymentMethod = async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error("Error adding payment method:", error);
    res
      .status(500)
      .json({ message: "Error adding payment method", error: error.message });
  }
};

// Get all payment methods for a user
export const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.findAll({
      where: { userId: req.user.id },
    });
    res.json(paymentMethods);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res
      .status(500)
      .json({
        message: "Error fetching payment methods",
        error: error.message,
      });
  }
};

// Delete a payment method
export const deletePaymentMethod = async (req, res) => {
  try {
    const deleted = await PaymentMethod.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (deleted) {
      return res.json({ message: "Payment method deleted" });
    }

    return res.status(404).json({ message: "Payment method not found" });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    res
      .status(500)
      .json({ message: "Error deleting payment method", error: error.message });
  }
};
