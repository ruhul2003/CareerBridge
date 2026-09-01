import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Bookmark, Calendar, Clock } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const SavedJobsTab = ({ user }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Saved');

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${SERVER_URL}/api/saved-jobs?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          const sorted = data.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
          setSavedJobs(sorted);
        }
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [user?.id, SERVER_URL]);

  const handleUnsave = async (jobId) => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${SERVER_URL}/api/saved-jobs?userId=${user.id}&jobId=${jobId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSavedJobs(prev => prev.filter(j => j.jobId !== jobId));
      }
    } catch (err) {
      console.error("Error unsaving job:", err);
    }
  };

  const formatSalary = (min, max, currency) => {
    const cur = currency && currency.trim() !== '' ? currency : 'BDT';
    if (min && max) return `${cur} ${Number(min).toLocaleString()} – ${Number(max).toLocaleString()}`;
    if (min) return `From ${cur} ${Number(min).toLocaleString()}`;
    if (max) return `Up to ${cur} ${Number(max).toLocaleString()}`;
    return 'Salary confidential';
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Saved just now';
      if (diffMins < 60) return `Saved ${diffMins}m ago`;
      if (diffHours < 24) return `Saved ${diffHours}h ago`;
      if (diffDays === 1) return 'Saved yesterday';
      if (diffDays < 7) return `Saved ${diffDays} days ago`;
      return `Saved ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } catch {
      return 'N/A';
    }
  };

  // Filter based on search query
  const filteredJobs = savedJobs.filter(job => {
    const matchesSearch =
      (job.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Counters
  const totalSaved = savedJobs.length;
  const activeCount = savedJobs.filter(j => j.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Search & Filter Strip */}
      <div className="flex items-center justify-between gap-4 bg-[#09090b] border border-[#1e1e24] p-3 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search jobs, companies, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent pl-10 pr-4 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 border-none outline-none focus:ring-0"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span>Sort by:</span>
          <select className="bg-[#141417] border border-[#27272a] text-neutral-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer">
            <option>Recently Saved</option>
            <option>Closing Soon</option>
          </select>
        </div>
      </div>

      {/* Main Container Header */}
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Saved Jobs</h2>
        <p className="text-xs text-neutral-500">Manage and track your bookmarked opportunities.</p>
      </div>

      {/* Counter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-[#141417] border border-[#27272a] rounded-lg flex items-center justify-center">
            <Bookmark className="w-4 h-4 text-neutral-400" />
          </div>
          <div>
            <p className="text-[11px] text-neutral-500 font-medium">Total Saved</p>
            <h3 className="text-xl font-semibold text-white">{totalSaved}</h3>
          </div>
        </div>
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] text-neutral-500 font-medium">Active Roles</p>
            <h3 className="text-xl font-semibold text-amber-500">{activeCount}</h3>
          </div>
        </div>
      </div>

      {/* Saved Jobs Mapping Stack */}
      <div className="space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#27272a] transition-all"
            >
              {/* Left Info Meta Block */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#141417] border border-[#27272a] rounded-xl flex items-center justify-center font-bold text-neutral-400 text-sm">
                  {job.companyName ? job.companyName[0].toUpperCase() : '🏢'}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/jobs/${job.jobId}`}>
                      <h4 className="text-sm font-medium text-white hover:text-neutral-300 cursor-pointer transition-colors">
                        {job.jobTitle || 'Untitled Position'}
                      </h4>
                    </Link>
                    <span className="text-[10px] tracking-wider font-bold bg-[#141417] border border-[#27272a] text-neutral-400 px-1.5 py-0.5 rounded uppercase">
                      {job.companyName || 'N/A'}
                    </span>
                  </div>
                  
                  {/* Location & Salary Indicators */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.isRemote ? 'Remote' : (job.location || 'On-site')}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <DollarSign className="w-3.5 h-3.5" /> {formatSalary(job.minSalary, job.maxSalary, job.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Status Logs & Dynamic CTA Buttons */}
              <div className="flex flex-col sm:items-end justify-center gap-2 min-w-[140px]">
                <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatTime(job.savedAt)}
                  </span>
                  {job.deadline && (
                    <span className="text-amber-500 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/10">
                      Deadline: {job.deadline}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleUnsave(job.jobId)}
                    className="p-2 rounded-lg border border-[#1e1e24] bg-[#141417] text-indigo-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Unsave"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                  <Link href={`/jobs/${job.jobId}`} className="flex-1 sm:flex-none">
                    <button className="w-full bg-white text-black font-semibold text-xs px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer">
                      View Job
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-10 text-center">
            <Bookmark className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm font-medium">No saved jobs yet</p>
            <p className="text-neutral-600 text-xs mt-1">Browse jobs and bookmark the ones you like to see them here.</p>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      {filteredJobs.length > 0 && (
        <div className="text-center pt-2">
          <p className="text-xs text-neutral-600">Showing {filteredJobs.length} of {totalSaved} saved jobs</p>
        </div>
      )}

    </div>
  );
};

export default SavedJobsTab;