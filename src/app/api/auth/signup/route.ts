import { NextResponse ,NextRequest} from "next/server";
import { hash } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password,collegeName } = await request.json();

    // 1. 
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // 2. Hash password
    const hashPassword = await hash(password);

    // 3. Create user (role always VIEWER at signup)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role: "ADMIN",
        collegeName,
      },
    });

    // 4. Remove password before sending response
    const { password: _password, ...safeUser } = user;

    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
