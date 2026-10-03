'use client';

import React, { useState } from 'react';
import { motion } from "motion/react"; 
import {
    Magnifier,
    ChartLine,
    ChartColumn,
    Bookmark,
    LayoutHeaderCursor,
    FileText,
    Target,
    ArrowUpRight
} from '@gravity-ui/icons';

const features = [
    {
        icon: <Magnifier className="w-6 h-6" />,
        title: "Smart Search",
        desc: "Find your ideal job with advanced filters.",
        category: "seeker"
    },
    {
        icon: <ChartLine className="w-6 h-6" />,
        title: "Salary Insights",
        desc: "Get real salary data to negotiate confidently.",
        category: "seeker"
    },
    {
        icon: <ChartColumn className="w-6 h-6" />,
        title: "Top Companies",
        desc: "Apply to vetted companies that are hiring.",
        category: "recruiter"
    },
    {
        icon: <Bookmark className="w-6 h-6" />,
        title: "Saved Jobs",
        desc: "Manage apps & favorites on your dashboard.",
        category: "seeker"
    },
    {
        icon: <LayoutHeaderCursor className="w-6 h-6" />,
        title: "One-Click Apply",
        desc: "Simplify your job applications for an easier process.",
        category: "seeker"
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: "Resume Builder",
        desc: "Create professional resumes with modern templates.",
        category: "seeker"
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: "Skill-Based Matching",
        desc: "Discover jobs that match your skills and experience.",
        category: "recruiter"
    },
    {
        icon: <ArrowUpRight className="w-6 h-6" />,
        title: "Career Growth Resources",
        desc: "Boost your career with quick interview tips.",
        category: "recruiter"
    }
];

const fadeInUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            delay: delay,
            ease: [0.16, 1, 0.3, 1] // Premium cubic-bezier from your Hero
        }
    }
});

export default function FeaturesSection() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const filterOptions = [
        { id: "all", label: "All Capabilities" },
        { id: "seeker", label: "For Job Seekers" },
        { id: "recruiter", label: "For Recruiters" }
    ];

    return (
        <section className="bg-transparent py-24 px-6 text-zinc-900 dark:text-white overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div 
                        variants={fadeInUp(0)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200/60 dark:border-primary-900/50 text-primary dark:text-secondary-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        POWERFUL PLATFORM CAPABILITIES
                    </motion.div>

                    <motion.h2 
                        variants={fadeInUp(0.1)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white"
                    >
                        Everything you need <br /> to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">succeed</span>
                    </motion.h2>

                    {/* Category Filter Pills */}
                    <div className="mt-8 flex items-center justify-center gap-2 select-none">
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSelectedCategory(opt.id)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                                    selectedCategory === opt.id
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "bg-slate-200/60 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Features Grid with Premium Animation */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => {
                        const isDimmed = selectedCategory !== "all" && feature.category !== selectedCategory;
                        return (
                        <motion.div
                            key={index}
                            variants={fadeInUp(0.1 + index * 0.05)}
                            animate={{
                                opacity: isDimmed ? 0.35 : 1,
                                scale: isDimmed ? 0.96 : 1,
                            }}
                            whileHover={{ 
                                y: -12, 
                                scale: 1.03,
                                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                            }}
                            className={`relative overflow-hidden group bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-3xl p-8 transition-all duration-300 shadow-xl shadow-slate-200/70 dark:shadow-2xl dark:shadow-black/80 hover:shadow-2xl ${
                                index % 2 === 0
                                    ? "hover:border-primary-400/60 dark:hover:border-primary-500/50 hover:shadow-primary-500/10"
                                    : "hover:border-secondary-400/60 dark:hover:border-secondary-500/50 hover:shadow-secondary-500/10"
                            }`}
                        >
                            {/* Top Highlight Shimmer */}
                            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-secondary-400/0 group-hover:via-secondary-400/70 to-transparent transition-all duration-500 pointer-events-none" />
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                                    index % 2 === 0
                                        ? "bg-primary-50 dark:bg-primary-950/40 text-primary dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50"
                                        : "bg-secondary-50 dark:bg-secondary-950/40 text-secondary dark:text-secondary-400 group-hover:bg-secondary-100 dark:group-hover:bg-secondary-900/50"
                                }`}
                            >
                                <div className="transition-transform group-hover:scale-110 duration-200">
                                    {feature.icon}
                                </div>
                            </motion.div>
                            
                            <h3 className={`text-xl font-semibold mb-3 text-zinc-900 dark:text-white transition-colors ${
                                index % 2 === 0 ? "group-hover:text-primary dark:group-hover:text-primary-300" : "group-hover:text-secondary-600 dark:group-hover:text-secondary-300"
                            }`}>
                                {feature.title}
                            </h3>
                            
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                                {feature.desc}
                            </p>
                        </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}