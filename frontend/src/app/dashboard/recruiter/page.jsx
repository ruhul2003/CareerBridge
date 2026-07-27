'use client';
import React, { useState } from 'react';

import RecruiterSidebar from '../../../Components/RecruiterSidebar';
import DashboardTab from '../../../Components/recruiter-dashboard-tabs/DashboardTab';
import CompanyTab from '../../../Components/recruiter-dashboard-tabs/CompanyTab';
import JobsTab from '../../../Components/recruiter-dashboard-tabs/JobsTab';
import ApplicationsTab from '../../../Components/recruiter-dashboard-tabs/ApplicationsTab';
import SettingsTab from '../../../Components/recruiter-dashboard-tabs/SettingsTab';

const RecruiterDashboard = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard': return <DashboardTab />;
      case 'company': return <CompanyTab />;
      case 'jobs': return <JobsTab />;
      case 'applications': return <ApplicationsTab />;
      case 'settings': return <SettingsTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-gray-200 font-sans selection:bg-neutral-800">
      <RecruiterSidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      <main className="flex-1 bg-[#020203] overflow-y-auto p-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default RecruiterDashboard;