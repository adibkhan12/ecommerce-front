import mongoose from 'mongoose';
import { Product } from "@/models/product";

const guestCartSchema = new mongoose.Schema({
  guestId: { type: String, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Create a TTL index on `createdAt` so that documents expire after 24 hours (86400 seconds)
guestCartSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('GuestCart', guestCartSchema);
