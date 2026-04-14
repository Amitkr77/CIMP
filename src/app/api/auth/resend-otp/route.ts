import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { sendOTPEmail } from '@/lib/email';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user)        return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (user.isVerified) return NextResponse.json({ error: 'Already verified' }, { status: 400 });

  const otp = generateOTP();
  user.otp          = otp;
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendOTPEmail(email, user.name, otp);
  return NextResponse.json({ success: true });
}