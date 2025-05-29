import { mongooseConnect } from "@/lib/mongoose";
import { User } from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    await mongooseConnect();
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ ok: true }); // Always return ok to avoid leaking user existence

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // Send email (configure the following to your SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await transporter.sendMail({
      to: email,
      from: process.env.SMTP_FROM || "no-reply@example.com",
      subject: "Password Reset Request",
      html: `<p>You requested a password reset for your account.</p>
             <p>Click the link below to set a new password. <b>This link expires in 15 minutes.</b></p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>
             <p>If you didn't request this, please ignore this email.</p>`
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ error: "Failed to process password reset" });
  }
}
