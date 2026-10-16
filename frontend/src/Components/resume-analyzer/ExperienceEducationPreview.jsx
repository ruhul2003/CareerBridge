'use client';

import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin, Building, Trash2 } from 'lucide-react';

export default function ExperienceEducationPreview({
  experience = [],
  education = [],
  onExperienceChange,
  onEducationChange,
}) {
  const removeExperience = (idx) => {
    if (onExperienceChange) {
      onExperienceChange(experience.filter((_, i) => i !== idx));
    }
  };

  const removeEducation = (idx) => {
    if (onEducationChange) {
      onEducationChange(education.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Experience Column */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">
              Work Experience ({experience.length})
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Extracted career roles & positions
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {experience && experience.length > 0 ? (
            experience.map((exp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2 relative group"
              >
                {onExperienceChange && (
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  <h5 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                    {exp.jobTitle || 'Role'}
                  </h5>
                  <p className="text-xs text-primary font-medium flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3 h-3" />
                    <span>{exp.company || 'Organization'}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{exp.startDate || 'Start'} - {exp.endDate || (exp.currentlyWorking ? 'Present' : 'End')}</span>
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{exp.location}</span>
                    </span>
                  )}
                </div>

                {exp.description && (
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed pt-1 border-t border-zinc-200/50 dark:border-zinc-700/50">
                    {exp.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400 italic py-2">No work experience entries extracted.</p>
          )}
        </div>
      </div>

      {/* Education Column */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white text-sm">
              Education & Academics ({education.length})
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Extracted degrees & university credentials
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {education && education.length > 0 ? (
            education.map((edu, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 space-y-2 relative group"
              >
                {onEducationChange && (
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div>
                  <h5 className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                    {edu.degree || 'Degree'}
                  </h5>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">
                    {edu.fieldOfStudy ? `${edu.fieldOfStudy} • ` : ''}{edu.institution || 'University'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{edu.startYear || '2019'} - {edu.endYear || '2023'}</span>
                  </span>
                  {edu.grade && (
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      Grade: {edu.grade}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-400 italic py-2">No education entries extracted.</p>
          )}
        </div>
      </div>
    </div>
  );
}
