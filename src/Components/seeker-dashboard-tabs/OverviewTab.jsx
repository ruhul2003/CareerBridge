import React from 'react';
import { Bookmark, Send, Calendar, ShieldCheck } from 'lucide-react';

const OverviewTab = () => {
  // Metric metadata
  const stats = [
    { title: 'Saved Jobs', value: 12, icon: Bookmark, color: 'text-blue-400' },
    { title: 'Applications Submitted', value: 24, icon: Send, color: 'text-amber-400' },
    { title: 'Interviews Scheduled', value: 3, icon: Calendar, color: 'text-emerald-400' },
    { title: 'Offers Received', value: 1, icon: ShieldCheck, color: 'text-purple-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Dynamic Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-5 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-semibold text-white tracking-tight">{stat.value}</h3>
            </div>
            <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
          </div>
        ))}
      </div>

      {/* Middle Grid Profile Block & Progress Bar Layer */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* User Card */}
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6 md:col-span-2 flex flex-col justify-between items-center text-center">
          <div className="my-4">
            <div className="w-20 h-20 bg-neutral-800 rounded-full border border-neutral-700 flex items-center justify-center text-white text-xl mx-auto mb-4">AR</div>
            <h4 className="text-lg font-medium text-white">Alex Rivera</h4>
            <p className="text-xs text-gray-500 mt-0.5">alex.rivera@example.com</p>
          </div>
          <button className="w-full border border-[#27272a] hover:bg-[#18181b] text-xs font-medium py-2 rounded-xl transition-all text-white">
            Edit Profile
          </button>
        </div>

        {/* Application Progress Tracking HUD */}
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6 md:col-span-3">
          <h4 className="text-sm font-medium text-white mb-5">Application Status</h4>
          <div className="space-y-4">
            {[
              { label: 'Applied', count: 10, fill: 'w-[80%] bg-white' },
              { label: 'Under Review', count: 6, fill: 'w-[50%] bg-amber-500' },
              { label: 'Shortlisted', count: 5, fill: 'w-[40%] bg-blue-500' },
              { label: 'Rejected', count: 2, fill: 'w-[15%] bg-red-500' },
            ].map((bar, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{bar.label}</span>
                  <span className="text-gray-300 font-medium">{bar.count}</span>
                </div>
                <div className="w-full h-1.5 bg-[#141417] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${bar.fill}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;