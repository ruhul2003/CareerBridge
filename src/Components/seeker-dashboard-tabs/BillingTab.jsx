import React from 'react';
import { CreditCard, Check, Download, AlertCircle, FileText } from 'lucide-react';

const BillingTab = () => {
  // Invoices logging mock structured dataset
  const invoices = [
    { id: "INV-2026-004", date: "Jun 01, 2026", amount: "$19.00", status: "Paid" },
    { id: "INV-2026-003", date: "May 01, 2026", amount: "$19.00", status: "Paid" },
    { id: "INV-2026-002", date: "Apr 01, 2026", amount: "$19.00", status: "Paid" },
    { id: "INV-2026-001", date: "Mar 01, 2026", amount: "$19.00", status: "Paid" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Title Header Layout Layer */}
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Subscription & Billing</h2>
        <p className="text-xs text-neutral-500">Manage your workspace plans, pricing subscriptions, and dynamic invoice logs.</p>
      </div>

      {/* Main Structural Matrix Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
        
        {/* Left Columns - Pricing Cards/Plan Overview HUD (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active Subscription State Box HUD */}
          <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">Pro Seeker Plan</h3>
                  <span className="text-[10px] tracking-wide font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded uppercase">
                    Active
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">Your next automatic cycle renewal bill is due on <span className="text-neutral-300 font-medium">August 01, 2026</span>.</p>
              </div>
            </div>
            
            <div className="sm:text-right">
              <h4 className="text-xl font-bold text-white">$19<span className="text-xs text-neutral-500 font-normal">/mo</span></h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">Billed monthly via Stripe</p>
            </div>
          </div>

          {/* Plan Comparison Premium Card Mechanism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Free Tier Details Static Log Box */}
            <div className="bg-[#09090b] border border-[#1e1e24] opacity-50 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Free Starter</h4>
                <h3 className="text-2xl font-bold text-white">$0 <span className="text-xs text-neutral-500 font-normal">/ lifetime</span></h3>
                <p className="text-xs text-neutral-500">Basic features suitable for starting your early job hunts.</p>
              </div>
              <ul className="space-y-2 text-xs text-neutral-400 pt-2 border-t border-[#1e1e24]/60">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-500" /> Apply to 5 jobs / month</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-neutral-500" /> Standard dashboard template</li>
              </ul>
              <button disabled className="w-full mt-2 bg-[#141417] text-neutral-600 font-medium text-xs py-2 rounded-xl cursor-not-allowed border border-transparent">
                Downgrade Not Allowed
              </button>
            </div>

            {/* Current Pro Plan Card Showcase */}
            <div className="bg-[#09090b] border border-indigo-500/30 rounded-2xl p-5 space-y-4 flex flex-col justify-between relative shadow-sm shadow-indigo-500/5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Pro Seeker</h4>
                  <span className="text-[9px] font-bold tracking-widest text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 px-2 py-0.5 rounded-full">POPULAR</span>
                </div>
                <h3 className="text-2xl font-bold text-white">$19 <span className="text-xs text-neutral-500 font-normal">/ month</span></h3>
                <p className="text-xs text-neutral-400">Unlock dynamic unlimited analytics optimization channels.</p>
              </div>
              <ul className="space-y-2 text-xs text-neutral-300 pt-2 border-t border-[#1e1e24]">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Unlimited monthly job applications</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Priority dynamic tracking updates</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Premium direct recruitment channels</li>
              </ul>
              <button className="w-full mt-2 bg-white text-black font-semibold text-xs py-2 rounded-xl hover:bg-neutral-200 transition-colors">
                Manage via Stripe Portal
              </button>
            </div>

          </div>

        </div>

        {/* Right Column - Local Secondary Configurations Metrices (Span 1) */}
        <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-5 space-y-4 h-fit">
          <h3 className="text-sm font-semibold text-white">Payment Method</h3>
          
          <div className="border border-[#1e1e24] bg-[#020203]/40 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="px-2 py-1 bg-neutral-800 rounded text-[10px] font-bold text-neutral-300 tracking-wide">
                VISA
              </div>
              <div>
                <p className="text-xs font-medium text-white">Visa ending in 4242</p>
                <p className="text-[10px] text-neutral-500 mt-0.5">Expires 12/28</p>
              </div>
            </div>
            <button className="text-[11px] text-neutral-400 hover:text-white transition-colors underline underline-offset-4">
              Update
            </button>
          </div>

          <div className="p-3 bg-neutral-900/20 border border-neutral-800/60 rounded-xl flex items-start gap-2.5 text-[11px] text-neutral-500">
            <AlertCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <p className="leading-normal">All transaction processing mechanisms are protected dynamically via Stripe SSL keys.</p>
          </div>
        </div>

      </div>

      {/* Bottom Historical Invoice Billing Section Log */}
      <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#1e1e24]">
          <h3 className="text-sm font-semibold text-white">Invoice History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1e1e24] text-neutral-500 font-medium bg-[#020203]/40">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Billing Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24] text-neutral-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#141417]/20 transition-colors">
                  <td className="p-4 font-mono text-neutral-400 tracking-tight">{inv.id}</td>
                  <td className="p-4 text-neutral-500">{inv.date}</td>
                  <td className="p-4 font-medium text-white">{inv.amount}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 rounded-lg border border-[#1e1e24] bg-[#141417] text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1 text-[11px]">
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default BillingTab;