import  {model, models, Schema} from "mongoose";

const OrderSchema = new Schema({
    line_items: [
        {
            price_data: {
                product_data: {
                    name: String,
                },
                unit_amount: Number,
                currency: String,
            },
            quantity: Number,
        },
    ],
    name: String,
    email: String,
    city: String,
    postal_code: String,
    addressLine1: String,
    addressLine2: String,
    country: String,
    paid: { type: Boolean, default: null },
    number: String,
    referralSource: { type: String, default: "" },
    referralOther: { type: String, default: "" },

    // Payment meta
    paymentMethod: { type: String, enum: ["COD", "tamara", "tabby", "card"], default: "COD" },
    status: { type: String, enum: ["pending", "authorized", "paid", "failed", "canceled"], default: "pending" },
    provider: { type: String, default: null },
    providerRef: { type: String, default: null },
    currency: { type: String, default: "AED" },
    amount: { type: Number, default: 0 },
},  {
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);