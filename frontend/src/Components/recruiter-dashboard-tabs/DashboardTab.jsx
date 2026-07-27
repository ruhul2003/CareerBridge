'use client';

import React from 'react';
import { Users, Briefcase, Zap, CheckCircle, Eye } from 'lucide-react';

const DashboardTab = () => {
    // Mock data - replace with real data from API later
    const stats = [
        { 
            icon: <Briefcase className="w-6 h-6" />, 
            label: "Total Job Posts", 
            value: "48",
            color: "text-blue-400"
        },
        { 
            icon: <Users className="w-6 h-6" />, 
            label: "Total Applicants", 
            value: "1,284",
            color: "text-emerald-400"
        },
        { 
            icon: <Zap className="w-6 h-6" />, 
            label: "Active Jobs", 
            value: "18",
            color: "text-amber-400"
        },
        { 
            icon: <CheckCircle className="w-6 h-6" />, 
            label: "Jobs Closed", 
            value: "32",
            color: "text-purple-400"
        },
    ];

    const recentApplications = [
        { name: "Julianne Moore", role: "Senior Product Designer", date: "Oct 24, 2023", experience: "6 years", status: "Interviewing" },
        { name: "Robert Downey", role: "Backend Engineer", date: "Oct 23, 2023", experience: "4 years", status: "New" },
        { name: "Emma Stone", role: "Marketing Lead", date: "Oct 22, 2023", experience: "8 years", status: "Reviewing" },
        { name: "Chris Pratt", role: "Product Manager", date: "Oct 21, 2023", experience: "5 years", status: "Rejected" },
    ];

    const topCompanies = [
        { name: "Google Inc.", industry: "Technology • Mountain View", activeJobs: 24, logo: "🔍" },
        { name: "Meta Platforms", industry: "Social Media • Menlo Park", activeJobs: 18, logo: "📘" },
        { name: "Stripe", industry: "Fintech • San Francisco", activeJobs: 12, logo: "💳" },
        { name: "Tesla", industry: "Automotive • Austin", activeJobs: 31, logo: "⚡" },
    ];

    return (
        <div className="p-6 max-w-8xl mx-auto space-y-8">
            {/* Welcome Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-semibold text-white">Welcome back, Alex Sterling</h1>
                    <p className="text-neutral-400 mt-1">Here is what is happening with your hiring today.</p>
                </div>
                <div className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full font-medium">
                    PREMIUM ACCOUNT
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-white/10 transition-colors">
                        <div className={`${stat.color} mb-4`}>{stat.icon}</div>
                        <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-neutral-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Recent Applications */}
                <div className="lg:col-span-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Recent Applications</h2>
                        <a href="#" className="text-sm text-neutral-400 hover:text-white flex items-center gap-1">
                            View all <Eye className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="space-y-4">
                        {recentApplications.map((app, i) => (
                            <div key={i} className="flex items-center justify-between bg-[#111] p-4 rounded-2xl border border-[#2a2a2a]">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-lg">
                                        {app.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{app.name}</p>
                                        <p className="text-sm text-neutral-400">{app.role}</p>
                                    </div>
                                </div>
                                <div className="text-right text-sm">
                                    <p className="text-neutral-400">{app.date}</p>
                                    <p className="text-neutral-500 text-xs">{app.experience}</p>
                                </div>
                                <div>
                                    <span className={`px-4 py-1 text-xs font-medium rounded-full ${
                                        app.status === 'Interviewing' ? 'bg-green-500/10 text-green-400' :
                                        app.status === 'Reviewing' ? 'bg-amber-500/10 text-amber-400' :
                                        app.status === 'New' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-red-500/10 text-red-400'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Companies */}
                <div className="lg:col-span-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">My Top Companies</h2>
                        <a href="#" className="text-sm text-neutral-400 hover:text-white">View all</a>
                    </div>

                    <div className="space-y-4">
                        {topCompanies.map((company, i) => (
                            <div key={i} className="flex items-center justify-between bg-[#111] p-4 rounded-2xl border border-[#2a2a2a] hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-xl">
                                        {company.logo}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{company.name}</p>
                                        <p className="text-xs text-neutral-500">{company.industry}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-emerald-400 font-semibold">{company.activeJobs}</div>
                                    <div className="text-[10px] text-neutral-500">ACTIVE JOBS</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 bg-white text-black rounded-2xl font-medium hover:bg-gray-200 transition">
                        View All Companies
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;