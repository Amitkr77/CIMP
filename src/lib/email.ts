import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ─── OTP Email (already working) ──────────────────────────────────────────────

export async function sendOTPEmail(to: string, name: string, otp: string) {
  await transporter.sendMail({
    from: `"Launchpad" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Launchpad verification code",
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#F0F4F9;padding:32px;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="display:inline-block;background:#1D4ED8;color:#fff;font-size:20px;font-weight:700;
                      padding:10px 20px;border-radius:10px;letter-spacing:1px;">LAUNCHPAD</div>
        </div>
        <div style="background:#fff;border-radius:12px;padding:32px;text-align:center;">
          <h2 style="color:#0F2144;margin:0 0 8px;">Verify your email</h2>
          <p style="color:#6B87A8;font-size:14px;margin:0 0 24px;">Hi ${name}, enter this code to activate your account</p>
          <div style="font-size:44px;font-weight:800;letter-spacing:16px;color:#1D4ED8;
                      background:#EFF6FF;padding:20px;border-radius:12px;margin-bottom:24px;">${otp}</div>
          <p style="color:#9BB3CC;font-size:12px;margin:0;">Expires in 10 minutes. Do not share this code.</p>
        </div>
      </div>
    `,
  });
}

// ─── Welcome / Onboarding Email ───────────────────────────────────────────────

const ROLE_META: Record<
  string,
  {
    headline: string;
    subline: string;
    steps: { icon: string; title: string; desc: string }[];
    tips: { icon: string; text: string }[];
    ctaLabel: string;
    ctaUrl: string;
  }
> = {
  incubatee: {
    headline: "You're officially inside. 🚀",
    subline:
      "Your account is verified and ready. Here's exactly what happens from here.",
    steps: [
      {
        icon: "📝",
        title: "Submit Your Application",
        desc: "Fill in your startup details — name, industry, and your core idea. Be specific and compelling.",
      },
      {
        icon: "🔍",
        title: "Manager Review",
        desc: "Our team reviews your submission and may reach out with questions through the messaging system.",
      },
      {
        icon: "👑",
        title: "CEO Final Decision",
        desc: "The CEO personally reviews shortlisted applications — and can fast-track exceptional ones.",
      },
      {
        icon: "🎉",
        title: "Welcome to the Portfolio",
        desc: "If approved, you'll be listed on our public portfolio and begin your incubation journey.",
      },
    ],
    tips: [
      {
        icon: "✍️",
        text: "Write your idea clearly — what problem, who it's for, why you can win.",
      },
      {
        icon: "📎",
        text: "Upload a pitch deck to stand out from other applicants.",
      },
      {
        icon: "💬",
        text: "Check your messages — the team may reach out directly.",
      },
    ],
    ctaLabel: "Submit My Application",
    ctaUrl: "/apply",
  },
  manager: {
    headline: "Access granted. Let's evaluate. 🔍",
    subline:
      "Your manager account is live. You have full access to the review pipeline.",
    steps: [
      {
        icon: "📋",
        title: "View All Applications",
        desc: "See every startup application submitted — sorted by date, filterable by stage.",
      },
      {
        icon: "✅",
        title: "Approve or Reject",
        desc: "Review the idea, add notes, and move applications to the CEO queue or reject with a reason.",
      },
      {
        icon: "💬",
        title: "Message Applicants",
        desc: "Communicate directly with incubatees through the built-in messaging system.",
      },
      {
        icon: "📊",
        title: "Track the Pipeline",
        desc: "Monitor approval rates and pipeline health from your dashboard at a glance.",
      },
    ],
    tips: [
      {
        icon: "⚡",
        text: "Add a note when approving — it helps the CEO make faster decisions.",
      },
      {
        icon: "📬",
        text: "Check messages regularly — applicants may have questions.",
      },
      {
        icon: "🎯",
        text: "Use filters to focus on pending applications first.",
      },
    ],
    ctaLabel: "Go to Approvals",
    ctaUrl: "/approvals",
  },
  ceo: {
    headline: "Full command is yours. 👑",
    subline:
      "CEO access activated. Every lever in the system is now at your disposal.",
    steps: [
      {
        icon: "👑",
        title: "Final Approval Authority",
        desc: "Every application that reaches you has cleared manager review. Your decision is final.",
      },
      {
        icon: "⚡",
        title: "Fast-Track Power",
        desc: "Spot an exceptional application? Bypass manager review entirely with one click.",
      },
      {
        icon: "🌐",
        title: "Publish to Portfolio",
        desc: "Approved startups can be made public — showcasing your portfolio to the world.",
      },
      {
        icon: "📊",
        title: "Analytics Dashboard",
        desc: "See industry breakdown, pipeline stats, fast-track counts, and recent activity in real time.",
      },
    ],
    tips: [
      {
        icon: "⚡",
        text: "Fast-track is your biggest differentiator — use it for exceptional founders.",
      },
      {
        icon: "🌐",
        text: "Publishing to the portfolio builds credibility for your incubator brand.",
      },
      {
        icon: "📋",
        text: "Check the activity feed daily to stay on top of manager decisions.",
      },
    ],
    ctaLabel: "Open Command Center",
    ctaUrl: "/dashboard",
  },
};

export async function sendWelcomeEmail(
  to: string,
  name: string,
  role: "incubatee" | "manager" | "ceo",
) {
  const meta = ROLE_META[role] ?? ROLE_META.incubatee;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const stepsHtml = meta.steps
    .map(
      (s, i) => `
    <tr>
      <td style="padding:0 0 20px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="48" valign="top" style="padding-right:14px;">
              <div style="width:40px;height:40px;background:#EFF6FF;border:1px solid #DBEAFE;
                          border-radius:10px;text-align:center;line-height:40px;font-size:18px;">
                ${s.icon}
              </div>
            </td>
            <td valign="top">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
                <span style="font-size:11px;font-weight:700;color:#9BB3CC;font-family:monospace;
                             letter-spacing:1px;">STEP ${i + 1}</span>
              </div>
              <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#0F2144;">${s.title}</p>
              <p style="margin:0;font-size:13px;color:#6B87A8;line-height:1.6;">${s.desc}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `,
    )
    .join("");

  const tipsHtml = meta.tips
    .map(
      (t) => `
    <tr>
      <td style="padding:0 0 10px 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="28" style="font-size:16px;">${t.icon}</td>
            <td style="font-size:13px;color:#3D5A80;line-height:1.5;">${t.text}</td>
          </tr>
        </table>
      </td>
    </tr>
  `,
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#E8EEF6;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#E8EEF6;padding:40px 16px;">
  <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

      <!-- Logo header -->
      <tr>
        <td align="center" style="padding-bottom:28px;">
          <div style="display:inline-block;background:#1D4ED8;color:#fff;font-size:18px;font-weight:800;
                      padding:10px 22px;border-radius:10px;letter-spacing:2px;">LAUNCHPAD</div>
        </td>
      </tr>

      <!-- Hero card -->
      <tr>
        <td style="background:#0F2144;border-radius:20px 20px 0 0;padding:48px 48px 40px;text-align:center;">
          <div style="font-size:52px;margin-bottom:16px;">🎊</div>
          <h1 style="margin:0 0 12px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.25;">
            ${meta.headline}
          </h1>
          <p style="margin:0 0 24px;font-size:15px;color:#9BB3CC;line-height:1.6;max-width:400px;margin-left:auto;margin-right:auto;">
            ${meta.subline}
          </p>
          <!-- Role badge -->
          <div style="display:inline-block;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);
                      color:#60A5FA;font-size:11px;font-weight:700;letter-spacing:2px;
                      padding:6px 16px;border-radius:999px;font-family:monospace;text-transform:uppercase;">
            ${role === "ceo" ? "👑" : role === "manager" ? "🔍" : "🚀"} &nbsp; ${role}
          </div>
        </td>
      </tr>

      <!-- Greeting ribbon -->
      <tr>
        <td style="background:#1D4ED8;padding:16px 48px;">
          <p style="margin:0;font-size:14px;color:#BFDBFE;">
            Welcome aboard, <strong style="color:#fff;">${name}</strong> —
            your account is verified and fully active.
          </p>
        </td>
      </tr>

      <!-- Steps section -->
      <tr>
        <td style="background:#ffffff;padding:36px 48px 28px;">
          <p style="margin:0 0 24px;font-size:11px;font-weight:700;color:#9BB3CC;letter-spacing:2px;
                    font-family:monospace;text-transform:uppercase;">What happens next</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${stepsHtml}
          </table>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="background:#ffffff;padding:0 48px;">
          <div style="height:1px;background:#D1DDF0;"></div>
        </td>
      </tr>

      <!-- Tips section -->
      <tr>
        <td style="background:#ffffff;padding:28px 48px 36px;">
          <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#9BB3CC;letter-spacing:2px;
                    font-family:monospace;text-transform:uppercase;">Quick-start tips</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${tipsHtml}
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="background:#F7FAFD;border:1px solid #D1DDF0;border-top:none;
                   padding:32px 48px;text-align:center;">
          <a href="${appUrl}${meta.ctaUrl}"
             style="display:inline-block;background:#1D4ED8;color:#ffffff;font-size:15px;
                    font-weight:700;text-decoration:none;padding:14px 36px;
                    border-radius:12px;letter-spacing:0.5px;">
            ${meta.ctaLabel} →
          </a>
        </td>
      </tr>

      <!-- Support footer -->
      <tr>
        <td style="background:#F0F4F9;border-radius:0 0 20px 20px;padding:28px 48px;text-align:center;">
          <p style="margin:0 0 6px;font-size:13px;color:#6B87A8;">
            Questions? Reply to this email or reach out at
            <a href="mailto:${process.env.GMAIL_USER}" style="color:#1D4ED8;text-decoration:none;">
              ${process.env.GMAIL_USER}
            </a>
          </p>
          <p style="margin:0;font-size:11px;color:#9BB3CC;">
            © ${new Date().getFullYear()} Launchpad Incubator · You're receiving this because you just registered.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Launchpad" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Welcome to Launchpad, ${name} — you're in. 🚀`,
    html,
  });
}
