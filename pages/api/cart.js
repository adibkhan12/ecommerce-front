import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";

export default async function handle(req, res) {
    try {
        await mongooseConnect();
        const ids = req.body.ids || [];  // Ensure `ids` is always an array
        if (ids.length === 0) {
            return res.json([]);  // Return an empty array instead of error
        }
        const products = await Product.find({ _id: { $in: ids } });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch cart products" });
    }
}
