import { model, models, Schema } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // Hash, not plain text!
  resetPasswordToken: { type: String, default: null },      // For forgot password flow
  resetPasswordExpires: { type: Date, default: null },      // For forgot password flow
}, { timestamps: true });

// Avoid recompilation errors in Next.js API routes
export const User = models?.User || model("User", UserSchema);
