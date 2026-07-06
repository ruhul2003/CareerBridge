import React, { useState, useEffect } from 'react';
import { Bookmark, Send, Calendar, ShieldCheck } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const OverviewTab = () => {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOverviewData = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${SERVER_URL}/api/applications?applicantId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (err) {
        console.error("Error fetching dashboard overview details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchOverviewData();
    } else if (!sessionLoading && !user) {
      setLoading(false);
    }
  }, [user, sessionLoading, SERVER_URL]);

  // Calculate status counts
  const appliedCount = applications.filter(a => a.status === 'Applied').length;
  const reviewCount = applications.filter(a => a.status === 'Review' || a.status === 'Under Review').length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;
  const offeredCount = applications.filter(a => a.status === 'Offered').length;

  const stats = [
    { title: 'Saved Jobs', value: 0, icon: Bookmark, color: 'text-blue-400' },
    { title: 'Applications Submitted', value: applications.length, icon: Send, color: 'text-amber-400' },
    { title: 'Interviews Scheduled', value: shortlistedCount, icon: Calendar, color: 'text-emerald-400' },
    { title: 'Offers Received', value: offeredCount, icon: ShieldCheck, color: 'text-purple-400' },
  ];

  // Helper for initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getPercentage = (count) => {
    if (applications.length === 0) return '0%';
    return `${Math.round((count / applications.length) * 100)}%`;
  };

  const statusBars = [
    { label: 'Applied', count: appliedCount, fill: 'bg-white', width: getPercentage(appliedCount) },
    { label: 'Under Review', count: reviewCount, fill: 'bg-amber-500', width: getPercentage(reviewCount) },
    { label: 'Shortlisted', count: shortlistedCount, fill: 'bg-blue-500', width: getPercentage(shortlistedCount) },
    { label: 'Rejected', count: rejectedCount, fill: 'bg-red-500', width: getPercentage(rejectedCount) },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

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
            <div className="w-20 h-20 bg-neutral-800 rounded-full border border-neutral-700 flex items-center justify-center text-white text-xl mx-auto mb-4 overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <h4 className="text-lg font-medium text-white">{user?.name || "Anonymous User"}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email || "No email address"}</p>
          </div>
          <button className="w-full border border-[#27272a] hover:bg-[#18181b] text-xs font-medium py-2 rounded-xl transition-all text-white">
            Edit Profile
          </button>
        </div>

        {/* Application Progress Tracking HUD */}
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6 md:col-span-3">
          <h4 className="text-sm font-medium text-white mb-5">Application Status</h4>
          <div className="space-y-4">
            {statusBars.map((bar, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{bar.label}</span>
                  <span className="text-gray-300 font-medium">{bar.count}</span>
                </div>
                <div className="w-full h-1.5 bg-[#141417] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${bar.fill}`} style={{ width: bar.width }}></div>
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