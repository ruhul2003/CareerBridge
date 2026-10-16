'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, UploadCloud, FileText, CheckCircle2, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeResumeFile } from '@/lib/resumeService';
import { validateResumeFile } from '@/lib/resumeParser';

export default function ResumeAutoFillDrawer({ isOpen, onClose, onApplyToForm }) {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const validation = validateResumeFile(selected);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    setFile(selected);
  };

  const handleScan = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const result = await analyzeResumeFile(file);
      setParsedData(result);
      toast.success('Resume parsed successfully! Review the extracted fields below.');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to parse resume document.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!parsedData?.parsedProfile) return;
    onApplyToForm(parsedData.parsedProfile);
    toast.success('Profile form fields auto-filled! Review and click Save Changes.');
    onClose();
  };

  const profile = parsedData?.parsedProfile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                AI Resume Profile Auto-Fill
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Upload your resume (PDF, Image, or TXT) to instantly populate your profile.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* File Picker */}
          {!parsedData ? (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-zinc-50 dark:bg-zinc-800/40 hover:bg-zinc-100/50">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                  {file ? file.name : 'Select or drop resume'}
                </span>
                <span className="text-xs text-zinc-400 mt-1">
                  Supports PDF, PNG, JPG, WEBP, and TXT files
                </span>
              </label>

              {file && (
                <button
                  type="button"
                  onClick={handleScan}
                  disabled={analyzing}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 text-white font-semibold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Document with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Scan & Extract Profile Fields</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            /* Parsed Summary Preview */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Information successfully extracted from <b>{file?.name}</b>!</span>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-2xl space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Name</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{profile?.fullName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Title</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{profile?.title || '—'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Email</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{profile?.email || '—'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Phone</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">{profile?.phone || '—'}</span>
                  </div>
                </div>

                {profile?.bio && (
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Bio / Summary</span>
                    <span className="text-zinc-700 dark:text-zinc-300 line-clamp-2">{profile.bio}</span>
                  </div>
                )}

                {profile?.skills && (
                  <div>
                    <span className="text-zinc-400 block text-[10px] uppercase font-semibold mb-1">
                      Detected Skills ({profile.skills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills.slice(0, 8).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[10px]">
                          {s}
                        </span>
                      ))}
                      {profile.skills.length > 8 && (
                        <span className="text-[10px] text-zinc-400">+{profile.skills.length - 8} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-700 transition"
          >
            Cancel
          </button>

          {parsedData && (
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/90 shadow-md transition cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Apply to Form Inputs</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
