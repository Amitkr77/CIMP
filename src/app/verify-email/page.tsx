"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value.slice(-1); // max 1 char
    setOtp(next);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter all 6 digits");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
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

  async function handleResend() {
    setResent(false);
    setError("");
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setResent(true);
      setCountdown(60);
    } else {
      const d = await res.json();
      setError(d.error);
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
        </div>

        <div
          className="bg-white border border-border rounded-2xl p-8 text-center"
          style={{ boxShadow: "0 4px 24px rgba(15,33,68,0.08)" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-3xl mx-auto mb-4">
            📧
          </div>
          <h2 className="font-display text-2xl font-semibold text-navy mb-2">
            Check your email
          </h2>
          <p className="text-secondary font-body text-sm mb-1">
            We sent a 6-digit code to
          </p>
          <p className="text-brand font-body text-sm font-semibold mb-6">
            {email}
          </p>

          <form onSubmit={handleSubmit}>
            {/* OTP input boxes */}
            <div className="flex gap-3 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold font-mono text-navy bg-bg border-2 rounded-xl focus:outline-none transition-all"
                  style={{ borderColor: digit ? "#1D4ED8" : "" }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59,130,246,0.12)";
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.style.borderColor = "";
                      e.target.style.boxShadow = "";
                    }
                  }}
                />
              ))}
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-body">
                {error}
              </div>
            )}

            {resent && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-body">
                ✓ New code sent!
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.join("").length < 6}
              className="w-full py-3 text-white font-semibold rounded-xl transition-all disabled:opacity-50 font-body text-sm hover:opacity-90"
              style={{ background: "#1D4ED8" }}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-muted text-sm font-body mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className="text-brand text-sm font-body font-medium hover:text-navy transition-colors disabled:text-muted disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
