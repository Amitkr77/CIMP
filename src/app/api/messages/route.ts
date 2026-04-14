import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Message } from '@/models/Message';
import { Notification } from '@/models/Notification';
import { Application } from '@/models/Application';
import { User } from '@/models/User';
import { verifyToken } from '@/lib/auth';

function getUser(req: NextRequest) {
  const token = req.cookies.get('incubator_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/messages?applicationId=xxx
export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const applicationId = req.nextUrl.searchParams.get('applicationId');
  if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 });

  await connectDB();

  // Verify access: incubatee can only see their own app's messages
  if (user.role === 'incubatee') {
    const app = await Application.findOne({ _id: applicationId, userId: user.userId });
    if (!app) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const messages = await Message.find({ applicationId }).sort({ createdAt: 1 });

  // Mark messages as read for this user
  await Message.updateMany(
    { applicationId, senderId: { $ne: user.userId }, read: false },
    { read: true }
  );

  return NextResponse.json({ messages });
}

// POST /api/messages
export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { applicationId, content } = await req.json();
  if (!applicationId || !content?.trim()) {
    return NextResponse.json({ error: 'applicationId and content required' }, { status: 400 });
  }

  await connectDB();

  // Access check
  const app = await Application.findById(applicationId);
  if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

  if (user.role === 'incubatee' && app.userId.toString() !== user.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const message = await Message.create({
    applicationId,
    senderId: user.userId,
    senderName: user.name,
    senderRole: user.role,
    content: content.trim(),
  });

  // Notify the other party
  let notifyUserId: string | null = null;
  let notifyTitle = '';
  let notifyMsg = '';

  if (user.role === 'incubatee') {
    // notify all managers/ceo — find any manager
    const managers = await User.find({ role: { $in: ['manager', 'ceo'] } }).select('_id');
    for (const m of managers) {
      await Notification.create({
        userId: m._id,
        title: 'New Message',
        message: `${user.name} sent a message about "${app.startupName}"`,
        type: 'info',
        applicationId: app._id,
      });
    }
  } else {
    // notify incubatee
    await Notification.create({
      userId: app.userId,
      title: 'New Message',
      message: `${user.name} (${user.role}) sent you a message about "${app.startupName}"`,
      type: 'info',
      applicationId: app._id,
    });
  }

  return NextResponse.json({ success: true, message });
}
