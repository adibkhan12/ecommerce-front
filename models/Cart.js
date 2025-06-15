import { model, models, Schema } from "mongoose";
import { Product } from "@/models/product";

const CartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, required: true }
}, { _id: false });

const CartSchema = new Schema({
    identifier: { type: String, unique: true, required: true },
    items: { type: [CartItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now }
});

CartSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

export const Cart = models?.Cart || model("Cart", CartSchema);
