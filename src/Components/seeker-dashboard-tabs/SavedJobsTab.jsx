import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Bookmark, Calendar, Clock } from 'lucide-react';

const SavedJobsTab = () => {
  // Mock Dataset matching Screenshot layout matrix values
  const [savedJobs, setSavedJobs] = useState([
    {
      id: "1",
      title: "Senior Product Designer",
      company: "TECHFLOW",
      location: "San Francisco, CA (Hybrid)",
      salary: "$160k - $200k + Equity",
      savedTime: "Saved 2 hours ago",
      closingStatus: "Closes in 3 days",
      status: "active"
    },
    {
      id: "2",
      title: "Frontend Engineer",
      company: "VERCEL",
      location: "Remote, Global",
      salary: "$140k - $180k",
      savedTime: "Saved yesterday",
      closingStatus: null,
      status: "active"
    },
    {
      id: "3",
      title: "Staff UI Researcher",
      company: "LINEAR",
      location: "New York, NY (On-site)",
      salary: "$180k - $220k",
      savedTime: "Saved 3 days ago",
      closingStatus: null,
      status: "draft"
    },
    {
      id: "4",
      title: "Full Stack Developer",
      company: "META",
      location: "Menlo Park, CA (Hybrid)",
      salary: "$150k - $210k + Bonus",
      savedTime: "Saved 5 days ago",
      closingStatus: null,
      status: "active"
    },
    {
      id: "5",
      title: "Design Systems Lead",
      company: "SPOTIFY",
      location: "Remote, USA",
      salary: "Confidential",
      savedTime: "Closed yesterday",
      closingStatus: null,
      status: "closed"
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('All Saved');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Search & Filter Strip */}
      <div className="flex items-center justify-between gap-4 bg-[#09090b] border border-[#1e1e24] p-3 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search jobs, companies, or skills..."
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
            <h3 className="text-xl font-semibold text-white">24</h3>
          </div>
        </div>
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] text-neutral-500 font-medium">Closing Soon</p>
            <h3 className="text-xl font-semibold text-amber-500">3</h3>
          </div>
        </div>
      </div>

      {/* Categorized Filter Chips Row */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-[#1e1e24] pb-4">
        {['All Saved', 'Design (8)', 'Engineering (12)', 'Product (4)'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === filter
                ? 'bg-[#18181b] text-white border border-[#27272a]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Saved Jobs Mapping Stack */}
      <div className="space-y-3">
        {savedJobs.map((job) => (
          <div
            key={job.id}
            className={`bg-[#09090b] border border-[#1e1e24] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#27272a] transition-all ${
              job.status === 'closed' ? 'opacity-60' : ''
            }`}
          >
            {/* Left Info Meta Block */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#141417] border border-[#27272a] rounded-xl flex items-center justify-center font-bold text-neutral-400 text-sm">
                {job.company[0]}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-medium text-white hover:text-neutral-300 cursor-pointer transition-colors">
                    {job.title}
                  </h4>
                  <span className="text-[10px] tracking-wider font-bold bg-[#141417] border border-[#27272a] text-neutral-400 px-1.5 py-0.5 rounded uppercase">
                    {job.company}
                  </span>
                </div>
                
                {/* Location & Salary Indicators */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {job.location}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Status Logs & Dynamic CTA Buttons */}
            <div className="flex flex-col sm:items-end justify-center gap-2 min-w-[140px]">
              <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {job.savedTime}
                </span>
                {job.closingStatus && (
                  <span className="text-amber-500 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/10">
                    {job.closingStatus}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {job.status === 'active' && (
                  <>
                    <button className="p-2 rounded-lg border border-[#1e1e24] bg-[#141417] text-neutral-400 hover:text-white transition-colors">
                      <Bookmark className="w-4 h-4 fill-current text-white" />
                    </button>
                    <button className="flex-1 sm:flex-none bg-white text-black font-semibold text-xs px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors">
                      Apply Now
                    </button>
                  </>
                )}
                {job.status === 'draft' && (
                  <button className="w-full text-center bg-[#141417] border border-[#1e1e24] text-neutral-400 font-medium text-xs px-4 py-2 rounded-lg cursor-not-allowed">
                    Draft Started
                  </button>
                )}
                {job.status === 'closed' && (
                  <button className="w-full text-center text-red-400/80 bg-red-500/5 border border-red-500/10 font-medium text-xs px-4 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
                    Remove from List
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Pagination / Infinite Scroll Bottom Anchor */}
      <div className="text-center pt-4">
        <button className="text-xs text-neutral-500 hover:text-neutral-300 font-medium transition-colors">
          Load More <span>↓</span>
        </button>
      </div>

    </div>
  );
};

export default SavedJobsTab;