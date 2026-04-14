"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = [
  {
    value: "incubatee",
    label: "Incubatee",
    desc: "Apply with your startup idea",
    icon: "🚀",
  },
  {
    value: "manager",
    label: "Manager",
    desc: "Review and evaluate applications",
    icon: "🔍",
  },
  {
    value: "ceo",
    label: "CEO",
    desc: "Final approval & full system control",
    icon: "👑",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "incubatee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="dot-grid fixed inset-0 opacity-50" />
      <div className="relative z-10 w-full max-w-lg">
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
            Create your account
          </p>
        </div>

        <div
          className="bg-white border border-border rounded-2xl p-8"
          style={{ boxShadow: "0 4px 24px rgba(15,33,68,0.08)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div>
              <label className="block text-sm font-body font-medium text-navy mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, role: r.value }))}
                    className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                      form.role === r.value
                        ? "border-brand bg-blue-50"
                        : "border-border bg-bg hover:border-border-2"
                    }`}
                  >
                    <div className="text-2xl mb-1">{r.icon}</div>
                    <div
                      className={`text-xs font-body font-semibold ${form.role === r.value ? "text-brand" : "text-secondary"}`}
                    >
                      {r.label}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-2 font-body">
                {ROLES.find((r) => r.value === form.role)?.desc}
              </p>
            </div>

            {[
              {
                key: "name",
                label: "Full Name",
                type: "text",
                ph: "Ratan Tata",
              },
              {
                key: "email",
                label: "Email",
                type: "email",
                ph: "you@example.com",
              },
              {
                key: "password",
                label: "Password",
                type: "password",
                ph: "Min 6 characters",
              },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-body font-medium text-navy mb-1.5">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  required
                  minLength={f.key === "password" ? 6 : undefined}
                  value={(form as any)[f.key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-navy font-body text-sm focus:outline-none transition-colors placeholder:text-faint"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59,130,246,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "";
                    e.target.style.boxShadow = "";
                  }}
                  placeholder={f.ph}
                />
              </div>
            ))}

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-xl transition-all disabled:opacity-50 font-body text-sm hover:opacity-90"
              style={{ background: "#1D4ED8" }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-muted text-sm mt-5 font-body">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand hover:text-navy font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
