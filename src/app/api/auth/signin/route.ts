import { NextResponse } from "next/server";
import { verify } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { generateKey } from "crypto";
import { generateToken } from "../../../../utils/jwt";


export async function POST(request: Request) {
    try {
        const {email,password}=await request.json();

        //1 email is already exist or not
        const user=await prisma.user.findUnique({where:{email}})

        if(!user){
            return NextResponse.json({error:"Invalid User Credentials"},{status:404})
        }

        //2 if user exist then ckeck password
        
        const passwordValidate=await verify(user.password,password);
        if(!passwordValidate){
            return NextResponse.json({error:"Invalid User Credentials"},{status:401})
        }
        //3 create jwt
        const token=await generateToken({
            userId: user.id,
            email: user.email,
        })


        //4 login successfully
        const { password: _password,...safeUser } = user;

       const response = NextResponse.json(
      { message: "Login successful", user: safeUser },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      
    });

    return response;
        
    } catch (error) {
        console.error("POST /api/auth/signin error:", error);
        return NextResponse.json(
            { error: "Failed to signin" },
            { status: 500 }         
        )
    }
}