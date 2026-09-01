import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, CheckCircle2, Calendar, TrendingUp, MoreVertical } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const ApplicationsTab = ({ user }) => {
  const [subTab, setSubTab] = useState('Active');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${SERVER_URL}/api/applications?applicantId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          // Sort by applied date descending
          const sorted = data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
          setApplications(sorted);
        }
      } catch (err) {
        console.error("Error fetching applications list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user?.id, SERVER_URL]);

  // Helper function to return conditional style states for mapping badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return 'text-white bg-neutral-800 border-neutral-700';
      case 'Review':
      case 'Under Review':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Shortlisted':
        return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20';
      case 'Rejected':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Offered':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      default:
        return 'text-neutral-400 bg-neutral-800';
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Filter based on search query and sub-tab selection (Active vs Archived)
  // For now, let's treat "Rejected" and "Offered" as Archived, and others as Active
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      (app.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.companyName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isArchivedStatus = app.status === 'Rejected' || app.status === 'Offered';
    const matchesTab = subTab === 'Active' ? !isArchivedStatus : isArchivedStatus;

    return matchesSearch && matchesTab;
  });

  // Analytics
  const totalApplied = applications.length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'Review' || a.status === 'Under Review' || a.status === 'Interview').length;
  const successRate = totalApplied > 0 
    ? Math.round((applications.filter(a => a.status === 'Offered' || a.status === 'Shortlisted').length / totalApplied) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  const [selectedApp, setSelectedApp] = useState(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Search & Controls Strip Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">My Applications</h2>
          <p className="text-xs text-neutral-500">Track your job applications and interview progress in real-time.</p>
        </div>

        {/* Action Button Controls Layer */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="bg-[#09090b] border border-[#1e1e24] p-1 rounded-xl flex items-center gap-1">
            {['Active', 'Archived'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  subTab === tab
                    ? 'bg-[#18181b] text-white border border-[#27272a]'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 bg-white text-black font-semibold text-xs px-3.5 py-2 rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Analytics Matrix Counters Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4">
          <p className="text-[11px] text-neutral-500 font-medium mb-1">Total Applied</p>
          <h3 className="text-2xl font-semibold text-white">{totalApplied}</h3>
        </div>
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4">
          <p className="text-[11px] text-neutral-500 font-medium mb-1">Shortlisted</p>
          <h3 className="text-2xl font-semibold text-white">{shortlistedCount}</h3>
        </div>
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4">
          <p className="text-[11px] text-neutral-500 font-medium mb-1">Interviews</p>
          <h3 className="text-2xl font-semibold text-white text-amber-500">{interviewCount}</h3>
        </div>
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4">
          <p className="text-[11px] text-neutral-500 font-medium mb-1">Success Rate</p>
          <h3 className="text-2xl font-semibold text-[#10b981] flex items-center gap-1.5">
            {successRate}% <TrendingUp className="w-4 h-4" />
          </h3>
        </div>
      </div>

      {/* Applications Filtering & Main Dataset Border Area */}
      <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl overflow-hidden shadow-sm">
        
        {/* Local Table Context Filter Input Bar */}
        <div className="p-4 border-b border-[#1e1e24] flex items-center gap-3">
          <Search className="w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs outline-none w-full placeholder-neutral-600 text-neutral-200"
          />
        </div>

        {/* Data Logger Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1e1e24] text-neutral-500 font-medium bg-[#020203]/40">
                <th className="p-4">Job Title</th>
                <th className="p-4">Company</th>
                <th className="p-4">Applied</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-[#141417]/20 transition-colors group/row">
                    
                    {/* Job Identity Cells */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#141417] border border-[#27272a] rounded-lg flex items-center justify-center font-semibold text-neutral-400">
                          {app.companyName ? app.companyName[0].toUpperCase() : '🏢'}
                        </div>
                        <div>
                          <h4 className="font-medium text-white group-hover/row:text-neutral-200 transition-colors">
                            {app.jobTitle || 'Untitled Position'}
                          </h4>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            {app.jobType ? app.jobType.replace('-', ' ') : 'N/A'} {app.isRemote ? '• Remote' : (app.location ? `• ${app.location}` : '')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company Name Cell */}
                    <td className="p-4 text-neutral-300 font-medium">
                      {app.companyName || 'N/A'}
                    </td>

                    {/* Time Logging Cell */}
                    <td className="p-4 text-neutral-500">
                      {formatTime(app.appliedAt)}
                    </td>

                    {/* Badge Conditional Styling Cell */}
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border tracking-wide uppercase ${getStatusBadge(app.status)}`}>
                        {app.status || 'Applied'}
                      </span>
                    </td>

                    {/* Operational Action Anchor Cell */}
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="text-neutral-400 hover:text-white font-medium text-xs bg-[#141417] border border-[#27272a] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-neutral-500">
                    No applications found in this tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Navigation Footer Section */}
        {filteredApplications.length > 0 && (
          <div className="p-4 border-t border-[#1e1e24] flex items-center justify-between text-[11px] text-neutral-500 bg-[#020203]/20">
            <span>Showing 1-{filteredApplications.length} of {filteredApplications.length} applications</span>
            
            <div className="flex items-center gap-1.5">
              <button className="w-6 h-6 border border-[#1e1e24] bg-[#141417] rounded flex items-center justify-center cursor-not-allowed opacity-50">
                ‹
              </button>
              <button className="w-6 h-6 bg-white text-black font-semibold rounded flex items-center justify-center">
                1
              </button>
              <button className="w-6 h-6 border border-[#1e1e24] bg-[#141417] rounded flex items-center justify-center cursor-not-allowed opacity-50">
                ›
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Application Detail Modal for Seeker */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedApp.jobTitle}</h3>
                <p className="text-xs text-zinc-400">{selectedApp.companyName} • Applied on {formatTime(selectedApp.appliedAt)}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-zinc-500 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Status</h4>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(selectedApp.status)}`}>
                  {selectedApp.status || 'Applied'}
                </span>
              </div>

              {selectedApp.coverLetter && (
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Cover Letter</h4>
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-300 whitespace-pre-wrap">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Submitted Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-medium text-white">Resume</span>
                    </div>
                    {selectedApp.resume ? (
                      <a href={selectedApp.resume} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                        View <Download className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-zinc-500">None</span>
                    )}
                  </div>

                  <div className="bg-[#141417] border border-[#27272a] p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium text-white">CV</span>
                    </div>
                    {selectedApp.cv ? (
                      <a href={selectedApp.cv} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                        View <Download className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-zinc-500">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationsTab;