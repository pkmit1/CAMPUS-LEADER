
import { NextRequest, NextResponse } from "next/server";
import { hash } from "@node-rs/argon2";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/utils/mailer";

// Generate random temporary password
function generateTemporaryPassword(length = 12): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      email,
      name,
      mobile,
      dob,
      gender,
      bloodGroup,
      fatherName,
      motherName,
      currentAddress,
      permanentAddress,
      bio,
      skills,
      githubUrl,
      linkedinUrl,
      location,
    } = data;

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await hash(temporaryPassword);

    // Process skills - ensure it's always an array of individual skills
    const processSkills = (skillsInput: any): string[] => {
      if (!skillsInput) return [];
      
      if (Array.isArray(skillsInput)) {
        // If it's already an array, make sure each item is a single skill
        return skillsInput.flatMap(skill => {
          if (typeof skill === 'string' && skill.includes(',')) {
            // If any item is a comma-separated string, split it
            return skill.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
          }
          return skill.trim().toLowerCase();
        }).filter(skill => skill.length > 0);
      }
      
      if (typeof skillsInput === 'string') {
        // If it's a string, split by commas
        return skillsInput.split(',')
          .map(skill => skill.trim().toLowerCase())
          .filter(skill => skill.length > 0);
      }
      
      return [];
    };

    const processedSkills = processSkills(skills);

    // Create addresses first
    let currentAddressRecord = null;
    let permanentAddressRecord = null;

    if (currentAddress) {
      currentAddressRecord = await prisma.address.create({
        data: currentAddress,
      });
    }

    if (
      permanentAddress &&
      JSON.stringify(permanentAddress) !== JSON.stringify(currentAddress)
    ) {
      permanentAddressRecord = await prisma.address.create({
        data: permanentAddress,
      });
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        mobile: mobile ? mobile.replace(/\D/g, "") : null,
        dob: dob ? new Date(dob) : null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        fatherName: fatherName || null,
        motherName: motherName || null,
        password: hashedPassword,
        bio: bio || null,
        skills: processedSkills, // Use the processed skills array
        githubUrl: githubUrl || null,
        linkedinUrl: linkedinUrl || null,
        location: location || null,
        role: "STUDENT",
        isTempPassword: true,
        currentAddressId: currentAddressRecord?.id || null,
        permanentAddressId:
          permanentAddressRecord?.id || currentAddressRecord?.id || null,
      },
      include: { currentAddress: true, permanentAddress: true },
    });

    // Send email with temporary password
    try {
      await sendMail(
        user.email,
        "Welcome to Our Platform - Your Account is Ready!",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0;">Welcome to Our Platform!</h2>
          </div>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Your account has been created successfully. Here are your login details:</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> 
              <code style="background: #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 14px; margin-left: 8px; font-family: monospace;">
                ${temporaryPassword}
              </code>
            </p>
          </div>
          <div style="background: #fef2f2; padding: 12px; border-radius: 6px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <p style="color: #dc2626; margin: 0; font-weight: 600;">
              🔐 Important: Please change your password after first login for security reasons.
            </p>
          </div>
          <p>If you have any questions or need assistance, please contact our support team.</p>
          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 5px 0; color: #6b7280;">Best regards,</p>
            <p style="margin: 5px 0; color: #374151; font-weight: 600;">The Team</p>
          </div>
        </div>
      `
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    // Remove password from response
    const { password: _pwd, ...safeUser } = user;

    return NextResponse.json(
      {
        message:
          "User created successfully. Temporary password sent to your email.",
        user: safeUser,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create user" },
      { status: 500 }
    );
  }
}
