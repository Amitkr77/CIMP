import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();

  if (!email || !otp)
    return NextResponse.json(
      { error: "Email and OTP required" },
      { status: 400 },
    );

  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.isVerified)
    return NextResponse.json({ error: "Already verified" }, { status: 400 });

  if (!user.otp || user.otp !== otp)
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

  if (user.otpExpiresAt < new Date())
    return NextResponse.json(
      { error: "OTP expired. Request a new one." },
      { status: 400 },
    );

  // Mark verified, clear OTP
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  await sendWelcomeEmail(user.email, user.name, user.role);

  // Now issue JWT and log them in
  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set("incubator_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
