'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

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

  // Helper to ensure lists parse nicely whether stored as arrays, comma-separated strings, or newline strings
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
          <p className="text-xs text-zinc-500 font-medium tracking-widest uppercase">Loading Position</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#0d0d0e] flex items-center justify-center text-zinc-400">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
          <p>The position you're looking for doesn't exist or has been removed.</p>
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
    <div className="min-h-screen bg-[#0d0d0e] text-zinc-100 pb-20 font-sans antialiased selection:bg-zinc-800">
      <div className="max-w-6xl mx-auto px-6 pt-12">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition" />
            <span className="text-xs font-medium uppercase tracking-wider">All Opportunities</span>
          </Link>
        </div>

        {/* Header Hero Panel */}
        <div className="bg-[#141416] border border-zinc-800/60 rounded-2xl p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1d1d20] border border-zinc-800/80 rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-xl font-bold bg-gradient-to-br from-zinc-300 to-zinc-600 bg-clip-text text-transparent">⬡</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">{job.jobTitle || 'Untitled Position'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-zinc-400 text-sm font-medium">{job.companyName || 'CloudScale AI'}</p>
                {job.status === 'active' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400/90 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" /> Active Role
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="p-3 bg-[#1d1d20] border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl transition">
              <Bookmark size={18} />
            </button>
            <button className="flex-1 sm:flex-initial px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition text-sm tracking-wide">
              Apply Now
            </button>
          </div>
        </div>

        {/* Quick Info Grid Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#141416] border border-zinc-800/50 rounded-xl p-5">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Salary Range</p>
            <p className="text-[15px] font-semibold text-zinc-200">{formatSalary(job.minSalary, job.maxSalary, job.currency)}</p>
          </div>

          <div className="bg-[#141416] border border-zinc-800/50 rounded-xl p-5">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Location</p>
            <p className="text-[15px] font-semibold text-zinc-300">{job.isRemote ? 'Remote' : (job.location || 'On-site')}</p>
          </div>

          <div className="bg-[#141416] border border-zinc-800/50 rounded-xl p-5">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Job Type</p>
            <p className="text-[15px] font-semibold text-zinc-300 capitalize">{(job.jobType ? job.jobType.replace('-', ' ') : 'N/A')}</p>
          </div>

          <div className="bg-[#141416] border border-zinc-800/50 rounded-xl p-5">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5">Deadline</p>
            <p className="text-[15px] font-semibold text-zinc-300">{job.deadline || 'No Deadline'}</p>
          </div>
        </div>

        {/* Main Content Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Descriptions, Responsibilities & Requirements */}
          <div className="lg:col-span-8 bg-[#141416] border border-zinc-800/50 rounded-2xl p-8 space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-zinc-200 mb-4">Job Category / Info</h2>
              <p className="text-zinc-400 text-[14px] leading-relaxed font-normal capitalize">
                Category: {job.jobCategory || 'General'}
              </p>
            </div>

            <hr className="border-zinc-800/60" />

            <div>
              <h2 className="text-lg font-semibold text-zinc-200 mb-4">Responsibilities</h2>
              <ul className="space-y-3.5 text-[14px] text-zinc-400">
                {parsedResponsibilities.length > 0 ? (
                  parsedResponsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-zinc-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-zinc-500 italic">No responsibilities listed.</li>
                )}
              </ul>
            </div>

            <hr className="border-zinc-800/60" />

            <div>
              <h2 className="text-lg font-semibold text-zinc-200 mb-4">Requirements</h2>
              <ul className="space-y-3.5 text-[14px] text-zinc-400">
                {parsedRequirements.length > 0 ? (
                  parsedRequirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-zinc-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-zinc-500 italic">No requirements listed.</li>
                )}
              </ul>
            </div>

            {parsedBenefits.length > 0 && (
              <>
                <hr className="border-zinc-800/60" />
                <div>
                  <h2 className="text-lg font-semibold text-zinc-200 mb-5">Benefits</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {parsedBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[#1d1d20]/50 border border-zinc-800/40 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800/80 text-zinc-400 flex items-center justify-center text-sm">✓</div>
                        <span className="text-xs text-zinc-300 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Right Column: Company Overview Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#141416] border border-zinc-800/50 rounded-2xl overflow-hidden p-5">
              <h3 className="font-semibold text-sm text-zinc-200 mb-4 tracking-wide">Company Overview</h3>
              
              <div className="h-44 bg-[#0d0d0e] border border-zinc-800/80 rounded-xl relative mb-5 overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416] via-transparent to-transparent opacity-90" />
                <span className="absolute text-zinc-600 text-3xl font-light font-mono select-none">🏢</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">COMPANY ID</span>
                  <span className="font-medium text-xs text-zinc-300">{job.companyId || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">VISIBILITY</span>
                  <span className="font-medium text-xs text-zinc-300">{job.isPubliclyVisible ? 'Public' : 'Hidden'}</span>
                </div>

                <div className="pt-2 text-center">
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 font-medium transition py-1"
                  >
                    View Company Profile <ExternalLink size={12} className="text-zinc-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}