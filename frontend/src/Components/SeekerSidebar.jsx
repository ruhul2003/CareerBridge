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
    <aside className="w-64 min-h-screen bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-[#1e1e24] p-5 flex flex-col justify-between text-zinc-600 dark:text-gray-400 select-none transition-colors duration-200">
      <div>
        {/* Profile Branding Header */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
            <span className="text-white font-bold text-lg">HL</span>
          </div>
          <div>
            <h2 className="text-zinc-900 dark:text-white font-semibold text-sm leading-tight">Seeker Portal</h2>
            <p className="text-[11px] text-zinc-500 dark:text-gray-500">Professional Tier</p>
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
                    ? 'bg-zinc-100 dark:bg-[#18181b] text-zinc-900 dark:text-white border border-zinc-200 dark:border-[#27272a] shadow-sm' 
                    : 'hover:bg-zinc-100 dark:hover:bg-[#121214] text-zinc-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-gray-200 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive ? 'text-indigo-600 dark:text-white' : 'text-zinc-400 dark:text-gray-500'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Operations */}
      <div className="pt-4 border-t border-zinc-200 dark:border-[#1e1e24] space-y-3">
        <button className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold text-xs py-2.5 rounded-xl cursor-pointer hover:bg-zinc-800 dark:hover:bg-gray-200 active:scale-[0.98] transition-all duration-250 shadow-sm">
          Post Resume
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-xs cursor-pointer text-zinc-500 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 active:translate-x-0.5 transition-all duration-200">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default SeekerSidebar;