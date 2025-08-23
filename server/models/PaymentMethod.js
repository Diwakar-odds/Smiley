import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cardNumber: String,
  expiryDate: String,
  cvv: String,
});

export default mongoose.model("PaymentMethod", paymentMethodSchema);
