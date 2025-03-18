import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

export default async function handler(req, res) {
    try {
        await mongooseConnect();
        const session = await getServerSession(req, res, authOptions);
        if (!session || !session.user) {
            return res.status(401).json({ message: "Unauthorized: Please log in." });
        }

        const userEmail = session.user.email;

        if (req.method === "GET") {
            const userWishes = await WishedProduct.find({ userEmail }).populate('product');
            return res.json(userWishes);
        }

        if (req.method === "POST") {
            // EXISTING: Toggling logic
            const { product } = req.body;
            const wishedDoc = await WishedProduct.findOne({ userEmail, product });
            if (wishedDoc) {
                await WishedProduct.findByIdAndDelete(wishedDoc._id);
                return res.json("Wished removed successfully");
            } else {
                await WishedProduct.create({ userEmail, product });
                return res.json("Wished added successfully");
            }
        }

        // If neither GET nor POST
        return res.status(405).json({ message: "Method Not Allowed" });
    } catch (error) {
        console.error("API ERROR:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
