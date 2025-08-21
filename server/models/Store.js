import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  description: { type: String },
  imageUrl: { type: String },
});

export default mongoose.model('Store', storeSchema);