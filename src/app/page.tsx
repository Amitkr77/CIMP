"use client"

import Link from "next/link";
import { motion, Variants } from "framer-motion";

/* ─── Icon Components (replacing emojis) ─── */
const IconSubmit = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);
const IconSearch = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconCrown = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 20h20" />
    <path d="M4 20V10l4-6 4 4 4-4 4 6v10" />
    <circle cx="8" cy="14" r="1" fill="currentColor" />
    <circle cx="16" cy="14" r="1" fill="currentColor" />
  </svg>
);
const IconRocket = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);
const IconShield = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const IconBolt = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconEye = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconArrowRight = () => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const workflowSteps = [
  {
    icon: <IconSubmit />,
    label: "Submit",
    desc: "Apply with your pitch deck and vision",
  },
  {
    icon: <IconSearch />,
    label: "Manager Review",
    desc: "Rigorous first-pass screening",
  },
  {
    icon: <IconCrown />,
    label: "CEO Approval",
    desc: "Direct access, final decision",
  },
  { icon: <IconRocket />, label: "Incubated", desc: "Funded and accelerated" },
];

const workflowColors = [
  { from: "#3b82f6", to: "#06b6d4" },
  { from: "#06b6d4", to: "#a855f7" },
  { from: "#a855f7", to: "#1D4ED8" },
];

const differentiators = [
  {
    icon: <IconBolt />,
    title: "14-Day Decisions",
    desc: "No months of waiting. Our pipeline moves fast because we review continuously, not in batches.",
  },
  {
    icon: <IconCrown />,
    title: "CEO-to-CEO Access",
    desc: "Your final review is with the decision-maker, not a junior analyst screening with a checklist.",
  },
  {
    icon: <IconEye />,
    title: "Full Transparency",
    desc: "See where your application stands at every stage. No black boxes, no ghosting.",
  },
  {
    icon: <IconShield />,
    title: "No Hidden Terms",
    desc: "Our terms are public before you apply. No surprise clawbacks buried in fine print.",
  },
];
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};
export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg antialiased">
      {/* ══════════════════════════════════════
          STYLES (scoped to this page)
          ══════════════════════════════════════ */}
      <style jsx global>{`
        .dot-grid {
          background-image: radial-gradient(
            circle,
            rgba(15, 33, 68, 0.08) 1px,
            transparent 1px
          );
          background-size: 24px 24px;
        }
        .shimmer-blue {
          background: linear-gradient(
            105deg,
            #0f2144 0%,
            #0f2144 35%,
            #1d4ed8 50%,
            #0f2144 65%,
            #0f2144 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%,
          100% {
            background-position: 200% center;
          }
          50% {
            background-position: -200% center;
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(1deg);
          }
        }
        .float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .pulse-ring::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: #1d4ed8;
          animation: pulse-ring 2s ease-out infinite;
          z-index: -1;
        }
      `}</style>

      {/* ══════════════════════════════════════
          NAV
          ══════════════════════════════════════ */}
      <motion.nav
        className="bg-white/80 backdrop-blur-lg border-b border-border sticky top-0 z-50"
        style={{ boxShadow: "0 1px 3px rgba(15,33,68,0.04)" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand group-hover:scale-105 transition-transform"
              style={{ boxShadow: "0 2px 8px rgba(29,78,216,0.25)" }}
            >
              <span
                className="text-white font-bold text-sm"
                style={{ fontFamily: "Lora,serif" }}
              >
                C
              </span>
            </div>
            <span className="font-display text-xl font-semibold text-navy">
              CIMP
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link
              href="/public-startups"
              className="text-secondary hover:text-navy text-sm font-body px-3 py-2 rounded-lg hover:bg-slate-50 transition-all"
            >
              Portfolio
            </Link>
            <Link
              href="/login"
              className="text-secondary hover:text-navy text-sm font-body px-3 py-2 rounded-lg hover:bg-slate-50 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="ml-2 px-5 py-2 rounded-lg text-white text-sm font-semibold font-body transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: "#1D4ED8" }}
            >
              Apply Now
            </Link>
          </div>
          {/* Mobile menu button */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-slate-50 transition-colors text-navy">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════
          HERO
          ══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="dot-grid absolute inset-0" />

        {/* Floating decorative elements */}
        <div
          className="absolute top-32 right-[15%] w-64 h-64 rounded-full opacity-[0.04] float-slow"
          style={{
            background: "radial-gradient(circle, #1D4ED8, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #1D4ED8, transparent 70%)",
            animation: "float-slow 9s ease-in-out infinite reverse",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36 text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-10"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
            </span>
            <span className="text-brand text-xs font-mono tracking-[0.15em] uppercase font-semibold">
              Applications Open
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-navy leading-[1.05] mb-7 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Where Bold Ideas <span className="shimmer-blue">Become</span>
            <br />
            Funded Companies
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-secondary font-body text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Rigorous multi-stage review. Direct CEO access.
            <br className="hidden sm:block" />
            Fast-track for exceptional ventures.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href="/register"
              className="group px-8 py-4 rounded-xl text-white font-semibold font-body transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2"
              style={{
                background: "#1D4ED8",
                boxShadow: "0 4px 20px rgba(29,78,216,0.3)",
              }}
            >
              Submit Your Startup
              <span className="group-hover:translate-x-0.5 transition-transform">
                <IconArrowRight />
              </span>
            </Link>
            <Link
              href="/public-startups"
              className="px-8 py-4 border border-slate-200 text-secondary rounded-xl hover:border-brand hover:text-brand transition-all font-body bg-white hover:shadow-sm flex items-center gap-2"
            >
              View Portfolio
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-24 inline-grid grid-cols-3 gap-x-16 gap-y-0 bg-white border border-slate-100 rounded-2xl px-10 md:px-14 py-8"
            style={{ boxShadow: "0 4px 32px rgba(15,33,68,0.06)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {[
              { value: "< 14", unit: "Days", label: "Avg. Decision Time" },
              { value: "3", unit: "Stages", label: "Deep Review Process" },
              { value: "100%", unit: "", label: "Transparent Pipeline" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 + i * 0.1 }}
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-navy leading-none">
                  {s.value}
                  <span className="text-brand text-lg md:text-xl">
                    {s.unit}
                  </span>
                </div>
                <div className="text-muted text-[11px] font-mono tracking-[0.12em] uppercase mt-2">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WORKFLOW — Curved Connectors
          ══════════════════════════════════════ */}
      <section className="border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.p
            className="text-center text-muted text-xs font-mono tracking-[0.2em] uppercase mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            The Journey
          </motion.p>

          {/* Desktop: Horizontal */}
          <div className="hidden md:flex items-start">
            {workflowSteps.map((step, i) => (
              <div key={step.label} className="flex items-start flex-1">
                {/* Step card */}
                <motion.div
                  className="flex-1 text-center group"
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl border-2 border-slate-100 bg-white text-secondary mb-5 group-hover:border-brand group-hover:text-brand group-hover:shadow-lg group-hover:shadow-blue-50 transition-all duration-300 mx-auto">
                    {step.icon}
                  </div>
                  <div className="text-navy text-sm font-body font-bold tracking-tight">
                    {step.label}
                  </div>
                  <div className="text-muted text-xs mt-1 font-body max-w-[160px] mx-auto leading-relaxed">
                    {step.desc}
                  </div>
                </motion.div>

                {/* Curved connector */}
                {i < 3 && (
                  <div className="self-start mt-7 flex-shrink-0 w-16 lg:w-24 -mx-1">
                    <svg
                      width="100%"
                      height="36"
                      viewBox="0 0 80 36"
                      fill="none"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        <linearGradient
                          id={`wf-${i}`}
                          x1="0"
                          y1="0"
                          x2="80"
                          y2="0"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop
                            offset="0%"
                            stopColor={workflowColors[i].from}
                            stopOpacity="0.5"
                          />
                          <stop
                            offset="100%"
                            stopColor={workflowColors[i].to}
                            stopOpacity="0.5"
                          />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M 4 8 C 26 32, 54 32, 76 8"
                        stroke={`url(#wf-${i})`}
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                        pathLength={1}
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: 0.3 + i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.circle
                        cx="76"
                        cy="8"
                        r="3"
                        fill={workflowColors[i].to}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.8 + i * 0.15 }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: Vertical */}
          <div className="md:hidden flex flex-col items-center">
            {workflowSteps.map((step, i) => (
              <div
                key={step.label}
                className="flex flex-col items-center w-full"
              >
                <motion.div
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-5 flex items-center gap-4"
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl border-2 border-slate-200 bg-white text-secondary flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-navy text-sm font-bold">
                      {step.label}
                    </div>
                    <div className="text-muted text-xs mt-0.5">{step.desc}</div>
                  </div>
                </motion.div>
                {i < 3 && (
                  <div className="my-1">
                    <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
                      <motion.path
                        d="M 6 4 C 22 12, 22 28, 6 36"
                        stroke={workflowColors[i].from}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.4"
                        pathLength={1}
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          DIFFERENTIATORS
          ══════════════════════════════════════ */}
      <section className="border-t border-slate-100 bg-bg">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="text-muted text-xs font-mono tracking-[0.2em] uppercase mb-4">
              Why CIMP
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy tracking-tight">
              What Sets Us Apart
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.title}
                className="group bg-white border border-slate-100 rounded-2xl p-7 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300"
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-brand flex items-center justify-center mb-5 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                  {d.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-navy mb-2 tracking-tight">
                  {d.title}
                </h3>
                <p className="text-secondary text-sm font-body leading-relaxed">
                  {d.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BAND
          ══════════════════════════════════════ */}
      <section className="border-t border-slate-100 bg-navy relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, #1D4ED8, transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 py-24 md:py-28 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-white tracking-tight mb-5 leading-tight">
              Ready to Build
              <br />
              Something Real?
            </h2>
            <p className="text-slate-400 font-body text-lg mb-10 max-w-md mx-auto">
              Applications are reviewed continuously. The earlier you apply, the
              faster you hear back.
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-9 py-4 rounded-xl text-white font-semibold font-body transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: "#1D4ED8",
                boxShadow: "0 4px 24px rgba(29,78,216,0.35)",
              }}
            >
              Start Your Application
              <span className="group-hover:translate-x-0.5 transition-transform">
                <IconArrowRight />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
          ══════════════════════════════════════ */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-brand">
              <span
                className="text-white font-bold text-[10px]"
                style={{ fontFamily: "Lora,serif" }}
              >
                C
              </span>
            </div>
            <span className="font-display text-sm font-semibold text-navy">
              CIMP
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/public-startups"
              className="text-muted hover:text-navy text-xs font-body transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/login"
              className="text-muted hover:text-navy text-xs font-body transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-muted hover:text-navy text-xs font-body transition-colors"
            >
              Apply
            </Link>
          </div>
          <p className="text-muted text-xs font-body">
            &copy; {new Date().getFullYear()} CIMP
          </p>
        </div>
      </footer>
    </main>
  );
}
