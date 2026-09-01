'use client';

import React, { useState, useEffect } from 'react';
import { 
    FileText, User, Mail, Calendar, Eye, 
    X, Check, Building2, ChevronDown, RefreshCw, Download,
    Phone, MapPin, Globe, GraduationCap, Code, ExternalLink, Loader2, Sparkles
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import Image from 'next/image';

const ApplicationsTab = ({ user }) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedJobFilter, setSelectedJobFilter] = useState('all');
    const [selectedApp, setSelectedApp] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Full Profile state for inspecting candidate
    const [applicantProfile, setApplicantProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        const fetchApplicationsData = async () => {
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

        fetchApplicationsData();
    }, [user?.id, SERVER_URL]);

    useEffect(() => {
        if (selectedJobFilter === 'all') {
            setFilteredApplications(applications);
        } else {
            setFilteredApplications(applications.filter(app => app.jobId === selectedJobFilter));
        }
    }, [selectedJobFilter, applications]);

    // Fetch full candidate profile when a candidate modal is opened
    useEffect(() => {
        const applicantIdToFetch = selectedApp?.applicantId || selectedApp?.userId;
        if (!selectedApp || !applicantIdToFetch) {
            setApplicantProfile(null);
            return;
        }

        const fetchFullApplicantDetails = async () => {
            setProfileLoading(true);
            setApplicantProfile(null);
            try {
                const res = await fetch(`/api/users/${applicantIdToFetch}`);
                if (res.ok) {
                    const profileData = await res.json();
                    setApplicantProfile(profileData);
                }
            } catch (err) {
                console.error("Error fetching candidate full profile:", err);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchFullApplicantDetails();
    }, [selectedApp]);

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
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400 font-sans">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
                <p className="text-xs">Loading Job Applications...</p>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="bg-[#141416] border border-zinc-800 rounded-2xl p-12 text-center max-w-2xl mx-auto my-8 font-sans">
                <Building2 className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">No Company Registered</h2>
                <p className="text-zinc-400 text-sm mb-6">
                    Please create or claim your company profile in the <span className="text-indigo-400 font-semibold">Company Tab</span> to start reviewing applicant submissions.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 font-sans">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141416] border border-zinc-800/80 rounded-2xl p-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        Applicant Management Hub
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                        Review submissions, inspect candidate educational & experience background, and track hiring decisions for <span className="text-indigo-400 font-semibold">{company.name}</span>.
                    </p>
                </div>

                {/* Job Filter Dropdown */}
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Filter by Job:</span>
                    <div className="relative min-w-[200px]">
                        <select
                            value={selectedJobFilter}
                            onChange={(e) => setSelectedJobFilter(e.target.value)}
                            className="w-full bg-[#1c1c1f] border border-zinc-700/70 text-white text-xs font-medium rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer pr-8 focus:border-indigo-500 transition-colors"
                        >
                            <option value="all">All Posted Positions ({applications.length})</option>
                            {jobs.map(job => (
                                <option key={job._id} value={job._id}>
                                    {job.title} ({applications.filter(a => a.jobId === job._id).length})
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            {filteredApplications.length === 0 ? (
                <div className="bg-[#141416] border border-zinc-800/80 rounded-2xl p-12 text-center">
                    <User className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-1">No Applications Received Yet</h3>
                    <p className="text-zinc-400 text-xs">
                        {selectedJobFilter === 'all' 
                            ? "No job seekers have applied for your company's active roles yet." 
                            : "No applications submitted for this specific job position yet."}
                    </p>
                </div>
            ) : (
                <div className="bg-[#141416] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800/80 bg-zinc-900/60 text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                                    <th className="py-4 px-6">Applicant Name</th>
                                    <th className="py-4 px-6">Applied Role</th>
                                    <th className="py-4 px-6">Applied Date</th>
                                    <th className="py-4 px-6">Decision Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60 text-xs">
                                {filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-zinc-900/40 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                                                    {app.applicantName ? app.applicantName.charAt(0).toUpperCase() : 'A'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white text-sm">{app.applicantName}</p>
                                                    <p className="text-[11px] text-zinc-400">{app.applicantEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-zinc-200">
                                            {app.jobTitle || 'Job Opportunity'}
                                        </td>
                                        <td className="py-4 px-6 text-zinc-400">
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
                                                className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ml-auto cursor-pointer shadow-sm"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> View Applicant Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Comprehensive Candidate Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#121215] w-full max-w-3xl rounded-2xl border border-zinc-800 shadow-2xl overflow-y-auto max-h-[92vh] font-sans">
                        {/* Sticky Header */}
                        <div className="p-6 pb-5 border-b border-zinc-800/80 flex items-start justify-between sticky top-0 bg-[#121215]/95 backdrop-blur-md z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 flex-shrink-0">
                                    {applicantProfile?.avatar ? (
                                        <img
                                            src={applicantProfile.avatar}
                                            alt={selectedApp.applicantName}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500/40 shadow-md"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-indigo-500/40 shadow-md">
                                            {selectedApp.applicantName ? selectedApp.applicantName.charAt(0).toUpperCase() : 'A'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-white tracking-tight">{selectedApp.applicantName}</h3>
                                        {applicantProfile?.title && (
                                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold">
                                                {applicantProfile.title}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        Applied for <span className="text-white font-medium">{selectedApp.jobTitle}</span> • {new Date(selectedApp.appliedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedApp(null)} 
                                className="text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body Content */}
                        <div className="p-6 space-y-6">
                            
                            {profileLoading && (
                                <div className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800/80 flex items-center justify-center gap-2 text-zinc-400 text-xs">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                    <span>Fetching full candidate educational & background records...</span>
                                </div>
                            )}

                            {/* Contact & Personal Metadata */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 text-xs">
                                <div className="flex items-center gap-2.5 text-zinc-300">
                                    <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                    <span className="truncate">{selectedApp.applicantEmail}</span>
                                </div>
                                
                                {applicantProfile?.phone && (
                                    <div className="flex items-center gap-2.5 text-zinc-300">
                                        <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        <span>{applicantProfile.phone}</span>
                                    </div>
                                )}

                                {applicantProfile?.location && (
                                    <div className="flex items-center gap-2.5 text-zinc-300">
                                        <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
                                        <span>{applicantProfile.location}</span>
                                    </div>
                                )}

                                {applicantProfile?.dateOfBirth && (
                                    <div className="flex items-center gap-2.5 text-zinc-300">
                                        <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                        <span>DOB: {applicantProfile.dateOfBirth}</span>
                                    </div>
                                )}

                                {applicantProfile?.languages && (
                                    <div className="flex items-center gap-2.5 text-zinc-300 col-span-1 sm:col-span-2">
                                        <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                        <span>Languages: {applicantProfile.languages}</span>
                                    </div>
                                )}
                            </div>

                            {/* Candidate Bio / Professional Summary */}
                            {applicantProfile?.bio && (
                                <div className="space-y-1.5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Professional Summary / Bio</h4>
                                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 text-xs text-zinc-300 leading-relaxed">
                                        {applicantProfile.bio}
                                    </div>
                                </div>
                            )}

                            {/* Social & Portfolio Links */}
                            {(applicantProfile?.github || applicantProfile?.linkedin || applicantProfile?.portfolio || applicantProfile?.website) && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Portfolio & Online Links</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {applicantProfile.github && (
                                            <a
                                                href={applicantProfile.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                                            >
                                                <FaGithub className="w-3.5 h-3.5 text-white" />
                                                <span>GitHub Profile</span>
                                                <ExternalLink className="w-3 h-3 text-zinc-500" />
                                            </a>
                                        )}
                                        {applicantProfile.linkedin && (
                                            <a
                                                href={applicantProfile.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                                            >
                                                <FaLinkedin className="w-3.5 h-3.5 text-blue-400" />
                                                <span>LinkedIn Profile</span>
                                                <ExternalLink className="w-3 h-3 text-zinc-500" />
                                            </a>
                                        )}
                                        {(applicantProfile.portfolio || applicantProfile.website) && (
                                            <a
                                                href={applicantProfile.portfolio || applicantProfile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                                            >
                                                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                                                <span>Portfolio Website</span>
                                                <ExternalLink className="w-3 h-3 text-zinc-500" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Candidate Technical Skills */}
                            {Array.isArray(applicantProfile?.skills) && applicantProfile.skills.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                        <Code className="w-4 h-4 text-cyan-400" />
                                        Skills & Core Competencies ({applicantProfile.skills.length})
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {applicantProfile.skills.map((skill, i) => (
                                            <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Educational Background Section */}
                            {Array.isArray(applicantProfile?.education) && applicantProfile.education.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                        <GraduationCap className="w-4 h-4 text-emerald-400" />
                                        Educational Background ({applicantProfile.education.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {applicantProfile.education.map((edu, idx) => (
                                            <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-bold text-white">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h5>
                                                    <span className="text-[11px] text-zinc-400">
                                                        {edu.startYear || 'N/A'} - {edu.endYear || 'Present'}
                                                    </span>
                                                </div>
                                                <p className="text-emerald-400 font-semibold text-[11px]">{edu.institution}</p>
                                                {edu.grade && <p className="text-zinc-400 text-[11px]">Grade / CGPA: {edu.grade}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Work Experience History Section */}
                            {Array.isArray(applicantProfile?.experience) && applicantProfile.experience.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                        <Building2 className="w-4 h-4 text-purple-400" />
                                        Work Experience & Career History ({applicantProfile.experience.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {applicantProfile.experience.map((exp, idx) => (
                                            <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="font-bold text-white">{exp.jobTitle}</h5>
                                                    <span className="text-[11px] text-zinc-400">
                                                        {exp.startDate || 'N/A'} - {exp.currentlyWorking ? 'Present' : exp.endDate || 'Present'}
                                                    </span>
                                                </div>
                                                <p className="text-purple-400 font-semibold text-[11px]">
                                                    {exp.company} {exp.employmentType ? `(${exp.employmentType})` : ''} {exp.location ? `• ${exp.location}` : ''}
                                                </p>
                                                {exp.description && (
                                                    <p className="text-zinc-300 text-[11px] leading-relaxed pt-1 whitespace-pre-wrap">{exp.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Submitted Cover Letter */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Submitted Cover Letter</h4>
                                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedApp.coverLetter || "No cover letter was submitted with this application."}
                                </div>
                            </div>

                            {/* Candidate Documents (Resume & CV) */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Candidate Attached Documents</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Resume Card */}
                                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-white">Resume Document</p>
                                                <p className="text-[10px] text-zinc-400">Primary candidate resume</p>
                                            </div>
                                        </div>
                                        {(selectedApp.resume || applicantProfile?.resume || applicantProfile?.resumeUrl) ? (
                                            <a 
                                                href={selectedApp.resume || applicantProfile?.resume || applicantProfile?.resumeUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
                                            >
                                                <Download className="w-3.5 h-3.5" /> View / Download Resume
                                            </a>
                                        ) : (
                                            <span className="text-[11px] text-zinc-500 italic">No Resume attached</span>
                                        )}
                                    </div>

                                    {/* CV Card */}
                                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-white">Curriculum Vitae (CV)</p>
                                                <p className="text-[10px] text-zinc-400">Detailed work history CV</p>
                                            </div>
                                        </div>
                                        {(selectedApp.cv || applicantProfile?.cv || applicantProfile?.cvUrl) ? (
                                            <a 
                                                href={selectedApp.cv || applicantProfile?.cv || applicantProfile?.cvUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition shadow cursor-pointer"
                                            >
                                                <Download className="w-3.5 h-3.5" /> View / Download CV
                                            </a>
                                        ) : (
                                            <span className="text-[11px] text-zinc-500 italic">No CV attached</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status decision controls */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-zinc-800/80">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Application Decision</span>
                                    <p className="text-[11px] text-zinc-500">Update status to notify applicant.</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {['Reviewing', 'Interviewing', 'Offered', 'Rejected'].map((status) => {
                                        const isSelected = selectedApp.status === status;
                                        return (
                                            <button
                                                key={status}
                                                onClick={() => handleUpdateStatus(selectedApp._id, status)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                                                    isSelected
                                                        ? status === 'Interviewing' ? 'bg-green-500/20 border-green-500/40 text-green-300' :
                                                          status === 'Offered' ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' :
                                                          status === 'Reviewing' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' :
                                                          'bg-red-500/20 border-red-500/40 text-red-300'
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
