'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Code, Plus, X, Save, Loader2, Sun, Moon, Phone, MapPin, Globe, Check } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import ThemeToggle from '@/Components/ThemeToggle';

const SettingsTab = ({ user }) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        title: '',
        phone: '',
        location: '',
        bio: '',
        linkedin: '',
        website: '',
    });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;
            setIsLoading(true);
            try {
                const res = await fetch(`/api/users/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile({
                        fullName: data.fullName || data.name || '',
                        email: data.email || '',
                        title: data.title || '',
                        phone: data.phone || '',
                        location: data.location || '',
                        bio: data.bio || '',
                        linkedin: data.linkedin || '',
                        website: data.website || data.portfolio || '',
                    });
                    setSkills(Array.isArray(data.skills) ? data.skills : []);
                }
            } catch (error) {
                console.error("Error fetching recruiter settings:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id]);

    const handleAddSkill = (e) => {
        e.preventDefault();
        const value = skillInput.trim();
        if (value && !skills.includes(value)) {
            setSkills([...skills, value]);
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) return;
        setIsSaving(true);
        setFeedback({ type: '', text: '' });

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: profile.fullName,
                    email: profile.email,
                    title: profile.title,
                    phone: profile.phone,
                    location: profile.location,
                    bio: profile.bio,
                    linkedin: profile.linkedin,
                    website: profile.website,
                    skills: skills
                })
            });

            if (res.ok) {
                setFeedback({ type: 'success', text: 'Recruiter profile updated successfully!' });
                setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
            } else {
                setFeedback({ type: 'error', text: 'Failed to update profile settings.' });
            }
        } catch (error) {
            console.error("Error saving profile settings:", error);
            setFeedback({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-t-indigo-500 border-zinc-800 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 font-sans">
            
            {/* Feedback Banner */}
            {feedback.text && (
                <div className={`p-4 rounded-xl text-sm flex items-center justify-between shadow-md border ${
                    feedback.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                }`}>
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>{feedback.text}</span>
                    </div>
                </div>
            )}

            {/* Title Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] p-6 rounded-2xl shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recruiter Profile & Settings</h2>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                        Update your recruiter contact info, title, and hiring preferences.
                    </p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Save Profile</span>
                        </>
                    )}
                </button>
            </div>

            {/* Appearance & Theme Settings */}
            <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Sun className="w-4 h-4 text-amber-500 dark:hidden" />
                            <Moon className="w-4 h-4 text-indigo-400 hidden dark:block" />
                            Appearance Preference
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
                            Switch between Light Mode and Dark Mode.
                        </p>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            {/* Personal & Recruiter Details */}
            <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#1e1e24] pb-3">
                    Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
                            Full Name *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={profile.fullName}
                                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                placeholder="Your Name"
                                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white"
                            />
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
                            Designation / Job Title *
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={profile.title}
                                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                placeholder="e.g. Lead Talent Acquisition Specialist"
                                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white"
                            />
                            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="w-full bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-500 dark:text-neutral-400 cursor-not-allowed"
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
                            Phone Number
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="e.g. +880 1800-000000"
                                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white"
                            />
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
                            Office Location
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={profile.location}
                                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                placeholder="e.g. Dhaka, Bangladesh"
                                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white"
                            />
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
                            LinkedIn URL
                        </label>
                        <div className="relative">
                            <input
                                type="url"
                                value={profile.linkedin}
                                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/in/yourprofile"
                                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white"
                            />
                            <FaLinkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
                        Bio / Overview
                    </label>
                    <textarea
                        rows={3}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Brief summary of your recruiting expertise..."
                        className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl p-3 text-sm text-slate-900 dark:text-white resize-none"
                    />
                </div>
            </div>

            {/* Hiring Tags / Specializations */}
            <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#1e1e24] pb-3">
                    Hiring Specializations & Tags
                </h3>

                <form onSubmit={handleAddSkill} className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="Add hiring tag (e.g., Tech Hiring, Executive Search)..."
                            className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2 text-sm text-slate-900 dark:text-white"
                        />
                        <Code className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Tag</span>
                    </button>
                </form>

                <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map((skill, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="hover:text-rose-500 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
