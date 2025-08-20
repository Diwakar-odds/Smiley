import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Drink", "Dessert"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String, // for item photo
    },
    available: {
      type: Boolean,
      default: true, // if temporarily unavailable
    },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
