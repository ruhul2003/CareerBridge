import React, { useState, useEffect } from 'react';
import { Search, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminJobsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/jobs`);
      if (!res.ok) throw new Error('Failed to load jobs list');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [SERVER_URL]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) return;

    try {
      const res = await fetch(`${SERVER_URL}/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Job listing removed successfully');
        setJobs(jobs.filter(j => j._id !== jobId));
      } else {
        throw new Error(data.message || 'Failed to remove job');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting job post');
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatSalary = (min, max, currency) => {
    const activeCurrency = currency && currency.trim() !== "" ? currency : 'BDT';
    if (min && max) return `${activeCurrency} ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()}`;
    if (min) return `From ${activeCurrency} ${Number(min).toLocaleString()}`;
    if (max) return `Up to ${activeCurrency} ${Number(max).toLocaleString()}`;
    return 'Confidential';
  };

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
        <span>Failed to load job posts: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Jobs</h2>
          <p className="text-xs text-zinc-500 mt-1">Monitor active openings, remove stale listings, or verify listings.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jobs by title, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121214] border border-zinc-800 focus:border-zinc-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-[#141416] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-zinc-900/30">
                <th className="px-6 py-4">Title / Company</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Salary</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs text-zinc-300">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-white">{job.title || job.jobTitle || 'Untitled Position'}</p>
                        <p className="text-[10px] text-indigo-400 font-medium mt-0.5">{job.companyName || 'Company'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{job.category || job.jobCategory || 'General'}</td>
                    <td className="px-6 py-4 text-zinc-400">{job.location || 'Dhaka, BD'}</td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">
                      {formatSalary(job.minSalary, job.maxSalary, job.currency || job.salary)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-zinc-500 hover:text-red-400 transition p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer"
                        title="Delete Job Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-zinc-500 italic">No job listings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminJobsTab;
