import {model, models, Schema} from "mongoose";

const AddressSchema = new Schema({
    userEmail: { type: String, unique: true, required: true },
    name: String,
    email: String,
    city: String,
    postalCode: String,
    country: String,
    addressLine1: String,
    addressLine2: String,
    number: String,
})

export const Address = models?.Address || model('Address', AddressSchema);