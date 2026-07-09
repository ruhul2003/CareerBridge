'use client';

import React, { useState } from 'react';
import { Building2, HelpCircle, X, Upload,FileText, ChevronDown } from 'lucide-react';

const CompanyTab = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        website: '',
        location: '',
        employeeRange: '',
        description: '',
    });
    const [logo, setLogo] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch('http://localhost:5000/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    logo: logo ? logo.name : null,
                    recruiterId: "current-user-id", // Replace with real user ID
                }),
            });

            if (res.ok) {
                alert("Company registered successfully!");
                setIsModalOpen(false);
                // Reset form
                setFormData({ name: '', industry: '', website: '', location: '', employeeRange: '', description: '' });
                setLogo(null);
            } else {
                alert("Failed to register company");
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to server");
        }
    };

    return (
        <div className="min-h-[80vh] max-w-8xl flex items-center justify-center p-6 bg-[#0d0d0d]">
            <div className="max-w-md text-center">
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
                <p className="text-neutral-400 text-lg leading-relaxed mb-10">
                    Set up your business profile to start posting high-performance job listings and manage your talent loop.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-3.5 bg-white text-black font-semibold rounded-2xl hover:bg-neutral-200 transition-all active:scale-95"
                    >
                        Register your company
                    </button>

                    <button className="px-8 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 font-medium rounded-2xl transition-all flex items-center justify-center gap-2 text-white">
                        <HelpCircle className="w-5 h-5" />
                        View FAQ
                    </button>
                </div>

                <p className="text-sm text-neutral-500">
                    Need specialized assistance?{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300 underline">Contact our enterprise support team.</a>
                </p>
            </div>

            {/* Register Company Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
                    <div className="bg-[#161616] w-full max-w-xl rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden font-sans">
                        
                        {/* Modal Header */}
                        <div className="p-6 pb-5 border-b border-zinc-800/60 flex items-start justify-between">
                            <div>
                                <h3 className="text-[19px] font-semibold text-white tracking-tight mb-0.5">Register New Company</h3>
                                <p className="text-xs text-zinc-400 tracking-normal">Enter your business details to start hiring on HireLoop.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            
                            {/* Company Name & Industry Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Company Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors" 
                                        placeholder="e.g. Acme Corp" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Industry / Category</label>
                                    <div className="relative">
                                        <select 
                                            required 
                                            value={formData.industry} 
                                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                            className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none transition-colors appearance-none cursor-pointer pr-10"
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

                            {/* Website URL & Location Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Website URL</label>
                                    <div className="flex bg-[#1f1f21] border border-zinc-800 focus-within:border-zinc-700 rounded-xl overflow-hidden transition-colors">
                                        <span className="bg-[#262629] border-r border-zinc-800 px-3.5 py-3 text-xs text-zinc-400 font-medium select-none flex items-center justify-center">
                                            https://
                                        </span>
                                        <input 
                                            type="text" 
                                            value={formData.website} 
                                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                                            className="w-full bg-transparent px-3.5 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none" 
                                            placeholder="www.company.com" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Location</label>
                                    <input 
                                        type="text" 
                                        value={formData.location} 
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors" 
                                        placeholder="City, Country" 
                                    />
                                </div>
                            </div>

                            {/* Employee Count Range & Company Logo Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Employee Count Range</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.employeeRange} 
                                            onChange={(e) => setFormData({...formData, employeeRange: e.target.value})}
                                            className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none transition-colors appearance-none cursor-pointer pr-10"
                                        >
                                            <option value="">1-10 employees</option>
                                            <option value="11-50">11-50 employees</option>
                                            <option value="51-200">51-200 employees</option>
                                            <option value="201+">201+ employees</option>
                                        </select>
                                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-300 mb-2">Company Logo</label>
                                    <div className="flex items-center gap-3 bg-[#1f1f21] border border-zinc-800 rounded-xl p-2.5 cursor-pointer hover:border-zinc-700 transition-colors">
                                        <div className="w-9 h-9 rounded-lg bg-[#28282b] flex items-center justify-center text-zinc-400 shadow-inner">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-semibold text-zinc-200 leading-normal">Upload image</p>
                                            <p className="text-[9px] text-zinc-500 font-medium tracking-wide leading-none mt-0.5">PNG, JPG UP TO 5MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Brief Description Section */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-300 mb-2">Brief Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-[#1f1f21] border border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3.5 h-28 text-sm text-zinc-200 placeholder-zinc-600 resize-none outline-none transition-colors leading-relaxed" 
                                    placeholder="Tell us about your company's mission and culture..."
                                />
                            </div>

                            {/* Modal Actions Footer */}
                            <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-zinc-800/40">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-xs font-semibold text-zinc-400 bg-[#1a1a1c] hover:bg-[#222224] border border-zinc-850 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2.5 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-colors shadow-md"
                                >
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