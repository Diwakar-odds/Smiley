import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    discount: { type: String }, // e.g. "30%" or "₹100 off"
    externalUrl: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    categories: [{ type: String }],
    locales: [{ type: String }],
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
