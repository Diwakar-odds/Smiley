import PaymentMethod from "../models/PaymentMethod.js";

export const addPaymentMethod = async (req, res) => {
  try {
    const method = new PaymentMethod({ ...req.body, userId: req.user._id });
    await method.save();
    res.status(201).json(method);
  } catch (error) {
    res.status(500).json({ message: "Error adding payment method", error });
  }
};

export const getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find({ userId: req.user._id });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment methods", error });
  }
};

export const deletePaymentMethod = async (req, res) => {
  try {
    await PaymentMethod.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Payment method deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment method", error });
  }
};
