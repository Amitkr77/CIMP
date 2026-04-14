import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Activity } from '@/models/Activity';
import { verifyToken } from '@/lib/auth';
import { Application } from '@/models/Application';

function getUser(req: NextRequest) {
  const token = req.cookies.get('incubator_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/activity?applicationId=xxx
export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const applicationId = req.nextUrl.searchParams.get('applicationId');
  if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 });

  await connectDB();

  if (user.role === 'incubatee') {
    const app = await Application.findOne({ _id: applicationId, userId: user.userId });
    if (!app) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const activities = await Activity.find({ applicationId }).sort({ createdAt: -1 });
  return NextResponse.json({ activities });
}
