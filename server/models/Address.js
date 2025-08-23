import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  street: String,
  city: String,
  state: String,
  zip: String,
});

export default mongoose.model("Address", addressSchema);
