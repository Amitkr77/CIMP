'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StageBadge from '@/components/StageBadge';

type App = { _id: string; startupName: string; applicantName: string; stage: string; isFastTracked: boolean; };
type Message = { _id: string; senderName: string; senderRole: string; content: string; createdAt: string; read: boolean; };

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/login'); return; }
      setUser(d.user);
    });
    fetch('/api/applications').then(r => r.json()).then(d => {
      setApps(d.applications || []);
    });
  }, [router]);

  async function selectApp(app: App) {
    setSelectedApp(app); setLoading(true);
    const res = await fetch(`/api/messages?applicationId=${app._id}`);
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  }

  async function sendMessage() {
    if (!msgInput.trim() || !selectedApp) return;
    setSending(true);
    try {
      const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicationId: selectedApp._id, content: msgInput }) });
      const data = await res.json();
      if (res.ok) { setMessages(prev => [...prev, data.message]); setMsgInput(''); }
    } finally { setSending(false); }
  }

  if (!user) return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={user} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-navy mb-1">Messages</h1>
          <p className="text-secondary font-body text-sm">Direct communication between applicants and the review team</p>
        </div>

        <div className="flex gap-6 h-[calc(100vh-220px)]">
          {/* Conversation list */}
          <div className="w-72 flex-shrink-0 bg-white border border-border rounded-2xl shadow-card overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-mono text-muted uppercase tracking-wider">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {apps.length === 0 ? (
                <p className="text-muted text-sm font-body text-center py-10">No conversations yet</p>
              ) : apps.map(app => (
                <button key={app._id} onClick={() => selectApp(app)}
                  className={`w-full px-4 py-4 text-left border-b border-border/60 hover:bg-bg transition-colors ${selectedApp?._id === app._id ? 'bg-blue-50 border-l-2 border-l-brand' : ''}`}>
                  <p className={`text-sm font-body font-semibold truncate ${selectedApp?._id === app._id ? 'text-brand' : 'text-navy'}`}>{app.startupName}</p>
                  <p className="text-xs text-muted font-body mt-0.5">{app.applicantName}</p>
                  <div className="mt-1.5">
                    <StageBadge stage={app.stage} fastTracked={app.isFastTracked} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div className="flex-1 bg-white border border-border rounded-2xl shadow-card overflow-hidden flex flex-col">
            {!selectedApp ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-bg border border-border flex items-center justify-center text-3xl mb-4">💬</div>
                <h3 className="font-display text-xl font-semibold text-navy mb-2">Select a conversation</h3>
                <p className="text-muted font-body text-sm">Choose an application from the left to start messaging</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-body font-semibold text-navy">{selectedApp.startupName}</h3>
                    <p className="text-xs text-muted font-body">{selectedApp.applicantName}</p>
                  </div>
                  <StageBadge stage={selectedApp.stage} fastTracked={selectedApp.isFastTracked} />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-muted font-body text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  ) : messages.map(m => {
                    const isMe = m.senderRole === user.role || (user.role === 'incubatee' && m.senderRole === 'incubatee');
                    return (
                      <div key={m._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${isMe ? 'rounded-br-sm text-white' : 'rounded-bl-sm bg-bg border border-border text-navy'}`}
                          style={isMe ? { background: '#1D4ED8' } : {}}>
                          <p className={`text-xs font-semibold mb-1 font-body ${isMe ? 'text-blue-200' : 'text-muted'}`}>
                            {m.senderName} · {m.senderRole}
                          </p>
                          <p className="text-sm font-body leading-relaxed">{m.content}</p>
                        </div>
                        <p className="text-[10px] text-faint font-mono mt-1 px-1">
                          {new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Input */}
                <div className="px-5 py-4 border-t border-border flex gap-3 items-end">
                  <textarea value={msgInput} onChange={e => setMsgInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                    rows={1} placeholder="Type a message... (Enter to send)"
                    className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-sm font-body text-navy focus:outline-none resize-none placeholder:text-faint transition-colors"
                    onFocus={e => { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor=''; e.target.style.boxShadow=''; }} />
                  <button onClick={sendMessage} disabled={sending || !msgInput.trim()}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-all flex-shrink-0"
                    style={{ background: '#1D4ED8' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
