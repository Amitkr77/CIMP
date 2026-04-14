'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StageBadge from '@/components/StageBadge';

type App = {
  _id: string; applicantName: string; startupName: string; idea: string;
  industry: string; stage: string; status: string; isFastTracked: boolean;
  isPublic: boolean; rejectionReason?: string; managerNote?: string;
  pitchDeckUrl?: string; pitchDeckName?: string; createdAt: string;
};

type Activity = { _id: string; actorName: string; actorRole: string; action: string; detail?: string; createdAt: string; };
type Message  = { _id: string; senderName: string; senderRole: string; content: string; createdAt: string; read: boolean; };

export default function ApprovalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [modal, setModal] = useState<{ type: string; app: App } | null>(null);
  const [inputText, setInputText] = useState('');
  // Side panel
  const [sideApp, setSideApp] = useState<App | null>(null);
  const [sideTab, setSideTab] = useState<'timeline'|'messages'>('timeline');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const [msgLoading, setMsgLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user || d.user.role === 'incubatee') { router.push('/dashboard'); return; }
      setUser(d.user);
    });
  }, [router]);

  useEffect(() => { if (user) fetchApps(); }, [user]);

  async function fetchApps() {
    setLoading(true);
    const res = await fetch('/api/applications');
    const data = await res.json();
    setApps(data.applications || []);
    setLoading(false);
  }

  function showToast(msg: string, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function takeAction(applicationId: string, action: string, extra: Record<string, string> = {}) {
    setActionLoading(applicationId + action);
    try {
      const res = await fetch('/api/approvals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicationId, action, ...extra }) });
      const data = await res.json();
      if (!res.ok) { showToast('Error: ' + data.error, 'error'); return; }
      showToast('Done! Application updated.');
      setModal(null); setInputText('');
      await fetchApps();
      if (sideApp?._id === applicationId) openSidePanel({ ...sideApp, ...data.application });
    } catch { showToast('Something went wrong', 'error'); }
    finally { setActionLoading(null); }
  }

  async function openSidePanel(app: App) {
    setSideApp(app); setSideTab('timeline');
    const [actRes, msgRes] = await Promise.all([
      fetch(`/api/activity?applicationId=${app._id}`),
      fetch(`/api/messages?applicationId=${app._id}`),
    ]);
    const actData = await actRes.json();
    const msgData = await msgRes.json();
    setActivities(actData.activities || []);
    setMessages(msgData.messages || []);
  }

  async function sendMessage() {
    if (!msgInput.trim() || !sideApp) return;
    setMsgLoading(true);
    try {
      const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicationId: sideApp._id, content: msgInput }) });
      const data = await res.json();
      if (res.ok) { setMessages(prev => [...prev, data.message]); setMsgInput(''); }
    } finally { setMsgLoading(false); }
  }

  const filtered = apps.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'pending') return a.status === 'pending';
    if (filter === 'approved') return a.status === 'approved';
    if (filter === 'rejected') return a.status === 'rejected';
    if (filter === 'fasttracked') return a.isFastTracked;
    return true;
  });

  if (!user) return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;

  const isCEO = user.role === 'ceo';

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={user} />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl border text-sm font-body shadow-card-lg animate-fade-up ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {toast.msg}
        </div>
      )}

      {/* Reject/Note Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-navy/20 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white border border-border rounded-2xl p-6 w-full max-w-md shadow-card-lg">
            <h3 className="font-display text-xl font-semibold text-navy mb-1">
              {modal.type === 'reject' ? 'Reject Application' : 'Approve with Note'}
            </h3>
            <p className="text-muted text-sm font-body mb-4">{modal.app.startupName}</p>
            <textarea rows={3} value={inputText} onChange={e => setInputText(e.target.value)}
              placeholder={modal.type === 'reject' ? 'Reason for rejection (shown to applicant)...' : 'Optional note for CEO...'}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-body text-sm focus:outline-none resize-none mb-4"
              onFocus={e => { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'; }}
              onBlur={e => { e.target.style.borderColor=''; e.target.style.boxShadow=''; }} />
            <div className="flex gap-3">
              <button onClick={() => { setModal(null); setInputText(''); }}
                className="flex-1 py-2.5 border border-border text-secondary rounded-xl hover:text-navy hover:border-border-2 transition-colors font-body text-sm">Cancel</button>
              <button onClick={() => {
                  if (modal.type === 'reject') takeAction(modal.app._id, isCEO ? 'ceo_reject' : 'manager_reject', { reason: inputText });
                  else takeAction(modal.app._id, 'manager_approve', { note: inputText });
                }}
                className={`flex-1 py-2.5 rounded-xl font-body text-sm font-semibold transition-colors ${modal.type === 'reject' ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100' : 'text-white hover:opacity-90'}`}
                style={modal.type !== 'reject' ? { background: '#1D4ED8' } : {}}>
                {modal.type === 'reject' ? 'Confirm Reject' : 'Confirm Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-semibold text-navy mb-1">
              {isCEO ? <><span className="shimmer-blue">CEO</span> Command Center</> : 'Review Applications'}
            </h1>
            <p className="text-secondary font-body text-sm">
              {isCEO ? 'Approve, reject, fast-track, or publish startups' : 'Review applications for CEO consideration'}
            </p>
          </div>
          <div className="bg-white border border-border rounded-xl px-5 py-3 text-center shadow-card">
            <div className="font-display text-2xl text-navy">{apps.length}</div>
            <div className="text-xs font-mono text-muted">Total</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[{k:'all',l:'All'},{k:'pending',l:'Pending'},{k:'approved',l:'Approved'},{k:'rejected',l:'Rejected'},
            ...(isCEO?[{k:'fasttracked',l:'⚡ Fast-Tracked'}]:[])].map(f=>(
            <button key={f.k} onClick={() => setFilter(f.k)}
              className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${filter===f.k ? 'bg-brand text-white' : 'bg-white border border-border text-secondary hover:border-border-2 hover:text-navy'}`}>
              {f.l}
            </button>
          ))}
        </div>

        <div className={`flex gap-6 ${sideApp ? 'items-start' : ''}`}>
          {/* Main list */}
          <div className={`flex-1 min-w-0 space-y-3 ${loading ? 'opacity-60' : ''}`}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white border border-border rounded-2xl p-12 text-center shadow-card">
                <p className="text-muted font-body">No applications found</p>
              </div>
            ) : filtered.map(app => (
              <div key={app._id}
                className={`bg-white border rounded-2xl p-5 shadow-card transition-all cursor-pointer ${sideApp?._id === app._id ? 'border-brand shadow-blue' : app.isFastTracked ? 'border-amber-300 shadow-amber' : 'border-border hover:border-border-2 hover:shadow-card-md'}`}
                onClick={() => openSidePanel(app)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-body font-semibold text-navy">{app.startupName}</h3>
                      <StageBadge stage={app.stage} fastTracked={app.isFastTracked} />
                      {app.isPublic && <span className="text-xs font-mono text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">🌐 Public</span>}
                      {app.isFastTracked && <span className="text-xs font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">⚡ Fast-Tracked</span>}
                      {app.pitchDeckUrl && <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">📎 Deck</span>}
                    </div>
                    <p className="text-secondary font-body text-sm mb-2 line-clamp-2">{app.idea}</p>
                    <div className="flex items-center gap-3 text-xs font-mono text-muted">
                      <span>👤 {app.applicantName}</span><span>🏭 {app.industry}</span>
                      <span>📅 {new Date(app.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    {app.managerNote && <p className="mt-2 text-xs text-amber-700 font-body bg-amber-50 px-3 py-1.5 rounded-lg">Note: {app.managerNote}</p>}
                    {app.rejectionReason && <p className="mt-2 text-xs text-red-600 font-body bg-red-50 px-3 py-1.5 rounded-lg">Rejected: {app.rejectionReason}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2 min-w-[150px]" onClick={e => e.stopPropagation()}>
                    {!isCEO && app.stage === 'submitted' && (<>
                      <button onClick={() => setModal({ type: 'approve', app })} disabled={!!actionLoading}
                        className="px-4 py-2 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all font-body"
                        style={{ background: '#1D4ED8' }}>✓ Approve</button>
                      <button onClick={() => setModal({ type: 'reject', app })} disabled={!!actionLoading}
                        className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg hover:bg-red-100 transition-colors font-body">✗ Reject</button>
                    </>)}

                    {isCEO && (<>
                      {app.stage === 'submitted' && (
                        <button onClick={() => takeAction(app._id, 'ceo_fasttrack')} disabled={!!actionLoading}
                          className="px-4 py-2 text-amber-800 text-xs font-bold rounded-lg transition-all font-body animate-pulse-amber"
                          style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>⚡ Fast Track</button>
                      )}
                      {app.stage === 'manager_approved' && (
                        <button onClick={() => takeAction(app._id, 'ceo_approve')} disabled={!!actionLoading}
                          className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100 transition-colors font-body">✓ CEO Approve</button>
                      )}
                      {!['ceo_approved','rejected'].includes(app.stage) && (
                        <button onClick={() => setModal({ type: 'reject', app })} disabled={!!actionLoading}
                          className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg hover:bg-red-100 transition-colors font-body">✗ Reject</button>
                      )}
                      {app.stage === 'ceo_approved' && (
                        <button onClick={() => takeAction(app._id, 'ceo_toggle_public')} disabled={!!actionLoading}
                          className={`px-4 py-2 text-xs rounded-lg transition-colors font-body border ${app.isPublic ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-bg border-border text-secondary hover:border-border-2 hover:text-navy'}`}>
                          {app.isPublic ? '🌐 Unpublish' : '🌐 Publish'}
                        </button>
                      )}
                    </>)}

                    {app.stage === 'ceo_approved' && !isCEO && <span className="text-xs text-center text-green-600 font-mono py-1">CEO Approved ✓</span>}
                    {app.stage === 'rejected' && <span className="text-xs text-center text-red-500 font-mono py-1">Rejected</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Side panel */}
          {sideApp && (
            <div className="w-80 flex-shrink-0 bg-white border border-border rounded-2xl shadow-card-lg sticky top-20 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h3 className="font-body font-semibold text-navy text-sm truncate">{sideApp.startupName}</h3>
                  <p className="text-xs text-muted font-mono">{sideApp.applicantName}</p>
                </div>
                <button onClick={() => setSideApp(null)} className="w-7 h-7 rounded-lg hover:bg-bg flex items-center justify-center text-muted hover:text-navy transition-colors text-lg">×</button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                {(['timeline','messages'] as const).map(t => (
                  <button key={t} onClick={() => setSideTab(t)}
                    className={`flex-1 py-2.5 text-xs font-body font-medium capitalize transition-colors ${sideTab===t ? 'text-brand border-b-2 border-brand bg-blue-50/50' : 'text-muted hover:text-navy'}`}>
                    {t === 'timeline' ? '⏱ Timeline' : '💬 Messages'}
                  </button>
                ))}
              </div>

              <div className="h-96 overflow-y-auto">
                {sideTab === 'timeline' && (
                  <div className="p-4">
                    {activities.length === 0 ? (
                      <p className="text-muted text-xs font-body text-center py-8">No activity yet</p>
                    ) : (
                      <div className="space-y-3">
                        {activities.map((act, i) => (
                          <div key={act._id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-xs flex-shrink-0">
                                {act.actorRole==='ceo'?'👑':act.actorRole==='manager'?'🔍':'🚀'}
                              </div>
                              {i < activities.length-1 && <div className="w-px flex-1 bg-border mt-1 min-h-[12px]" />}
                            </div>
                            <div className="pb-3 flex-1">
                              <p className="text-xs font-body text-navy font-semibold">{act.actorName}</p>
                              <p className="text-xs text-secondary font-body">{act.action}</p>
                              {act.detail && <p className="text-[11px] text-muted mt-0.5">"{act.detail}"</p>}
                              <p className="text-[10px] text-faint font-mono mt-0.5">{new Date(act.createdAt).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {sideTab === 'messages' && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                      {messages.length === 0 ? (
                        <p className="text-muted text-xs font-body text-center py-8">No messages yet</p>
                      ) : messages.map(m => (
                        <div key={m._id} className={`flex flex-col ${m.senderRole==='incubatee'?'items-end':'items-start'}`}>
                          <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs font-body ${m.senderRole==='incubatee'?'bg-blue-600 text-white':'bg-bg border border-border text-navy'}`}>
                            <p className={`font-semibold mb-0.5 ${m.senderRole==='incubatee'?'text-blue-100':'text-muted'}`}>{m.senderName}</p>
                            {m.content}
                          </div>
                          <p className="text-[10px] text-faint font-mono mt-0.5 px-1">{new Date(m.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-border flex gap-2">
                      <input value={msgInput} onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                        placeholder="Type a message..." disabled={msgLoading}
                        className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-xs font-body text-navy focus:outline-none placeholder:text-faint"
                        onFocus={e=>{e.target.style.borderColor='#3B82F6';}} onBlur={e=>{e.target.style.borderColor='';}} />
                      <button onClick={sendMessage} disabled={msgLoading || !msgInput.trim()}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white disabled:opacity-50 transition-all hover:opacity-90"
                        style={{ background: '#1D4ED8' }}>→</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
