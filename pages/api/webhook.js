import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order"; // Ensure this model is correctly defined
const stripe = require('stripe')(process.env.STRIPE_SK);
import { buffer } from 'micro';

const endpointSecret = "whsec_414ad824765a4ddb959e130e98e71fe91a0656af22fd0525748b5c7555908184";

export default async function handler(req, res) {
    await mongooseConnect();

    const sig = req.headers['stripe-signature'];
    if (!sig) {
        res.status(400).send("Missing Stripe signature header.");
        return;
    }

    let event;
    try {
        const rawBody = await buffer(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    console.log("Event received:", JSON.stringify(event, null, 2)); // Debugging log

    switch (event.type) {
        case 'checkout.session.completed':
            const data = event.data.object;

            console.log("Metadata received:", data.metadata); // Ensure metadata is logged
            const orderId = data.metadata?.orderId;
            console.log("Order received:", orderId);
            console.log(data);
            const paid = data.payment_status === "paid";
            if (orderId && paid) {
                await Order.findByIdAndUpdate(orderId, {
                    paid:true,
                })
            }
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).send("Webhook received.");
}

export const config = {
    api: { bodyParser: false },
};
