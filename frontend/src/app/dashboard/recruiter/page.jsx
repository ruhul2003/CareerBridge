'use client';
import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';

import RecruiterSidebar from '../../../Components/RecruiterSidebar';
import DashboardTab from '../../../Components/recruiter-dashboard-tabs/DashboardTab';
import CompanyTab from '../../../Components/recruiter-dashboard-tabs/CompanyTab';
import JobsTab from '../../../Components/recruiter-dashboard-tabs/JobsTab';
import ApplicationsTab from '../../../Components/recruiter-dashboard-tabs/ApplicationsTab';
import SettingsTab from '../../../Components/recruiter-dashboard-tabs/SettingsTab';

const RecruiterDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020203]">
        <div className="w-8 h-8 border-2 border-t-white border-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'recruiter') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020203] text-gray-400 p-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="mb-6 max-w-sm">You must be logged in as a Recruiter to access this dashboard.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard': return <DashboardTab user={user} />;
      case 'company': return <CompanyTab user={user} />;
      case 'jobs': return <JobsTab user={user} />;
      case 'applications': return <ApplicationsTab user={user} />;
      case 'settings': return <SettingsTab user={user} />;
      default: return <DashboardTab user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-gray-200 font-sans selection:bg-neutral-800">
      <RecruiterSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
      />

      <main className="flex-1 bg-[#020203] overflow-y-auto p-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default RecruiterDashboard;