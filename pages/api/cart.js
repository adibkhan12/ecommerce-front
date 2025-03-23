import { mongooseConnect } from "@/lib/mongoose";
import { Cart } from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    await mongooseConnect();
    // Get session even though we support guest users – session may be null.
    const session = await getServerSession(req, res, authOptions);
    let identifier;

    // Determine the identifier from session or from query/body guestId.
    if (session?.user?.email) {
        identifier = session.user.email;
    } else {
        // For guest users, expect the identifier to be provided.
        // GET: from query params; PUT: from request body.
        identifier = req.method === "GET" ? req.query.identifier : req.body.identifier;
    }

    if (!identifier) {
        return res.status(400).json({ error: "Identifier is required." });
    }

    // Handle GET request – fetch and return the cart.
    if (req.method === "GET") {
        try {
            const cart = await Cart.findOne({ userEmail: identifier });
            if (cart) {
                return res.status(200).json(cart);
            } else {
                // If no cart, return an empty cart structure.
                return res.status(200).json({ userEmail: identifier, items: [], updatedAt: new Date() });
            }
        } catch (error) {
            console.error("GET /api/cart error:", error);
            return res.status(500).json({ error: "Error fetching cart." });
        }
    }

    // Handle PUT request – update / create the cart record.
    if (req.method === "PUT") {
        try {
            const { cart: newCart } = req.body;
            if (!newCart) {
                return res.status(400).json({ error: "Cart data is required." });
            }
            // Try to update an existing record.
            const updatedCart = await Cart.findOneAndUpdate(
                { userEmail: identifier },
                { ...newCart, userEmail: identifier },
                { new: true, upsert: true }
            );
            return res.status(200).json(updatedCart);
        } catch (error) {
            console.error("PUT /api/cart error:", error);
            return res.status(500).json({ error: "Error updating cart." });
        }
    }

    // Method not allowed
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
}
