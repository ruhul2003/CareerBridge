import React from 'react';
import { LayoutDashboard, Briefcase, Bookmark, FileText, CreditCard, Settings, LogOut } from 'lucide-react';

const SeekerSidebar = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'saved', name: 'Saved Jobs', icon: Bookmark },
    { id: 'applications', name: 'Applications', icon: FileText },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#09090b] border-r border-[#1e1e24] p-5 flex flex-col justify-around text-gray-400 select-none">
      <div>
        {/* Profile Branding Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
            <span className="text-white font-bold text-lg">HL</span>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm leading-tight">Seeker Portal</h2>
            <p className="text-[11px] text-gray-500">Professional Tier</p>
          </div>
        </div>

        {/* Dynamic Navigation Options */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer outline-none transition-all duration-200 active:scale-[0.98] ${
                  isActive 
                    ? 'bg-[#18181b] text-white border border-[#27272a] shadow-sm' 
                    : 'hover:bg-[#121214] hover:text-gray-200 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Operations */}
      <div className="pt-4 border-t border-[#1e1e24] space-y-3">
        <button className="w-full bg-white text-black font-semibold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-gray-200 active:scale-[0.98] transition-all duration-250 shadow-sm">
          Post Resume
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-xs cursor-pointer hover:text-red-400 active:translate-x-0.5 transition-all duration-200 text-gray-500">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default SeekerSidebar;