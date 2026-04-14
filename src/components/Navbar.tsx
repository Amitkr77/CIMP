'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  user: { name: string; email: string; role: string };
}

const ROLE_STYLES: Record<string, string> = {
  incubatee: 'bg-blue-50 text-blue-700 border border-blue-200',
  manager:   'bg-amber-50 text-amber-700 border border-amber-200',
  ceo:       'bg-navy text-white border border-navy-2',
};
const ROLE_ICON: Record<string, string> = { incubatee: '🚀', manager: '🔍', ceo: '👑' };

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [notifCount, setNotifCount] = useState(0);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowNotifs(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function fetchNotifs() {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifCount(data.unreadCount || 0);
      setNotifs(data.notifications || []);
    } catch {}
  }

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH' });
    setNotifCount(0);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const links = [
    { href: '/dashboard',        label: 'Dashboard', roles: ['incubatee','manager','ceo'] },
    { href: '/apply',            label: 'Apply',     roles: ['incubatee'] },
    { href: '/approvals',        label: 'Approvals', roles: ['manager','ceo'] },
    { href: '/messages',         label: 'Messages',  roles: ['incubatee','manager','ceo'] },
    { href: '/public-startups',  label: 'Portfolio', roles: ['incubatee','manager','ceo'] },
  ].filter(l => l.roles.includes(user.role));

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50" style={{ boxShadow: '0 1px 3px rgba(15,33,68,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1D4ED8' }}>
            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Lora, serif' }}>L</span>
          </div>
          <span className="font-display text-lg font-semibold text-navy hidden sm:block">Launchpad</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3.5 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                pathname === l.href
                  ? 'bg-blue-50 text-brand'
                  : 'text-secondary hover:text-navy hover:bg-bg'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Notification Bell */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => { setShowNotifs(v => !v); if (!showNotifs && notifCount > 0) markAllRead(); }}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center hover:bg-bg transition-colors border border-transparent hover:border-border"
            >
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-mono flex items-center justify-center">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 top-11 w-80 bg-white border border-border rounded-xl shadow-card-lg overflow-hidden animate-fade-up">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm font-semibold text-navy font-body">Notifications</span>
                  <button onClick={markAllRead} className="text-xs text-brand hover:text-navy font-body">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <p className="text-center text-muted text-sm py-8 font-body">No notifications</p>
                  ) : notifs.map((n: any) => (
                    <div key={n._id} className={`px-4 py-3 border-b border-border/60 hover:bg-bg transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                      <p className={`text-sm font-body ${n.read ? 'text-secondary' : 'text-navy font-medium'}`}>{n.title}</p>
                      <p className="text-xs text-muted font-body mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-faint font-mono mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role badge */}
          <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono ${ROLE_STYLES[user.role]}`}>
            {ROLE_ICON[user.role]} {user.role}
          </span>

          {/* Name */}
          <span className="text-secondary text-sm font-body hidden md:block truncate max-w-[120px]">{user.name}</span>

          {/* Logout */}
          <button onClick={handleLogout}
            className="px-3 py-1.5 border border-border text-muted text-xs rounded-lg hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all font-body"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
