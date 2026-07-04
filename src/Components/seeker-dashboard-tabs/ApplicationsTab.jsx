import React, { useState } from 'react';
import { Search, Download, FileText, CheckCircle2, Calendar, TrendingUp, MoreVertical } from 'lucide-react';

const ApplicationsTab = () => {
  // Navigation Tab State (Active vs Archived)
  const [subTab, setSubTab] = useState('Active');

  // Application Mock Dataset matching Screenshot matrix data rows
  const [applications, setApplications] = useState([
    {
      id: "1",
      title: "Senior Frontend Engineer",
      type: "Full-time • Remote",
      company: "Stark Industries",
      appliedTime: "2 hours ago",
      status: "Applied"
    },
    {
      id: "2",
      title: "Product Designer",
      type: "Contract • Hybrid",
      company: "Cyberdyne Systems",
      appliedTime: "1 day ago",
      status: "Review"
    },
    {
      id: "3",
      title: "Lead Data Scientist",
      type: "Full-time • On-site",
      company: "Wayne Enterprises",
      appliedTime: "4 days ago",
      status: "Shortlisted"
    },
    {
      id: "4",
      title: "Cloud Architect",
      type: "Full-time • Remote",
      company: "Oscorp Tech",
      appliedTime: "1 week ago",
      status: "Rejected"
    },
    {
      id: "5",
      title: "AI Research Engineer",
      type: "Full-time • Hybrid",
      company: "Hooli Corp",
      appliedTime: "2 weeks ago",
      status: "Offered"
    }
  ]);

  // Helper function to return conditional style states for mapping badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return 'text-white bg-neutral-800 border-neutral-700';
      case 'Review':
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
          <button className="flex items-center gap-1.5 bg-white text-black font-semibold text-xs px-3.5 py-2 rounded-xl hover:bg-neutral-200 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Analytics Matrix Counters Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4">
          <p className="text-[11px] text-neutral-500 font-medium mb-1">Total Applied</p>
          <h3 className="text-2xl font-semibold text-white">24</h3>
        </div>
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4">
          <p className="text-[11px] text-neutral-500 font-medium mb-1">Shortlisted</p>
          <h3 className="text-2xl font-semibold text-white">8</h3>
        </div>
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4">
          <p className="text-[11px] text-neutral-500 font-medium mb-1">Interviews</p>
          <h3 className="text-2xl font-semibold text-white text-amber-500">3</h3>
        </div>
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-xl p-4">
          <p className="text-[11px] text-neutral-500 font-medium mb-1">Success Rate</p>
          <h3 className="text-2xl font-semibold text-[#10b981] flex items-center gap-1.5">
            12% <TrendingUp className="w-4 h-4" />
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
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-[#141417]/20 transition-colors group">
                  
                  {/* Job Identity Cells */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#141417] border border-[#27272a] rounded-lg flex items-center justify-center font-semibold text-neutral-400">
                        {app.company[0]}
                      </div>
                      <div>
                        <h4 className="font-medium text-white group-hover:text-neutral-200 transition-colors">
                          {app.title}
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{app.type}</p>
                      </div>
                    </div>
                  </td>

                  {/* Company Name Cell */}
                  <td className="p-4 text-neutral-300 font-medium">
                    {app.company}
                  </td>

                  {/* Time Logging Cell */}
                  <td className="p-4 text-neutral-500">
                    {app.appliedTime}
                  </td>

                  {/* Badge Conditional Styling Cell */}
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border tracking-wide uppercase ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </td>

                  {/* Operational Action Anchor Cell */}
                  <td className="p-4 text-right">
                    <button className="text-neutral-400 hover:text-white font-medium text-xs bg-[#141417] border border-[#27272a] px-3 py-1.5 rounded-lg transition-colors">
                      Details
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Bottom Navigation Footer Section */}
        <div className="p-4 border-t border-[#1e1e24] flex items-center justify-between text-[11px] text-neutral-500 bg-[#020203]/20">
          <span>Showing 1-5 of 24 applications</span>
          
          <div className="flex items-center gap-1.5">
            <button className="w-6 h-6 border border-[#1e1e24] bg-[#141417] rounded flex items-center justify-center cursor-not-allowed opacity-50">
              ‹
            </button>
            <button className="w-6 h-6 bg-white text-black font-semibold rounded flex items-center justify-center">
              1
            </button>
            <button className="w-6 h-6 border border-[#1e1e24] bg-[#141417] rounded flex items-center justify-center hover:bg-[#18181b] hover:text-white transition-colors">
              2
            </button>
            <button className="w-6 h-6 border border-[#1e1e24] bg-[#141417] rounded flex items-center justify-center hover:bg-[#18181b] hover:text-white transition-colors">
              3
            </button>
            <button className="w-6 h-6 border border-[#1e1e24] bg-[#141417] rounded flex items-center justify-center hover:bg-[#18181b] hover:text-white transition-colors">
              ›
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ApplicationsTab;