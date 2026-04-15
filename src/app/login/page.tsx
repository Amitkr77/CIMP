"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GoogleButton from "@/components/GoogleButton";

/* ─── SVG Icons ─── */
const IconEye = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const IconSpinner = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className="animate-spin"
  >
    <path d="M12 2a10 10 0 0 1 10 10" opacity="0.9" />
    <path d="M12 2a10 10 0 0 0-7 17" opacity="0.3" />
    <path d="M5 19a10 10 0 0 0 15 0" opacity="0.15" />
  </svg>
);

const IconError = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const IconUser = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/* ─── Demo Accounts ─── */
const demoAccounts = [
  {
    email: "ceo@demo.com",
    password: "demo123",
    label: "CEO",
    color: "#1D4ED8",
  },
  {
    email: "manager@demo.com",
    password: "demo123",
    label: "Manager",
    color: "#7C3AED",
  },
  {
    email: "incubatee@demo.com",
    password: "demo123",
    label: "Incubatee",
    color: "#059669",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.requiresVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(email: string, password: string) {
    setForm({ email, password });
    setTimeout(() => emailRef.current?.focus(), 50);
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* ─── Scoped Styles ─── */}
      <style jsx global>{`
        .dot-grid {
          background-image: radial-gradient(
            circle,
            rgba(15, 33, 68, 0.07) 1px,
            transparent 1px
          );
          background-size: 24px 24px;
        }
        @keyframes float-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -30px) scale(1.05);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-15px, 20px) scale(0.95);
          }
        }
        .login-input {
          width: 100%;
          background: #f6f7fa;
          border: 1.5px solid #e2e5ee;
          border-radius: 12px;
          padding: 11px 16px;
          color: #0f2144;
          font-size: 14px;
          transition:
            border-color 0.2s,
            box-shadow 0.2s,
            background 0.2s;
          outline: none;
        }
        .login-input::placeholder {
          color: #b0b7c9;
        }
        .login-input:hover {
          border-color: #c8cde0;
        }
        .login-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: #fff;
        }
      `}</style>

      {/* Background elements */}
      <div className="dot-grid fixed inset-0" />
      <div
        className="fixed top-[15%] right-[10%] w-72 h-72 rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #1D4ED8, transparent 70%)",
          animation: "float-1 12s ease-in-out infinite",
        }}
      />
      <div
        className="fixed bottom-[10%] left-[8%] w-56 h-56 rounded-full opacity-[0.03] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #7C3AED, transparent 70%)",
          animation: "float-2 15s ease-in-out infinite",
        }}
      />

      {/* ═══ Card ═══ */}
      <motion.div
        className="relative z-10 w-full max-w-[420px]"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                background: "#1D4ED8",
                boxShadow: "0 2px 10px rgba(29,78,216,0.3)",
              }}
            >
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: "Lora,serif" }}
              >
                L
              </span>
            </div>
            <span className="font-display text-2xl font-semibold text-navy">
              Launchpad
            </span>
          </Link>
          <p className="text-muted text-sm mt-3 font-body">
            Sign in to your account
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="bg-white border border-slate-100 rounded-2xl overflow-hidden"
          style={{
            boxShadow:
              "0 4px 32px rgba(15,33,68,0.07), 0 1px 3px rgba(15,33,68,0.04)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Top accent line */}
          <div
            className="h-[2px]"
            style={{
              background: "linear-gradient(90deg, #1D4ED8, #7C3AED, #1D4ED8)",
            }}
          />

          <div className="p-7 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-body font-medium text-navy mb-1.5"
                >
                  Email
                </label>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="login-input"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-body font-medium text-navy"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-body text-brand hover:text-navy transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, password: e.target.value }))
                    }
                    className="login-input"
                    style={{ paddingRight: "44px" }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-navy transition-colors p-0.5"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    <IconEye open={showPw} />
                  </button>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">
                        <IconError />
                      </span>
                      <span className="text-red-600 text-sm font-body leading-relaxed">
                        {error}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed font-body text-sm flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: loading ? "#94A3B8" : "#1D4ED8",
                  boxShadow: loading
                    ? "none"
                    : "0 2px 12px rgba(29,78,216,0.25)",
                }}
              >
                {loading ? (
                  <>
                    <IconSpinner />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <IconArrowRight />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[11px] text-muted font-body uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Google */}
            <GoogleButton role="incubatee" />

            {/* Demo Accounts */}
            <div className="mt-6 bg-slate-50/80 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <IconUser />
                <span className="text-[11px] font-mono text-muted uppercase tracking-[0.12em] font-semibold">
                  Demo Accounts
                </span>
              </div>
              <div className="space-y-2 ">
                {demoAccounts.map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => fillDemo(d.email, d.password)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group text-left active:scale-[0.99]"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-navy block">
                        {d.label}
                      </span>
                      <span className="text-[11px] font-mono text-muted truncate block">
                        {d.email}
                      </span>
                    </div>
                    <span className="text-muted opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      <IconArrowRight />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer link */}
        <motion.p
          className="text-center text-muted text-sm mt-6 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          No account?{" "}
          <Link
            href="/register"
            className="text-brand hover:text-navy font-semibold transition-colors inline-flex items-center gap-0.5"
          >
            Create one
            <IconArrowRight />
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
}
