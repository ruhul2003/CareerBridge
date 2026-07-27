'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Briefcase, MapPin, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const ITEMS_PER_PAGE = 12;

const CompaniesPage = () => {
    const [companies, setCompanies] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

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
                setCurrentPage(1);
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

    // Pagination calculations
    const totalPages = Math.ceil(companies.length / ITEMS_PER_PAGE);
    const indexOfLastCompany = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstCompany = indexOfLastCompany - ITEMS_PER_PAGE;
    const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-gray-100 px-6 py-12 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-semibold text-white tracking-tight mb-3">
                        Browse Companies ({companies.length})
                    </h1>
                    <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
                        Discover Bangladesh's leading technology, software, and digital innovations platforms.
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
                    <>
                        {/* Companies Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentCompanies.map((company) => (
                                <div 
                                    key={company._id} 
                                    className="bg-[#141414] border border-[#222] rounded-3xl p-6 hover:border-white/10 transition-all group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="w-14 h-14 bg-[#1f1f1f] rounded-2xl flex items-center justify-center overflow-hidden border border-zinc-800">
                                                {company.logo ? (
                                                    <img 
                                                        src={company.logo} 
                                                        alt={company.name} 
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <span 
                                                    className="text-white font-bold text-xl"
                                                    style={{ display: company.logo ? 'none' : 'flex' }}
                                                >
                                                    {company.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-medium border border-emerald-500/20">
                                                Verified
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                                            {company.name}
                                        </h3>

                                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 min-h-[60px] leading-relaxed">
                                            {company.description || company.tagline || "No description available."}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {company.industry && (
                                                <span className="text-xs px-3.5 py-1.5 bg-[#1f1f1f] border border-zinc-800 rounded-full text-gray-300 flex items-center gap-1.5">
                                                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> {company.industry}
                                                </span>
                                            )}
                                            {company.location && (
                                                <span className="text-xs px-3.5 py-1.5 bg-[#1f1f1f] border border-zinc-800 rounded-full text-gray-300 flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {company.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-[#222] flex justify-between items-center text-sm">
                                        <span className="text-gray-400 text-xs">
                                            {company.size || "100+ Employees"}
                                        </span>
                                        <a 
                                            href={`/jobs?company=${encodeURIComponent(company.name)}`} 
                                            className="text-indigo-400 hover:text-indigo-300 font-medium text-xs flex items-center gap-1 transition-colors"
                                        >
                                            View Jobs →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141414] border border-[#222] p-4 rounded-2xl">
                                <span className="text-xs text-gray-400 font-medium">
                                    Showing <span className="text-white font-bold">{indexOfFirstCompany + 1}</span> to <span className="text-white font-bold">{Math.min(indexOfLastCompany, companies.length)}</span> of <span className="text-white font-bold">{companies.length}</span> companies
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 bg-[#1f1f1f] border border-zinc-800 rounded-xl text-gray-300 hover:text-white hover:border-indigo-500/50 disabled:opacity-40 disabled:hover:border-zinc-800 cursor-pointer transition disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-9 h-9 text-xs font-bold rounded-xl border transition cursor-pointer ${
                                                currentPage === page
                                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                                    : 'bg-[#1f1f1f] border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-700'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 bg-[#1f1f1f] border border-zinc-800 rounded-xl text-gray-300 hover:text-white hover:border-indigo-500/50 disabled:opacity-40 disabled:hover:border-zinc-800 cursor-pointer transition disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CompaniesPage;