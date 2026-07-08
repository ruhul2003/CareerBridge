'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Briefcase, MapPin, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const CompaniesPage = () => {
    const [companies, setCompanies] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch companies whenever search input changes
    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
                const queryParam = searchInput.trim() 
                    ? `?search=${encodeURIComponent(searchInput.trim())}` 
                    : '';

                const res = await fetch(`${baseUrl}/api/companies${queryParam}`);
                
                if (!res.ok) throw new Error('Failed to fetch companies');
                
                const data = await res.json();
                setCompanies(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching companies:", error);
                setCompanies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [searchInput]);

    const clearSearch = () => setSearchInput('');

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-gray-100 px-6 py-12 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-semibold text-white tracking-tight mb-3">
                        Browse Companies
                    </h1>
                    <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
                        Discover the world's leading technology and creative organizations.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-[#141414] border border-[#222] p-4 rounded-2xl flex items-center gap-3 mb-12 shadow-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, industry, or location..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-transparent pl-12 pr-12 py-3.5 text-sm text-gray-200 placeholder-gray-500 border-none outline-none focus:ring-1 focus:ring-white/10 rounded-xl"
                        />
                        {searchInput && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div 
                                key={i} 
                                className="bg-[#141414] border border-[#222] h-80 rounded-3xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : companies.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-[#222] rounded-3xl">
                        <p className="text-gray-400 text-lg">No companies found</p>
                        {searchInput && (
                            <p className="text-gray-500 mt-2">Try different keywords</p>
                        )}
                    </div>
                ) : (
                    /* Companies Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <div 
                                key={company._id} 
                                className="bg-[#141414] border border-[#222] rounded-3xl p-6 hover:border-white/10 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <div className="w-14 h-14 bg-[#1f1f1f] rounded-2xl flex items-center justify-center overflow-hidden">
                                        {company.logo ? (
                                            <Image 
                                                src={company.logo} 
                                                alt={company.name} 
                                                width={56} 
                                                height={56} 
                                                className="object-cover" 
                                            />
                                        ) : (
                                            <Briefcase className="w-7 h-7 text-gray-500" />
                                        )}
                                    </div>
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-medium">
                                        Verified
                                    </span>
                                </div>

                                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                                    {company.name}
                                </h3>

                                <p className="text-gray-400 text-sm line-clamp-3 mb-6 min-h-[60px]">
                                    {company.description || company.tagline || "No description available."}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {company.industry && (
                                        <span className="text-xs px-4 py-2 bg-[#1f1f1f] rounded-full text-gray-400 flex items-center gap-1.5">
                                            <Briefcase className="w-3.5 h-3.5" /> {company.industry}
                                        </span>
                                    )}
                                    {company.location && (
                                        <span className="text-xs px-4 py-2 bg-[#1f1f1f] rounded-full text-gray-400 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" /> {company.location}
                                        </span>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-[#222] flex justify-between items-center text-sm">
                                    <span className="text-gray-400">
                                        {company.activeJobs || 12} Active Jobs
                                    </span>
                                    <a 
                                        href={`/companies/${company._id}`} 
                                        className="text-white hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors"
                                    >
                                        View Openings →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompaniesPage;