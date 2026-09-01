'use client';
import React, { useState } from 'react';
import SeekerSidebar from '../../../Components/SeekerSidebar';
import OverviewTab from '../../../Components/seeker-dashboard-tabs/OverviewTab';
import SavedJobsTab from '../../../Components/seeker-dashboard-tabs/SavedJobsTab';
import ApplicationsTab from '../../../Components/seeker-dashboard-tabs/ApplicationsTab';
import BillingTab from '../../../Components/seeker-dashboard-tabs/BillingTab';
import SettingsTab from '../../../Components/seeker-dashboard-tabs/SettingsTab';




import { authClient } from '@/lib/auth-client';

const SeekerDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020203]">
        <div className="w-8 h-8 border-2 border-t-cyan-500 border-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard': return <OverviewTab user={user} onEditProfile={() => setCurrentTab('settings')} />;
      case 'saved': return <SavedJobsTab user={user} />;
      case 'applications': return <ApplicationsTab user={user} />;
      case 'billing': return <BillingTab user={user} />;
      case 'settings': return <SettingsTab user={user} />;
      default: return <OverviewTab user={user} onEditProfile={() => setCurrentTab('settings')} />;
    }
  };

  return (
    <div className="flex bg-[#09090b] min-h-screen text-gray-200 font-sans selection:bg-neutral-800">
      <SeekerSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="flex-1 bg-[#020203] overflow-y-auto max-h-screen p-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default SeekerDashboard;