'use client';

import React from 'react';
import Image from 'next/image';
import {
    LayoutDashboard,
    Building2,
    BriefcaseBusiness,
    FileText,
    Settings,
} from 'lucide-react';

const RecruiterSidebar = ({ currentTab, setCurrentTab, user }) => {
    const menuItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: LayoutDashboard,
        },
        {
            id: 'company',
            title: 'My Company',
            icon: Building2,
        },
        {
            id: 'jobs',
            title: 'Manage Jobs',
            icon: BriefcaseBusiness,
        },
        {
            id: 'applications',
            title: 'Applications',
            icon: FileText,
        },
        {
            id: 'settings',
            title: 'Settings',
            icon: Settings,
        },
    ];

    const getPlanLabel = (plan) => {
        if (plan === 'recruiter_enterprise') return 'ENTERPRISE';
        if (plan === 'recruiter_growth') return 'GROWTH';
        return 'FREE';
    };

    const getInitials = (name) => {
        if (!name) return 'R';
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    return (
        <aside className="w-72 bg-white dark:bg-[#0b0b0d] border-r border-zinc-200 dark:border-neutral-800 flex flex-col justify-between transition-colors duration-200">

            {/* Top */}
            <div>

                {/* Profile */}
                <div className="p-6 border-b border-zinc-200 dark:border-neutral-800">

                    <div className="flex items-center gap-3">

                        {user?.image ? (
                            <Image
                                src={user.image}
                                alt="Recruiter"
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-neutral-800 text-zinc-900 dark:text-white flex items-center justify-center font-bold text-lg border border-zinc-300 dark:border-neutral-700 shrink-0">
                                {getInitials(user?.name || user?.fullName)}
                            </div>
                        )}

                        <div className="min-w-0 flex-1">

                            <h2 className="font-semibold text-zinc-900 dark:text-white truncate" title={user?.name || user?.fullName}>
                                {user?.name || user?.fullName || 'Recruiter'}
                            </h2>

                            <p className="text-xs text-zinc-500 dark:text-gray-400 truncate" title={user?.email}>
                                {user?.email}
                            </p>

                            <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded tracking-wider ${
                                user?.plan === 'recruiter_enterprise' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                user?.plan === 'recruiter_growth' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700'
                            }`}>
                                {getPlanLabel(user?.plan)}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Navigation */}
                <div className="p-4 space-y-2">

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer
                                    ${currentTab === item.id
                                        ? 'bg-zinc-100 dark:bg-neutral-800 text-zinc-900 dark:text-white border-l-4 border-indigo-600 dark:border-white font-medium'
                                        : 'text-zinc-600 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-neutral-900 hover:text-zinc-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                <Icon size={18} />

                                <span className="text-sm">
                                    {item.title}
                                </span>
                            </button>
                        );
                    })}

                </div>

            </div>

        </aside>
    );
};

export default RecruiterSidebar;