import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Building2, FileText, UserCheck, ShieldAlert } from 'lucide-react';

const AdminOverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/admin/stats`);
        if (!res.ok) throw new Error('Failed to fetch statistics');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          throw new Error(data.message || 'Error fetching stats');
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [SERVER_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/30 border border-red-900/50 rounded-2xl text-red-400 text-sm flex items-center gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <span>Failed to load overview statistics: {error}</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
    { label: 'Job Seekers', value: stats.totalSeekers, icon: UserCheck, color: 'from-cyan-500/10 to-blue-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
    { label: 'Recruiters', value: stats.totalRecruiters, icon: Briefcase, color: 'from-purple-500/10 to-indigo-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
    { label: 'Active Jobs', value: stats.totalJobs, icon: Briefcase, color: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { label: 'Companies', value: stats.totalCompanies, icon: Building2, color: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
    { label: 'Applications', value: stats.totalApplications, icon: FileText, color: 'from-rose-500/10 to-pink-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] border border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, Admin</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Monitor and coordinate platform growth, verify registrations, approve companies, manage job posts, and coordinate settings from your centralized root terminal.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} ${card.border} border rounded-2xl p-6 shadow-sm hover:scale-[1.01] hover:shadow-md transition-all duration-300 flex items-center justify-between`}
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{card.label}</p>
                <h3 className="text-3xl font-black text-white">{card.value}</h3>
              </div>
              <div className={`p-3 bg-black/40 rounded-xl border border-zinc-800/80 ${card.text}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverviewTab;
