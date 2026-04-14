import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';
import { Activity } from '@/models/Activity';
import { verifyToken } from '@/lib/auth';

function getUser(req: NextRequest) {
  const token = req.cookies.get('incubator_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const applications = user.role === 'incubatee'
    ? await Application.find({ userId: user.userId }).sort({ createdAt: -1 })
    : await Application.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ applications });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'incubatee') return NextResponse.json({ error: 'Only incubatees can apply' }, { status: 403 });

  const { startupName, idea, industry } = await req.json();
  if (!startupName || !idea || !industry) return NextResponse.json({ error: 'All fields required' }, { status: 400 });

  await connectDB();
  const existing = await Application.findOne({ userId: user.userId });
  if (existing) return NextResponse.json({ error: 'You already have an application' }, { status: 409 });

  const application = await Application.create({
    userId: user.userId, applicantName: user.name,
    startupName, idea, industry, status: 'pending', stage: 'submitted',
  });

  await Activity.create({
    applicationId: application._id, actorName: user.name,
    actorRole: user.role, action: 'submitted application',
  });

  return NextResponse.json({ success: true, application }, { status: 201 });
}

// PATCH — edit application (only if still editable)
export async function PATCH(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'incubatee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { applicationId, startupName, idea, industry } = await req.json();
  if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 });

  await connectDB();
  const app = await Application.findOne({ _id: applicationId, userId: user.userId });
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!app.isEditable) return NextResponse.json({ error: 'Application is locked for editing' }, { status: 400 });

  if (startupName) app.startupName = startupName;
  if (idea) app.idea = idea;
  if (industry) app.industry = industry;
  await app.save();

  await Activity.create({
    applicationId, actorName: user.name, actorRole: user.role, action: 'edited application',
  });

  return NextResponse.json({ success: true, application: app });
}
