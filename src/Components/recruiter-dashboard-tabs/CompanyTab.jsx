'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    Building2, HelpCircle, X, Upload, FileText, ChevronDown, 
    ImageIcon, MapPin, Briefcase, Globe, Users, ExternalLink 
} from 'lucide-react';

const CompanyTab = () => {
    const CURRENT_RECRUITER_ID = "current-user-id"; 

    const [company, setCompany] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '', industry: '', website: '', location: '', employeeRange: '', description: '',
    });
    const [logo, setLogo] = useState(null);
    const fileInputRef = useRef(null);

    const fetchMyCompany = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/companies?recruiterId=${CURRENT_RECRUITER_ID}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setCompany(data[0]);
                } else {
                    setCompany(null);
                }
            }
        } catch (error) {
            console.error("Error fetching company profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyCompany();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            setLogo(file);
        } else if (file) {
            alert("File size exceeds 5MB limit.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    logo: logo ? logo.name : null,
                    recruiterId: CURRENT_RECRUITER_ID, 
                }),
            });

            if (res.ok) {
                alert("Company registered successfully!");
                setIsModalOpen(false);
                setFormData({ name: '', industry: '', website: '', location: '', employeeRange: '', description: '' });
                setLogo(null);
                fetchMyCompany(); 
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-[#0d0d0d]">
                <div className="w-8 h-8 border-2 border-t-white border-zinc-800 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-zinc-100 font-sans antialiased">
            {company ? (
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 animate-fadeIn">
                    
                    {/* Header Banner Section */}
                    <div className="relative bg-gradient-to-b from-zinc-900 to-[#141416]  rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/10 blur-[120px] pointer-events-none" />
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 border border-amber-400/30 flex items-center justify-center text-white text-4xl font-bold shadow-lg shrink-0">
                                {company.name ? company.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-3xl font-bold tracking-tight text-white">{company.name}</h1>
                                    <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-wider font-bold rounded-full">
                                        Approved
                                    </span>
                                </div>
                                <p className="text-zinc-400 text-sm mt-2 max-w-2xl leading-relaxed">
                                    Engineering the next generation of enterprise architectures and industry innovations.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                            
                            {company.website && (
                                <a 
                                    href={`https://${company.website.replace(/^(https?:\/\/)?(www\.)?/, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-xl text-center transition-all inline-flex items-center justify-center gap-1.5"
                                >
                                    <Globe className="w-3.5 h-3.5" /> Visit Website
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Split Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Side Content Container */}
                        <div className="lg:col-span-2 space-y-10">
                            
                            {/* About Content */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-white tracking-wide">About {company.name}</h2>
                                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                                    {company.description || "No extensive description data available for this structural block profile setup."}
                                </p>
                            </div>

                            {/* Company Metrics Grid Layout */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-white tracking-wide">Company Stats</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-[#141416]  rounded-2xl p-5 shadow-sm">
                                        <Users className="w-5 h-5 text-zinc-500 mb-3" />
                                        <p className="text-2xl font-bold text-white tracking-tight">{company.employeeRange || '1-10'}</p>
                                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Employees</p>
                                    </div>
                                    <div className="bg-[#141416]  rounded-2xl p-5 shadow-sm">
                                        <MapPin className="w-5 h-5 text-zinc-500 mb-3" />
                                        <p className="text-2xl font-bold text-white tracking-tight truncate">{company.location || 'Remote'}</p>
                                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Headquarters</p>
                                    </div>
                                    <div className="bg-[#141416]  rounded-2xl p-5 shadow-sm">
                                        <Briefcase className="w-5 h-5 text-zinc-500 mb-3" />
                                        <p className="text-2xl font-bold text-white tracking-tight truncate">{company.industry || 'Technology'}</p>
                                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Presence Sector</p>
                                    </div>
                                </div>
                            </div>

                            {/* Office Media Gallery */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white tracking-wide">Life at {company.name}</h2>
                                    <button className="text-xs text-zinc-400 hover:text-white font-semibold transition-colors">View Gallery</button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-[340px]">
                                    <div className="sm:col-span-2 bg-zinc-900  rounded-2xl overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/40 to-zinc-900/60" />
                                    </div>
                                    <div className="grid grid-rows-2 gap-4 h-full">
                                        <div className="bg-zinc-900  rounded-2xl overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-zinc-950/70" />
                                        </div>
                                        <div className="bg-zinc-900  rounded-2xl overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/30 to-neutral-950/70" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar Components */}
                        <div className="space-y-6">
                            
                            {/* Active Roles Sidebar Card */}
                            <div className="bg-[#141416]  rounded-2xl p-6 shadow-xl space-y-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-bold text-white tracking-wide">Active Roles</h3>
                                    <span className="bg-zinc-800 px-2 py-0.5 text-[11px] font-bold text-zinc-400 rounded-md">3</span>
                                </div>

                                <div className="space-y-3.5">
                                    {[
                                        { title: 'Senior Distributed Systems Engineer', loc: 'SF / Remote', sal: '$180k - $240k' },
                                        { title: 'Product Design Lead', loc: 'New York', sal: '$160k - $210k' },
                                        { title: 'DevOps Architect (Infra)', loc: 'Remote', sal: '$190k+' }
                                    ].map((job, idx) => (
                                        <div key={idx} className="p-4 bg-[#1c1c1e]  rounded-xl space-y-2.5 group hover:border-zinc-750 transition-colors">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">{job.title}</h4>
                                                <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0" />
                                            </div>
                                            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-medium text-zinc-400">
                                                <span className="px-2 py-0.5 bg-zinc-800/80 rounded-md">{job.loc}</span>
                                                <span className="px-2 py-0.5 bg-zinc-800/80 rounded-md">{job.sal}</span>
                                            </div>
                                            <button className="w-full mt-1 py-2 bg-white text-black hover:bg-zinc-200 text-[11px] font-bold rounded-lg transition-colors">
                                                Quick Apply
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-2.5 bg-[#1a1a1c] hover:bg-[#222224]  text-xs font-semibold text-zinc-400 rounded-xl transition-colors">
                                    See all openings
                                </button>
                            </div>

                            {/* Hiring Team Block */}
                            <div className="bg-[#141416]  rounded-2xl p-6 shadow-xl space-y-4">
                                <h3 className="text-sm font-bold text-white tracking-wide uppercase text-zinc-500">Hiring Team</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs border border-zinc-700">
                                        RC
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-white">Recruiter Coordinator</h4>
                                        <p className="text-[10px] text-zinc-500 font-medium">Head of Talent Acquisition</p>
                                    </div>
                                </div>
                                <button className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 rounded-xl border border-zinc-800 transition-colors">
                                    Message Team
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                /* Empty Fallback configuration box screen setup */
                <div className="min-h-[80vh] flex items-center justify-center p-6 max-w-md mx-auto text-center animate-fadeIn">
                    <div>
                        <div className="relative mx-auto mb-10 w-48 h-48">
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-zinc-900 rounded-3xl border border-neutral-700 shadow-2xl" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Building2 className="w-20 h-20 text-neutral-500" />
                            </div>
                            <div className="absolute -top-3 -right-3 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-neutral-700">
                                <span className="text-2xl"><FileText className="w-8 h-8 text-neutral-500" /></span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-semibold text-white mb-3">Company not registered yet</h2>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-10">
                            Set up your business profile to start posting high-performance job listings and manage your talent loop.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-3.5 bg-white text-black font-semibold rounded-2xl hover:bg-neutral-200 transition-all text-sm"
                            >
                                Register your company
                            </button>
                            <button className="px-8 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 font-medium rounded-2xl transition-all flex items-center justify-center gap-2 text-white text-sm">
                                <HelpCircle className="w-4 h-4" /> View FAQ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Input Backdrop Wrapper */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                    <div className="bg-[#161616] w-full max-w-xl rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden font-sans">
                        <div className="p-6 pb-5 border-b border-zinc-800/60 flex items-start justify-between">
                            <div>
                                <h3 className="text-[19px] font-semibold text-white tracking-tight mb-0.5">Register New Company</h3>
                                <p className="text-xs text-zinc-400">Enter your business details to start hiring on HireLoop.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Company Name</label>
                                    <input 
                                        type="text" required value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors" 
                                        placeholder="e.g. Acme Corp" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Industry / Category</label>
                                    <div className="relative">
                                        <select 
                                            required value={formData.industry} 
                                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                            className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none appearance-none cursor-pointer pr-10"
                                        >
                                            <option value="" disabled hidden>Select Industry</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Marketing">Marketing</option>
                                        </select>
                                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Website URL</label>
                                    <div className="flex bg-[#1f1f21] border border-zinc-800 focus-within:border-zinc-700 rounded-xl overflow-hidden">
                                        <span className="bg-[#262629] border-r border-zinc-800 px-3.5 py-3 text-xs text-zinc-400 font-medium select-none flex items-center justify-center">https://</span>
                                        <input 
                                            type="text" value={formData.website} 
                                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                                            className="w-full bg-transparent px-3.5 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none" placeholder="www.company.com" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Location</label>
                                    <input 
                                        type="text" value={formData.location} 
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none" placeholder="City, Country" 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Employee Count Range</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.employeeRange} 
                                            onChange={(e) => setFormData({...formData, employeeRange: e.target.value})}
                                            className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none appearance-none cursor-pointer pr-10"
                                        >
                                            <option value="1-10">1-10 employees</option>
                                            <option value="11-50">11-50 employees</option>
                                            <option value="51-200">51-200 employees</option>
                                            <option value="201+">201+ employees</option>
                                        </select>
                                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Company Logo</label>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                    <div onClick={() => fileInputRef.current?.click()} className="flex items-center justify-between bg-[#1f1f21] border border-zinc-800 rounded-xl p-2.5 cursor-pointer hover:border-zinc-700">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-9 h-9 min-w-9 rounded-lg bg-[#28282b] flex items-center justify-center text-zinc-400 shadow-inner">
                                                {logo ? <ImageIcon className="w-4 h-4 text-emerald-400" /> : <Upload className="w-4 h-4" />}
                                            </div>
                                            <div className="text-left overflow-hidden">
                                                <p className="text-[11px] font-semibold text-zinc-200 truncate max-w-[120px]">{logo ? logo.name : "Upload image"}</p>
                                                <p className="text-[9px] text-zinc-500 mt-0.5">{logo ? `${(logo.size / (1024 * 1024)).toFixed(2)} MB` : "PNG, JPG UP TO 5MB"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-2">Brief Description</label>
                                <textarea 
                                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3.5 h-24 text-sm text-zinc-200 placeholder-zinc-600 resize-none outline-none" 
                                    placeholder="Tell us about your company's mission and culture..."
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/40">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-semibold text-zinc-400 bg-[#1a1a1c] hover:bg-[#222224] border border-zinc-850 rounded-xl">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 shadow-md">
                                    Register Company
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyTab;