const { GoogleGenAI } = require("@google/genai");
const { parseResumeHeuristics } = require("./resumeParserUtil");

const geminiApiKey = process.env.GEMINI_API_KEY;
const aiClient = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

const RESUME_EXTRACTION_PROMPT = `You are an expert HR Specialist, ATS (Applicant Tracking System) Engineer, and Senior Technical Recruiter.
Carefully examine and analyze the provided resume document (PDF, image, or text).
Extract all candidate information accurately and evaluate their profile against modern industry standards.

Return strictly a valid raw JSON object (without markdown code blocks, backticks, or extra commentary) with the following structure:
{
  "parsedProfile": {
    "fullName": "Candidate Full Name",
    "email": "candidate@example.com",
    "phone": "+1 234 567 8900",
    "title": "Professional Title / Target Headline",
    "location": "City, Country or State",
    "bio": "2-3 sentence executive professional summary",
    "github": "https://github.com/username (or empty string)",
    "linkedin": "https://linkedin.com/in/username (or empty string)",
    "portfolio": "https://portfolio.dev (or empty string)",
    "website": "Personal website if available (or empty string)",
    "languages": "Comma-separated spoken/written languages",
    "skills": ["Skill1", "Skill2", "Skill3"],
    "education": [
      {
        "institution": "University / College Name",
        "degree": "Degree (e.g., Bachelor of Science)",
        "fieldOfStudy": "Major / Field (e.g., Computer Science)",
        "startYear": "2019",
        "endYear": "2023",
        "grade": "CGPA / GPA (e.g., 3.8/4.0)"
      }
    ],
    "experience": [
      {
        "company": "Company Name",
        "jobTitle": "Job Title",
        "employmentType": "Full-time",
        "location": "Remote / On-site",
        "startDate": "YYYY-MM",
        "endDate": "YYYY-MM or Present",
        "currentlyWorking": true,
        "description": "Key achievements and responsibilities"
      }
    ]
  },
  "analysis": {
    "atsScore": 85,
    "summary": "Brief 2-sentence summary of the candidate's resume quality and readiness.",
    "strengths": [
      "Key strength 1",
      "Key strength 2"
    ],
    "improvements": [
      "Actionable improvement tip 1",
      "Actionable improvement tip 2"
    ],
    "recommendedRoles": [
      "Target Role 1",
      "Target Role 2"
    ]
  }
}`;

async function analyzeResume({ fileBase64, mimeType, fileName, textContent }) {
  // If text file or plain text provided without Gemini
  let rawText = textContent || "";
  
  if (fileBase64 && (!mimeType || mimeType === "text/plain") && !rawText) {
    try {
      rawText = Buffer.from(fileBase64, "base64").toString("utf-8");
    } catch (e) {
      console.warn("Failed to decode base64 as utf-8 string:", e);
    }
  }

  // If Gemini client is active, use Gemini 2.0 / 1.5 multimodal
  if (aiClient) {
    try {
      let contents;

      if (fileBase64 && mimeType && mimeType !== "text/plain") {
        // Multimodal input (PDF or image: png, jpeg, webp)
        contents = [
          {
            role: "user",
            parts: [
              { text: RESUME_EXTRACTION_PROMPT },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: fileBase64,
                },
              },
            ],
          },
        ];
      } else {
        // Plain text input
        contents = `${RESUME_EXTRACTION_PROMPT}\n\nResume Document Content:\n${rawText || "No readable content provided."}`;
      }

      const response = await aiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
      });

      let text = response.text ? response.text.trim() : "";
      if (text.startsWith("```")) {
        text = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "").trim();
      }

      const parsed = JSON.parse(text);
      if (parsed && parsed.parsedProfile) {
        return {
          success: true,
          source: "gemini-ai",
          data: {
            ...parsed,
            rawTextPreview: rawText ? rawText.slice(0, 1500) : (fileName || "Uploaded document"),
          },
        };
      }
    } catch (err) {
      console.error("Gemini AI Resume Analysis Error, falling back to heuristics:", err);
    }
  }

  // Graceful rule-based heuristics fallback
  const fallbackResult = parseResumeHeuristics(rawText || fileName || "Software Developer Resume");
  return {
    success: true,
    source: "heuristic-parser",
    data: fallbackResult,
  };
}

module.exports = {
  analyzeResume,
  RESUME_EXTRACTION_PROMPT,
};
