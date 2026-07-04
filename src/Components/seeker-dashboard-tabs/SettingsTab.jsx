import React, { useState } from 'react';
import { User, Mail, Briefcase, Code, Plus, X, ShieldAlert, Save } from 'lucide-react';

const SettingsTab = () => {
  // Profile Info Basic States
  const [profile, setProfile] = useState({
    fullName: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    title: 'Full-stack Developer',
  });

  // Skills Engine Tags Management States
  const [skills, setSkills] = useState(['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS', 'Next.js']);
  const [skillInput, setSkillInput] = useState('');

  // Handle adding raw skill string tag values
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  // Remove precise skill tag indices 
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title Header Section */}
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Account Settings</h2>
        <p className="text-xs text-neutral-500">Update your profile information, manage dynamic skill tags, and security choices.</p>
      </div>

      {/* Profile Info Form Section Card */}
      <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-semibold text-white border-b border-[#1e1e24] pb-3">Personal Profile Information</h3>
        
        {/* Avatar Uploader Grid Field Component */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-16 h-16 bg-neutral-800 rounded-full border border-neutral-700 flex items-center justify-center text-white text-xl font-bold font-mono">
            AR
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xs font-medium text-white">Profile Avatar Photo</h4>
            <p className="text-[11px] text-neutral-500">PNG or JPG framework models up to 5MB.</p>
            <div className="flex items-center gap-2 pt-1">
              <button className="bg-[#141417] border border-[#27272a] text-neutral-300 hover:text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors">
                Change Photo
              </button>
              <button className="text-[11px] text-red-400/80 hover:text-red-400 transition-colors px-2 py-1">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid Text Fields Forms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
              <User className="w-3 h-3 text-neutral-500" /> Full Name
            </label>
            <input 
              type="text" 
              value={profile.fullName}
              onChange={(e) => setProfile({...profile, fullName: e.target.value})}
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
              onChange={(e) => setProfile({...profile, email: e.target.value})}
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
              onChange={(e) => setProfile({...profile, title: e.target.value})}
              className="w-full bg-[#020203] border border-[#1e1e24] focus:border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none transition-colors"
            />
          </div>

        </div>
      </div>

      {/* Technical Skills Tag Engine Section Card */}
      <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Code className="w-4 h-4 text-neutral-400" /> Core Technical Skills
          </h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">Add core tech expertise keywords keywords to match dynamic job listings requirements.</p>
        </div>

        {/* Input Text Form Engine Trigger */}
        <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
          <input 
            type="text" 
            placeholder="Type skill tag (e.g., C++, TypeScript) & press Enter..." 
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

        {/* Flexible Active Dynamic Tags Wrapper Grid Layout */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="flex items-center gap-1 bg-[#141417] border border-[#27272a] text-neutral-200 text-xs pl-2.5 pr-1.5 py-1 rounded-lg font-medium group hover:border-neutral-600 transition-colors"
            >
              <span>{skill}</span>
              <button 
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="p-0.5 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-xs text-neutral-600 italic">No skill tags added yet. Use the engine to inject core technical labels.</p>
          )}
        </div>
      </div>

      {/* Bottom Global Changes Form Action Submission Controls Trigger */}
      <div className="flex items-center justify-between border-t border-[#1e1e24] pt-5">
        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
          <ShieldAlert className="w-4 h-4 text-neutral-600" />
          <span>All operational profiles data variables are verified locally.</span>
        </div>
        <button className="flex items-center gap-1.5 bg-white text-black font-semibold text-xs px-4 py-2 rounded-xl hover:bg-neutral-200 transition-colors shadow-sm">
          <Save className="w-3.5 h-3.5" /> Save Form Changes
        </button>
      </div>

    </div>
  );
};

export default SettingsTab;