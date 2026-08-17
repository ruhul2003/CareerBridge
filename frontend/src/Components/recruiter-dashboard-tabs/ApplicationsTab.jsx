'use client';

import React, { useState, useEffect } from 'react';
import { 
    FileText, User, Mail, Calendar, Eye, 
    X, Check, Building2, ChevronDown, RefreshCw, Download 
} from 'lucide-react';

const ApplicationsTab = ({ user }) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedJobFilter, setSelectedJobFilter] = useState('all');
    const [selectedApp, setSelectedApp] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchApplicationsData = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            // 1. Fetch current recruiter's company
            const companyRes = await fetch(`${SERVER_URL}/api/companies?recruiterId=${user.id}`);
            if (companyRes.ok) {
                const companies = await companyRes.json();
                if (companies && companies.length > 0) {
                    const currentCompany = companies[0];
                    setCompany(currentCompany);

                    // 2. Fetch jobs and applications in parallel
                    const [jobsRes, appsRes] = await Promise.all([
                        fetch(`${SERVER_URL}/api/jobs?companyId=${currentCompany._id}`),
                        fetch(`${SERVER_URL}/api/applications?companyId=${currentCompany._id}`)
                    ]);

                    if (jobsRes.ok) {
                        const jobsData = await jobsRes.json();
                        setJobs(jobsData);
                    }

                    if (appsRes.ok) {
                        const appsData = await appsRes.json();
                        // Sort newest first
                        const sortedApps = appsData.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
                        setApplications(sortedApps);
                        setFilteredApplications(sortedApps);
                    }
                } else {
                    setCompany(null);
                }
            }
        } catch (error) {
            console.error("Error fetching applications workspace:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchApplicationsData();
        }
    }, [user?.id]);

    useEffect(() => {
        if (selectedJobFilter === 'all') {
            setFilteredApplications(applications);
        } else {
            setFilteredApplications(applications.filter(app => app.jobId === selectedJobFilter));
        }
    }, [selectedJobFilter, applications]);

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            const res = await fetch(`${SERVER_URL}/api/applications/${appId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update locally
                const updated = applications.map(app => 
                    app._id === appId ? { ...app, status: newStatus } : app
                );
                setApplications(updated);
                
                if (selectedApp && selectedApp._id === appId) {
                    setSelectedApp({ ...selectedApp, status: newStatus });
                }
            } else {
                alert("Failed to update applicant status.");
            }
        } catch (error) {
            console.error("Error updating application status:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-t-white border-zinc-800 rounded-full animate-spin" />
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-6 text-center animate-fadeIn">
                <div className="max-w-md">
                    <div className="relative mx-auto mb-8 w-44 h-44 bg-zinc-900 rounded-3xl border border-neutral-800 flex items-center justify-center shadow-xl">
                        <Building2 className="w-16 h-16 text-neutral-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Company profile required</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                        Before you can manage candidate applications, you must register your company profile.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-end flex-wrap gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Candidates & Applications</h1>
                    <p className="text-zinc-400 text-sm mt-1">Review applicant profiles and coordinate status paths.</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 font-medium">Filter by Job:</span>
                    <div className="relative">
                        <select 
                            value={selectedJobFilter}
                            onChange={(e) => setSelectedJobFilter(e.target.value)}
                            className="bg-[#141416] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-300 font-semibold outline-none cursor-pointer pr-10 appearance-none min-w-[200px]"
                        >
                            <option value="all">All Jobs ({applications.length})</option>
                            {jobs.map(job => (
                                <option key={job._id} value={job._id}>
                                    {job.jobTitle}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
                <div className="bg-[#141416] rounded-2xl border border-zinc-800/80 p-12 text-center max-w-xl mx-auto space-y-4">
                    <FileText className="w-12 h-12 text-zinc-600 mx-auto" />
                    <h3 className="text-lg font-bold text-white">No applications found</h3>
                    <p className="text-zinc-400 text-sm">
                        Candidates will appear here once they start submitting applications for your job openings.
                    </p>
                </div>
            ) : (
                <div className="bg-[#141416] border border-zinc-850 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800/80 bg-zinc-950/20 text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    <th className="py-4 px-6">Candidate</th>
                                    <th className="py-4 px-6">Applied Role</th>
                                    <th className="py-4 px-6">Applied Date</th>
                                    <th className="py-4 px-6">Current Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60 text-sm text-zinc-300">
                                {filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-zinc-900/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center font-bold text-xs">
                                                    {app.applicantName ? app.applicantName.charAt(0).toUpperCase() : 'A'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{app.applicantName}</p>
                                                    <p className="text-xs text-zinc-500">{app.applicantEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-zinc-200">
                                            {app.jobTitle}
                                        </td>
                                        <td className="py-4 px-6 text-xs text-zinc-400">
                                            {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="relative inline-block">
                                                <select 
                                                    value={app.status || 'Applied'}
                                                    onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none appearance-none cursor-pointer pr-7 ${
                                                        app.status === 'Applied' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                                        app.status === 'Interviewing' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                        app.status === 'Reviewing' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                                        app.status === 'Offered' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                                        'bg-red-500/10 border-red-500/20 text-red-400'
                                                    }`}
                                                >
                                                    <option value="Applied">Applied</option>
                                                    <option value="Reviewing">Reviewing</option>
                                                    <option value="Interviewing">Interviewing</option>
                                                    <option value="Offered">Offered</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button 
                                                onClick={() => setSelectedApp(app)}
                                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ml-auto border border-zinc-700/60"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Candidate Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                    <div className="bg-[#161616] w-full max-w-2xl rounded-2xl border border-zinc-800/80 shadow-2xl overflow-y-auto max-h-[90vh] font-sans">
                        <div className="p-6 pb-5 border-b border-zinc-800/60 flex items-start justify-between sticky top-0 bg-[#161616] z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center text-white font-bold text-xl border border-neutral-700">
                                    {selectedApp.applicantName ? selectedApp.applicantName.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div>
                                    <h3 className="text-[19px] font-semibold text-white tracking-tight">{selectedApp.applicantName}</h3>
                                    <p className="text-xs text-zinc-400">Applying for {selectedApp.jobTitle}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Metadata */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850">
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <Mail className="w-4 h-4 text-zinc-500" />
                                    <span className="text-xs truncate">{selectedApp.applicantEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <Calendar className="w-4 h-4 text-zinc-500" />
                                    <span className="text-xs">Applied on: {new Date(selectedApp.appliedAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Cover Letter</h4>
                                <div className="bg-[#1f1f21] border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedApp.coverLetter || "No cover letter was submitted with this application."}
                                </div>
                            </div>

                            {/* Candidate Documents (Resume & CV) */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Candidate Documents</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Resume Card */}
                                    <div className="bg-[#1f1f21] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-white">Resume</p>
                                                <p className="text-[10px] text-zinc-400">Primary candidate document</p>
                                            </div>
                                        </div>
                                        {selectedApp.resume ? (
                                            <a 
                                                href={selectedApp.resume}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition shadow"
                                            >
                                                <Download className="w-3.5 h-3.5" /> View Resume
                                            </a>
                                        ) : (
                                            <span className="text-[11px] text-zinc-500 italic">No Resume attached</span>
                                        )}
                                    </div>

                                    {/* CV Card */}
                                    <div className="bg-[#1f1f21] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-white">Curriculum Vitae (CV)</p>
                                                <p className="text-[10px] text-zinc-400">Detailed work history document</p>
                                            </div>
                                        </div>
                                        {selectedApp.cv ? (
                                            <a 
                                                href={selectedApp.cv}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition shadow"
                                            >
                                                <Download className="w-3.5 h-3.5" /> View CV
                                            </a>
                                        ) : (
                                            <span className="text-[11px] text-zinc-500 italic">No CV attached</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status controls */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-zinc-800/40">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Application Decision</span>
                                    <p className="text-xs text-zinc-400">Update status to trigger applicant alerts.</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {['Interviewing', 'Offered', 'Rejected'].map((status) => {
                                        const isSelected = selectedApp.status === status;
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => handleUpdateStatus(selectedApp._id, status)}
                                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                                                    isSelected
                                                        ? status === 'Interviewing' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                                          status === 'Offered' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                                                          'bg-red-500/10 border-red-500/30 text-red-400'
                                                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsTab;
