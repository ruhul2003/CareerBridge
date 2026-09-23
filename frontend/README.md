# CareerBridge – Modern Job Platform

CareerBridge is a sleek, full-featured job marketplace connecting talented job seekers with top recruiters and companies. Built with a beautiful dark UI, smooth animations, a powerful backend, real-time email notifications, and an automated email verification system.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Authentication**: Better Auth (Email/Password + Google OAuth) with Email Verification
- **Real-Time Emails**: Nodemailer (SMTP with automated fallback simulation mode)
- **Database**: MongoDB (Atlas)
- **Payments**: Stripe Checkout & Subscriptions
- **UI & Animations**: HeroUI, Motion (Framer Motion), Lucide Icons
- **AI Integration**: Google Gemini 2.0 Flash (AI Studio)
- **Image Hosting**: ImgBB API

---

## 🌟 Core Features

- **Real-Time Email Notification System**:
  - **Job Application Confirmation**: Sent instantly to job seekers upon applying.
  - **New Candidate Alert**: Sent immediately to recruiters and hiring teams when an application is submitted.
  - **Application Status Changes**: Real-time email updates to candidates when marked as Shortlisted, Interview Scheduled, Accepted, or Rejected.
  - **Subscription Receipts**: Immediate plan activation and upgrade confirmation emails.
  - **Email Diagnostic Engine**: Integrated test and dispatch API endpoints (`/api/emails/test`, `/api/emails/send`).
- **Complete Email Verification System**:
  - Automated verification email generation on signup via Better-Auth.
  - Interactive email verification page (`/verify-email`) supporting automatic URL token verification and manual code submission.
  - One-click "Resend Verification Email" action with a 60-second cooldown protection.
  - Global `EmailVerificationBanner` reminding unverified users to activate their accounts.
  - Profile verification badges (Verified vs. Unverified) across the Navigation Bar, Seeker Settings, Recruiter Settings, and Dashboard Overview.
  - Admin Users Management verification column and status filters.
- **Role-Based Dashboards**: Tailored workspaces for Seekers, Recruiters, and Platform Admins.
- **Advanced Job Search & Filters**: Search by keyword, role, location, remote status, and category.
- **Company Management**: Company profile registration, branding, and active listings overview.
- **AI Studio Tools**: AI-assisted job description generator, resume match assessment, and mock interview coaching.
- **Stripe Subscription Management**: Free, Growth, and Enterprise subscription tiers.

---

## 📧 Email Configuration (SMTP)

The real-time email engine supports any standard SMTP provider (Gmail, Resend, SendGrid, Outlook, Amazon SES) as well as custom SMTP relays:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="CareerBridge" <noreply@careerbridge.com>
```

> **Simulation Mode**: If SMTP variables are not set in `.env`, the system automatically runs in development simulation mode, logging formatted email payloads and tokens safely without throwing exceptions or failing requests.

---

## 🛠️ How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ruhul2003/CareerBridge-Client.git
   cd CareerBridge-Client
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Configure .env based on .env.example
   node index.js
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Configure .env.local based on .env.example
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Development Team

| Name | Student ID | Role |
| :--- | :---: | :--- |
| **MD. Ruhul Amin** | `41230301323` | **Team Leader** & Full-Stack Architect |
| **Anike Podder** | `41230301317` | Developer |
| **Farjana Afrin Urmi** | `41230301324` | Developer |
| **Azharul Islam Tohin** | `41230301335` | Developer |

---

## 🙏 Acknowledgements

We express our deepest gratitude to the entire **CareerBridge** development team for their extraordinary dedication, technical ingenuity, and collaborative spirit. Special recognition goes to **Team Leader MD. Ruhul Amin** (`41230301323`) for providing strategic vision, architecting the full-stack system, and leading the implementation of **Next.js 16**, **Better Auth Email Verification**, **Express.js Real-Time Notifications**, **Google Gemini 2.0 Flash**, and **Stripe**. Equal appreciation to **Anike Podder**, **Farjana Afrin Urmi**, and **Azharul Islam Tohin** for frontend engineering, database optimization, and quality assurance.
