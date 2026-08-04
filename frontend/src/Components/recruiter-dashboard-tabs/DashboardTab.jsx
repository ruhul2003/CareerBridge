'use client';

import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Zap, CheckCircle, Eye, Building2 } from 'lucide-react';

const DashboardTab = ({ user }) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [otherCompanies, setOtherCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) return;
            setIsLoading(true);
            try {
                // 1. Fetch current recruiter's company
                const companyRes = await fetch(`${SERVER_URL}/api/companies?recruiterId=${user.id}`);
                let companyData = null;
                if (companyRes.ok) {
                    const companies = await companyRes.json();
                    if (companies && companies.length > 0) {
                        companyData = companies[0];
                        setCompany(companyData);
                    }
                }

                // 2. Fetch other companies for recommendation/comparison
                const allCompaniesRes = await fetch(`${SERVER_URL}/api/companies`);
                if (allCompaniesRes.ok) {
                    const allCompanies = await allCompaniesRes.json();
                    const filtered = allCompanies.filter(c => c._id !== companyData?._id).slice(0, 4);
                    setOtherCompanies(filtered);
                }

                if (companyData?._id) {
                    // 3. Fetch jobs and applications in parallel
                    const [jobsRes, appsRes] = await Promise.all([
                        fetch(`${SERVER_URL}/api/jobs?companyId=${companyData._id}`),
                        fetch(`${SERVER_URL}/api/applications?companyId=${companyData._id}`)
                    ]);

                    if (jobsRes.ok) {
                        const jobsData = await jobsRes.json();
                        setJobs(jobsData);
                    }
                    if (appsRes.ok) {
                        const appsData = await appsRes.json();
                        // Sort by appliedAt descending
                        const sortedApps = appsData.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
                        setApplications(sortedApps);
                    }
                }
            } catch (error) {
                console.error("Error loading recruiter dashboard overview data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-t-white border-zinc-800 rounded-full animate-spin" />
            </div>
        );
    }

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => !j.status || j.status === 'active').length;
    const closedJobs = jobs.filter(j => j.status === 'closed').length;
    const totalApplicants = applications.length;

    const stats = [
        { 
            icon: <Briefcase className="w-6 h-6" />, 
            label: "Total Job Posts", 
            value: totalJobs,
            color: "text-blue-400"
        },
        { 
            icon: <Users className="w-6 h-6" />, 
            label: "Total Applicants", 
            value: totalApplicants,
            color: "text-emerald-400"
        },
        { 
            icon: <Zap className="w-6 h-6" />, 
            label: "Active Jobs", 
            value: activeJobs,
            color: "text-amber-400"
        },
        { 
            icon: <CheckCircle className="w-6 h-6" />, 
            label: "Jobs Closed", 
            value: closedJobs,
            color: "text-purple-400"
        },
    ];

    const getInitials = (name) => {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="p-6 max-w-8xl mx-auto space-y-8 animate-fadeIn">
            {/* Welcome Header */}
            <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-white">Welcome back, {user?.name || user?.fullName || 'Recruiter'}</h1>
                    <p className="text-neutral-400 mt-1">Here is what is happening with your hiring today.</p>
                </div>
                <div className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full font-medium border border-emerald-500/20 uppercase tracking-wider">
                    {user?.plan === 'recruiter_enterprise' ? 'Enterprise Access' : user?.plan === 'recruiter_growth' ? 'Growth Access' : 'Free Tier'}
                </div>
            </div>

            {!company ? (
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-8 text-center max-w-2xl mx-auto space-y-4">
                    <Building2 className="w-12 h-12 text-zinc-500 mx-auto" />
                    <h2 className="text-xl font-bold text-white">Register your company profile</h2>
                    <p className="text-neutral-400 text-sm">
                        To post jobs and receive candidate applications, you need to register your company profile first. Head over to the "My Company" tab to set up your business workspace.
                    </p>
                </div>
            ) : (
                <>
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
                        <div className="lg:col-span-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-white">Recent Applications</h2>
                                    <span className="text-xs text-zinc-500 font-medium">{applications.length} total candidates</span>
                                </div>

                                <div className="space-y-4">
                                    {applications.length === 0 ? (
                                        <div className="text-center py-10 text-neutral-500 text-sm">
                                            No applications received yet.
                                        </div>
                                    ) : (
                                        applications.slice(0, 4).map((app, i) => (
                                            <div key={i} className="flex items-center justify-between bg-[#111] p-4 rounded-2xl border border-[#2a2a2a]">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-lg font-semibold shrink-0 text-white border border-neutral-700">
                                                        {getInitials(app.applicantName)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-white truncate">{app.applicantName}</p>
                                                        <p className="text-sm text-neutral-400 truncate">{app.jobTitle}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right text-sm shrink-0 px-2">
                                                    <p className="text-neutral-400">{formatDate(app.appliedAt)}</p>
                                                    <p className="text-neutral-500 text-xs">{app.jobType || 'Full-time'}</p>
                                                </div>
                                                <div className="shrink-0">
                                                    <span className={`px-4 py-1 text-xs font-semibold rounded-full border ${
                                                        app.status === 'Applied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        app.status === 'Interviewing' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        app.status === 'Reviewing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        app.status === 'Offered' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                                    }`}>
                                                        {app.status || 'Applied'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Top Companies */}
                        <div className="lg:col-span-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white">Explore Workspaces</h2>
                                <span className="text-xs text-zinc-500 font-medium">Other Companies</span>
                            </div>

                            <div className="space-y-4">
                                {otherCompanies.length === 0 ? (
                                    <div className="text-center py-10 text-neutral-500 text-sm">
                                        No other companies registered.
                                    </div>
                                ) : (
                                    otherCompanies.map((comp, i) => (
                                        <div key={i} className="flex items-center justify-between bg-[#111] p-4 rounded-2xl border border-[#2a2a2a] hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-10 h-10 bg-gradient-to-br from-neutral-800 to-zinc-900 border border-neutral-700 rounded-xl flex items-center justify-center text-xl text-white font-bold shrink-0">
                                                    {comp.name ? comp.name.charAt(0).toUpperCase() : 'C'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-white truncate">{comp.name}</p>
                                                    <p className="text-xs text-neutral-500 truncate">{comp.industry} • {comp.location}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardTab;