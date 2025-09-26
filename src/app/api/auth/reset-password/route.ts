import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "@node-rs/argon2";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gt: new Date() }, // OTP still valid
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const hashedPassword = await hash(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete OTP after successful reset
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("reset-password error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
