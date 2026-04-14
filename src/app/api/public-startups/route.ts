import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';

export async function GET() {
  await connectDB();
  const startups = await Application.find({ isPublic: true, status: 'approved' })
    .select('startupName applicantName idea industry isFastTracked createdAt')
    .sort({ createdAt: -1 });
  return NextResponse.json({ startups });
}
