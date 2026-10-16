'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Sparkles, CheckSquare, Square, RefreshCw, ShieldCheck } from 'lucide-react';

export default function ProfileDiffModal({
  isOpen,
  onClose,
  currentProfile = {},
  extractedProfile = {},
  onApply,
  isApplying = false,
}) {
  const fieldsConfig = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'title', label: 'Headline / Role' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'location', label: 'Location' },
    { key: 'bio', label: 'Bio / Summary' },
    { key: 'github', label: 'GitHub Profile' },
    { key: 'linkedin', label: 'LinkedIn Profile' },
    { key: 'portfolio', label: 'Portfolio URL' },
    { key: 'website', label: 'Website' },
    { key: 'languages', label: 'Languages' },
  ];

  // Selected fields map: { [fieldKey]: boolean }
  const [selectedFields, setSelectedFields] = useState(() => {
    const initial = {};
    fieldsConfig.forEach((f) => {
      // Auto-select if extracted profile has a value
      initial[f.key] = Boolean(extractedProfile[f.key]);
    });
    // Complex fields
    initial.skills = Array.isArray(extractedProfile.skills) && extractedProfile.skills.length > 0;
    initial.education = Array.isArray(extractedProfile.education) && extractedProfile.education.length > 0;
    initial.experience = Array.isArray(extractedProfile.experience) && extractedProfile.experience.length > 0;
    return initial;
  });

  if (!isOpen) return null;

  const toggleField = (key) => {
    setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => {
    const next = {};
    fieldsConfig.forEach((f) => {
      next[f.key] = Boolean(extractedProfile[f.key]);
    });
    next.skills = true;
    next.education = true;
    next.experience = true;
    setSelectedFields(next);
  };

  const deselectAll = () => {
    const next = {};
    fieldsConfig.forEach((f) => {
      next[f.key] = false;
    });
    next.skills = false;
    next.education = false;
    next.experience = false;
    setSelectedFields(next);
  };

  const handleApply = () => {
    // Build payload of selected fields
    const payload = {};
    fieldsConfig.forEach((f) => {
      if (selectedFields[f.key] && extractedProfile[f.key]) {
        payload[f.key] = extractedProfile[f.key];
      }
    });

    if (selectedFields.skills && extractedProfile.skills) {
      payload.skills = extractedProfile.skills;
    }
    if (selectedFields.education && extractedProfile.education) {
      payload.education = extractedProfile.education;
    }
    if (selectedFields.experience && extractedProfile.experience) {
      payload.experience = extractedProfile.experience;
    }

    onApply(payload);
  };

  const totalSelectedCount = Object.values(selectedFields).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                Review & Apply to Profile
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Choose which extracted fields to update in your CareerBridge profile.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar Selection */}
        <div className="px-6 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <span>{totalSelectedCount} fields selected for synchronization</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={selectAll}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Select All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={deselectAll}
              className="text-zinc-500 hover:underline cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Fields List Body */}
        <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {fieldsConfig.map((field) => {
            const current = currentProfile[field.key] || '—';
            const extracted = extractedProfile[field.key];
            if (!extracted) return null;

            const isSelected = selectedFields[field.key];
            const isDiff = current !== extracted;

            return (
              <div
                key={field.key}
                onClick={() => toggleField(field.key)}
                className={`pt-3.5 first:pt-0 flex items-start gap-3.5 cursor-pointer rounded-xl p-2 transition-colors ${
                  isSelected ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="mt-1 text-primary">
                  {isSelected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-zinc-400" />}
                </div>

                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-500 dark:text-zinc-400 block mb-0.5">
                      {field.label} (Current)
                    </span>
                    <p className="text-zinc-600 dark:text-zinc-400 truncate bg-zinc-100/70 dark:bg-zinc-800/60 p-2 rounded-lg">
                      {current}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-primary block mb-0.5 flex items-center gap-1">
                      <span>Extracted from Resume</span>
                      {isDiff && <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded font-normal">New</span>}
                    </span>
                    <p className="text-zinc-900 dark:text-zinc-100 font-medium bg-primary/10 dark:bg-primary/20 p-2 rounded-lg break-words">
                      {extracted}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Complex: Skills */}
          {extractedProfile.skills && extractedProfile.skills.length > 0 && (
            <div
              onClick={() => toggleField('skills')}
              className={`pt-3.5 flex items-start gap-3.5 cursor-pointer rounded-xl p-2 transition-colors ${
                selectedFields.skills ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
              }`}
            >
              <div className="mt-1 text-primary">
                {selectedFields.skills ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-zinc-400" />}
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <span className="font-semibold text-primary block mb-1">
                  Skills Footprint ({extractedProfile.skills.length} extracted)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {extractedProfile.skills.slice(0, 10).map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px]">
                      {s}
                    </span>
                  ))}
                  {extractedProfile.skills.length > 10 && (
                    <span className="px-2 py-0.5 text-[11px] text-zinc-400">
                      +{extractedProfile.skills.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Complex: Education & Experience */}
          {extractedProfile.experience && extractedProfile.experience.length > 0 && (
            <div
              onClick={() => toggleField('experience')}
              className={`pt-3.5 flex items-start gap-3.5 cursor-pointer rounded-xl p-2 transition-colors ${
                selectedFields.experience ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
              }`}
            >
              <div className="mt-1 text-primary">
                {selectedFields.experience ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-zinc-400" />}
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <span className="font-semibold text-primary block mb-1">
                  Work Experience ({extractedProfile.experience.length} roles extracted)
                </span>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {extractedProfile.experience.map((e) => `${e.jobTitle} at ${e.company}`).join(' • ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying || totalSelectedCount === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 shadow-md shadow-primary/20 transition disabled:opacity-50 cursor-pointer"
          >
            {isApplying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Profile...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Apply {totalSelectedCount} Fields to Profile</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
