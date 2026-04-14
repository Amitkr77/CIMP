"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError(data.error);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="dot-grid fixed inset-0 opacity-50" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#1D4ED8" }}
            >
              <span className="text-white font-bold font-display text-lg">
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
        </div>

        <div
          className="bg-white border border-border rounded-2xl p-8"
          style={{ boxShadow: "0 4px 24px rgba(15,33,68,0.08)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-body font-medium text-navy mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-navy font-body text-sm focus:outline-none focus:border-brand transition-colors placeholder:text-faint"
                style={{ transition: "border-color 0.15s, box-shadow 0.15s" }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B82F6";
                  e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "";
                  e.target.style.boxShadow = "";
                }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-body font-medium text-navy mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-navy font-body text-sm focus:outline-none transition-colors placeholder:text-faint"
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B82F6";
                  e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "";
                  e.target.style.boxShadow = "";
                }}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-body">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-xl transition-all disabled:opacity-50 font-body text-sm"
              style={{ background: "#1D4ED8" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="mt-6 p-4 bg-bg border border-border rounded-xl">
            <p className="text-xs font-mono text-muted mb-2 uppercase tracking-wider">
              Demo Accounts
            </p>
            <div className="space-y-1 text-xs font-mono text-secondary">
              <div>incubatee@demo.com / demo123</div>
              <div>manager@demo.com / demo123</div>
              <div>ceo@demo.com / demo123</div>
            </div>
          </div>
        </div>
        <p className="text-center text-muted text-sm mt-5 font-body">
          No account?{" "}
          <Link
            href="/register"
            className="text-brand hover:text-navy font-medium transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
