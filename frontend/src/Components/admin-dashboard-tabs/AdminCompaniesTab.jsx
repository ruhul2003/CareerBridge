import React, { useState, useEffect } from 'react';
import { Search, Trash2, ShieldAlert, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminCompaniesTab = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/companies`);
      if (!res.ok) throw new Error('Failed to load companies');
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [SERVER_URL]);

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company? All job listings associated with it may remain or be orphaned.")) return;

    try {
      const res = await fetch(`${SERVER_URL}/api/admin/companies/${companyId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Company deleted successfully');
        setCompanies(companies.filter(c => c._id !== companyId));
      } else {
        throw new Error(data.message || 'Failed to delete company');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting company');
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <span>Failed to load companies: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Companies</h2>
          <p className="text-xs text-zinc-500 mt-1">Review companies, delete spam listings, or verify recruiter registrations.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search companies by name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#121214] border border-zinc-800 focus:border-zinc-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition"
          />
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-[#141416] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-zinc-900/30">
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Industry</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Website</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs text-zinc-300">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <tr key={company._id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white font-bold overflow-hidden shadow-inner border border-zinc-700/60">
                          {company.companyLogo || company.logo ? (
                            <img src={company.companyLogo || company.logo} alt={company.name} className="w-full h-full object-cover" />
                          ) : (
                            (company.name || 'C').charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-semibold text-white">{company.name || 'Company'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-zinc-400">{company.industry || 'Tech'}</td>
                    <td className="px-6 py-4.5 text-zinc-400">{company.location || 'N/A'}</td>
                    <td className="px-6 py-4.5 text-indigo-400">
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                          Visit site <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => handleDeleteCompany(company._id)}
                        className="text-zinc-500 hover:text-red-400 transition p-1.5 hover:bg-red-500/10 rounded-lg cursor-pointer"
                        title="Delete Company"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-zinc-500 italic">No companies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCompaniesTab;
