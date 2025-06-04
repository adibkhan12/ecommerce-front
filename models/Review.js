import mongoose, { Schema, models, model } from 'mongoose';

const ReviewSchema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  user: { type: String, required: true }, // user email or id
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const Review = models?.Review || model('Review', ReviewSchema);
