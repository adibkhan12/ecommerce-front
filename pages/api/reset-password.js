import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { token, email, password } = req.body;
  if (!token || !email || !password)
    return res.status(400).json({ error: "All fields required." });

  await mongooseConnect();
  const user = await User.findOne({
    email,
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ error: "Invalid or expired token." });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.status(200).json({ ok: true, message: "Password has been reset. You can now sign in." });
}
