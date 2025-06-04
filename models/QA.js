import mongoose, { Schema, models, model } from 'mongoose';

const QASchema = new Schema({
  product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  user: { type: String, required: true }, // user email or id
  question: { type: String, required: true },
  answer: { type: String },
  createdAt: { type: Date, default: Date.now },
  answeredAt: { type: Date }
});

export const QA = models?.QA || model('QA', QASchema);
