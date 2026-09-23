const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = null;

/**
 * Initialize or retrieve the nodemailer transporter.
 * Supports SMTP (Gmail, Outlook, Resend, SendGrid, custom SMTP)
 * with graceful fallback to Ethereal / simulated transport in dev/testing.
 */
function getTransporter() {
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
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    console.log(`[EmailService] Configured SMTP transporter for host: ${host}`);
  } else {
    // Development / fallback transporter: logs to console cleanly without throwing errors
    console.warn("[EmailService] SMTP credentials not provided in .env. Using mock/simulated email transporter.");
    transporter = {
      sendMail: async (mailOptions) => {
        const fakeMessageId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        console.log(`\n================== [REAL-TIME EMAIL SIMULATION] ==================`);
        console.log(`To:      ${mailOptions.to}`);
        console.log(`From:    ${mailOptions.from || process.env.SMTP_FROM || "CareerBridge <noreply@careerbridge.com>"}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Time:    ${new Date().toISOString()}`);
        console.log(`Preview: ${(mailOptions.text || mailOptions.html || "").substring(0, 150)}...`);
        console.log(`==================================================================\n`);
        return {
          messageId: fakeMessageId,
          accepted: [mailOptions.to],
          rejected: [],
          response: "250 Mock email accepted and logged",
        };
      },
      verify: async () => true,
    };
  }

  return transporter;
}

/**
 * Send an email through the active transporter
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.html] - HTML body
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.from] - Custom sender
 */
async function sendEmail({ to, subject, html, text, from }) {
  if (!to) {
    console.error("[EmailService] Recipient 'to' is required to send email.");
    return { success: false, error: "Missing recipient email address." };
  }

  const sender = from || process.env.SMTP_FROM || '"CareerBridge" <noreply@careerbridge.com>';

  try {
    const mailClient = getTransporter();
    const info = await mailClient.sendMail({
      from: sender,
      to,
      subject,
      text: text || (html ? html.replace(/<[^>]*>?/gm, "") : ""),
      html,
    });

    console.log(`[EmailService] Email sent successfully to ${to} [ID: ${info.messageId}]`);
    return {
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      response: info.response,
    };
  } catch (error) {
    console.error(`[EmailService] Failed to send email to ${to}:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify transporter connectivity
 */
async function verifyEmailConfig() {
  try {
    const mailClient = getTransporter();
    if (mailClient.verify) {
      await mailClient.verify();
      return { connected: true, message: "Transporter is ready." };
    }
    return { connected: true, message: "Transporter active (mock mode)." };
  } catch (err) {
    return { connected: false, message: err.message };
  }
}

module.exports = {
  getTransporter,
  sendEmail,
  verifyEmailConfig,
};
