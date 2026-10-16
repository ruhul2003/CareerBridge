/**
 * Resume Analyzer Verification & Smoke Test
 * Tests heuristic text extraction, contact detection, ATS scoring, and fallback handling.
 */

const assert = require("assert");
const {
  extractEmail,
  extractPhone,
  extractSkills,
  parseResumeHeuristics,
  calculateATSScore,
} = require("./resumeParserUtil");
const { analyzeResume } = require("./resumeAiService");

const SAMPLE_RESUME_TEXT = `
ALEX MORGAN
Senior Full Stack Engineer
alex.morgan@example.com | +1 (555) 234-5678 | San Francisco, CA
https://github.com/alexmorgan | https://linkedin.com/in/alexmorgan

PROFESSIONAL SUMMARY
Dynamic and results-oriented Senior Full Stack Engineer with 5+ years of experience building scalable web architectures, REST APIs, and modern cloud applications.

CORE SKILLS
JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, PostgreSQL, Docker, AWS, Git, Tailwind CSS, GraphQL

WORK EXPERIENCE
Lead Web Developer - CloudScale Solutions (2022 - Present)
Architected high-throughput microservices and responsive web portals using Next.js and Node.js.
Improved system performance by 45% and mentored junior developers.

Frontend Engineer - Apex Digital Lab (2020 - 2022)
Engineered interactive user interfaces in React and TypeScript. Collaborated in Agile Scrum sprints.

EDUCATION
Bachelor of Science in Computer Science (2016 - 2020)
University of California, Berkeley - CGPA: 3.85
`;

async function runTests() {
  console.log("==========================================");
  console.log("RUNNING RESUME ANALYZER VERIFICATION TESTS");
  console.log("==========================================");

  // Test 1: Email Extraction
  const email = extractEmail(SAMPLE_RESUME_TEXT);
  assert.strictEqual(email, "alex.morgan@example.com", "Email should match sample text");
  console.log("✔ Test 1 Passed: Email extraction successful ->", email);

  // Test 2: Phone Extraction
  const phone = extractPhone(SAMPLE_RESUME_TEXT);
  assert.ok(phone.includes("555"), "Phone should contain digits from sample");
  console.log("✔ Test 2 Passed: Phone extraction successful ->", phone);

  // Test 3: Skills Extraction
  const skills = extractSkills(SAMPLE_RESUME_TEXT);
  assert.ok(skills.includes("React"), "Skills must include React");
  assert.ok(skills.includes("Next.js") || skills.includes("Node.js"), "Skills must include Next.js or Node.js");
  console.log(`✔ Test 3 Passed: ${skills.length} skills successfully identified ->`, skills.slice(0, 5).join(", "), "...");

  // Test 4: Complete Heuristics Orchestration
  const parsed = parseResumeHeuristics(SAMPLE_RESUME_TEXT);
  assert.ok(parsed.parsedProfile, "Parsed profile object should exist");
  assert.ok(parsed.analysis, "Analysis object should exist");
  assert.ok(parsed.analysis.atsScore >= 60, "ATS score should be >= 60 for comprehensive resume");
  console.log("✔ Test 4 Passed: Full heuristics orchestration passed with ATS Score ->", parsed.analysis.atsScore);

  // Test 5: End-to-End AI Service Fallback
  const aiResult = await analyzeResume({
    textContent: SAMPLE_RESUME_TEXT,
    fileName: "alex_morgan_resume.txt",
    mimeType: "text/plain",
  });
  assert.strictEqual(aiResult.success, true, "AI service must return success: true");
  assert.ok(aiResult.data.parsedProfile.fullName, "Candidate name must be extracted");
  console.log("✔ Test 5 Passed: AI Service Pipeline succeeded -> Name:", aiResult.data.parsedProfile.fullName);

  console.log("==========================================");
  console.log("ALL RESUME ANALYZER TESTS PASSED (5/5) 🎉");
  console.log("==========================================");
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
