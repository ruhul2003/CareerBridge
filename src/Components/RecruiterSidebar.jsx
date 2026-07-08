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

const RecruiterSidebar = ({ currentTab, setCurrentTab }) => {
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

    return (
        <aside className="w-72 min-h-screen bg-[#0b0b0d] border-r border-neutral-800 flex flex-col justify-between">

            {/* Top */}
            <div>

                {/* Profile */}
                <div className="p-6 border-b border-neutral-800">

                    <div className="flex items-center gap-3">

                        <Image
                            src="https://i.pravatar.cc/100?img=12"
                            alt="Recruiter"
                            width={48}
                            height={48}
                            className="rounded-full"
                        />

                        <div>

                            <h2 className="font-semibold text-white">
                                Alex Sterling
                            </h2>

                            <p className="text-xs text-gray-400">
                                Recruiter
                            </p>

                            <span className="inline-block mt-2 text-[10px] bg-neutral-800 text-gray-300 px-2 py-1 rounded">
                                PREMIUM ACCOUNT
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

            {/* Bottom */}
            <div className="border-t border-neutral-800 p-5">

                <div className="flex items-center gap-3">

                    <Image
                        src="https://i.pravatar.cc/100?img=12"
                        alt="Recruiter"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />

                    <div>

                        <h3 className="text-sm font-medium">
                            Alex Sterling
                        </h3>

                        <p className="text-xs text-gray-500">
                            Premium Account
                        </p>

                    </div>

                </div>

            </div>

        </aside>
    );
};

export default RecruiterSidebar;