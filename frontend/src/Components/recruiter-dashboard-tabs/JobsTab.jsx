'use client';

import React, { useState, useEffect } from 'react';
import { 
    Briefcase, MapPin, DollarSign, Calendar, Plus, Edit2, 
    Power, X, Building2, HelpCircle, Check, Loader2 
} from 'lucide-react';

const JobsTab = ({ user }) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        jobTitle: '',
        location: '',
        division: 'All',
        jobType: 'Full-time',
        isRemote: 'On-site',
        minSalary: '',
        maxSalary: '',
        currency: 'USD',
        deadline: '',
        description: '',
        requirements: ''
    });

    const fetchMyCompanyAndJobs = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const companyRes = await fetch(`${SERVER_URL}/api/companies?recruiterId=${user.id}`);
            if (companyRes.ok) {
                const companies = await companyRes.json();
                if (companies && companies.length > 0) {
                    const currentCompany = companies[0];
                    setCompany(currentCompany);

                    // Fetch jobs for this company
                    const jobsRes = await fetch(`${SERVER_URL}/api/jobs?companyId=${currentCompany._id}`);
                    if (jobsRes.ok) {
                        const jobsData = await jobsRes.json();
                        setJobs(jobsData);
                    }
                } else {
                    setCompany(null);
                }
            }
        } catch (error) {
            console.error("Error fetching recruiter company/jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchMyCompanyAndJobs();
        }
    }, [user?.id]);

    const openCreateModal = () => {
        setEditingJob(null);
        setFormData({
            jobTitle: '',
            location: '',
            division: 'All',
            jobType: 'Full-time',
            isRemote: 'On-site',
            minSalary: '',
            maxSalary: '',
            currency: 'USD',
            deadline: '',
            description: '',
            requirements: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (job) => {
        setEditingJob(job);
        setFormData({
            jobTitle: job.jobTitle || '',
            location: job.location || '',
            division: job.division || 'All',
            jobType: job.jobType || 'Full-time',
            isRemote: job.isRemote || 'On-site',
            minSalary: job.minSalary || '',
            maxSalary: job.maxSalary || '',
            currency: job.currency || 'USD',
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            description: job.description || '',
            requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || '')
        });
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (job) => {
        const newStatus = (!job.status || job.status === 'active') ? 'closed' : 'active';
        try {
            const res = await fetch(`${SERVER_URL}/api/jobs/${job._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                // Update local state
                setJobs(jobs.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
            } else {
                alert("Failed to update job status.");
            }
        } catch (error) {
            console.error("Error toggling job status:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!company?._id) return;

        const processedRequirements = formData.requirements
            .split('\n')
            .map(r => r.trim())
            .filter(r => r.length > 0);

        const payload = {
            ...formData,
            requirements: processedRequirements,
            companyId: company._id,
            companyName: company.name,
            status: editingJob ? editingJob.status : 'active'
        };

        try {
            let res;
            if (editingJob) {
                // Edit existing job
                res = await fetch(`${SERVER_URL}/api/jobs/${editingJob._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create new job
                res = await fetch(`${SERVER_URL}/api/jobs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                setIsModalOpen(false);
                fetchMyCompanyAndJobs();
            } else {
                alert("Operation failed. Please try again.");
            }
        } catch (error) {
            console.error("Error saving job:", error);
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
                        Before you can manage or post job listings, you must configure your business company workspace.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Manage Job Openings</h1>
                    <p className="text-zinc-400 text-sm mt-1">Publish and coordinate positions for {company.name}.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md"
                >
                    <Plus className="w-4 h-4" /> Post New Job
                </button>
            </div>

            {/* Jobs List */}
            {jobs.length === 0 ? (
                <div className="bg-[#141416] rounded-2xl border border-zinc-800/80 p-12 text-center max-w-xl mx-auto space-y-4">
                    <Briefcase className="w-12 h-12 text-zinc-600 mx-auto" />
                    <h3 className="text-lg font-bold text-white">No jobs posted yet</h3>
                    <p className="text-zinc-400 text-sm">
                        Launch your first career post to invite high-performance applications.
                    </p>
                    <button 
                        onClick={openCreateModal}
                        className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-xs font-semibold rounded-xl transition"
                    >
                        Create first listing
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {jobs.map((job) => {
                        const isActive = !job.status || job.status === 'active';
                        return (
                            <div 
                                key={job._id}
                                className={`bg-[#141416] border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition hover:border-zinc-700/60 ${
                                    isActive ? 'border-zinc-800/80' : 'border-zinc-900 opacity-60'
                                }`}
                            >
                                <div className="space-y-3 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className="text-lg font-bold text-white truncate max-w-md">{job.jobTitle}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                                            isActive 
                                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                                : 'bg-zinc-800 border border-zinc-700 text-zinc-500'
                                        }`}>
                                            {isActive ? 'Active' : 'Closed'}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                                            <span>{job.location} ({job.isRemote})</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="w-3.5 h-3.5 text-zinc-500" />
                                            <span>{job.minSalary} - {job.maxSalary} {job.currency}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button 
                                        onClick={() => openEditModal(job)}
                                        className="p-2.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 rounded-xl transition border border-zinc-700/40"
                                        title="Edit Listing"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleToggleStatus(job)}
                                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
                                            isActive 
                                                ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' 
                                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                        }`}
                                    >
                                        <Power className="w-3.5 h-3.5" />
                                        {isActive ? 'Close Position' : 'Re-open Position'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Post/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                    <div className="bg-[#161616] w-full max-w-2xl rounded-2xl border border-zinc-800/80 shadow-2xl overflow-y-auto max-h-[90vh] font-sans">
                        <div className="p-6 pb-5 border-b border-zinc-800/60 flex items-start justify-between sticky top-0 bg-[#161616] z-10">
                            <div>
                                <h3 className="text-[19px] font-semibold text-white tracking-tight mb-0.5">
                                    {editingJob ? 'Edit Job Posting' : 'Post New Opening'}
                                </h3>
                                <p className="text-xs text-zinc-400">Fill in the fields to specify candidate requirements.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Job Title *</label>
                                    <input 
                                        type="text" required value={formData.jobTitle} 
                                        onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} 
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-650 outline-none transition-colors" 
                                        placeholder="e.g. Senior Software Engineer" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Location/City *</label>
                                    <input 
                                        type="text" required value={formData.location} 
                                        onChange={(e) => setFormData({...formData, location: e.target.value})} 
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-650 outline-none transition-colors" 
                                        placeholder="e.g. San Francisco, CA" 
                                    />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Division *</label>
                                    <select 
                                        required value={formData.division} 
                                        onChange={(e) => setFormData({...formData, division: e.target.value})}
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none cursor-pointer"
                                    >
                                        <option value="All">All Divisions</option>
                                        <option value="Dhaka">Dhaka</option>
                                        <option value="Chittagong">Chittagong</option>
                                        <option value="Sylhet">Sylhet</option>
                                        <option value="Rajshahi">Rajshahi</option>
                                        <option value="Khulna">Khulna</option>
                                        <option value="Remote">International/Remote</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Job Type *</label>
                                    <select 
                                        required value={formData.jobType} 
                                        onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none cursor-pointer"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Workplace Type *</label>
                                    <select 
                                        required value={formData.isRemote} 
                                        onChange={(e) => setFormData({...formData, isRemote: e.target.value})}
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none cursor-pointer"
                                    >
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 3 - Salary details */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="sm:col-span-1">
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Currency</label>
                                    <select 
                                        value={formData.currency} 
                                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-3 py-3 text-sm text-zinc-200 outline-none cursor-pointer"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="BDT">BDT (৳)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-1.5">
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Min Salary *</label>
                                    <input 
                                        type="number" required value={formData.minSalary} 
                                        onChange={(e) => setFormData({...formData, minSalary: e.target.value})} 
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none transition-colors" 
                                        placeholder="e.g. 80000" 
                                    />
                                </div>
                                <div className="sm:col-span-1.5">
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Max Salary *</label>
                                    <input 
                                        type="number" required value={formData.maxSalary} 
                                        onChange={(e) => setFormData({...formData, maxSalary: e.target.value})} 
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none transition-colors" 
                                        placeholder="e.g. 120000" 
                                    />
                                </div>
                            </div>

                            {/* Row 4 - Deadline */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-2">Application Deadline *</label>
                                <input 
                                    type="date" required value={formData.deadline} 
                                    onChange={(e) => setFormData({...formData, deadline: e.target.value})} 
                                    className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none transition-colors text-zinc-300" 
                                />
                            </div>

                            {/* Row 5 - Description */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-2">Job Description *</label>
                                <textarea 
                                    required value={formData.description} 
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3.5 h-28 text-sm text-zinc-200 placeholder-zinc-650 resize-none outline-none" 
                                    placeholder="Write a clear overview of the role, team context, and responsibilities..."
                                />
                            </div>

                            {/* Row 6 - Requirements */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-2">Requirements * (One per line)</label>
                                <textarea 
                                    required value={formData.requirements} 
                                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                    className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3.5 h-28 text-sm text-zinc-200 placeholder-zinc-650 resize-none outline-none font-mono" 
                                    placeholder="e.g. 5+ years of production experience&#10;Proficiency with React and Next.js&#10;Strong communication skills"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/40">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-semibold text-zinc-400 bg-[#1a1a1c] hover:bg-[#222224] border border-zinc-850 rounded-xl">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 shadow-md">
                                    {editingJob ? 'Save Changes' : 'Post Listing'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsTab;
