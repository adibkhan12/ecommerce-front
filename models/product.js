import mongoose, { model, Schema, models } from 'mongoose';

const ColorVariantSchema = new Schema({
  color: { type: mongoose.Types.ObjectId, ref: 'Color' },
  images: [{ type: String }],
  // Add other fields for variants if needed
}, { _id: false });

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: mongoose.Types.ObjectId, ref: 'Category' },
  properties: { type: Object },
  stock: { type: Number, required: true, default: 0 },
  colorVariants: [ColorVariantSchema], // <-- Add this line
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);