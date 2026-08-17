// Components/seeker-dashboard-tabs/SettingsTab.jsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, Mail, Briefcase, Code, Plus, X, ShieldAlert, Save, Loader2, Upload, FileText, ExternalLink } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const SettingsTab = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    title: '',
    avatar: '',
    resume: '',
    cv: '',
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
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
        if (!res.ok) throw new Error('Failed to fetch');

        const userData = await res.json();

        setProfile({
          fullName: userData.fullName || '',
          email: userData.email || '',
          title: userData.title || '',
          avatar: userData.avatar || '',
          resume: userData.resume || userData.resumeUrl || '',
          cv: userData.cv || userData.cvUrl || '',
        });
        setSkills(Array.isArray(userData.skills) ? userData.skills : []);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

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

      if (!res.ok) throw new Error();
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
      setMessage({ type: 'success', text: `${docType.toUpperCase()} file uploaded successfully!` });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || `Failed to upload ${docType}` });
    } finally {
      setUploadingDoc((prev) => ({ ...prev, [docType]: false }));
    }
  };

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
          skills: skills,
          resume: profile.resume.trim(),
          cv: profile.cv.trim(),
        }),
      });

      if (!res.ok) throw new Error();

      setMessage({ type: 'success', text: 'Profile & documents updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to save changes' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-neutral-400">Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Picture */}
      <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex-shrink-0">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt="Profile Avatar"
                width={96}
                height={96}
                className="rounded-full object-cover border-2 border-neutral-700"
              />
            ) : (
              <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center text-4xl font-bold text-white border-2 border-neutral-700">
                {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AR'}
              </div>
            )}
          </div>

          <div>
            <label className="cursor-pointer flex items-center gap-2 bg-[#141417] hover:bg-[#1f1f24] border border-[#27272a] text-white text-sm px-5 py-2.5 rounded-xl transition-colors">
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Change Photo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
            <p className="text-xs text-neutral-500 mt-2">PNG or JPG • Max 5MB</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-semibold text-white border-b border-[#1e1e24] pb-3">Personal Profile Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
              <User className="w-3 h-3 text-neutral-500" /> Full Name
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full bg-[#020203] border border-[#1e1e24] focus:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
              <Mail className="w-3 h-3 text-neutral-500" /> Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-[#020203] border border-[#1e1e24] focus:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-neutral-500" /> Professional Headline
            </label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full bg-[#020203] border border-[#1e1e24] focus:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Code className="w-4 h-4 text-neutral-400" /> Core Technical Skills
          </h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">Add keywords to better match job opportunities.</p>
        </div>

        <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="Type skill and press Enter..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="flex-1 bg-[#020203] border border-[#1e1e24] focus:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-colors"
          />
          <button
            type="submit"
            className="p-2 border border-[#1e1e24] bg-[#141417] text-neutral-400 hover:text-white hover:bg-[#18181b] rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-[#141417] border border-[#27272a] text-neutral-200 text-xs pl-3 pr-2 py-1 rounded-lg font-medium"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="p-0.5 hover:text-red-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-xs text-neutral-600 italic">No skills added yet.</p>
          )}
        </div>
      </div>

      {/* Resume & CV Documents Section */}
      <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-400" /> Resume & Curriculum Vitae (CV)
          </h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Upload files (PDF, DOC, DOCX up to 10MB) or enter document links so recruiters can review your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resume Box */}
          <div className="bg-[#020203] border border-[#1e1e24] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" /> Resume
              </span>
              {profile.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline font-medium"
                >
                  View File <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="space-y-2">
              <label className="cursor-pointer flex items-center justify-center gap-2 bg-[#141417] hover:bg-[#1f1f24] border border-[#27272a] text-white text-xs px-4 py-2.5 rounded-xl transition-colors w-full">
                <Upload className="w-3.5 h-3.5" />
                {uploadingDoc.resume ? 'Uploading Resume...' : (profile.resume ? 'Upload New Resume File' : 'Upload Resume File')}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleDocumentUpload(e, 'resume')}
                  disabled={uploadingDoc.resume}
                />
              </label>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-[#1e1e24]"></div>
                <span className="shrink mx-2 text-[10px] text-neutral-600 uppercase">OR URL</span>
                <div className="flex-grow border-t border-[#1e1e24]"></div>
              </div>

              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={profile.resume}
                onChange={(e) => setProfile({ ...profile, resume: e.target.value })}
                className="w-full bg-[#09090b] border border-[#1e1e24] focus:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-colors"
              />
            </div>
          </div>

          {/* CV Box */}
          <div className="bg-[#020203] border border-[#1e1e24] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" /> Curriculum Vitae (CV)
              </span>
              {profile.cv && (
                <a
                  href={profile.cv}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline font-medium"
                >
                  View File <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="space-y-2">
              <label className="cursor-pointer flex items-center justify-center gap-2 bg-[#141417] hover:bg-[#1f1f24] border border-[#27272a] text-white text-xs px-4 py-2.5 rounded-xl transition-colors w-full">
                <Upload className="w-3.5 h-3.5" />
                {uploadingDoc.cv ? 'Uploading CV...' : (profile.cv ? 'Upload New CV File' : 'Upload CV File')}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleDocumentUpload(e, 'cv')}
                  disabled={uploadingDoc.cv}
                />
              </label>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-[#1e1e24]"></div>
                <span className="shrink mx-2 text-[10px] text-neutral-600 uppercase">OR URL</span>
                <div className="flex-grow border-t border-[#1e1e24]"></div>
              </div>

              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={profile.cv}
                onChange={(e) => setProfile({ ...profile, cv: e.target.value })}
                className="w-full bg-[#09090b] border border-[#1e1e24] focus:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-3 rounded-xl text-xs border ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-400 border-green-500/30'
              : 'bg-red-500/10 text-red-400 border-red-500/30'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end border-t border-[#1e1e24] pt-5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 rounded-xl hover:bg-neutral-200 disabled:opacity-70 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;