import nodemailer from "nodemailer";

let transporter = null;

/**
 * Initialize or get active nodemailer transporter for Next.js server environment
 */
export function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
    console.log(`[Next.js EmailService] Initialized SMTP transporter for: ${host}`);
  } else {
    // Development / fallback simulation
    console.warn("[Next.js EmailService] SMTP credentials missing in .env. Running in simulation mode.");
    transporter = {
      sendMail: async (mailOptions) => {
        const fakeMessageId = `mock-client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        console.log(`\n================== [NEXT.js REAL-TIME EMAIL SIMULATION] ==================`);
        console.log(`To:      ${mailOptions.to}`);
        console.log(`From:    ${mailOptions.from || process.env.SMTP_FROM || "CareerBridge <noreply@careerbridge.com>"}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Time:    ${new Date().toISOString()}`);
        console.log(`Preview: ${(mailOptions.text || mailOptions.html || "").substring(0, 160)}...`);
        console.log(`=========================================================================\n`);
        return {
          messageId: fakeMessageId,
          accepted: [mailOptions.to],
          rejected: [],
          response: "250 Mock email accepted and logged",
        };
      },
    };
  }

  return transporter;
}

/**
 * Base email layout wrapper
 */
export function baseEmailWrapper({ title, previewText, contentHtml, footerNote }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || "CareerBridge"}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0c0a09;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f4f4f5;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0c0a09;
      padding: 40px 10px;
    }
    .main-card {
      max-width: 600px;
      margin: 0 auto;
      background: #18181b;
      border-radius: 16px;
      border: 1px solid #27272a;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .header-banner {
      background: linear-gradient(135deg, #0284c7 0%, #4f46e5 50%, #ea580c 100%);
      padding: 32px 30px;
      text-align: center;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin: 0;
    }
    .brand-tagline {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 6px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .body-content {
      padding: 36px 32px;
      font-size: 15px;
      line-height: 1.6;
      color: #e4e4e7;
    }
    .btn-action {
      display: inline-block;
      background: linear-gradient(135deg, #0284c7, #6366f1);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 32px;
      border-radius: 10px;
      margin: 24px 0 16px 0;
      text-align: center;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
    }
    .info-card {
      background: #27272a;
      border-left: 4px solid #38bdf8;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 20px 0;
      font-size: 14px;
    }
    .footer-section {
      text-align: center;
      padding: 24px;
      font-size: 12px;
      color: #a1a1aa;
      border-top: 1px solid #27272a;
      background-color: #121215;
    }
  </style>
</head>
<body>
  <table class="wrapper" role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <div class="main-card">
          <div class="header-banner">
            <h1 class="brand-title">Career<span style="color:#fdba74;">Bridge</span></h1>
            <div class="brand-tagline">Connecting Talent With Exceptional Opportunities</div>
          </div>
          <div class="body-content">
            ${contentHtml}
          </div>
          <div class="footer-section">
            <p style="margin: 0 0 8px 0;">${footerNote || "You are receiving this real-time notification from your CareerBridge account."}</p>
            <p style="margin: 0; color: #71717a;">&copy; ${new Date().getFullYear()} CareerBridge Inc. All rights reserved.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send an email directly via the configured transporter
 */
export async function sendTransactionalEmail({ to, subject, html, text, from }) {
  if (!to) {
    console.error("[Next.js EmailService] Recipient 'to' is required.");
    return { success: false, error: "Recipient email is required" };
  }

  const sender = from || process.env.SMTP_FROM || '"CareerBridge" <noreply@careerbridge.com>';

  try {
    const client = getTransporter();
    const info = await client.sendMail({
      from: sender,
      to,
      subject,
      text: text || (html ? html.replace(/<[^>]*>?/gm, "") : ""),
      html,
    });

    console.log(`[Next.js EmailService] Email successfully dispatched to ${to} [ID: ${info.messageId}]`);
    return { success: true, messageId: info.messageId, response: info.response };
  } catch (error) {
    console.error(`[Next.js EmailService] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send a branded Email Verification Email
 */
export async function sendVerificationEmail({ to, name, verifyUrl, token }) {
  const contentHtml = `
    <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; font-size: 12px; font-weight: 600; margin-bottom: 12px;">
      🔒 Account Security
    </div>
    <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #ffffff;">Verify Your Email Address</h2>
    <p>Hello ${name || "there"},</p>
    <p>Welcome to <strong>CareerBridge</strong>! Please confirm your email address to complete your account setup and unlock full access to job applications, postings, and AI Studio tools.</p>
    
    <div style="text-align: center;">
      <a href="${verifyUrl}" class="btn-action">Verify Email Address &rarr;</a>
    </div>

    ${token ? `
    <div class="info-card">
      <div style="font-size: 12px; text-transform: uppercase; color: #a1a1aa; font-weight: 600; margin-bottom: 4px;">Or use this verification code:</div>
      <div style="font-family: monospace; font-size: 22px; font-weight: bold; letter-spacing: 4px; color: #38bdf8;">${token}</div>
    </div>` : ''}

    <p style="font-size: 13px; color: #a1a1aa; margin-top: 20px;">
      If the button above does not work, copy and paste this URL into your browser:<br/>
      <a href="${verifyUrl}" style="color: #38bdf8; word-break: break-all;">${verifyUrl}</a>
    </p>

    <p style="font-size: 12px; color: #71717a; margin-top: 24px;">
      This verification link will expire in 24 hours. If you did not create a CareerBridge account, please ignore this email.
    </p>
  `;

  const html = baseEmailWrapper({
    title: "Verify your email - CareerBridge",
    previewText: "Verify your email address to complete your CareerBridge account registration.",
    contentHtml,
  });

  return sendTransactionalEmail({
    to,
    subject: "Verify your CareerBridge email address",
    html,
  });
}

/**
 * Send Welcome Email
 */
export async function sendWelcomeEmail({ to, name, role }) {
  const isRecruiter = role === "recruiter";
  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #ffffff;">Welcome to CareerBridge, ${name || "there"}! 🎉</h2>
    <p>Your account is ready as a <strong>${isRecruiter ? "Hiring Manager / Recruiter" : "Job Seeker"}</strong>.</p>
    
    <div class="info-card">
      <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #ffffff;">What you can do next:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #d4d4d8;">
        ${isRecruiter ? `
          <li>Set up your company profile and brand presence</li>
          <li>Publish job openings and reach qualified applicants</li>
          <li>Review resumes and manage applications in real time</li>
        ` : `
          <li>Browse curated positions matching your career goals</li>
          <li>Track all your job applications with real-time status notifications</li>
          <li>Leverage AI tools for cover letter generation and resume matching</li>
        `}
      </ul>
    </div>

    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://career-bridge-client-xi.vercel.app'}" class="btn-action">Explore CareerBridge &rarr;</a>
    </div>
  `;

  const html = baseEmailWrapper({
    title: "Welcome to CareerBridge!",
    previewText: "Welcome to CareerBridge - your career platform is ready.",
    contentHtml,
  });

  return sendTransactionalEmail({
    to,
    subject: "Welcome to CareerBridge!",
    html,
  });
}
