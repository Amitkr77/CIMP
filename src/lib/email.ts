// ── OPTION B: Nodemailer (Gmail) ─────────────────
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOTPEmail(to: string, name: string, otp: string) {
  await transporter.sendMail({
    from: `"Launchpad" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Verify your Launchpad account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0F2144;">Welcome to Launchpad, ${name}!</h2>
        <p style="color: #3D5A80;">Your verification code is:</p>
        <div style="font-size: 40px; font-weight: bold; letter-spacing: 12px;
                    color: #1D4ED8; background: #EFF6FF; padding: 20px;
                    border-radius: 12px; text-align: center; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6B87A8; font-size: 14px;">
          This code expires in <strong>10 minutes</strong>.
        </p>
      </div>
    `,
  });
}
