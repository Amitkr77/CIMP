import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Nav */}
      <nav className="bg-white border-b border-border sticky top-0 z-50" style={{boxShadow:'0 1px 3px rgba(15,33,68,0.06)'}}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'#1D4ED8'}}>
              <span className="text-white font-bold text-sm" style={{fontFamily:'Lora,serif'}}>L</span>
            </div>
            <span className="font-display text-xl font-semibold text-navy">Launchpad</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/public-startups" className="text-secondary hover:text-navy text-sm font-body transition-colors">Portfolio</Link>
            <Link href="/login" className="text-secondary hover:text-navy text-sm font-body transition-colors">Sign In</Link>
            <Link href="/register" className="px-4 py-2 rounded-lg text-white text-sm font-semibold font-body transition-all hover:opacity-90" style={{background:'#1D4ED8'}}>Apply Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-brand text-xs font-mono tracking-widest uppercase">Applications Open</span>
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-semibold text-navy leading-tight mb-6 max-w-4xl mx-auto">
            Where Bold Ideas <span className="shimmer-blue">Become</span><br/>Funded Companies
          </h1>
          <p className="text-secondary font-body text-xl max-w-xl mx-auto mb-12 leading-relaxed">
            Rigorous multi-stage review. Direct CEO access. Fast-track for exceptional ventures.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="px-8 py-4 rounded-xl text-white font-semibold font-body transition-all hover:opacity-90 hover:scale-[1.02]" style={{background:'#1D4ED8',boxShadow:'0 4px 14px rgba(29,78,216,0.3)'}}>
              Submit Your Startup →
            </Link>
            <Link href="/public-startups" className="px-8 py-4 border border-border-2 text-secondary rounded-xl hover:border-brand hover:text-brand transition-all font-body bg-white">
              View Portfolio
            </Link>
          </div>
          {/* Stats */}
          <div className="mt-20 inline-grid grid-cols-3 gap-12 bg-white border border-border rounded-2xl px-12 py-8" style={{boxShadow:'0 4px 24px rgba(15,33,68,0.08)'}}>
            {[{v:'3-Stage',l:'Review Process'},{v:'CEO',l:'Fast-Track Power'},{v:'100%',l:'Transparent'}].map(s=>(
              <div key={s.l} className="text-center">
                <div className="font-display text-3xl font-semibold text-navy mb-1">{s.v}</div>
                <div className="text-muted text-xs font-mono tracking-wider uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow */}
      <div className="border-t border-border bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-center text-muted text-xs font-mono tracking-widest uppercase mb-10">The Journey</p>
          <div className="flex items-center justify-between">
            {[{icon:'📝',l:'Submit',d:'You apply'},{icon:'🔍',l:'Manager Review',d:'Initial screen'},{icon:'👑',l:'CEO Approval',d:'Final decision'},{icon:'🚀',l:'Incubated',d:"You're in!"}].map((s,i)=>(
              <div key={s.l} className="flex items-center gap-3 flex-1">
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 rounded-xl bg-bg border border-border flex items-center justify-center text-2xl mx-auto mb-3">{s.icon}</div>
                  <div className="text-navy text-sm font-body font-semibold">{s.l}</div>
                  <div className="text-muted text-xs mt-0.5 font-body">{s.d}</div>
                </div>
                {i<3&&<div className="text-border-2 text-xl flex-shrink-0">→</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
