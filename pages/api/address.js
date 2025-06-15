import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Address } from "@/models/Address";

export default async function handle(req, res) {
  await mongooseConnect();
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user;

  if (!user) return res.status(200).json([]);

  if (req.method === "PUT") {
    const address = await Address.findOne({ userEmail: user.email });
    if (address) {
      const updated = await Address.findByIdAndUpdate(address._id, req.body, { new: true });
      return res.status(200).json(updated);
    } else {
      const created = await Address.create({ userEmail: user.email, ...req.body });
      return res.status(201).json(created);
    }
  }

  if (req.method === "GET") {
    const address = await Address.findOne({ userEmail: user.email });
    return res.status(200).json(address);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
