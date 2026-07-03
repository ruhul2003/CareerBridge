'use client';

import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Calendar, MapPin, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'freelance'];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOption, setSortOption] = useState('Most Recent');
  const [loading, setLoading] = useState(true);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/jobs`);
        const data = await res.json();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [SERVER_URL]);

  useEffect(() => {
    let result = [...jobs];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(job =>
        job.jobTitle?.toLowerCase().includes(q) ||
        job.jobCategory?.toLowerCase().includes(q)
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter(job => selectedTypes.includes(job.jobType));
    }

    if (sortOption === 'Salary High to Low') {
      result.sort((a, b) => (parseInt(b.maxSalary || 0) - parseInt(a.maxSalary || 0)));
    } else {
      result.sort((a, b) => (b._id || '').localeCompare(a._id || ''));
    }

    setFilteredJobs(result);
  }, [searchQuery, selectedTypes, sortOption, jobs]);

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const formatSalary = (min, max, currency = 'BDT') => {
    if (min && max) return `${currency} ${Number(min).toLocaleString()} – ${Number(max).toLocaleString()}`;
    if (min) return `From ${currency} ${Number(min).toLocaleString()}`;
    if (max) return `Up to ${currency} ${Number(max).toLocaleString()}`;
    return 'Salary confidential';
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-20 selection:bg-indigo-500/30 selection:text-white antialiased">
      {/* Structural Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Filter / Search Navigation Header */}
      

      {/* Dynamic Quantitative Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <h2 className="text-sm font-medium tracking-widest text-zinc-400 uppercase">
            Available Opportunities ({filteredJobs.length})
          </h2>
        </div>
        <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100 mt-2">
          Discover your next challenge
        </p>
      </div>

      <div className="border-b border-zinc-800/60 bg-transparent backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center">
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-zinc-500 transition-colors group-focus-within:text-indigo-400" size={18} />
              <input
                type="text"
                placeholder="Search matching roles, categories, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/60 border border-zinc-800/80 pl-11 pr-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 placeholder-zinc-500"
              />
            </div>

            {/* Filter Controls Wrapper */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 bg-zinc-900/60 border border-zinc-800/40 p-2 lg:p-1.5 rounded-xl">
              <div className="flex items-center gap-2 px-3 text-zinc-400 text-xs font-semibold tracking-wider uppercase">
                <SlidersHorizontal size={14} className="text-zinc-500" />
                <span>Type</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {JOB_TYPES.map((type) => {
                  const isChecked = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all border ${
                        isChecked
                          ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-300 shadow-[0_2px_10px_rgba(99,102,241,0.05)]'
                          : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                    >
                      <span className="capitalize">{type.replace('-', ' ')}</span>
                    </button>
                  );
                })}
              </div>

              <div className="h-px lg:h-6 w-full lg:w-px bg-zinc-800/80" />

              {/* Sort Selector */}
              <div className="relative flex items-center w-full lg:w-auto">
                <ArrowUpDown size={14} className="absolute left-3 text-zinc-500 pointer-events-none" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full lg:w-auto bg-zinc-950/50 border border-zinc-800/60 rounded-lg pl-9 pr-8 py-1.5 text-xs font-medium text-zinc-300 focus:outline-none focus:border-indigo-500/80 appearance-none cursor-pointer hover:text-zinc-100 transition-colors"
                >
                  <option className="bg-zinc-900">Most Recent</option>
                  <option className="bg-zinc-900">Salary High to Low</option>
                </select>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Board Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
            <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase">Fetching Positions</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-zinc-800/60 rounded-3xl bg-zinc-900/10">
            <Briefcase className="mx-auto text-zinc-600 mb-4" size={32} />
            <h3 className="text-base font-medium text-zinc-300">No vacancies match your filters</h3>
            <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">Try resetting your active categories or adjusting your search phrase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/80 rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_30px_rgba(99,102,241,0.03)] group flex flex-col justify-between"
              >
                <div>
                  {/* Meta Details Row */}
                  <div className="flex justify-between items-start gap-4 mb-5">
                    <span className="inline-block px-2.5 py-1 text-[11px] font-semibold tracking-wide text-zinc-400 bg-zinc-800/40 rounded-md border border-zinc-800/60 uppercase">
                      {job.jobCategory}
                    </span>
                    <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md border uppercase ${
                      job.status === 'active'
                        ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                        : 'bg-zinc-800/40 text-zinc-500 border-zinc-800'
                    }`}>
                      {job.status || 'Active'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold tracking-tight text-zinc-100 group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[56px] leading-snug">
                    {job.jobTitle}
                  </h3>

                  {/* Operational Information Grid */}
                  <div className="mt-5 space-y-3.5 text-sm">
                    <div className="text-emerald-400 font-medium tracking-tight text-lg">
                      {formatSalary(job.minSalary, job.maxSalary, job.currency)}
                    </div>

                    <div className="pt-2 space-y-2.5 border-t border-zinc-800/40">
                      <div className="flex items-center gap-2.5 text-zinc-400 text-xs">
                        <Briefcase size={15} className="text-zinc-500" />
                        <span className="capitalize">{job.jobType?.replace('-', ' ')}</span>
                      </div>

                      {job.isRemote && (
                        <div className="flex items-center gap-2.5 text-zinc-400 text-xs">
                          <MapPin size={15} className="text-teal-500/80" />
                          <span className="text-zinc-300">Remote Compatible</span>
                        </div>
                      )}

                      {job.deadline && (
                        <div className="flex items-center gap-2.5 text-zinc-500 text-xs">
                          <Calendar size={15} />
                          <span>Closing: {new Date(job.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Button */}
                <button className="w-full mt-7 py-3 bg-zinc-100 text-zinc-950 text-xs font-semibold tracking-wider uppercase rounded-xl hover:bg-white active:scale-[0.99] transition-all shadow-md">
                  Apply Position
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}