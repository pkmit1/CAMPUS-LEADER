import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gt: new Date() }, // OTP not expired
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
