"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// Icons (You can use lucide-react or heroicons, I'm using inline SVGs for zero dependencies)
const SearchIcon = () => (
  <svg
    className="w-4 h-4 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const BellIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);
const ChevronDown = () => (
  <svg
    className="w-4 h-4 ml-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);
const LogoutIcon = () => (
  <svg
    className="w-4 h-4 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

interface NavbarProps {
  user: { name: string; email: string; role: string; image?: string };
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [notifCount, setNotifCount] = useState(0);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  // New state for Profile Dropdown
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifs() {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      setNotifCount(data.unreadCount || 0);
      setNotifs(data.notifications || []);
    } catch {}
  }

  async function markAllRead() {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifCount(0);
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const links = [
    {
      href: "/dashboard",
      label: "Dashboard",
      roles: ["incubatee", "manager", "ceo"],
    },
    { href: "/apply", label: "Apply", roles: ["incubatee"] },
    { href: "/approvals", label: "Approvals", roles: ["manager", "ceo"] },
    {
      href: "/messages",
      label: "Messages",
      roles: ["incubatee", "manager", "ceo"],
    },
    {
      href: "/public-startups",
      label: "Portfolio",
      roles: ["incubatee", "manager", "ceo"],
    },
  ].filter((l) => l.roles.includes(user.role));

  // Generate Avatar URL based on name if user doesn't have one
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff&size=128`;
  console.log(user);
  

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* 1. Logo Section */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm">
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: "serif" }}
              >
                L
              </span>
            </div>
            <span className="font-display text-lg font-bold text-slate-800 hidden sm:block tracking-tight">
              Launchpad
            </span>
          </Link>

          {/* 2. Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative px-3 py-2"
              >
                <span
                  className={`text-sm font-medium transition-colors ${
                    pathname === l.href
                      ? "text-blue-600"
                      : "text-slate-600 group-hover:text-slate-900"
                  }`}
                >
                  {l.label}
                </span>
                {/* Active Indicator Dot */}
                {pathname === l.href && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* 3. Right Side: Search, Notifications, Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar (Impressive Feature) */}
          <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-slate-300 focus-within:bg-white transition-all w-48">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder-slate-400 text-slate-700"
            />
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifs(!showNotifs);
                if (!showNotifs && notifCount > 0) markAllRead();
              }}
              className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
            >
              <BellIcon />
              {notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in py-2">
                <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Notifications
                  </span>
                  {notifCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    notifs.map((n: any) => (
                      <div
                        key={n._id}
                        className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${!n.read ? "bg-blue-50/30" : ""}`}
                      >
                        <p
                          className={`text-sm ${n.read ? "text-slate-600" : "text-slate-900 font-semibold"}`}
                        >
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Profile Dropdown (New Feature) */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-700 leading-tight">
                  {user.name.split(" ")[0]}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">
                  {user.role}
                </p>
              </div>
              <div className="relative">
                <img
                  src={user.image || avatarUrl}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <ChevronDown />
            </button>

            {/* Profile Menu */}
            {showProfile && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-50">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    Your Profile
                  </Link>
                </div>
                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogoutIcon />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
