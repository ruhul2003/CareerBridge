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
        <aside className="w-72  bg-[#0b0b0d] border-r border-neutral-800 flex flex-col justify-between">

            {/* Top */}
            <div>

                {/* Profile */}
                <div className="p-6 border-b border-neutral-800">

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
                            <div className="w-12 h-12 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-lg border border-neutral-700 shrink-0">
                                {getInitials(user?.name || user?.fullName)}
                            </div>
                        )}

                        <div className="min-w-0 flex-1">

                            <h2 className="font-semibold text-white truncate" title={user?.name || user?.fullName}>
                                {user?.name || user?.fullName || 'Recruiter'}
                            </h2>

                            <p className="text-xs text-gray-400 truncate" title={user?.email}>
                                {user?.email}
                            </p>

                            <span className={`inline-block mt-2 text-[9px] font-bold px-2 py-0.5 rounded tracking-wider ${
                                user?.plan === 'recruiter_enterprise' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                user?.plan === 'recruiter_growth' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-zinc-800 text-zinc-400 border border-zinc-700'
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
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200

                ${currentTab === item.id
                                        ? 'bg-neutral-800 text-white border-l-4 border-white'
                                        : 'text-gray-400 hover:bg-neutral-900 hover:text-white'
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