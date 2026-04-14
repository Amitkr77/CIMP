import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';
import { Notification } from '@/models/Notification';
import { Activity } from '@/models/Activity';
import { verifyToken } from '@/lib/auth';

function getUser(req: NextRequest) {
  const token = req.cookies.get('incubator_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

async function notify(userId: string, title: string, message: string, type: 'info'|'success'|'warning'|'error', applicationId: string) {
  await Notification.create({ userId, title, message, type, applicationId });
}

async function log(applicationId: string, actorName: string, actorRole: string, action: string, detail?: string) {
  await Activity.create({ applicationId, actorName, actorRole, action, detail });
}

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['manager', 'ceo'].includes(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { applicationId, action, note, reason } = await req.json();
  if (!applicationId || !action) return NextResponse.json({ error: 'applicationId and action required' }, { status: 400 });

  await connectDB();
  const app = await Application.findById(applicationId);
  if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 });

  const appIdStr = app._id.toString();
  const ownerId = app.userId.toString();

  if (action === 'manager_approve') {
    if (user.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    app.stage = 'manager_approved';
    app.managerId = user.userId as any;
    app.managerNote = note || '';
    app.isEditable = false;
    await app.save();
    await log(appIdStr, user.name, user.role, 'approved application', note);
    await notify(ownerId, 'Application Approved by Manager ✅', `Great news! "${app.startupName}" passed manager review and is now with the CEO.`, 'success', appIdStr);
  }

  else if (action === 'manager_reject') {
    if (user.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    app.stage = 'rejected'; app.status = 'rejected';
    app.rejectedBy = 'manager'; app.rejectionReason = reason || '';
    app.managerId = user.userId as any;
    await app.save();
    await log(appIdStr, user.name, user.role, 'rejected application', reason);
    await notify(ownerId, 'Application Rejected', `Unfortunately, "${app.startupName}" was not approved at this stage. Reason: ${reason || 'Not specified'}`, 'error', appIdStr);
  }

  else if (action === 'ceo_approve') {
    if (user.role !== 'ceo') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (app.stage !== 'manager_approved') return NextResponse.json({ error: 'Must be manager approved first' }, { status: 400 });
    app.stage = 'ceo_approved'; app.status = 'approved';
    await app.save();
    await log(appIdStr, user.name, user.role, 'CEO approved application');
    await notify(ownerId, '🎉 CEO Approved!', `Congratulations! "${app.startupName}" has been approved by the CEO. Welcome to Launchpad!`, 'success', appIdStr);
  }

  else if (action === 'ceo_reject') {
    if (user.role !== 'ceo') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    app.stage = 'rejected'; app.status = 'rejected';
    app.rejectedBy = 'ceo'; app.rejectionReason = reason || '';
    await app.save();
    await log(appIdStr, user.name, user.role, 'CEO rejected application', reason);
    await notify(ownerId, 'Application Rejected by CEO', `"${app.startupName}" was not approved. Reason: ${reason || 'Not specified'}`, 'error', appIdStr);
  }

  else if (action === 'ceo_fasttrack') {
    if (user.role !== 'ceo') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    app.stage = 'ceo_approved'; app.status = 'approved';
    app.isFastTracked = true; app.isEditable = false;
    await app.save();
    await log(appIdStr, user.name, user.role, '⚡ fast-tracked application', 'Skipped manager review');
    await notify(ownerId, '⚡ Fast-Tracked by CEO!', `"${app.startupName}" was personally fast-tracked by the CEO. You're in!`, 'success', appIdStr);
  }

  else if (action === 'ceo_toggle_public') {
    if (user.role !== 'ceo') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (app.status !== 'approved') return NextResponse.json({ error: 'Only approved apps can be published' }, { status: 400 });
    app.isPublic = !app.isPublic;
    await app.save();
    await log(appIdStr, user.name, user.role, app.isPublic ? 'published to portfolio' : 'removed from portfolio');
    await notify(ownerId, app.isPublic ? '🌐 Now Live on Portfolio!' : 'Removed from Portfolio', app.isPublic ? `"${app.startupName}" is now publicly listed on the Launchpad portfolio.` : `"${app.startupName}" has been removed from the public portfolio.`, 'info', appIdStr);
  }

  else {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }

  return NextResponse.json({ success: true, application: app });
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['manager', 'ceo'].includes(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await connectDB();
  const [total, pending, managerApproved, ceoApproved, rejected, fastTracked] = await Promise.all([
    Application.countDocuments(),
    Application.countDocuments({ status: 'pending' }),
    Application.countDocuments({ stage: 'manager_approved' }),
    Application.countDocuments({ stage: 'ceo_approved' }),
    Application.countDocuments({ status: 'rejected' }),
    Application.countDocuments({ isFastTracked: true }),
  ]);

  return NextResponse.json({ total, pending, managerApproved, ceoApproved, rejected, fastTracked });
}
