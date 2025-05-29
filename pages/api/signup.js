import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    await mongooseConnect();

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email is already registered." });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
