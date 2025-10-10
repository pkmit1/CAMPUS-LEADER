import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt";

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

// GET: fetch user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: {
        currentAddress: true,
        permanentAddress: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// PUT: update profile fields


export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await request.json();
    const { 
      name, 
      email, 
      collegeName, 
      image, 
      skills, // This should be an array of strings
      gender, 
      bio, 
      githubUrl, 
      linkedinUrl, 
      bloodGroup, 
      mobile, 
      dob,
      currentAddress,
      permanentAddress
    } = body;

    // Fetch existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: decoded.email },
      include: {
        currentAddress: true,
        permanentAddress: true
      }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare user update data
    const userUpdateData: any = { 
      name: name ?? existingUser.name,
      email: email ?? existingUser.email,
      collegeName: collegeName ?? existingUser.collegeName,
      image: image ?? existingUser.image,
      gender: gender ?? existingUser.gender,
      bio: bio ?? existingUser.bio,
      githubUrl: githubUrl ?? existingUser.githubUrl,
      linkedinUrl: linkedinUrl ?? existingUser.linkedinUrl,
      bloodGroup: bloodGroup ?? existingUser.bloodGroup,
      mobile: mobile ?? existingUser.mobile,
      dob: dob ? new Date(dob) : existingUser.dob
    };

    // Handle skills - ensure it's always an array
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        userUpdateData.skills = skills;
      } else if (typeof skills === 'string') {
        // If it's a string, split by commas and clean up
        userUpdateData.skills = skills.split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      } else {
        userUpdateData.skills = existingUser.skills;
      }
    }

    // Use transaction for atomic update
    const result = await prisma.$transaction(async (tx) => {
      // Handle current address
      if (currentAddress) {
        if (existingUser.currentAddressId) {
          // Update existing current address
          await tx.address.update({
            where: { id: existingUser.currentAddressId },
            data: {
              street: currentAddress.street ?? existingUser.currentAddress?.street,
              city: currentAddress.city ?? existingUser.currentAddress?.city,
              state: currentAddress.state ?? existingUser.currentAddress?.state,
              pincode: currentAddress.pincode ?? existingUser.currentAddress?.pincode,
              country: currentAddress.country ?? existingUser.currentAddress?.country ?? "India"
            }
          });
        } else {
          // Create new current address
          const newAddress = await tx.address.create({
            data: {
              street: currentAddress.street || null,
              city: currentAddress.city || null,
              state: currentAddress.state || null,
              pincode: currentAddress.pincode || null,
              country: currentAddress.country || "India"
            }
          });
          userUpdateData.currentAddressId = newAddress.id;
        }
      }

      // Handle permanent address
      if (permanentAddress) {
        if (existingUser.permanentAddressId) {
          // Update existing permanent address
          await tx.address.update({
            where: { id: existingUser.permanentAddressId },
            data: {
              street: permanentAddress.street ?? existingUser.permanentAddress?.street,
              city: permanentAddress.city ?? existingUser.permanentAddress?.city,
              state: permanentAddress.state ?? existingUser.permanentAddress?.state,
              pincode: permanentAddress.pincode ?? existingUser.permanentAddress?.pincode,
              country: permanentAddress.country ?? existingUser.permanentAddress?.country ?? "India"
            }
          });
        } else {
          // Create new permanent address
          const newAddress = await tx.address.create({
            data: {
              street: permanentAddress.street || null,
              city: permanentAddress.city || null,
              state: permanentAddress.state || null,
              pincode: permanentAddress.pincode || null,
              country: permanentAddress.country || "India"
            }
          });
          userUpdateData.permanentAddressId = newAddress.id;
        }
      }

      // Update user
      const updatedUser = await tx.user.update({
        where: { email: decoded.email },
        data: userUpdateData,
        include: {
          currentAddress: true,
          permanentAddress: true
        }
      });

      return updatedUser;
    });

    // Format response
    const formattedResponse = {
      id: result.id,
      name: result.name,
      email: result.email,
      collegeName: result.collegeName,
      image: result.image,
      skills: result.skills, // This will be an array
      gender: result.gender,
      bio: result.bio,
      githubUrl: result.githubUrl,
      linkedinUrl: result.linkedinUrl,
      bloodGroup: result.bloodGroup,
      mobile: result.mobile,
      dob: result.dob,
      currentAddress: result.currentAddress ? {
        street: result.currentAddress.street,
        city: result.currentAddress.city,
        state: result.currentAddress.state,
        pincode: result.currentAddress.pincode,
        country: result.currentAddress.country
      } : null,
      permanentAddress: result.permanentAddress ? {
        street: result.permanentAddress.street,
        city: result.permanentAddress.city,
        state: result.permanentAddress.state,
        pincode: result.permanentAddress.pincode,
        country: result.permanentAddress.country
      } : null,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}



// POST: upload image
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = await verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `profile-${decoded.email}-${Date.now()}${fileExtension}`;
    
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    // Update user profile with new image
    await prisma.user.update({
      where: { email: decoded.email },
      data: { image: imageUrl },
    });

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: "Profile picture updated successfully" 
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 