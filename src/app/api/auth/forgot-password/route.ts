import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/utils/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.otp.create({
      data: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // expires in 10 minutes
      },
    });

// Send OTP via email with enhanced message
(async () => {
await sendMail(
  user.email,
  "Password Reset Request - OTP",
  `
    <p>Dear ${user.name || 'User'},</p>
    <p>We received a request to reset your password. To proceed, please use the following One-Time Password (OTP):</p>
    <p><b>${code}</b></p>
    <p>This OTP will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
    <p>If you have any issues or did not request this action, please contact our support team.</p>
    <br>
    <p>Thank you, <br>Your Support Team</p>
  `
);
})();


    return NextResponse.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("forgot-password error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
