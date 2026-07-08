'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';

// 1. Separate the logic into a client component safely contained under a Suspense scope
function SuccessPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Activating your subscription...');

    useEffect(() => {
        if (!sessionId) {
            router.push('/pricing');
            return;
        }

        const activateSubscription = async () => {
            const backendUrls = [
                'https://hireloop-server-lac.vercel.app/api/activate-subscription',
                'http://localhost:5000/api/activate-subscription'
            ];

            for (const url of backendUrls) {
                try {
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ session_id: sessionId }),
                        credentials: 'include'
                    });

                    if (!res.ok) continue;

                    const data = await res.json();

                    if (data.success) {
                        setStatus('success');
                        setMessage('Subscription activated successfully!');
                        setTimeout(() => router.push('/dashboard/seeker'), 1800);
                        return;
                    }
                } catch (err) {
                    console.log(`Failed with ${url}`);
                }
            }

            setStatus('error');
            setMessage('Failed to activate subscription. Please try again or contact support.');
        };

        activateSubscription();
    }, [sessionId, router]);

    return (
        <div className="text-center max-w-md px-6">
            {status === 'processing' && (
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6" />
            )}

            {status === 'success' && (
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-emerald-400" />
                </div>
            )}

            {status === 'error' && (
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    ❌
                </div>
            )}

            <h1 className="text-3xl font-bold mb-3">
                {status === 'success' ? 'Thank You!' : 'Processing Payment'}
            </h1>
            <p className="text-zinc-400 mb-8">{message}</p>

            {status === 'success' && (
                <Link 
                    href="/dashboard/seeker" 
                    className="mt-6 inline-block bg-white text-black px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                    Go to Dashboard
                </Link>
            )}
        </div>
    );
}

// 2. Export the primary page enclosed completely with Suspense fallback boundaries
export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-50">
            <Suspense fallback={
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-zinc-700 border-t-transparent rounded-full mx-auto mb-6" />
                    <p className="text-zinc-400 text-sm">Loading security state...</p>
                </div>
            }>
                <SuccessPageContent />
            </Suspense>
        </div>
    );
}