// src/modules/otp/templates/email.templates.js
/**
 * HTML Email Templates for OTP notifications
 * BRD: Email transactional notifications
 */

const BASE_STYLE = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  margin: 0; padding: 0;
`;

const CARD_STYLE = `
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  max-width: 520px;
  margin: 40px auto;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
`;

const OTP_BOX_STYLE = `
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 12px;
  padding: 20px 32px;
  text-align: center;
  margin: 28px 0;
`;

const FOOTER_STYLE = `
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

/**
 * Generic OTP email wrapper
 */
const buildOtpEmail = ({ heading, subtext, otp, expiryMinutes = 10, note = '' }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CareConnect — ${heading}</title>
</head>
<body style="${BASE_STYLE}">
  <div style="${CARD_STYLE}">

    <!-- Logo -->
    <div style="text-align:center; margin-bottom:24px;">
      <span style="font-size:28px; font-weight:800; color:#0f172a;">
        Care<span style="color:#4f46e5;">Connect</span>
      </span>
      <p style="margin:4px 0 0; color:#64748b; font-size:13px;">🏥 Doctor-on-Demand Platform</p>
    </div>

    <!-- Heading -->
    <h1 style="font-size:22px; font-weight:700; color:#0f172a; margin:0 0 8px;">${heading}</h1>
    <p style="color:#64748b; font-size:15px; margin:0 0 4px;">${subtext}</p>

    <!-- OTP Box -->
    <div style="${OTP_BOX_STYLE}">
      <p style="color:rgba(255,255,255,0.8); font-size:13px; margin:0 0 8px; letter-spacing:1px; text-transform:uppercase;">Your OTP Code</p>
      <span style="font-size:42px; font-weight:800; color:#ffffff; letter-spacing:10px;">${otp}</span>
      <p style="color:rgba(255,255,255,0.7); font-size:12px; margin:10px 0 0;">Expires in ${expiryMinutes} minutes</p>
    </div>

    <!-- Security Note -->
    <div style="background:#fef3c7; border-left:4px solid #f59e0b; border-radius:8px; padding:14px 18px; margin:20px 0;">
      <p style="margin:0; color:#92400e; font-size:13px;">
        ⚠️ <strong>Security Notice:</strong> Never share this OTP with anyone. CareConnect will never ask for your OTP via call or message.
      </p>
    </div>

    ${note ? `<p style="color:#64748b; font-size:13px; margin:16px 0 0;">${note}</p>` : ''}

    <!-- Footer -->
    <div style="${FOOTER_STYLE}">
      <p style="margin:0 0 4px;">© ${new Date().getFullYear()} CareConnect Healthcare SaaS</p>
      <p style="margin:0;">If you did not request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
`;

// ============================================================
// Specific Templates
// ============================================================

const emailVerifyTemplate = (name, otp) => ({
  subject: `${otp} — Verify Your Email | CareConnect`,
  html: buildOtpEmail({
    heading:  `Welcome, ${name}! 👋`,
    subtext:  'Please verify your email address to activate your CareConnect account.',
    otp,
    expiryMinutes: 10,
    note: 'This OTP is valid for 10 minutes from the time of request.',
  }),
});

const phoneVerifyTemplate = (otp) => ({
  subject: `${otp} — Verify Your Phone | CareConnect`,
  html: buildOtpEmail({
    heading:  'Verify Your Phone Number',
    subtext:  'Use the OTP below to verify your phone number.',
    otp,
    expiryMinutes: 10,
  }),
});

const loginOtpTemplate = (name, otp) => ({
  subject: `${otp} — Login OTP | CareConnect`,
  html: buildOtpEmail({
    heading:  `Login to CareConnect`,
    subtext:  `Hi ${name}, use the OTP below to complete your login.`,
    otp,
    expiryMinutes: 10,
    note: 'If you did not initiate this login, please secure your account immediately.',
  }),
});

const passwordResetTemplate = (name, otp) => ({
  subject: `${otp} — Password Reset | CareConnect`,
  html: buildOtpEmail({
    heading:  'Reset Your Password',
    subtext:  `Hi ${name}, use the OTP below to reset your password.`,
    otp,
    expiryMinutes: 10,
    note: 'This OTP is for password reset only. It expires in 10 minutes.',
  }),
});

const appointmentConfirmTemplate = ({ patientName, doctorName, scheduledAt, appointmentId }) => ({
  subject: `Appointment Confirmed — ${doctorName} | CareConnect`,
  html: `
<!DOCTYPE html><html><body style="${BASE_STYLE}">
  <div style="${CARD_STYLE}">
    <div style="text-align:center; margin-bottom:24px;">
      <span style="font-size:28px; font-weight:800; color:#0f172a;">Care<span style="color:#4f46e5;">Connect</span></span>
    </div>
    <div style="text-align:center; margin:20px 0;">
      <span style="font-size:48px;">✅</span>
      <h1 style="font-size:22px; font-weight:700; color:#0f172a; margin:12px 0 4px;">Appointment Confirmed!</h1>
      <p style="color:#64748b;">Your appointment has been successfully booked.</p>
    </div>
    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:20px; margin:20px 0;">
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px 0; color:#64748b; font-size:14px;">Patient</td><td style="padding:8px 0; font-weight:600; color:#0f172a;">${patientName}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-size:14px;">Doctor</td><td style="padding:8px 0; font-weight:600; color:#0f172a;">${doctorName}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-size:14px;">Scheduled</td><td style="padding:8px 0; font-weight:600; color:#0f172a;">${scheduledAt}</td></tr>
        <tr><td style="padding:8px 0; color:#64748b; font-size:14px;">Booking ID</td><td style="padding:8px 0; font-weight:600; color:#4f46e5;">#${appointmentId}</td></tr>
      </table>
    </div>
    <div style="${FOOTER_STYLE}">
      <p>© ${new Date().getFullYear()} CareConnect Healthcare SaaS</p>
    </div>
  </div>
</body></html>`,
});

module.exports = {
  emailVerifyTemplate,
  phoneVerifyTemplate,
  loginOtpTemplate,
  passwordResetTemplate,
  appointmentConfirmTemplate,
};
