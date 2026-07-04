'use client';
import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Briefcase, MapPin, CheckCircle2 } from 'lucide-react';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // API theke data fetch kora
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {

const res = await fetch(`http://localhost:5000/api/companies?search=${searchTerm}`);
        const data = await res.json();
        // Database data array check kora
        setCompanies(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce ba basic input delay use korle bhalo hoy, ekhane straight trigger kora holo
    fetchCompanies();
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100 px-6 py-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-white tracking-tight mb-3">
            Browse Companies
          </h1>
          <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
            Discover the world's leading technology and creative organizations. Filter by industry, size, and values to find your next professional home.
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="bg-[#141414] border border-[#222] p-4 rounded-xl flex items-center gap-3 mb-12 shadow-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, industry, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent pl-11 pr-4 py-2 text-sm text-gray-200 placeholder-gray-600 border-none outline-none focus:ring-0"
            />
          </div>
          <button className="bg-white text-black font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors">
            Find Companies
          </button>
        </div>

        {/* Grid List Section */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading companies...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div 
                key={company._id} 
                className="bg-[#141414] border border-[#222] rounded-2xl p-6 flex flex-col justify-between hover:border-[#333] transition-all group"
              >
                <div>
                  {/* Top Row: Logo & Verified Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center justify-center overflow-hidden">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    {company.status === 'approved' || company.status === 'verified' ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded-full border border-[#10b981]/20">
                        <CheckCircle2 className="w-3 h-3 fill-[#10b981] text-[#141414]" /> Verified
                      </span>
                    ) : null}
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-medium text-white mb-2 group-hover:text-gray-200 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-6 leading-relaxed">
                    {company.description || "No description available at the moment."}
                  </p>

                  {/* Meta Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {company.industry && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#1c1c1c] border border-[#2a2a2a] px-3 py-1.5 rounded-full">
                        <Briefcase className="w-3 h-3 text-gray-500" /> {company.industry}
                      </span>
                    )}
                    {company.location && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#1c1c1c] border border-[#2a2a2a] px-3 py-1.5 rounded-full">
                        <MapPin className="w-3 h-3 text-gray-500" /> {company.location.split(',')[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Active Jobs Count & Action Button */}
                <div className="pt-4 border-t border-[#222] flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">
                    {company.activeJobs || Math.floor(Math.random() * 30) + 2} Active Jobs
                  </span>
                  <a href={`/companies/${company._id}`} className="text-white hover:text-gray-300 font-medium flex items-center gap-1 transition-all">
                    View Openings <span className="text-sm font-light">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        <div className="flex items-center justify-center gap-2 mt-16 text-xs text-gray-400">
          <button className="w-8 h-8 rounded-lg border border-[#222] bg-[#141414] flex items-center justify-center hover:bg-[#1c1c1c] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white text-black font-semibold flex items-center justify-center">
            1
          </button>
          <button className="w-8 h-8 rounded-lg border border-[#222] bg-[#141414] flex items-center justify-center hover:bg-[#1c1c1c]">
            2
          </button>
          <button className="w-8 h-8 rounded-lg border border-[#222] bg-[#141414] flex items-center justify-center hover:bg-[#1c1c1c]">
            3
          </button>
          <span className="px-1 text-gray-600">...</span>
          <button className="w-8 h-8 rounded-lg border border-[#222] bg-[#141414] flex items-center justify-center hover:bg-[#1c1c1c]">
            12
          </button>
          <button className="w-8 h-8 rounded-lg border border-[#222] bg-[#141414] flex items-center justify-center hover:bg-[#1c1c1c]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CompaniesPage;