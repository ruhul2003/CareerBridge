'use client';
import React, { useState } from 'react';
import SeekerSidebar from '../../../Components/SeekerSidebar';
import OverviewTab from '../../../Components/seeker-dashboard-tabs/OverviewTab';


// import SavedJobsTab from './tabs/SavedJobsTab';
// import ApplicationsTab from './tabs/ApplicationsTab';
// import BillingTab from './tabs/BillingTab';
// import SettingsTab from './tabs/SettingsTab';

const SeekerDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard': return <OverviewTab />;
    //   case 'saved': return <SavedJobsTab />;
    //   case 'applications': return <ApplicationsTab />;
    //   case 'billing': return <BillingTab />;
    //   case 'settings': return <SettingsTab />;
      default: return <OverviewTab />;
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