import mongoose, { Schema, model, models } from 'mongoose';

const ColorSchema = new Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true }, // e.g. #ff9900
});

export const Color = models?.Color || model('Color', ColorSchema);
