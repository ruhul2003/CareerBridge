'use client';
import React, { useEffect, useState } from 'react';
import { CreditCard, Check, Download, AlertCircle } from 'lucide-react';

const BillingTab = () => {
    const [subscription, setSubscription] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            // Fetch from your backend (adjust URL as needed)
            const res = await fetch('http://localhost:5000/api/user-subscription', {
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                setSubscription(data.subscription);
                setInvoices(data.invoices || []);
            }
        } catch (err) {
            console.error("Failed to fetch subscription:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-neutral-500">Loading billing information...</div>;
    }

    const planName = subscription?.planId?.includes('pro') ? 'Pro Seeker' : 
                     subscription?.planId?.includes('premium') ? 'Premium Seeker' : 'Free';

    const isActive = subscription?.status === 'active';

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Subscription & Billing</h2>
                <p className="text-xs text-neutral-500">Manage your workspace plans, pricing subscriptions, and invoice logs.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left - Plan Info */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Active Subscription */}
                    <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-white">{planName}</h3>
                                        {isActive && (
                                            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full">ACTIVE</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        Next billing: {subscription?.nextBilling || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-3xl font-bold text-white">
                                    {subscription?.amount || '$19'}<span className="text-sm font-normal text-neutral-500">/mo</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Plan Features */}
                    <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6">
                        <h4 className="font-semibold mb-4 text-white">Plan Benefits</h4>
                        <ul className="space-y-3 text-sm">
                            {subscription?.features?.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-neutral-300">
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    {feature}
                                </li>
                            )) || (
                                <li className="text-neutral-500">No features loaded yet.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Right Column - Payment Method */}
                <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl p-6 h-fit">
                    <h3 className="text-sm font-semibold text-white mb-4">Payment Method</h3>
                    
                    <div className="border border-[#1e1e24] bg-[#020203] rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 bg-neutral-800 rounded text-xs font-bold">VISA</div>
                                <div>
                                    <p className="text-white text-sm">•••• {subscription?.last4 || '4242'}</p>
                                    <p className="text-xs text-neutral-500">Expires {subscription?.expiry || '12/28'}</p>
                                </div>
                            </div>
                            <button className="text-xs text-neutral-400 hover:text-white underline">Update</button>
                        </div>
                    </div>

                    <div className="mt-4 text-[11px] text-neutral-500 flex gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <p>Secured by Stripe</p>
                    </div>
                </div>
            </div>

            {/* Invoice History */}
            <div className="bg-[#09090b] border border-[#1e1e24] rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-[#1e1e24]">
                    <h3 className="font-semibold text-white">Invoice History</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-[#020203]">
                            <tr className="text-neutral-500 border-b border-[#1e1e24]">
                                <th className="p-4 text-left">Invoice</th>
                                <th className="p-4 text-left">Date</th>
                                <th className="p-4 text-left">Amount</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1e24]">
                            {invoices.length > 0 ? (
                                invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-[#141417]">
                                        <td className="p-4 font-mono text-neutral-400">{inv.id}</td>
                                        <td className="p-4 text-neutral-500">{inv.date}</td>
                                        <td className="p-4 font-medium">{inv.amount}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 text-xs bg-emerald-500/10 text-emerald-400 rounded-full">Paid</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="text-neutral-400 hover:text-white flex items-center gap-1 text-xs">
                                                <Download className="w-4 h-4" /> PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-neutral-500">No invoices yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillingTab;