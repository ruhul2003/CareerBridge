// Components/seeker-dashboard-tabs/SettingsTab.jsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  User,
  Mail,
  Briefcase,
  Code,
  Plus,
  X,
  ShieldAlert,
  Save,
  Loader2,
  Upload,
  FileText,
  ExternalLink,
  Sun,
  Moon,
  GraduationCap,
  Building2,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Trash2,
  Edit3,
  Check
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { authClient } from '@/lib/auth-client';
import ThemeToggle from '@/Components/ThemeToggle';
import toast from 'react-hot-toast';

const SettingsTab = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    title: '',
    phone: '',
    location: '',
    bio: '',
    github: '',
    linkedin: '',
    portfolio: '',
    website: '',
    dateOfBirth: '',
    languages: '',
    avatar: '',
    resume: '',
    cv: '',
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // Education list state & inline form modal
  const [educationList, setEducationList] = useState([]);
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [eduForm, setEduForm] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    grade: '',
  });

  // Experience list state & inline form modal
  const [experienceList, setExperienceList] = useState([]);
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExpId, setEditingExpId] = useState(null);
  const [expForm, setExpForm] = useState({
    company: '',
    jobTitle: '',
    employmentType: 'Full-time',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState({ resume: false, cv: false });
  const [message, setMessage] = useState({ type: '', text: '' });

  const session = authClient.useSession();
  const userId = session.data?.user?.id;

  // Fetch user profile
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch profile');

        const userData = await res.json();

        setProfile({
          fullName: userData.fullName || userData.name || '',
          email: userData.email || '',
          title: userData.title || '',
          phone: userData.phone || '',
          location: userData.location || '',
          bio: userData.bio || '',
          github: userData.github || '',
          linkedin: userData.linkedin || '',
          portfolio: userData.portfolio || '',
          website: userData.website || '',
          dateOfBirth: userData.dateOfBirth || '',
          languages: userData.languages || '',
          avatar: userData.avatar || '',
          resume: userData.resume || userData.resumeUrl || '',
          cv: userData.cv || userData.cvUrl || '',
        });

        setSkills(Array.isArray(userData.skills) ? userData.skills : []);
        setEducationList(Array.isArray(userData.education) ? userData.education : []);
        setExperienceList(Array.isArray(userData.experience) ? userData.experience : []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Skill Add / Remove
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Education Add / Edit / Delete
  const handleSaveEducation = (e) => {
    e.preventDefault();
    if (!eduForm.institution.trim() || !eduForm.degree.trim()) {
      toast.error('Institution and Degree are required!');
      return;
    }

    if (editingEduId) {
      setEducationList(
        educationList.map((item) =>
          (item.id || item._id) === editingEduId ? { ...eduForm, id: editingEduId } : item
        )
      );
    } else {
      setEducationList([...educationList, { ...eduForm, id: Date.now().toString() }]);
    }

    setEduForm({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startYear: '',
      endYear: '',
      grade: '',
    });
    setEditingEduId(null);
    setShowEduModal(false);
    toast.success('Education record updated locally. Click "Save All Changes" to persist.');
  };

  const handleEditEdu = (item) => {
    const itemKey = item.id || item._id;
    setEditingEduId(itemKey);
    setEduForm({
      institution: item.institution || '',
      degree: item.degree || '',
      fieldOfStudy: item.fieldOfStudy || '',
      startYear: item.startYear || '',
      endYear: item.endYear || '',
      grade: item.grade || '',
    });
    setShowEduModal(true);
  };

  const handleDeleteEdu = (idToDelete) => {
    setEducationList(educationList.filter((item) => (item.id || item._id) !== idToDelete));
  };

  // Experience Add / Edit / Delete
  const handleSaveExperience = (e) => {
    e.preventDefault();
    if (!expForm.company.trim() || !expForm.jobTitle.trim()) {
      toast.error('Company Name and Job Title are required!');
      return;
    }

    if (editingExpId) {
      setExperienceList(
        experienceList.map((item) =>
          (item.id || item._id) === editingExpId ? { ...expForm, id: editingExpId } : item
        )
      );
    } else {
      setExperienceList([...experienceList, { ...expForm, id: Date.now().toString() }]);
    }

    setExpForm({
      company: '',
      jobTitle: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    });
    setEditingExpId(null);
    setShowExpModal(false);
    toast.success('Experience record updated locally. Click "Save All Changes" to persist.');
  };

  const handleEditExp = (item) => {
    const itemKey = item.id || item._id;
    setEditingExpId(itemKey);
    setExpForm({
      company: item.company || '',
      jobTitle: item.jobTitle || '',
      employmentType: item.employmentType || 'Full-time',
      location: item.location || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      currentlyWorking: item.currentlyWorking || false,
      description: item.description || '',
    });
    setShowExpModal(true);
  };

  const handleDeleteExp = (idToDelete) => {
    setExperienceList(experienceList.filter((item) => (item.id || item._id) !== idToDelete));
  };

  // Avatar Upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', userId);

    try {
      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      setProfile((prev) => ({ ...prev, avatar: data.avatarUrl }));
      setMessage({ type: 'success', text: 'Profile picture updated!' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  // Document Upload
  const handleDocumentUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    setUploadingDoc((prev) => ({ ...prev, [docType]: true }));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('type', docType);

    try {
      const res = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setProfile((prev) => ({ ...prev, [docType]: data.documentUrl }));
      setMessage({ type: 'success', text: `${docType.toUpperCase()} uploaded successfully!` });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || `Failed to upload ${docType}` });
    } finally {
      setUploadingDoc((prev) => ({ ...prev, [docType]: false }));
    }
  };

  // Save Profile to Backend
  const handleSave = async () => {
    if (!userId) {
      setMessage({ type: 'error', text: 'Please log in to save changes' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profile.fullName.trim(),
          email: profile.email.trim(),
          title: profile.title.trim(),
          phone: profile.phone.trim(),
          location: profile.location.trim(),
          bio: profile.bio.trim(),
          github: profile.github.trim(),
          linkedin: profile.linkedin.trim(),
          portfolio: profile.portfolio.trim(),
          website: profile.website.trim(),
          dateOfBirth: profile.dateOfBirth.trim(),
          languages: profile.languages.trim(),
          skills: skills,
          education: educationList,
          experience: experienceList,
          resume: profile.resume.trim(),
          cv: profile.cv.trim(),
          avatar: profile.avatar,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      setMessage({ type: 'success', text: 'All profile, education, & experience details saved successfully!' });
      toast.success('Profile updated successfully!');
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to save changes' });
      toast.error('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-slate-500 dark:text-neutral-400">Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Save Status Banner */}
      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between shadow-md border ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage({ type: '', text: '' })} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar with Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile & Credentials Studio</h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
            Manage your personal profile, education history, work experience, social links, and uploaded documents.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all transform hover:scale-[1.02]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save All Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Theme Preference */}
      <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500 dark:hidden" />
              <Moon className="w-4 h-4 text-indigo-400 hidden dark:block" />
              Appearance & Theme Preference
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">
              Switch between Light Mode and Dark Mode for the application.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Profile Picture & General Details */}
      <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#1e1e24] pb-3">
          <User className="w-5 h-5 text-cyan-500" />
          Personal Details
        </h3>

        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-slate-100 dark:border-[#1e1e24]">
          <div className="relative w-24 h-24 flex-shrink-0">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt="Profile Avatar"
                width={96}
                height={96}
                className="rounded-full object-cover border-2 border-cyan-500/40 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-cyan-500/40 shadow-md">
                {(profile.fullName || profile.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Profile Photo</h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              PNG, JPG, or WEBP up to 5MB. Clear headshots recommended.
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#18181b] hover:bg-slate-200 dark:hover:bg-[#27272a] text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-[#27272a] cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Upload New Photo'}</span>
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Inputs Grid */}
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
                placeholder="e.g. MD. Ruhul Amin"
                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              Professional Title / Designation *
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              Email Address (Account ID)
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
                placeholder="e.g. +880 1700-000000"
                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              Location / City, Country
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="e.g. Dhaka, Bangladesh"
                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>
        </div>

        {/* Bio & Languages */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              Professional Bio / Summary
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Briefly describe your career achievements, core strengths, and passion..."
              className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              Languages Spoken
            </label>
            <input
              type="text"
              value={profile.languages}
              onChange={(e) => setProfile({ ...profile, languages: e.target.value })}
              placeholder="e.g. English (Fluent), Bengali (Native), German (Basic)"
              className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Social & Portfolio Links Card */}
      <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#1e1e24] pb-3">
          <Globe className="w-5 h-5 text-indigo-500" />
          Social & Online Portfolio Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              GitHub Profile URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                placeholder="https://github.com/yourusername"
                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <FaGithub className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              LinkedIn Profile URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/yourusername"
                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <FaLinkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              Portfolio / Website URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={profile.portfolio}
                onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                placeholder="https://yourportfolio.com"
                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-neutral-400 mb-1.5">
              Other Link / Blog URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                placeholder="https://medium.com/@yourname"
                className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Educational Background Card */}
      <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1e1e24] pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-500" />
            Educational Background ({educationList.length})
          </h3>
          <button
            onClick={() => {
              setEditingEduId(null);
              setEduForm({
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startYear: '',
                endYear: '',
                grade: '',
              });
              setShowEduModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Education</span>
          </button>
        </div>

        {/* Education List */}
        {educationList.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-neutral-400 italic py-2">
            No education records added yet. Click "+ Add Education" above to list your degrees and academic background.
          </p>
        ) : (
          <div className="space-y-3">
            {educationList.map((item, idx) => {
              const itemKey = item.id || item._id || idx;
              return (
                <div
                  key={itemKey}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.institution}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-neutral-400 pt-0.5">
                      {(item.startYear || item.endYear) && (
                        <span>
                          🗓️ {item.startYear || 'N/A'} - {item.endYear || 'Present'}
                        </span>
                      )}
                      {item.grade && <span>🎓 Grade: {item.grade}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditEdu(item)}
                      className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-[#27272a] hover:bg-slate-300 dark:hover:bg-[#3f3f46] text-slate-700 dark:text-slate-200 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEdu(itemKey)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Education Inline Modal / Form */}
        {showEduModal && (
          <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {editingEduId ? 'Edit Education Record' : 'Add New Education Record'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Institution Name *
                </label>
                <input
                  type="text"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  placeholder="e.g. University of Dhaka"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Degree / Qualification *
                </label>
                <input
                  type="text"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Science (B.Sc.)"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Field of Study / Major
                </label>
                <input
                  type="text"
                  value={eduForm.fieldOfStudy}
                  onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Grade / CGPA
                </label>
                <input
                  type="text"
                  value={eduForm.grade}
                  onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                  placeholder="e.g. 3.85 / 4.00"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Start Year
                </label>
                <input
                  type="text"
                  value={eduForm.startYear}
                  onChange={(e) => setEduForm({ ...eduForm, startYear: e.target.value })}
                  placeholder="e.g. 2020"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  End / Passing Year
                </label>
                <input
                  type="text"
                  value={eduForm.endYear}
                  onChange={(e) => setEduForm({ ...eduForm, endYear: e.target.value })}
                  placeholder="e.g. 2024 or Present"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowEduModal(false);
                  setEditingEduId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-[#27272a] text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEducation}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
              >
                {editingEduId ? 'Update Education' : 'Save Education'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Work Experience Card */}
      <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1e1e24] pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" />
            Work Experience & History ({experienceList.length})
          </h3>
          <button
            onClick={() => {
              setEditingExpId(null);
              setExpForm({
                company: '',
                jobTitle: '',
                employmentType: 'Full-time',
                location: '',
                startDate: '',
                endDate: '',
                currentlyWorking: false,
                description: '',
              });
              setShowExpModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work Experience</span>
          </button>
        </div>

        {/* Experience List */}
        {experienceList.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-neutral-400 italic py-2">
            No work experience added yet. Click "+ Add Work Experience" to list your career roles and achievements.
          </p>
        ) : (
          <div className="space-y-3">
            {experienceList.map((item, idx) => {
              const itemKey = item.id || item._id || idx;
              return (
                <div
                  key={itemKey}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.jobTitle}</h4>
                      {item.employmentType && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-semibold border border-purple-500/20">
                          {item.employmentType}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {item.company} {item.location ? `• ${item.location}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                      🗓️ {item.startDate || 'N/A'} - {item.currentlyWorking ? 'Present' : item.endDate || 'Present'}
                    </p>
                    {item.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditExp(item)}
                      className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-[#27272a] hover:bg-slate-300 dark:hover:bg-[#3f3f46] text-slate-700 dark:text-slate-200 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteExp(itemKey)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Experience Inline Form */}
        {showExpModal && (
          <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-[#18181b] border border-slate-200 dark:border-[#27272a] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {editingExpId ? 'Edit Work Experience' : 'Add New Work Experience'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Job Title / Role *
                </label>
                <input
                  type="text"
                  value={expForm.jobTitle}
                  onChange={(e) => setExpForm({ ...expForm, jobTitle: e.target.value })}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  placeholder="e.g. CareerBridge Inc."
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Employment Type
                </label>
                <select
                  value={expForm.employmentType}
                  onChange={(e) => setExpForm({ ...expForm, employmentType: e.target.value })}
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={expForm.location}
                  onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                  placeholder="e.g. Dhaka, Bangladesh"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  Start Date
                </label>
                <input
                  type="text"
                  value={expForm.startDate}
                  onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                  placeholder="e.g. Jan 2022"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                  End Date
                </label>
                <input
                  type="text"
                  disabled={expForm.currentlyWorking}
                  value={expForm.currentlyWorking ? 'Present' : expForm.endDate}
                  onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                  placeholder="e.g. Dec 2023"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="currentlyWorking"
                checked={expForm.currentlyWorking}
                onChange={(e) => setExpForm({ ...expForm, currentlyWorking: e.target.checked })}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="currentlyWorking" className="text-xs text-slate-700 dark:text-slate-300">
                I am currently working in this role
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-neutral-400 mb-1">
                Role Description & Key Achievements
              </label>
              <textarea
                rows={3}
                value={expForm.description}
                onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                placeholder="Summarize key responsibilities, projects, tools, and achievements..."
                className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#27272a] rounded-lg p-2 text-xs text-slate-900 dark:text-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowExpModal(false);
                  setEditingExpId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-[#27272a] text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveExperience}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow"
              >
                {editingExpId ? 'Update Experience' : 'Save Experience'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Technical Skills Card */}
      <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#1e1e24] pb-3">
          <Code className="w-5 h-5 text-cyan-500" />
          Technical & Professional Skills ({skills.length})
        </h3>

        <form onSubmit={handleAddSkill} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. Next.js, React, Node.js, TypeScript, Docker..."
              className="w-full bg-slate-50 dark:bg-[#141417] border border-slate-200 dark:border-[#27272a] rounded-xl pl-10 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <Code className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold"
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
          {skills.length === 0 && (
            <p className="text-xs text-slate-400 italic">No skills added yet.</p>
          )}
        </div>
      </div>

      {/* Resume & CV Uploads Card */}
      <div className="bg-white dark:bg-[#09090b] border border-slate-200 dark:border-[#1e1e24] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-[#1e1e24] pb-3">
          <FileText className="w-5 h-5 text-indigo-500" />
          Resume & Curriculum Vitae (CV) Documents
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Slot */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Resume Document
              </h4>
              {profile.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-500 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View File
                </a>
              )}
            </div>

            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-slate-300 dark:border-[#27272a] hover:border-cyan-500 dark:hover:border-cyan-500 rounded-xl p-4 text-center transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                  {uploadingDoc.resume ? 'Uploading Resume...' : 'Upload PDF Resume'}
                </span>
                <span className="text-[10px] text-slate-400">PDF up to 10MB</span>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleDocumentUpload(e, 'resume')}
                className="hidden"
                disabled={uploadingDoc.resume}
              />
            </label>

            {profile.resume && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Resume file attached
              </p>
            )}
          </div>

          {/* CV Slot */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121215] border border-slate-200 dark:border-[#27272a] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Full CV Document
              </h4>
              {profile.cv && (
                <a
                  href={profile.cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-500 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View File
                </a>
              )}
            </div>

            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-slate-300 dark:border-[#27272a] hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-4 text-center transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                  {uploadingDoc.cv ? 'Uploading CV...' : 'Upload PDF CV'}
                </span>
                <span className="text-[10px] text-slate-400">PDF up to 10MB</span>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleDocumentUpload(e, 'cv')}
                className="hidden"
                disabled={uploadingDoc.cv}
              />
            </label>

            {profile.cv && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> CV file attached
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Save Action */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all transform hover:scale-[1.01]"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save All Profile Details</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;