'use client';

import React, { useState } from 'react';
import { Building2, HelpCircle, X, Upload } from 'lucide-react';

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
        <div className="min-h-[80vh] max-w-8xl flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                <div className="relative mx-auto mb-10 w-48 h-48">
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-zinc-900 rounded-3xl border border-neutral-700 shadow-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="w-20 h-20 text-neutral-500" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-neutral-700">
                        <span className="text-2xl">📄</span>
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

                    <button className="px-8 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 font-medium rounded-2xl transition-all flex items-center justify-center gap-2">
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 w-full max-w-lg rounded-3xl border border-zinc-700 overflow-hidden">
                        <div className="p-6 border-b border-zinc-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-white">Register New Company</h3>
                                <p className="text-sm text-zinc-400">Enter your business details to start hiring on HireLoop.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1.5">Company Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white" placeholder="e.g. Acme Corp" />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1.5">Industry / Category</label>
                                    <select required value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white">
                                        <option value="">Select Industry</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Marketing">Marketing</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-400 mb-1.5">Website URL</label>
                                <input type="url" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white" placeholder="https://www.company.com" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1.5">Location</label>
                                    <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white" placeholder="City, Country" />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1.5">Employee Count Range</label>
                                    <select value={formData.employeeRange} onChange={(e) => setFormData({...formData, employeeRange: e.target.value})}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white">
                                        <option value="">Select Range</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201+">201+ employees</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-400 mb-1.5">Company Logo</label>
                                <div className="border border-dashed border-zinc-700 rounded-2xl p-6 text-center hover:border-zinc-500 transition">
                                    <Upload className="w-8 h-8 mx-auto text-zinc-500 mb-2" />
                                    <p className="text-sm text-zinc-400">Upload Image (PNG, JPG up to 5MB)</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-zinc-400 mb-1.5">Brief Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 h-28 text-white resize-y" 
                                    placeholder="Tell us about your company's mission and culture..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 text-zinc-400 hover:bg-zinc-800 rounded-2xl transition">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="flex-1 py-3 bg-white text-black font-semibold rounded-2xl hover:bg-neutral-200 transition">
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