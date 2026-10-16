'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, AlertTriangle, Target, Sparkles, TrendingUp } from 'lucide-react';

export default function ATSScoreCard({ analysis = {} }) {
  const {
    atsScore = 75,
    summary = 'Resume parsed successfully with strong potential.',
    strengths = [],
    improvements = [],
    recommendedRoles = [],
  } = analysis;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 70) return 'text-primary stroke-primary';
    return 'text-amber-500 stroke-amber-500';
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return { label: 'Top Tier / Interview Ready', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    if (score >= 70) return { label: 'Strong Competitive Profile', bg: 'bg-primary/10 text-primary dark:text-primary-400 border-primary/20' };
    return { label: 'Needs Minor Optimization', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
  };

  const badge = getScoreBadge(atsScore);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header & Gauge */}
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-6">
        <div className="flex items-center gap-5">
          {/* Radial SVG Meter */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-zinc-100 dark:stroke-zinc-800"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r={radius}
                className={getScoreColor(atsScore)}
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white leading-none">
                {atsScore}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                ATS Compatibility Score
              </h3>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              {summary}
            </p>
            <div>
              <span className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Roles Pill Cloud */}
        {recommendedRoles && recommendedRoles.length > 0 && (
          <div className="w-full sm:w-auto bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-primary" /> Target Roles Match
            </p>
            <div className="flex flex-wrap gap-1.5">
              {recommendedRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Key Strengths Detected</span>
          </div>
          <ul className="space-y-1.5">
            {strengths && strengths.length > 0 ? (
              strengths.map((str, idx) => (
                <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-zinc-500">Good baseline information provided.</li>
            )}
          </ul>
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Recommended Improvements</span>
          </div>
          <ul className="space-y-1.5">
            {improvements && improvements.length > 0 ? (
              improvements.map((imp, idx) => (
                <li key={idx} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-zinc-500">Resume is highly complete and structured well.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
