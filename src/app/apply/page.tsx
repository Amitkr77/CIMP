'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const INDUSTRIES = ['FinTech','EdTech','HealthTech','AgriTech','CleanTech','SaaS','E-Commerce','AI/ML','DeepTech','Other'];

export default function ApplyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [existingApp, setExistingApp] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form, setForm] = useState({ startupName: '', idea: '', industry: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      if (!d.user) { router.push('/login'); return; }
      if (d.user.role !== 'incubatee') { router.push('/dashboard'); return; }
      setUser(d.user);
    });
    fetch('/api/applications').then(r => r.json()).then(d => {
      const app = d.applications?.[0];
      if (app) {
        setExistingApp(app);
        setForm({ startupName: app.startupName, idea: app.idea, industry: app.industry });
        if (app.pitchDeckName) setUploadedFile(app.pitchDeckName);
      }
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const isEdit = existingApp && existingApp.isEditable;
      const res = await fetch('/api/applications', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { applicationId: existingApp._id, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch { setError('Something went wrong'); }
    finally { setLoading(false); }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !existingApp) return;
    setUploadLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('applicationId', existingApp._id);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setUploadedFile(data.name);
    } catch { setError('Upload failed'); }
    finally { setUploadLoading(false); }
  }

  if (!user) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
        <h2 className="font-display text-2xl font-semibold text-navy mb-2">
          {existingApp ? 'Application Updated!' : 'Application Submitted!'}
        </h2>
        <p className="text-muted font-body">Redirecting to dashboard...</p>
      </div>
    </div>
  );

  const isLocked = existingApp && !existingApp.isEditable;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar user={user} />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-navy mb-1">
            {existingApp ? 'Your Application' : 'Apply for Incubation'}
          </h1>
          <p className="text-secondary font-body text-sm">
            {isLocked ? 'Your application is under review and cannot be edited.' : 'Tell us about your startup. Be specific and compelling.'}
          </p>
        </div>

        {isLocked && (
          <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <span className="text-lg">🔒</span>
            <p className="text-sm text-amber-700 font-body">Application locked — currently under review by our team.</p>
          </div>
        )}

        <div className="bg-white border border-border rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-body font-medium text-navy mb-1.5">Startup Name *</label>
              <input required disabled={isLocked} value={form.startupName}
                onChange={e => setForm(p => ({ ...p, startupName: e.target.value }))}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-navy font-body text-sm focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors placeholder:text-faint"
                onFocus={e => { if (!isLocked) { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'; }}}
                onBlur={e => { e.target.style.borderColor=''; e.target.style.boxShadow=''; }}
                placeholder="e.g. NovaPay, GreenRoot..." />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-navy mb-1.5">Industry *</label>
              <select required disabled={isLocked} value={form.industry}
                onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-navy font-body text-sm focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                onFocus={e => { if (!isLocked) { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'; }}}
                onBlur={e => { e.target.style.borderColor=''; e.target.style.boxShadow=''; }}>
                <option value="">Select industry...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-navy mb-1.5">
                Your Idea *
                <span className="ml-2 text-faint text-xs font-normal">Problem · Solution · Why you?</span>
              </label>
              <textarea required disabled={isLocked} rows={6} value={form.idea}
                onChange={e => setForm(p => ({ ...p, idea: e.target.value }))}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-navy font-body text-sm focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed resize-none transition-colors placeholder:text-faint"
                onFocus={e => { if (!isLocked) { e.target.style.borderColor='#3B82F6'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.12)'; }}}
                onBlur={e => { e.target.style.borderColor=''; e.target.style.boxShadow=''; }}
                placeholder="We are building [product] for [audience] because [problem]. Our solution [approach] wins because [differentiation]..." />
              <p className="text-faint text-xs mt-1 font-mono">{form.idea.length} chars</p>
            </div>

            {/* Pitch Deck Upload */}
            {existingApp && (
              <div>
                <label className="block text-sm font-body font-medium text-navy mb-1.5">Pitch Deck</label>
                <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors ${isLocked ? 'border-border opacity-60' : 'border-border hover:border-brand cursor-pointer'}`}
                  onClick={() => !isLocked && fileRef.current?.click()}>
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">📎</span>
                      <span className="text-sm font-body text-navy font-medium">{uploadedFile}</span>
                      {!isLocked && <span className="text-xs text-brand font-body">(click to replace)</span>}
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl mb-2">📁</div>
                      <p className="text-sm text-secondary font-body">{uploadLoading ? 'Uploading...' : 'Click to upload pitch deck (PDF, max 5MB)'}</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.ppt,.pptx" className="hidden" onChange={handleFileUpload} disabled={isLocked} />
              </div>
            )}

            {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-body">{error}</div>}

            {/* Workflow hint */}
            <div className="p-4 bg-bg border border-border rounded-xl">
              <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">What happens next</p>
              <div className="flex items-center gap-2 text-xs font-body flex-wrap">
                <span className="text-blue-600 font-medium">Submitted</span><span className="text-muted">→</span>
                <span className="text-amber-600 font-medium">Manager Reviews</span><span className="text-muted">→</span>
                <span className="text-green-600 font-medium">CEO Approves</span><span className="text-muted">→</span>
                <span className="text-navy font-semibold">You're In! 🎉</span>
              </div>
            </div>

            {!isLocked && (
              <button type="submit" disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-xl transition-all disabled:opacity-50 font-body text-sm hover:opacity-90"
                style={{ background: '#1D4ED8' }}>
                {loading ? 'Saving...' : existingApp ? 'Update Application' : 'Submit Application →'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
