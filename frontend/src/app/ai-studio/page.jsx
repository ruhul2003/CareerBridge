'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  FileSearch,
  MessageSquareCode,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Award,
  Zap,
  Target,
  Brain,
  ChevronRight,
  BookOpen,
  Send,
  UserCheck,
  Bot
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AICareerStudioContent() {
  const searchParams = useSearchParams();
  const queryJobId = searchParams.get('jobId');

  const [activeTab, setActiveTab] = useState('matcher'); // 'matcher' | 'interview'

  // --- RESUME MATCHER & ATS STATE ---
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('Full Stack Developer');
  const [targetCompany, setTargetCompany] = useState('TechCorp Solutions');
  const [jobDescription, setJobDescription] = useState(
    'Looking for a Full Stack Developer skilled in Next.js, React, Node.js, Express, MongoDB, and Tailwind CSS. Experience with REST APIs, authentication, and state management required.'
  );

  const [liveJobs, setLiveJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  // --- INTERVIEW MOCK SIMULATOR STATE ---
  const [interviewRole, setInterviewRole] = useState('Senior Frontend Engineer');
  const [interviewCategory, setInterviewCategory] = useState('Technical & System Design');
  const [interviewLevel, setInterviewLevel] = useState('Mid-Senior');
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState({}); // { [questionId]: evalObj }

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  // Fetch live jobs to populate dropdown for quick selector
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/jobs`);
        if (res.ok) {
          const data = await res.json();
          setLiveJobs(data || []);

          // Auto-fill queryJobId if passed
          const targetId = queryJobId;
          if (targetId && data?.length > 0) {
            const found = data.find((j) => j._id === targetId);
            if (found) {
              setSelectedJobId(found._id);
              setJobTitle(found.title || '');
              setTargetCompany(found.companyName || found.company || '');
              setJobDescription(found.description || found.responsibilities || '');
            }
          }
        }
      } catch (err) {
        console.error("Failed to load jobs for selector:", err);
      }
    };
    fetchJobs();
  }, [SERVER_URL, queryJobId]);

  // When user selects a job from dropdown
  const handleSelectJob = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    if (!jobId) return;
    const found = liveJobs.find((j) => j._id === jobId);
    if (found) {
      setJobTitle(found.title || '');
      setTargetCompany(found.companyName || found.company || '');
      setJobDescription(found.description || found.responsibilities || '');
    }
  };

  // Trigger Resume Matcher
  const handleAnalyzeMatch = async () => {
    if (!resumeText.trim()) {
      toast.error('Please paste your resume content or skills summary!');
      return;
    }
    if (!jobTitle.trim()) {
      toast.error('Please specify the target job title!');
      return;
    }

    setMatchingLoading(true);
    setMatchResult(null);

    try {
      const res = await fetch(`${SERVER_URL}/api/ai/resume-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobTitle,
          targetCompany,
          jobDescription
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setMatchResult(data.data);
        toast.success('AI Resume & ATS Analysis Complete!');
      } else {
        toast.error(data.message || 'Failed to complete analysis.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error connecting to AI match engine.');
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleCopyCoverLetter = () => {
    if (!matchResult?.tailoredCoverLetter) return;
    navigator.clipboard.writeText(matchResult.tailoredCoverLetter);
    setCopiedCoverLetter(true);
    toast.success('Tailored Cover Letter copied to clipboard!');
    setTimeout(() => setCopiedCoverLetter(false), 3000);
  };

  // Trigger Interview Questions Generation
  const handleStartInterview = async () => {
    if (!interviewRole.trim()) {
      toast.error('Please enter a role to practice!');
      return;
    }

    setQuestionsLoading(true);
    setQuestions([]);
    setCurrentQIndex(0);
    setEvaluations({});
    setUserAnswer('');

    try {
      const res = await fetch(`${SERVER_URL}/api/ai/interview-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: interviewRole,
          category: interviewCategory,
          seniorityLevel: interviewLevel
        })
      });

      const data = await res.json();
      if (data.success && data.questions?.length > 0) {
        setQuestions(data.questions);
        toast.success(`Generated ${data.questions.length} tailored interview questions!`);
      } else {
        toast.error(data.message || 'Failed to generate interview questions.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error generating interview session.');
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Evaluate candidate answer for current question
  const handleEvaluateCurrentAnswer = async () => {
    const currentQ = questions[currentQIndex];
    if (!currentQ) return;
    if (!userAnswer.trim()) {
      toast.error('Please enter your response before submitting!');
      return;
    }

    setEvaluating(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/ai/evaluate-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          candidateAnswer: userAnswer,
          jobTitle: interviewRole
        })
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluations((prev) => ({
          ...prev,
          [currentQ.id || currentQIndex]: data.evaluation
        }));
        toast.success('Response evaluated by AI Coach!');
      } else {
        toast.error(data.message || 'Failed to evaluate answer.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error evaluating response.');
    } finally {
      setEvaluating(false);
    }
  };

  const currentQ = questions[currentQIndex];
  const currentEval = currentQ ? evaluations[currentQ.id || currentQIndex] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white flex flex-col">

      {/* Hero Header */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-cyan-500/15 via-indigo-500/20 to-purple-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-lg shadow-indigo-500/10"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen Career Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4"
          >
            CareerBridge <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">AI Studio</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
          >
            Analyze your resume compatibility against real job descriptions, unlock ATS missing keyword breakdowns, generate tailored cover letters, and master your upcoming interviews with AI mock sessions.
          </motion.p>

          {/* Navigation Tab Pills */}
          <div className="flex justify-center mt-10">
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2 shadow-2xl backdrop-blur-md">
              <button
                onClick={() => setActiveTab('matcher')}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === 'matcher'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileSearch className="w-4 h-4" />
                <span>AI Resume & ATS Matcher</span>
              </button>

              <button
                onClick={() => setActiveTab('interview')}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                  activeTab === 'interview'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquareCode className="w-4 h-4" />
                <span>AI Mock Interview Simulator</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {/* TAB 1: RESUME & ATS MATCHER */}
          {activeTab === 'matcher' && (
            <motion.div
              key="matcher-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Input Form */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-cyan-400" />
                    Target Job Configuration
                  </h2>

                  {/* Select from live jobs */}
                  {liveJobs.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Import From Live Jobs (Optional)
                      </label>
                      <select
                        value={selectedJobId}
                        onChange={handleSelectJob}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                      >
                        <option value="">-- Choose a live job to auto-fill --</option>
                        {liveJobs.map((j) => (
                          <option key={j._id} value={j._id}>
                            {j.title} ({j.companyName || j.company || 'Company'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Target Job Title *
                      </label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Target Company Name
                      </label>
                      <input
                        type="text"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        placeholder="e.g. Google / Microsoft"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Job Description / Key Requirements
                      </label>
                      <textarea
                        rows={4}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste job posting text or key skills required..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Candidate Resume Input */}
                <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    Your Resume & Skills
                  </h2>
                  <p className="text-xs text-slate-400 mb-4">
                    Paste your resume text, work experience summary, or key technical skill set below.
                  </p>

                  <textarea
                    rows={7}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste resume text here (e.g. Experienced Developer with 3+ years experience in React, Next.js, Node.js, Express, MongoDB, HTML, CSS, Tailwind CSS...)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />

                  <button
                    onClick={handleAnalyzeMatch}
                    disabled={matchingLoading}
                    className="w-full mt-4 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {matchingLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Analyzing ATS Match with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <span>Analyze Match & Generate Cover Letter</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: AI Analysis Output */}
              <div className="lg:col-span-7 space-y-6">
                {!matchResult && !matchingLoading && (
                  <div className="h-full min-h-[420px] bg-slate-900/40 border border-slate-800/70 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                      <Brain className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready for AI Analysis</h3>
                    <p className="text-slate-400 text-sm max-w-md">
                      Fill in your resume details and target job description on the left, then click <span className="text-cyan-400 font-semibold">"Analyze Match"</span> to reveal your ATS match score, keyword gaps, and tailored cover letter.
                    </p>
                  </div>
                )}

                {matchingLoading && (
                  <div className="h-full min-h-[420px] bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-cyan-400 animate-spin" />
                      <Sparkles className="w-8 h-8 text-amber-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Evaluating Resume & ATS Signals...</h3>
                    <p className="text-slate-400 text-xs">Gemini 2.0 Flash is parsing skill vectors and generating recommendations.</p>
                  </div>
                )}

                {matchResult && !matchingLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {/* Compatibility Score Card */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                            ATS Compatibility Breakdown
                          </span>
                          <h2 className="text-2xl font-extrabold text-white mt-3">{jobTitle}</h2>
                          <p className="text-slate-400 text-xs mt-1">{targetCompany || 'Target Organization'}</p>
                          <p className="text-slate-300 text-sm mt-3 leading-relaxed">{matchResult.summary}</p>
                        </div>

                        {/* Match Percentage Circle Badge */}
                        <div className="flex-shrink-0 text-center">
                          <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-slate-950 border-4 border-cyan-500/30 shadow-inner">
                            <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                              {matchResult.matchScore}%
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-400 mt-2 block">Match Rating</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills Grid: Matched & Missing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Matched Skills */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
                        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4" />
                          Matched Strengths ({matchResult.matchingSkills?.length || 0})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {matchResult.matchingSkills?.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
                        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4" />
                          Missing ATS Keywords ({matchResult.missingSkills?.length || 0})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {matchResult.missingSkills?.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300"
                            >
                              + {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-lg">
                      <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-400" />
                        Optimization Recommendations
                      </h3>
                      <ul className="space-y-2.5">
                        {matchResult.recommendations?.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tailored Cover Letter Card */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                          Generated Tailored Cover Letter
                        </h3>
                        <button
                          onClick={handleCopyCoverLetter}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          {copiedCoverLetter ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Cover Letter</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs sm:text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                        {matchResult.tailoredCoverLetter}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 2: AI MOCK INTERVIEW SIMULATOR */}
          {activeTab === 'interview' && (
            <motion.div
              key="interview-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Interview Setup & Question Stepper */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Interview Settings
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Target Role / Position *
                      </label>
                      <input
                        type="text"
                        value={interviewRole}
                        onChange={(e) => setInterviewRole(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Interview Domain
                      </label>
                      <select
                        value={interviewCategory}
                        onChange={(e) => setInterviewCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="Technical & System Design">Technical & System Design</option>
                        <option value="Behavioral & Leadership">Behavioral & Leadership</option>
                        <option value="Problem Solving & Algorithms">Problem Solving & Coding</option>
                        <option value="Full Comprehensive Mix">Full Comprehensive Mix</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                        Seniority Level
                      </label>
                      <select
                        value={interviewLevel}
                        onChange={(e) => setInterviewLevel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="Junior / Entry Level">Junior / Entry Level</option>
                        <option value="Mid-Senior">Mid-Senior</option>
                        <option value="Staff / Lead Engineer">Staff / Lead Engineer</option>
                      </select>
                    </div>

                    <button
                      onClick={handleStartInterview}
                      disabled={questionsLoading}
                      className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {questionsLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating Questions...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4" />
                          <span>Generate Mock Questions</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Questions Stepper List */}
                {questions.length > 0 && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Interview Questions ({questions.length})
                    </h3>

                    <div className="space-y-2">
                      {questions.map((q, idx) => {
                        const isEvaluated = !!evaluations[q.id || idx];
                        const isCurrent = idx === currentQIndex;

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setCurrentQIndex(idx);
                              setUserAnswer('');
                            }}
                            className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isCurrent
                                ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-md'
                                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className="line-clamp-1">
                              Q{idx + 1}: {q.question}
                            </span>
                            {isEvaluated && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Active Question & Live AI Evaluation */}
              <div className="lg:col-span-8 space-y-6">
                {questions.length === 0 && !questionsLoading && (
                  <div className="h-full min-h-[420px] bg-slate-900/40 border border-slate-800/70 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                      <Bot className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Interactive Mock Interview Practice</h3>
                    <p className="text-slate-400 text-sm max-w-md">
                      Set your desired role and domain on the left, then click <span className="text-purple-400 font-semibold">"Generate Mock Questions"</span> to start your interactive practice round.
                    </p>
                  </div>
                )}

                {questions.length > 0 && currentQ && (
                  <div className="space-y-6">
                    {/* Active Question Box */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                      <div className="flex items-center justify-between text-xs text-purple-400 font-semibold uppercase tracking-wider mb-2">
                        <span>Question {currentQIndex + 1} of {questions.length}</span>
                        <span className="bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                          {currentQ.category || 'Interview Question'}
                        </span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-extrabold text-white mt-2 mb-3 leading-snug">
                        "{currentQ.question}"
                      </h2>

                      {currentQ.hint && (
                        <p className="text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span><strong>Coach Hint:</strong> {currentQ.hint}</span>
                        </p>
                      )}
                    </div>

                    {/* Candidate Answer Input */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                      <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                        Your Answer
                      </label>
                      <textarea
                        rows={5}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your response as if you were answering the interviewer live..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      />

                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={handleEvaluateCurrentAnswer}
                          disabled={evaluating}
                          className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {evaluating ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Evaluating Answer...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>Submit Answer for AI Grading</span>
                            </>
                          )}
                        </button>

                        {currentQIndex < questions.length - 1 && (
                          <button
                            onClick={() => {
                              setCurrentQIndex((prev) => prev + 1);
                              setUserAnswer('');
                            }}
                            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <span>Next Question</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Live AI Evaluation Feedback */}
                    {currentEval && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-400" />
                            AI Coach Evaluation
                          </h3>
                          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400">Score:</span>
                            <span className="text-lg font-black text-purple-400">{currentEval.score} / 10</span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed">{currentEval.feedback}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Key Strengths</h4>
                            <ul className="space-y-1">
                              {currentEval.strengths?.map((s, i) => (
                                <li key={i} className="text-xs text-emerald-200">✓ {s}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Areas for Improvement</h4>
                            <ul className="space-y-1">
                              {currentEval.missingPoints?.map((m, i) => (
                                <li key={i} className="text-xs text-amber-200">+ {m}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {currentEval.idealAnswer && (
                          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mt-4">
                            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Sample Exemplar Answer</h4>
                            <p className="text-xs text-slate-300 leading-relaxed italic">{currentEval.idealAnswer}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function AICareerStudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading AI Studio...
      </div>
    }>
      <AICareerStudioContent />
    </Suspense>
  );
}
