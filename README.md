# CareerBridge - Intelligent Job Portal & Career Platform

CareerBridge is a comprehensive full-stack career platform engineered with Next.js (App Router), Express.js, MongoDB, Tailwind CSS, and Google Gemini AI.

---

## 🚀 Resume Analyzing & Profile Auto-Fill System

CareerBridge features an intelligent **Resume Analyzing System** allowing job seekers to upload resumes in multiple file formats and seamlessly sync extracted credentials directly into their user profile.

### Key Capabilities

1. **Multi-Format Document Support**:
   - **PDF Documents**: Direct analysis via Google Gemini multimodal processing and layout inspection.
   - **Images (PNG, JPG, JPEG, WEBP)**: Visual OCR and layout extraction of scanned or visual CVs.
   - **Plain Text (TXT)**: Direct text decoding and regex heuristic keyword parsing.

2. **Extracted Profile Fields**:
   - **Candidate Identity**: Full Name, Professional Headline/Target Role, and Executive Bio/Summary.
   - **Contact Channels**: Direct Email Address, Phone Number, and Geographic Location.
   - **Social & Portfolios**: GitHub repository, LinkedIn profile, portfolio URL, and personal website.
   - **Skills Footprint**: Automatic detection against 150+ technology and business skill keywords.
   - **Work History**: Company name, job title, employment type, location, dates, and responsibilities.
   - **Education**: Degree title, institution, field of study, graduation year, and GPA/grade.

3. **ATS Compatibility & Readiness Scoring**:
   - Real-time compatibility score (0 to 100) based on keyword density, structure, and contact clarity.
   - Actionable strengths and improvement recommendations.
   - Target job roles suggestions based on detected skills.

4. **Interactive Profile Sync Workflow**:
   - **Resume Analyzer Tab**: Dedicated portal in the Seeker Dashboard with drag-and-drop upload, radial ATS gauge, interactive skills chip editor, and experience timeline.
   - **Profile Studio Auto-Fill Drawer**: Quick-action modal inside `SettingsTab` to instantly populate profile input forms from uploaded resumes.
   - **Side-by-Side Diff & Selective Merge**: Choose which extracted fields to accept before persisting to MongoDB.

---

## 🛠️ API Endpoints

### 1. Resume Analysis
- **POST** `/api/ai/analyze-resume`
  - Accepts `multipart/form-data` (file) or JSON `{ fileBase64, mimeType, fileName, textContent }`.
  - Returns structured `parsedProfile`, `analysis` (ATS score, strengths, improvements), and `rawTextPreview`.

### 2. Profile Synchronization
- **POST** `/api/resume/apply-to-profile`
  - Accepts `{ userId, profileData, analysisMetadata }`.
  - Updates the seeker's document in MongoDB `user` collection atomically.

### 3. User Profile Update
- **PATCH** `/api/users/:id`
  - Updates profile fields including `skills`, `education`, `experience`, `bio`, and social links.

---

## 🧪 Verification & Testing

To run the automated smoke test suite for resume parsing heuristics:

```bash
node backend/test-resume-analyzer.js
```

---

## 📦 Running the Application

### Backend Server
```bash
cd backend
npm install
npm start
```

### Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.
