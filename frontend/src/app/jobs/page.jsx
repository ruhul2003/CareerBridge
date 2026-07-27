'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Briefcase, Calendar, ArrowRight, MapPin, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'freelance'];
const ITEMS_PER_PAGE = 12;

function JobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortOption, setSortOption] = useState('Most Recent');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  // Read URL search / location query parameters from Hero Banner or Company links
  useEffect(() => {
    const searchVal = searchParams.get('search') || searchParams.get('company') || '';
    const locationVal = searchParams.get('location') || '';

    const initialCombined = [searchVal, locationVal].filter(Boolean).join(' ');
    if (initialCombined) {
      setSearchQuery(initialCombined);
    }
  }, [searchParams]);

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
        (job.title || job.jobTitle)?.toLowerCase().includes(q) ||
        (job.companyName)?.toLowerCase().includes(q) ||
        (job.category || job.jobCategory)?.toLowerCase().includes(q) ||
        (job.location)?.toLowerCase().includes(q)
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter(job => {
        const type = (job.type || job.jobType || '').toLowerCase();
        return selectedTypes.some(t => type.includes(t.toLowerCase()));
      });
    }

    if (sortOption === 'Salary High to Low') {
      result.sort((a, b) => (parseInt(b.maxSalary || 0) - parseInt(a.maxSalary || 0)));
    } else {
      result.sort((a, b) => (b._id || '').localeCompare(a._id || ''));
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  }, [searchQuery, selectedTypes, sortOption, jobs]);

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const formatSalary = (min, max, currency) => {
    const activeCurrency = currency && currency.trim() !== "" ? currency : 'BDT';
    if (min && max) {
      return `${activeCurrency} ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} / mo`;
    }
    if (min) return `From ${activeCurrency} ${Number(min).toLocaleString()} / mo`;
    if (max) return `Up to ${activeCurrency} ${Number(max).toLocaleString()} / mo`;
    return 'Salary confidential';
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const indexOfLastJob = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 pb-20 selection:bg-indigo-500/30 selection:text-white antialiased transition-colors duration-300">
      {/* Structural Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Dynamic Quantitative Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <h2 className="text-sm font-medium tracking-widest text-slate-500 dark:text-zinc-400 uppercase">
            Available Opportunities ({filteredJobs.length})
          </h2>
        </div>
        <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-zinc-100 mt-2">
          Discover your next challenge
        </p>
      </div>

      <div className="border-b border-slate-200 dark:border-zinc-800/60 bg-white/80 dark:bg-transparent backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center">

            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 text-slate-400 dark:text-zinc-500 transition-colors group-focus-within:text-indigo-500" size={18} />
              <input
                type="text"
                placeholder="Search by position, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800/80 pl-11 pr-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 placeholder-slate-400 dark:placeholder-zinc-500 text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            {/* Filter Controls Wrapper */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/40 p-2 lg:p-1.5 rounded-xl">
              <div className="flex items-center gap-2 px-3 text-slate-500 dark:text-zinc-400 text-xs font-semibold tracking-wider uppercase">
                <SlidersHorizontal size={14} className="text-slate-400 dark:text-zinc-500" />
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
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all border cursor-pointer ${isChecked
                          ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-300 shadow-sm'
                          : 'bg-white dark:bg-zinc-950/40 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                        }`}
                    >
                      <span className="capitalize">{type.replace('-', ' ')}</span>
                    </button>
                  );
                })}
              </div>

              <div className="h-px lg:h-6 w-full lg:w-px bg-slate-200 dark:bg-zinc-800/80" />

              {/* Sort Selector */}
              <div className="relative flex items-center w-full lg:w-auto">
                <ArrowUpDown size={14} className="absolute left-3 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full lg:w-auto bg-white dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/60 rounded-lg pl-9 pr-8 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 focus:outline-none focus:border-indigo-500/80 appearance-none cursor-pointer hover:text-slate-900 dark:hover:text-zinc-100 transition-colors shadow-sm"
                >
                  <option className="bg-white text-slate-900 dark:bg-zinc-900 dark:text-white">Most Recent</option>
                  <option className="bg-white text-slate-900 dark:bg-zinc-900 dark:text-white">Salary High to Low</option>
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
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-xs text-slate-500 dark:text-zinc-500 font-medium tracking-widest uppercase">Fetching Positions</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-slate-200 dark:border-zinc-800/60 rounded-3xl bg-white/50 dark:bg-zinc-900/10">
            <Briefcase className="mx-auto text-slate-400 dark:text-zinc-600 mb-4" size={32} />
            <h3 className="text-base font-medium text-slate-700 dark:text-zinc-300">No vacancies match your search</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1 max-w-xs mx-auto">Try resetting active filters or searching for another company or role.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentJobs.map((job) => {
                const positionName = job.title || job.jobTitle || 'Position Title';
                const companyName = job.companyName || 'Company';
                const companyLogo = job.companyLogo || job.logo;

                return (
                  <div
                    key={job._id}
                    className="bg-white dark:bg-zinc-900/40 border border-slate-200/80 dark:border-zinc-800/50 hover:border-indigo-500/50 dark:hover:border-zinc-700/80 rounded-3xl p-6 sm:p-7 transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_-12px_rgba(99,102,241,0.22)] dark:shadow-none hover:-translate-y-2 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Company Logo, Position & Status Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3.5">
                          {/* Company Image / Logo */}
                          <div className="w-14 h-14 rounded-2xl bg-slate-100/90 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/50 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                            {companyLogo ? (
                              <img
                                src={companyLogo}
                                alt={companyName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <span
                              className="text-slate-800 dark:text-white font-bold text-xl"
                              style={{ display: companyLogo ? 'none' : 'flex' }}
                            >
                              {companyName.charAt(0).toUpperCase()}
                            </span>
                          </div>

                          {/* Company Name & Category */}
                          <div>
                            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">
                              {companyName}
                            </p>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                              {job.category || job.jobCategory || 'Tech'}
                            </span>
                          </div>
                        </div>

                        {/* Status Tag */}
                        <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border uppercase ${job.status === 'active' || !job.status
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-100 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-500 border-slate-200 dark:border-zinc-800'
                          }`}>
                          {job.status || 'Active'}
                        </span>
                      </div>

                      {/* Position Name */}
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2 min-h-[56px] leading-snug">
                        {positionName}
                      </h3>

                      {/* Operational Information Grid */}
                      <div className="mt-4 space-y-3.5 text-sm">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-tight text-base">
                          {formatSalary(job.minSalary, job.maxSalary, job.currency || job.salary)}
                        </div>

                        <div className="pt-3 space-y-2.5 border-t border-slate-200/80 dark:border-zinc-800/40">
                          <div className="flex items-center gap-2.5 text-slate-600 dark:text-zinc-400 text-xs">
                            <Briefcase size={14} className="text-slate-400 dark:text-zinc-500" />
                            <span className="capitalize">{job.type || job.jobType?.replace('-', ' ') || 'Full-time'}</span>
                          </div>

                          {job.location && (
                            <div className="flex items-center gap-2.5 text-slate-600 dark:text-zinc-400 text-xs">
                              <MapPin size={14} className="text-indigo-500 dark:text-indigo-400/80" />
                              <span className="text-slate-700 dark:text-zinc-300">{job.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Primary Button */}
                    <Link
                      href={`/jobs/${job._id}`}
                      className="w-full mt-6 py-3 bg-indigo-50 dark:bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-300 hover:text-white text-xs font-semibold tracking-wider uppercase rounded-xl border border-indigo-200 dark:border-indigo-500/30 hover:border-indigo-600 transition-all duration-300 active:scale-[0.985] shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      View Details
                      <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/50 p-4 rounded-2xl shadow-sm">
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                  Showing <span className="text-slate-900 dark:text-white font-bold">{indexOfFirstJob + 1}</span> to <span className="text-slate-900 dark:text-white font-bold">{Math.min(indexOfLastJob, filteredJobs.length)}</span> of <span className="text-slate-900 dark:text-white font-bold">{filteredJobs.length}</span> positions
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-slate-100 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800/80 rounded-xl text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 disabled:opacity-40 cursor-pointer transition disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 text-xs font-bold rounded-xl border transition cursor-pointer ${
                        currentPage === page
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-zinc-950/40 border-slate-200 dark:border-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-slate-100 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800/80 rounded-xl text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 disabled:opacity-40 cursor-pointer transition disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
          <span className="text-xs text-zinc-500 font-medium tracking-widest uppercase">Loading Jobs</span>
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
}