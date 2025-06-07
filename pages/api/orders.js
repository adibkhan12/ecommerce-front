import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  await mongooseConnect();
  const { method } = req;

  if (method === "GET") {
    const { orderId, email } = req.query;

    // Guest order lookup by orderId and email
    if (orderId && email) {
      const order = await Order.findOne({ _id: orderId, email }).lean();
      if (!order) return res.status(404).json({ error: "Order not found" });
      return res.json(order);
    }

    // Logged-in user: return only their orders
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email) {
      const orders = await Order.find({ email: session.user.email }).sort({ createdAt: -1 }).lean();
      return res.json(orders);
    }

    // If neither, deny access
    return res.status(401).json({ error: "Unauthorized" });
  }

  res.status(405).end(`Method ${method} Not Allowed`);
}
