import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret");

export async function generateToken(user: any) {
console.log("user in jwt:",  user)

  return await new SignJWT({
    userId: user.userId,
    email: user.email,
    role:   user.role
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err: any) {
    console.error("JWT Error:", err.message);
    return null;
  }
}
