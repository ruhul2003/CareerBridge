'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Code, Plus, X, Save, Loader2, Sun, Moon } from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';

const SettingsTab = ({ user }) => {
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        title: '',
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
                const res = await fetch(`${SERVER_URL}/api/users/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile({
                        fullName: data.fullName || data.name || '',
                        email: data.email || '',
                        title: data.title || '',
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
            const res = await fetch(`${SERVER_URL}/api/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: profile.fullName,
                    email: profile.email,
                    title: profile.title,
                    skills: skills
                })
            });

            if (res.ok) {
                setFeedback({ type: 'success', text: 'Profile settings updated successfully!' });
                if (typeof window !== 'undefined') {
                    setTimeout(() => {
                        window.location.reload();
                    }, 1200);
                }
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
                <div className="w-8 h-8 border-2 border-t-white border-zinc-800 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile Settings</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm mt-1">Manage your account credentials and personal profile.</p>
            </div>

            {feedback.text && (
                <div className={`p-4 rounded-xl border text-xs font-semibold ${
                    feedback.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                }`}>
                    {feedback.text}
                </div>
            )}

            {/* Appearance & Theme Settings Card */}
            <div className="bg-white dark:bg-[#141416] p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 transition-colors duration-300 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-500 dark:hidden" />
                        <Moon className="w-4 h-4 text-indigo-400 hidden dark:block" />
                        Appearance & Theme Preference
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                        Switch between Light Mode and Dark Mode across your workspace.
                    </p>
                </div>
                <ThemeToggle />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-[#141416] p-6 rounded-2xl border border-slate-200 dark:border-zinc-850 shadow-sm transition-colors duration-300">
                {/* Full Name */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">Full Name</label>
                    <div className="flex bg-slate-50 dark:bg-[#1f1f21] border border-slate-300 dark:border-zinc-800 focus-within:border-indigo-500 dark:focus-within:border-zinc-700 rounded-xl overflow-hidden items-center px-4">
                        <User className="w-4 h-4 text-slate-400 dark:text-zinc-500 mr-3" />
                        <input 
                            type="text" required
                            value={profile.fullName} 
                            onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                            className="w-full bg-transparent py-3 text-sm text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 outline-none" 
                            placeholder="e.g. Alex Sterling" 
                        />
                    </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">Email Address</label>
                    <div className="flex bg-slate-100 dark:bg-[#1f1f21] border border-slate-200 dark:border-zinc-800/80 rounded-xl overflow-hidden items-center px-4 opacity-75">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 mr-3" />
                        <input 
                            type="email" disabled
                            value={profile.email} 
                            className="w-full bg-transparent py-3 text-sm text-slate-500 dark:text-zinc-400 outline-none cursor-not-allowed" 
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-500">Contact admin to modify registered account email.</p>
                </div>

                {/* Recruiter Title */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">Hiring Title / Role</label>
                    <div className="flex bg-slate-50 dark:bg-[#1f1f21] border border-slate-300 dark:border-zinc-800 focus-within:border-indigo-500 dark:focus-within:border-zinc-700 rounded-xl overflow-hidden items-center px-4">
                        <Briefcase className="w-4 h-4 text-slate-400 dark:text-zinc-500 mr-3" />
                        <input 
                            type="text" 
                            value={profile.title} 
                            onChange={(e) => setProfile({...profile, title: e.target.value})}
                            className="w-full bg-transparent py-3 text-sm text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-600 outline-none" 
                            placeholder="e.g. Head of Talent Acquisition" 
                        />
                    </div>
                </div>

                {/* Hiring Interests / Tags */}
                <div className="space-y-3">
                    <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">Hiring Sectors & Interests</label>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-[#1f1f21] border border-slate-300 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-650 outline-none transition-colors"
                            placeholder="Add hiring tag (e.g. Engineering, Sales, Devops)"
                        />
                        <button 
                            type="button"
                            onClick={handleAddSkill}
                            className="px-4 py-2.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-300 rounded-xl text-xs font-semibold border border-slate-300 dark:border-zinc-700/60 transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {skills.length === 0 ? (
                            <span className="text-xs text-slate-400 dark:text-zinc-500 italic">No tags added yet. Add tags to classify your focus areas.</span>
                        ) : (
                            skills.map((skill, index) => (
                                <div 
                                    key={index}
                                    className="bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-800 dark:text-zinc-300 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-2"
                                >
                                    <span>{skill}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="text-slate-400 dark:text-zinc-500 hover:text-red-500"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/40 flex justify-end">
                    <button 
                        type="submit" disabled={isSaving}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-xs rounded-xl transition shadow flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsTab;

