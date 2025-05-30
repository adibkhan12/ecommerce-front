import { mongooseConnect } from "@/lib/mongoose";
import { Cart } from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    await mongooseConnect();
    // Get session even though we support guest users – session may be null.
    const session = await getServerSession(req, res, authOptions);
    let identifier;

    // Always use identifier from request body for PUT (to match frontend usage), otherwise use session or query param.
    if (req.method === "PUT") {
    identifier = req.body.identifier;
    } else if (session?.user?.email) {
    identifier = session.user.email;
    } else {
    identifier = req.query.identifier;
    }

    // Stronger check: ensure identifier is a non-empty string
    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
        return res.status(400).json({ error: "Valid identifier is required (user email or guest id)." });
    }
    identifier = identifier.trim();

    // Handle GET request – fetch and return the cart.
    if (req.method === "GET") {
        try {
            const cart = await Cart.findOne({ identifier });
            if (cart) {
                return res.status(200).json(cart);
            } else {
                // If no cart, return an empty cart structure.
                return res.status(200).json({ identifier, items: [], updatedAt: new Date() });
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
            // Defensive: Prevent upsert if identifier is null/empty (should never happen due to earlier check)
            if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
            return res.status(400).json({ error: "Valid identifier is required (user email or guest id)." });
            }
            // Try to update an existing record.
            const updatedCart = await Cart.findOneAndUpdate(
            { identifier },
            { ...newCart, identifier },
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
