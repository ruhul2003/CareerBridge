/**
 * Reusable responsive HTML email templates for CareerBridge
 * Designed with modern email styling, rich accents, and responsive layout.
 */

const APP_NAME = "CareerBridge";
const PRIMARY_COLOR = "#0284c7"; // Sky 600
const ACCENT_COLOR = "#6366f1"; // Indigo 500
const DARK_BG = "#09090b"; // Zinc 950
const CARD_BG = "#18181b"; // Zinc 900
const TEXT_LIGHT = "#f4f4f5"; // Zinc 100
const TEXT_MUTED = "#a1a1aa"; // Zinc 400

/**
 * Base email layout wrapper
 */
function baseEmailWrapper({ title, previewText, contentHtml, footerNote }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || APP_NAME}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0c0a09;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: ${TEXT_LIGHT};
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
      background: ${CARD_BG};
      border-radius: 16px;
      border: 1px solid #27272a;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
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
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
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
      color: ${TEXT_MUTED};
      border-top: 1px solid #27272a;
      background-color: #121215;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${previewText || title}
  </div>
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
 * 1. Email Verification Template
 */
function emailVerificationTemplate({ name, verifyUrl, token }) {
  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #ffffff;">Verify Your Email Address</h2>
    <p>Hello ${name ? name : "there"},</p>
    <p>Thank you for joining <strong>CareerBridge</strong>! Please confirm your email address by clicking the verification button below:</p>
    
    <div style="text-align: center;">
      <a href="${verifyUrl}" class="btn-action">Verify Email Address &rarr;</a>
    </div>

    ${token ? `
    <div class="info-card">
      <div style="font-size: 12px; text-transform: uppercase; color: #a1a1aa; font-weight: 600; margin-bottom: 4px;">Or use this verification code:</div>
      <div style="font-family: monospace; font-size: 22px; font-weight: bold; letter-spacing: 4px; color: #38bdf8;">${token}</div>
    </div>` : ''}

    <p style="font-size: 13px; color: #a1a1aa; margin-top: 20px;">
      If the button above does not work, copy and paste this link into your browser:<br/>
      <a href="${verifyUrl}" style="color: #38bdf8; word-break: break-all;">${verifyUrl}</a>
    </p>

    <p style="font-size: 12px; color: #71717a; margin-top: 24px;">
      If you did not create an account on CareerBridge, you can safely ignore this email.
    </p>
  `;

  return baseEmailWrapper({
    title: "Verify your email - CareerBridge",
    previewText: "Please verify your email address to activate your CareerBridge account.",
    contentHtml,
  });
}

/**
 * 2. Welcome Email Template
 */
function welcomeEmailTemplate({ name, role, appUrl }) {
  const isRecruiter = role === "recruiter";
  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #ffffff;">Welcome to CareerBridge, ${name || "User"}! 🎉</h2>
    <p>We are thrilled to have you with us. Your account is ready and configured as a <strong>${isRecruiter ? "Hiring Manager / Recruiter" : "Job Seeker"}</strong>.</p>
    
    <div class="info-card">
      <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #ffffff;">Here is what you can do right now:</h3>
      <ul style="margin: 0; padding-left: 20px; color: #d4d4d8;">
        ${isRecruiter ? `
          <li>Create or register your company profile</li>
          <li>Post new job listings and attract top-tier candidates</li>
          <li>Review resumes and manage applicants in real-time</li>
          <li>Utilize AI Studio for instant job description generation</li>
        ` : `
          <li>Explore curated job openings matching your profile</li>
          <li>Save jobs and track applications in real-time</li>
          <li>Generate AI-tailored cover letters and resume match scores</li>
          <li>Get instantly notified on application status changes</li>
        `}
      </ul>
    </div>

    <div style="text-align: center;">
      <a href="${appUrl || 'https://career-bridge-client-xi.vercel.app'}" class="btn-action">Go to Dashboard &rarr;</a>
    </div>
  `;

  return baseEmailWrapper({
    title: "Welcome to CareerBridge!",
    previewText: `Welcome to CareerBridge, ${name || 'User'}! Get started today.`,
    contentHtml,
  });
}

/**
 * 3. Application Submitted Confirmation (to Seeker)
 */
function applicationSubmittedTemplate({ applicantName, jobTitle, companyName, jobId, appUrl }) {
  const contentHtml = `
    <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34d399; font-size: 12px; font-weight: 600; margin-bottom: 12px;">
      ✓ Application Received
    </div>
    <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #ffffff;">Your application was sent successfully!</h2>
    <p>Hi ${applicantName || "there"},</p>
    <p>Good news! Your job application for <strong>${jobTitle}</strong> at <strong>${companyName || "the hiring team"}</strong> has been delivered directly to the recruiter.</p>
    
    <div class="info-card">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; width: 120px;">Role:</td>
          <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${jobTitle}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa;">Company:</td>
          <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${companyName || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa;">Applied Date:</td>
          <td style="padding: 6px 0; color: #ffffff;">${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa;">Initial Status:</td>
          <td style="padding: 6px 0;"><span style="color: #38bdf8; font-weight: bold;">Applied (Under Review)</span></td>
        </tr>
      </table>
    </div>

    <p>You will receive real-time email updates as soon as the employer reviews your application, shortlists you, or schedules an interview.</p>

    <div style="text-align: center;">
      <a href="${appUrl || 'https://career-bridge-client-xi.vercel.app'}/dashboard/seeker" class="btn-action">Track Application &rarr;</a>
    </div>
  `;

  return baseEmailWrapper({
    title: `Application Confirmed: ${jobTitle}`,
    previewText: `Your application for ${jobTitle} at ${companyName || 'the employer'} was successfully submitted!`,
    contentHtml,
  });
}

/**
 * 4. New Applicant Alert (to Recruiter)
 */
function newApplicantRecruiterTemplate({ recruiterName, applicantName, applicantEmail, jobTitle, resumeUrl, coverLetter, appUrl }) {
  const contentHtml = `
    <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; font-size: 12px; font-weight: 600; margin-bottom: 12px;">
      🔔 New Candidate Application
    </div>
    <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #ffffff;">New Applicant for ${jobTitle}</h2>
    <p>Hello ${recruiterName || "Hiring Manager"},</p>
    <p>A new candidate has just submitted an application for your active listing <strong>${jobTitle}</strong>.</p>
    
    <div class="info-card">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; width: 120px;">Candidate:</td>
          <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${applicantName || "Confidential"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa;">Email:</td>
          <td style="padding: 6px 0; color: #38bdf8;">${applicantEmail}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa;">Applied Time:</td>
          <td style="padding: 6px 0; color: #ffffff;">${new Date().toLocaleString()}</td>
        </tr>
        ${resumeUrl ? `
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa;">Resume/CV:</td>
          <td style="padding: 6px 0;"><a href="${resumeUrl}" style="color: #6366f1; text-decoration: underline;" target="_blank">View Attached Document</a></td>
        </tr>` : ''}
      </table>
    </div>

    ${coverLetter ? `
    <div style="background: #1e1e24; border-radius: 8px; padding: 14px 16px; margin: 16px 0; font-style: italic; color: #d4d4d8; font-size: 13px; border: 1px solid #2e2e38;">
      "${coverLetter.length > 250 ? coverLetter.substring(0, 250) + "..." : coverLetter}"
    </div>` : ''}

    <div style="text-align: center;">
      <a href="${appUrl || 'https://career-bridge-client-xi.vercel.app'}/dashboard/recruiter" class="btn-action">Review Candidate in Dashboard &rarr;</a>
    </div>
  `;

  return baseEmailWrapper({
    title: `New Candidate: ${applicantName} for ${jobTitle}`,
    previewText: `New candidate application received for ${jobTitle}`,
    contentHtml,
  });
}

/**
 * 5. Application Status Update (to Seeker)
 */
function applicationStatusUpdateTemplate({ applicantName, jobTitle, companyName, newStatus, message, dashboardUrl }) {
  let badgeColor = "#38bdf8"; // default blue
  let badgeBg = "rgba(56, 189, 248, 0.15)";
  let badgeBorder = "rgba(56, 189, 248, 0.3)";

  if (newStatus === "Shortlisted" || newStatus === "Accepted" || newStatus === "Hired") {
    badgeColor = "#34d399"; // green
    badgeBg = "rgba(16, 185, 129, 0.15)";
    badgeBorder = "rgba(16, 185, 129, 0.3)";
  } else if (newStatus === "Rejected") {
    badgeColor = "#f87171"; // red
    badgeBg = "rgba(244, 63, 94, 0.15)";
    badgeBorder = "rgba(244, 63, 94, 0.3)";
  } else if (newStatus === "Interview" || newStatus === "Interview Scheduled") {
    badgeColor = "#fbbf24"; // amber
    badgeBg = "rgba(245, 158, 11, 0.15)";
    badgeBorder = "rgba(245, 158, 11, 0.3)";
  }

  const contentHtml = `
    <div style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background: ${badgeBg}; border: 1px solid ${badgeBorder}; color: ${badgeColor}; font-size: 13px; font-weight: 700; margin-bottom: 12px;">
      Status: ${newStatus}
    </div>
    <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #ffffff;">Update on your application for ${jobTitle}</h2>
    <p>Dear ${applicantName || "Applicant"},</p>
    <p>The hiring team at <strong>${companyName || "the organization"}</strong> has updated the status of your application for <strong>${jobTitle}</strong> to:</p>
    
    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; font-size: 22px; font-weight: 800; color: ${badgeColor}; padding: 10px 24px; background: #27272a; border-radius: 12px; border: 1px solid #3f3f46;">
        ${newStatus}
      </span>
    </div>

    ${message ? `
    <div class="info-card">
      <div style="font-weight: 600; margin-bottom: 4px; color: #ffffff;">Message from recruiter:</div>
      <p style="margin: 0; color: #e4e4e7;">${message}</p>
    </div>` : ''}

    <p style="font-size: 14px; color: #a1a1aa;">
      You can view complete application history, feedback, and recruiter notes directly in your CareerBridge dashboard.
    </p>

    <div style="text-align: center;">
      <a href="${dashboardUrl || 'https://career-bridge-client-xi.vercel.app'}/dashboard/seeker" class="btn-action">View Application Status &rarr;</a>
    </div>
  `;

  return baseEmailWrapper({
    title: `Application Update: ${jobTitle} is now ${newStatus}`,
    previewText: `Your application status for ${jobTitle} was updated to ${newStatus}.`,
    contentHtml,
  });
}

/**
 * 6. Subscription / Plan Confirmation Template
 */
function subscriptionConfirmationTemplate({ userName, planName, amount, billingCycle, invoiceId }) {
  const contentHtml = `
    <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); color: #818cf8; font-size: 12px; font-weight: 600; margin-bottom: 12px;">
      ✨ Plan Activated
    </div>
    <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #ffffff;">Thank you for your subscription!</h2>
    <p>Hello ${userName || "Valued Member"},</p>
    <p>Your subscription to <strong>${planName || "CareerBridge Pro"}</strong> is now active. All premium privileges, unlimited applications, and priority AI Studio tooling are unlocked on your account.</p>
    
    <div class="info-card">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa; width: 120px;">Plan:</td>
          <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${planName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa;">Amount:</td>
          <td style="padding: 6px 0; color: #34d399; font-weight: 600;">$${amount || "0"} / ${billingCycle || "month"}</td>
        </tr>
        ${invoiceId ? `
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa;">Transaction Ref:</td>
          <td style="padding: 6px 0; color: #a1a1aa; font-family: monospace;">${invoiceId}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 6px 0; color: #a1a1aa;">Active From:</td>
          <td style="padding: 6px 0; color: #ffffff;">${new Date().toLocaleDateString()}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center;">
      <a href="https://career-bridge-client-xi.vercel.app" class="btn-action">Access Pro Features &rarr;</a>
    </div>
  `;

  return baseEmailWrapper({
    title: `Subscription Activated: ${planName}`,
    previewText: `Your ${planName} subscription is now active on CareerBridge!`,
    contentHtml,
  });
}

module.exports = {
  baseEmailWrapper,
  emailVerificationTemplate,
  welcomeEmailTemplate,
  applicationSubmittedTemplate,
  newApplicantRecruiterTemplate,
  applicationStatusUpdateTemplate,
  subscriptionConfirmationTemplate,
};
