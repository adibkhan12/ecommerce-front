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
    paid:Boolean,
    number: String,
    referralSource: { type: String, default: "" },
    referralOther: { type: String, default: "" },
},  {
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);