import { mongooseConnect } from "@/lib/mongoose";
import { AdBanner } from "@/models/AdBanner";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === "GET") {
    try {
      const banners = await AdBanner.find().sort({ order: 1, createdAt: 1 });
      return res.status(200).json(banners);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching banners", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
