import mongoose, { Schema, model, models } from 'mongoose';

const guestCartSchema = new Schema({
  guestId: { type: String, required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
  }],
  createdAt: { type: Date, default: Date.now }
});

guestCartSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export const GuestCart = models?.GuestCart || model('GuestCart', guestCartSchema);
