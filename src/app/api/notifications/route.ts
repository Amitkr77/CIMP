import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Notification } from '@/models/Notification';
import { verifyToken } from '@/lib/auth';

function getUser(req: NextRequest) {
  const token = req.cookies.get('incubator_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET — fetch notifications for current user
export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const notifications = await Notification.find({ userId: user.userId })
    .sort({ createdAt: -1 })
    .limit(30);

  const unreadCount = await Notification.countDocuments({ userId: user.userId, read: false });

  return NextResponse.json({ notifications, unreadCount });
}

// PATCH — mark all as read
export async function PATCH(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  await Notification.updateMany({ userId: user.userId, read: false }, { read: true });

  return NextResponse.json({ success: true });
}
