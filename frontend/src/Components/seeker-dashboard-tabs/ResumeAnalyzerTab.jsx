'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSearch,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import ResumeDropzone from '@/Components/resume-analyzer/ResumeDropzone';
import ATSScoreCard from '@/Components/resume-analyzer/ATSScoreCard';
import SkillsCloudEditor from '@/Components/resume-analyzer/SkillsCloudEditor';
import ExperienceEducationPreview from '@/Components/resume-analyzer/ExperienceEducationPreview';
import ProfileDiffModal from '@/Components/resume-analyzer/ProfileDiffModal';
import { analyzeResumeFile, syncResumeToProfile } from '@/lib/resumeService';

export default function ResumeAnalyzerTab({ user, onNavigateToSettings }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [currentProfile, setCurrentProfile] = useState({});
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('insights'); // 'insights' | 'raw'

  const userId = user?.id;

  // Fetch current user profile to enable diff & comparison
  useEffect(() => {
    if (!userId) return;
    const fetchCurrent = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentProfile(data || {});
        }
      } catch (e) {
        console.warn('Failed to load current profile for diff:', e);
      }
    };
    fetchCurrent();
  }, [userId]);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    // Don't wipe previous analysis until user triggers scan
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const data = await analyzeResumeFile(selectedFile);
      setAnalysisData(data);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Resume Analysis Error:', error);
      toast.error(error.message || 'Failed to analyze resume document.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyProfileData = async (payloadToApply) => {
    if (!userId) {
      toast.error('Please log in to apply profile updates.');
      return;
    }

    setIsApplying(true);
    try {
      const result = await syncResumeToProfile(userId, payloadToApply, {
        atsScore: analysisData?.analysis?.atsScore,
        fileName: selectedFile?.name,
      });

      toast.success('Profile updated from resume data!');
      setShowDiffModal(false);

      // Refresh current profile state
      setCurrentProfile((prev) => ({
        ...prev,
        ...payloadToApply,
      }));
    } catch (error) {
      console.error('Profile Sync Error:', error);
      toast.error(error.message || 'Failed to sync resume to profile.');
    } finally {
      setIsApplying(false);
    }
  };

  const parsed = analysisData?.parsedProfile;
  const analysis = analysisData?.analysis;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-primary/90 to-indigo-950 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-semibold backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Scanner & ATS Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Resume Analyzing System
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Upload your resume in <span className="text-white font-medium">PDF, Image (PNG/JPG), or TXT</span> format. Our multi-model intelligence parses contact details, work history, skills, and calculates ATS compatibility to auto-update your CareerBridge profile.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Upload Dropzone Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileSearch className="w-5 h-5 text-primary" />
            <span>Document Ingestion</span>
          </h2>
          {analysisData && (
            <button
              type="button"
              onClick={() => {
                setAnalysisData(null);
                setSelectedFile(null);
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Analyze New Resume
            </button>
          )}
        </div>

        <ResumeDropzone
          onFileSelected={handleFileSelected}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          selectedFile={selectedFile}
          onClearFile={handleClearFile}
        />
      </section>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisData && parsed && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="space-y-8"
          >
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                    Resume Extraction Complete
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Ready to sync candidate information into your seeker profile.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowDiffModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 shadow-md shadow-primary/20 transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Profile with Extracted Data</span>
                </button>
              </div>
            </div>

            {/* ATS Score Card */}
            {analysis && <ATSScoreCard analysis={analysis} />}

            {/* Personal Details Snapshot Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {parsed.fullName || 'Candidate Profile'}
                  </h3>
                  <p className="text-xs text-primary font-medium mt-0.5">
                    {parsed.title || 'Professional'}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Parsed Verified
                </span>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {parsed.email && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300">
                    <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{parsed.email}</span>
                  </div>
                )}
                {parsed.phone && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{parsed.phone}</span>
                  </div>
                )}
                {parsed.location && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{parsed.location}</span>
                  </div>
                )}
                {parsed.github && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300">
                    <Github className="w-3.5 h-3.5 text-primary shrink-0" />
                    <a href={parsed.github} target="_blank" rel="noreferrer" className="truncate hover:underline">
                      {parsed.github.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>

              {/* Bio summary */}
              {parsed.bio && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    Professional Summary
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/30 p-3.5 rounded-xl">
                    {parsed.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Skills Footprint Editor */}
            <SkillsCloudEditor
              skills={parsed.skills || []}
              onSkillsChange={(newSkills) => {
                setAnalysisData((prev) => ({
                  ...prev,
                  parsedProfile: {
                    ...prev.parsedProfile,
                    skills: newSkills,
                  },
                }));
              }}
            />

            {/* Experience & Education Preview */}
            <ExperienceEducationPreview
              experience={parsed.experience || []}
              education={parsed.education || []}
              onExperienceChange={(newExp) => {
                setAnalysisData((prev) => ({
                  ...prev,
                  parsedProfile: {
                    ...prev.parsedProfile,
                    experience: newExp,
                  },
                }));
              }}
              onEducationChange={(newEdu) => {
                setAnalysisData((prev) => ({
                  ...prev,
                  parsedProfile: {
                    ...prev.parsedProfile,
                    education: newEdu,
                  },
                }));
              }}
            />

            {/* Diff & Sync Modal */}
            <ProfileDiffModal
              isOpen={showDiffModal}
              onClose={() => setShowDiffModal(false)}
              currentProfile={currentProfile}
              extractedProfile={parsed}
              onApply={handleApplyProfileData}
              isApplying={isApplying}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
