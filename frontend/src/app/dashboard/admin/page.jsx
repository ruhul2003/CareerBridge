'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import AdminSidebar from '../../../Components/AdminSidebar';
import AdminOverviewTab from '../../../Components/admin-dashboard-tabs/AdminOverviewTab';
import AdminUsersTab from '../../../Components/admin-dashboard-tabs/AdminUsersTab';
import AdminJobsTab from '../../../Components/admin-dashboard-tabs/AdminJobsTab';
import AdminCompaniesTab from '../../../Components/admin-dashboard-tabs/AdminCompaniesTab';

const AdminDashboard = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-200 rounded-full animate-spin" />
          <p className="text-xs text-zinc-500 font-medium tracking-widest uppercase">Verifying Authorization</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Let the router handle redirecting
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard': return <AdminOverviewTab />;
      case 'users': return <AdminUsersTab />;
      case 'jobs': return <AdminJobsTab />;
      case 'companies': return <AdminCompaniesTab />;
      default: return <AdminOverviewTab />;
    }
  };

  return (
    <div className="flex bg-[#09090b] min-h-screen text-gray-200 font-sans selection:bg-neutral-800">
      <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="flex-1 bg-[#020203] overflow-y-auto max-h-screen p-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
