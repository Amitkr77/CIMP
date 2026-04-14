import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';

export const revalidate = 60;

async function getPublicStartups() {
  await connectDB();
  return Application.find({ isPublic: true, status: 'approved' })
    .select('startupName applicantName idea industry isFastTracked createdAt')
    .sort({ createdAt: -1 }).lean();
}

export default async function PublicStartupsPage() {
  const startups = await getPublicStartups();
  const serialized = startups.map(s => ({
    ...s, _id: s._id.toString(), createdAt: (s.createdAt as Date).toISOString(),
  }));

  return (
    <main className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="bg-white border-b border-border sticky top-0 z-50" style={{ boxShadow: '0 1px 3px rgba(15,33,68,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1D4ED8' }}>
              <span className="text-white font-bold text-sm" style={{ fontFamily: 'Lora,serif' }}>L</span>
            </div>
            <span className="font-display text-lg font-semibold text-navy">Launchpad</span>
          </Link>
          <Link href="/dashboard" className="text-secondary hover:text-brand text-sm font-body transition-colors font-medium">Dashboard →</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-700 text-xs font-mono tracking-widest uppercase">CEO Approved</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-navy mb-4">
            Our <span className="shimmer-blue">Portfolio</span>
          </h1>
          <p className="text-secondary font-body text-lg max-w-xl mx-auto">
            Startups that earned their place through our rigorous review process.
          </p>
        </div>

        {serialized.length === 0 ? (
          <div className="text-center py-24 bg-white border border-border rounded-2xl shadow-card">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="font-display text-2xl font-semibold text-navy mb-2">Portfolio Coming Soon</h2>
            <p className="text-muted font-body">No startups published yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <p className="text-muted text-sm font-mono mb-8">{serialized.length} startup{serialized.length !== 1 ? 's' : ''} incubated</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serialized.map((s: any) => (
                <div key={s._id}
                  className={`bg-white border rounded-2xl p-6 flex flex-col shadow-card hover:shadow-card-md transition-all group ${s.isFastTracked ? 'border-amber-300' : 'border-border hover:border-border-2'}`}>
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs font-mono text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">✓ Incubated</span>
                    {s.isFastTracked && <span className="text-xs font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">⚡ Fast-Tracked</span>}
                    <span className="text-xs font-mono text-muted ml-auto">{s.industry}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-navy mb-1 group-hover:text-brand transition-colors">{s.startupName}</h3>
                  <p className="text-muted text-xs font-body mb-3">by {s.applicantName}</p>
                  <p className="text-secondary text-sm font-body leading-relaxed flex-1 line-clamp-4">{s.idea}</p>
                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-faint text-xs font-mono">
                      Joined {new Date(s.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
