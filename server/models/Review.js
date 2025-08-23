import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
});

export default mongoose.model("Review", reviewSchema);
