'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
// Gravity UI Icons for a polished visual identity
import {
    Check,
    CircleQuestion,
    ChevronDown,
    Person,
    Briefcase,
    Rocket,
    Star
} from '@gravity-ui/icons';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const PricingPage = () => {

    const [billingTarget, setBillingTarget] = useState('seeker');

    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };


    const seekerPlans = [
        {
            name: 'Free',
            id: 'seeker_free',
            price: '$0',
            period: '/forever',
            description: 'Essential features for getting started and organizing your initial search tracking.',
            icon: <Person className="w-5 h-5 text-zinc-400" />,
            features: [
                'Browse & save up to 10 jobs',
                'Apply to up to 3 jobs per month',
                'Basic profile page',
                'Standard email alerts'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Pro',
            id: 'seeker_pro',
            price: '$19',
            period: '/month',
            description: 'Our most popular option for serious active candidates looking to rapidly accelerate landing a role.',
            icon: <Star className="w-5 h-5 text-blue-400" />,
            features: [
                'Apply to up to 30 jobs per month',
                'Unlimited saved jobs',
                'Advanced application tracking dashboard',
                'Comprehensive salary insights'
            ],
            cta: 'Upgrade to Pro',
            popular: true
        },
        {
            name: 'Premium',
            id: 'seeker_premium',
            price: '$39',
            period: '/month',
            description: 'Uncapped potential and priority visibility tools tailored for elite competitive talent placement.',
            icon: <Star className="w-5 h-5 text-purple-400" />,
            features: [
                'Everything in Pro + Unlimited applications',
                'Profile boost directly to recruiter feeds',
                'Early access to freshly published jobs',
                '24/7 Priority customer support queue'
            ],
            cta: 'Go Premium',
            popular: false
        }
    ];

    const recruiterPlans = [
        {
            name: 'Free',
            id: 'recruiter_free',
            price: '$0',
            period: '/forever',
            description: 'Ideal baseline solution matching startups launching their initial hiring infrastructure pipeline.',
            icon: <Briefcase className="w-5 h-5 text-zinc-400" />,
            features: [
                'Up to 3 active job posts simultaneously',
                'Basic applicant management pipeline',
                'Standard organic listing search visibility',
                'Great for a company’s first year of hiring'
            ],
            cta: 'Start Free Posting',
            popular: false
        },
        {
            name: 'Growth',
            id: 'recruiter_growth',
            price: '$49',
            period: '/month',
            description: 'Expanded allocation built for expanding companies with active multi-departmental team tracks.',
            icon: <Rocket className="w-5 h-5 text-blue-400" />,
            features: [
                'Up to 10 active job posts simultaneously',
                'Full automated applicant tracking workflow',
                'Basic listing performance metrics & analytics',
                'Dedicated email support desk response'
            ],
            cta: 'Scale Your Hiring',
            popular: true
        },
        {
            name: 'Enterprise',
            id: 'recruiter_enterprise',
            price: '$149',
            period: '/month',
            description: 'High performance structural operations for organizations with continuous large-scale talent acquisition.',
            icon: <Star className="w-5 h-5 text-purple-400" />,
            features: [
                'Up to 50 active job posts simultaneously',
                'Advanced interactive analytics visual dashboard',
                'Premium featured job listing styling boosts',
                'Multi-user team collaboration seats',
                'Custom corporate branding options',
                'Dedicated account manager + priority support'
            ],
            cta: 'Contact Corporate Tier',
            popular: false
        }
    ];

    const faqs = [
        {
            question: 'Can I cancel my subscription at any time?',
            answer: 'Yes, absolutely. All our premium tiers operate on flexible, non-binding month-to-month subscription structures. You can easily modify, downgrade, or cancel your renewal configurations through your profile billing dashboard settings at any time with no penalties.'
        },
        {
            question: 'How do refunds work if I change my mind?',
            answer: 'We maintain a 14-day satisfaction policy. If you determine the premium features aren’t a proper fit for your current search or hiring sequence within your initial two weeks of service, reach out to support for a complete refund.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We support all major international credit/debit networks including Visa, Mastercard, American Express, and Discover. Enterprise-grade recruiters also have options to establish monthly or annual invoicing arrangements via bank wire transfers.'
        },
        {
            question: 'What happens if I decide to switch plans mid-month?',
            answer: 'If you upgrade your plan tier mid-cycle, the transition occurs immediately, and your remaining days on the old tier are applied as a pro-rated credit toward your updated invoice. Downgrades take effect starting with your subsequent billing date.'
        }
    ];

    const activePlans = billingTarget === 'seeker' ? seekerPlans : recruiterPlans;

    return (
        <div className="w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">

                {/* Header Title Typography */}
                <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center max-w-3xl mx-auto mb-12"
                >
                    <motion.span 
                        variants={fadeInUp}
                        className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500"
                    >
                        Transparent Pricing
                    </motion.span>
                    <motion.h1 
                        variants={fadeInUp}
                        className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-2 tracking-tight"
                    >
                        Flexible plans tailored to your goals
                    </motion.h1>
                    <motion.p 
                        variants={fadeInUp}
                        className="text-zinc-600 dark:text-zinc-400 mt-3 text-sm sm:text-base leading-relaxed"
                    >
                        Whether you are an ambitious job seeker hunting for your next milestone or an expanding operation tracking down pristine talent, we have got you covered.
                    </motion.p>
                </motion.div>

                {/* Switch Segment Control Toggle Grid Wrapper */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex justify-center mb-16"
                >
                    <div className="relative p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center gap-1 shadow-md">
                        <button
                            onClick={() => setBillingTarget('seeker')}
                            className={`relative z-10 flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                                billingTarget === 'seeker'
                                    ? 'text-white'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                        >
                            {billingTarget === 'seeker' && (
                                <motion.div
                                    layoutId="activePlanTab"
                                    className="absolute inset-0 bg-zinc-900 dark:bg-zinc-800 rounded-lg border border-zinc-800 dark:border-zinc-700/50 -z-10 shadow-md"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <Person className="w-4 h-4" />
                            For Job Seekers
                        </button>
                        <button
                            onClick={() => setBillingTarget('recruiter')}
                            className={`relative z-10 flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                                billingTarget === 'recruiter'
                                    ? 'text-white'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                            }`}
                        >
                            {billingTarget === 'recruiter' && (
                                <motion.div
                                    layoutId="activePlanTab"
                                    className="absolute inset-0 bg-zinc-900 dark:bg-zinc-800 rounded-lg border border-zinc-800 dark:border-zinc-700/50 -z-10 shadow-md"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                            <Briefcase className="w-4 h-4" />
                            For Recruiters
                        </button>
                    </div>
                </motion.div>

                {/* 3-Tier Pricing Cards Grid Layout */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={billingTarget}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-24"
                    >
                        {activePlans.map((plan) => (
                            <motion.div
                                key={plan.id}
                                variants={fadeInUp}
                                whileHover={{ y: -8, transition: { duration: 0.2, ease: "easeOut" } }}
                                className={`relative bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-xl shadow-slate-200/80 dark:shadow-2xl dark:shadow-black/80 flex flex-col justify-between min-h-[480px] transition-all duration-300 hover:shadow-blue-500/15 ${
                                    plan.popular
                                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                }`}
                            >
                                {/* Popular Highlight Pill */}
                                {plan.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-bold text-white bg-blue-600 rounded-full uppercase tracking-wider shadow-md">
                                        Most Popular
                                    </span>
                                )}

                                {/* Plan Name & Core Header Metadata */}
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{plan.name}</h3>
                                        <div className="p-2 bg-zinc-100 dark:bg-zinc-950/60 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                                            {plan.icon}
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed min-h-[36px]">
                                        {plan.description}
                                    </p>

                                    {/* Dynamic Price Indicator Text Block */}
                                    <div className="my-6 flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{plan.price}</span>
                                        <span className="text-xs text-zinc-500 font-medium">{plan.period}</span>
                                    </div>

                                    <hr className="border-zinc-200 dark:border-zinc-800/80 mb-6" />

                                    {/* Interactive Checkbox Checklist Array Mapping */}
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                                                <div className="w-4 h-4 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <span className="leading-normal font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Plan Action CTA Callout Anchor Point */}
                                <div className="mt-8">
                                    {plan.name === 'Free' ? (
                                        <Link
                                            href="/dashboard/seeker"
                                            className="block w-full text-center text-sm font-semibold px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition text-white shadow-md shadow-emerald-600/20"
                                        >
                                            Get Started Free
                                        </Link>
                                    ) : plan.name === 'Enterprise' ? (
                                        <a
                                            href="mailto:sales@yourcompany.com?subject=Enterprise%20Plan%20Inquiry"
                                            className="block w-full text-center text-sm font-semibold px-6 py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white transition"
                                        >
                                            Contact Sales
                                        </a>
                                    ) : (
                                        <form action="/api/checkout_sessions" method="POST">
                                            <input type="hidden" name="plan_id" value={plan.id} />
                                            <button
                                                type="submit"
                                                className={`block w-full text-center text-sm font-semibold px-6 py-3.5 rounded-2xl transition-all cursor-pointer ${
                                                    plan.popular
                                                        ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 text-white'
                                                        : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white'
                                                }`}
                                            >
                                                {plan.cta}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* FAQ Accordion Section Layout Wrapper */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="max-w-3xl mx-auto border-t border-zinc-200 dark:border-zinc-800 pt-16"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 mb-3 shadow-sm">
                            <CircleQuestion className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">Frequently Asked Questions</h2>
                        <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">Have concerns regarding billing pipelines? Find instant clarity below.</p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-colors duration-200 shadow-sm"
                                >
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full flex items-center justify-between text-left p-4 gap-4 text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition cursor-pointer"
                                    >
                                        <span className="text-sm font-semibold">{faq.question}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                                                }`}
                                        />
                                    </button>

                                    {/* Collapsible Accordion Element View Body */}
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                                className="overflow-hidden border-t border-zinc-200 dark:border-zinc-800/60"
                                            >
                                                <div className="p-4 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default PricingPage;