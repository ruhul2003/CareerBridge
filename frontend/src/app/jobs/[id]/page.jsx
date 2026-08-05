'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      
      try {
        const res = await fetch(`${SERVER_URL}/api/jobs/${jobId}`);
        if (!res.ok) throw new Error('Job not found');
        
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, SERVER_URL]);

  useEffect(() => {
    const checkIfApplied = async () => {
      if (!user?.id || !jobId) return;
      try {
        const res = await fetch(`${SERVER_URL}/api/applications?applicantId=${user.id}&jobId=${jobId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setApplied(true);
          }
        }
      } catch (err) {
        console.error("Error checking application status:", err);
      }
    };
    checkIfApplied();
  }, [user, jobId, SERVER_URL]);

  const handleApplyClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setShowApplyModal(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setSubmitError('Resume URL is required');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${SERVER_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          applicantId: user.id,
          applicantEmail: user.email,
          applicantName: user.name,
          resume,
          coverLetter,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      setApplied(true);
      setShowApplyModal(false);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user?.id || !jobId) return;
      try {
        const res = await fetch(`${SERVER_URL}/api/saved-jobs?userId=${user.id}&jobId=${jobId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setIsSaved(true);
          }
        }
      } catch (err) {
        console.error("Error checking saved job status:", err);
      }
    };
    checkIfSaved();
  }, [user, jobId, SERVER_URL]);

  const handleSaveToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    try {
      if (isSaved) {
        const res = await fetch(`${SERVER_URL}/api/saved-jobs?userId=${user.id}&jobId=${jobId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsSaved(false);
        }
      } else {
        const res = await fetch(`${SERVER_URL}/api/saved-jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId,
            userId: user.id,
          }),
        });
        if (res.ok) {
          setIsSaved(true);
        }
      }
    } catch (err) {
      console.error("Error toggling saved job status:", err);
    }
  };


  // Dynamic salary formatting helper matching your schema fields
  const formatSalary = (min, max, currency) => {
    const activeCurrency = currency && currency.trim() !== "" ? currency : 'BDT';
    
    if (min && max) {
      return `${activeCurrency} ${Number(min).toLocaleString()} – ${Number(max).toLocaleString()}`;
    }
    if (min) return `From ${activeCurrency} ${Number(min).toLocaleString()}`;
    if (max) return `Up to ${activeCurrency} ${Number(max).toLocaleString()}`;
    return 'Salary confidential';
  };

  const parseListField = (fieldData) => {
    if (!fieldData) return [];
    if (Array.isArray(fieldData)) return fieldData;
    if (typeof fieldData === 'string') {
      if (fieldData.includes('\n')) {
        return fieldData.split('\n').map(item => item.trim()).filter(Boolean);
      }
      if (fieldData.includes(',')) {
        return fieldData.split(',').map(item => item.trim()).filter(Boolean);
      }
      return [fieldData.trim()];
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 font-medium tracking-widest uppercase">Loading Jobs</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center text-zinc-400">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
          <p>The position you are looking for does not exist or has been removed.</p>
          <button
            onClick={() => router.push('/jobs')}
            className="mt-6 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-sm font-medium transition"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const parsedResponsibilities = parseListField(job.responsibilities);
  const parsedRequirements = parseListField(job.requirements);
  const parsedBenefits = parseListField(job.benefits);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0d0e] text-slate-900 dark:text-zinc-100 pb-20 font-sans antialiased transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300 transition group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition" />
            <span className="text-xs font-medium uppercase tracking-wider">All Opportunities</span>
          </Link>
        </div>

        {/* Header Hero Panel */}
        <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-zinc-800/60 rounded-2xl p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4">
            {/* Company Image / Logo */}
            <div className="w-16 h-16 bg-slate-100 dark:bg-[#1d1d20] border border-slate-200 dark:border-zinc-700/60 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-md">
              {job.companyLogo || job.logo ? (
                <img
                  src={job.companyLogo || job.logo}
                  alt={job.companyName || 'Company Logo'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <span
                className="text-slate-800 dark:text-white font-bold text-2xl"
                style={{ display: (job.companyLogo || job.logo) ? 'none' : 'flex' }}
              >
                {(job.companyName || 'C').charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              {/* Position Name */}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{job.title || job.jobTitle || 'Untitled Position'}</h1>
              
              {/* Company Name & Status */}
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold">{job.companyName || 'Company'}</p>
                <span className="text-slate-300 dark:text-zinc-600">•</span>
                <span className="text-slate-500 dark:text-zinc-400 text-xs font-medium">{job.category || job.jobCategory || 'Tech'}</span>
                {(job.status === 'active' || !job.status) && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" /> Active Role
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleSaveToggle}
              className={`p-3 border rounded-xl transition cursor-pointer ${
                isSaved 
                  ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500' 
                  : 'bg-slate-100 dark:bg-[#1d1d20] border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
              title={isSaved ? "Unsave Job" : "Save Job"}
            >
              <Bookmark size={18} className={isSaved ? 'fill-current' : ''} />
            </button>
            {user?.role !== 'recruiter' && user?.role !== 'admin' && (
              applied ? (
                <button disabled className="flex-1 sm:flex-initial px-6 py-3 bg-slate-200 dark:bg-zinc-850 text-slate-400 dark:text-zinc-500 font-semibold rounded-xl cursor-not-allowed text-sm tracking-wide border border-slate-300 dark:border-zinc-800">
                  Applied
                </button>
              ) : (
                <button 
                  onClick={handleApplyClick}
                  className="flex-1 sm:flex-initial px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition text-sm tracking-wide cursor-pointer shadow-lg"
                >
                  Apply Now
                </button>
              )
            )}
          </div>
        </div>

        {/* Quick Info Grid Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-zinc-800/50 rounded-xl p-5 shadow-sm">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Salary Range</p>
            <p className="text-[15px] font-semibold text-emerald-600 dark:text-emerald-400">{formatSalary(job.minSalary, job.maxSalary, job.currency || job.salary)}</p>
          </div>

          <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-zinc-800/50 rounded-xl p-5 shadow-sm">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Location</p>
            <p className="text-[15px] font-semibold text-slate-800 dark:text-zinc-200">{job.location || 'Dhaka, Bangladesh'}</p>
          </div>

          <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-zinc-800/50 rounded-xl p-5 shadow-sm">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Job Type</p>
            <p className="text-[15px] font-semibold text-slate-800 dark:text-zinc-200 capitalize">{((job.type || job.jobType) ? (job.type || job.jobType).replace('-', ' ') : 'Full-time')}</p>
          </div>

          <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-zinc-800/50 rounded-xl p-5 shadow-sm">
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Experience Level</p>
            <p className="text-[15px] font-semibold text-slate-800 dark:text-zinc-200">{job.experienceLevel || 'Mid-Senior'}</p>
          </div>
        </div>

        {/* Main Content Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Descriptions, Responsibilities & Requirements */}
          <div className="lg:col-span-8 bg-white dark:bg-[#141416] border border-slate-200 dark:border-zinc-800/50 rounded-2xl p-8 space-y-8 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-200 mb-3">Job Description</h2>
              <p className="text-slate-600 dark:text-zinc-400 text-[14px] leading-relaxed font-normal">
                {job.description || `Join ${job.companyName || 'our company'} as a ${job.title || job.jobTitle}. Build scalable digital services and work with modern technology teams.`}
              </p>
            </div>

            <hr className="border-slate-200 dark:border-zinc-800/60" />

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-200 mb-4">Responsibilities</h2>
              <ul className="space-y-3.5 text-[14px] text-slate-600 dark:text-zinc-400">
                {parsedResponsibilities.length > 0 ? (
                  parsedResponsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 dark:text-zinc-500 italic">No responsibilities listed.</li>
                )}
              </ul>
            </div>

            <hr className="border-slate-200 dark:border-zinc-800/60" />

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-200 mb-4">Requirements</h2>
              <ul className="space-y-3.5 text-[14px] text-slate-600 dark:text-zinc-400">
                {parsedRequirements.length > 0 ? (
                  parsedRequirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400 dark:text-zinc-500 italic">No requirements listed.</li>
                )}
              </ul>
            </div>

            {parsedBenefits.length > 0 && (
              <>
                <hr className="border-slate-200 dark:border-zinc-800/60" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-200 mb-5">Benefits & Perks</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {parsedBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-[#1d1d20]/50 border border-slate-200 dark:border-zinc-800/40 rounded-xl">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">✓</div>
                        <span className="text-xs text-slate-700 dark:text-zinc-300 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Right Column: Company Overview Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-zinc-800/50 rounded-2xl overflow-hidden p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-200 mb-4 tracking-wider uppercase">Company Overview</h3>
              
              {/* Company Banner & Logo */}
              <div className="p-6 bg-slate-50 dark:bg-[#0d0d0e] border border-slate-200 dark:border-zinc-800/80 rounded-xl relative mb-5 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/60 rounded-2xl overflow-hidden flex items-center justify-center mb-3 shadow-md">
                  {job.companyLogo || job.logo ? (
                    <img
                      src={job.companyLogo || job.logo}
                      alt={job.companyName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span
                    className="text-slate-800 dark:text-white font-bold text-2xl"
                    style={{ display: (job.companyLogo || job.logo) ? 'none' : 'flex' }}
                  >
                    {(job.companyName || 'C').charAt(0).toUpperCase()}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{job.companyName || 'Company'}</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{job.location || 'Dhaka, Bangladesh'}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800/60">
                  <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">CATEGORY</span>
                  <span className="font-semibold text-xs text-indigo-600 dark:text-indigo-400">{job.category || job.jobCategory || 'Tech'}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800/60">
                  <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">JOB TYPE</span>
                  <span className="font-semibold text-xs text-slate-700 dark:text-zinc-300 capitalize">{(job.type || job.jobType || 'Full-time').replace('-', ' ')}</span>
                </div>

                <div className="pt-2 text-center">
                  <Link 
                    href="/companies" 
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition py-1"
                  >
                    View All Companies <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Apply for Position</h3>
                <p className="text-xs text-zinc-400 mt-1">{job.jobTitle} • {job.companyName}</p>
              </div>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="text-zinc-500 hover:text-zinc-300 transition text-lg font-medium cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={user?.name || ""}
                  disabled
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-400 rounded-xl px-4 py-2.5 text-sm outline-none cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Resume URL <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  required
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Cover Letter</label>
                <textarea
                  placeholder="Tell us why you are a great fit..."
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none transition resize-none"
                />
              </div>

              {submitError && (
                <p className="text-xs text-red-400 font-medium">{submitError}</p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-4 py-2.5 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}