import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { sendOTPEmail } from "@/lib/email"; // 👈 add this

// Helper — generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: "All fields required" }, { status: 400 });

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing)
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 },
    );

  const hashed = await bcrypt.hash(password, 12);
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create user — unverified
  await User.create({
    name,
    email,
    password: hashed,
    role,
    isVerified: false,
    otp,
    otpExpiresAt,
  });

  // Send OTP email
  await sendOTPEmail(email, name, otp);

  // Don't set auth cookie yet — send them to verify page instead
  return NextResponse.json({
    success: true,
    requiresVerification: true,
    email,
  });
}
