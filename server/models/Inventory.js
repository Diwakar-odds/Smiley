import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  mealId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
  stock: {
    type: Number,
    required: true,
    default: 0, // current available quantity
  },
  threshold: {
    type: Number,
    required: true,
    default: 10, // low-stock warning level
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update "lastUpdated" on save
inventorySchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.model("Inventory", inventorySchema);
