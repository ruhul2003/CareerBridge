'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Tag, Sparkles, Check } from 'lucide-react';

export default function SkillsCloudEditor({ skills = [], onSkillsChange }) {
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkillInput('');
      return;
    }
    onSkillsChange([...skills, trimmed]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    onSkillsChange(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">
              Extracted Skills Footprint
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {skills.length} skills recognized from your resume. Add or remove items before saving.
            </p>
          </div>
        </div>

        {/* Inline Add Skill Form */}
        <form onSubmit={handleAddSkill} className="flex items-center gap-1.5">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            placeholder="Add skill..."
            className="px-3 py-1.5 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary w-32 sm:w-40"
          />
          <button
            type="submit"
            className="p-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition text-xs flex items-center justify-center cursor-pointer"
            title="Add Skill"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Skills Badges */}
      <div className="flex flex-wrap gap-2 pt-1">
        <AnimatePresence>
          {skills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/60 shadow-2xs group hover:border-primary/40 transition"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-zinc-400 hover:text-rose-500 rounded-full transition cursor-pointer p-0.5"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
