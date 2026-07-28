'use client';
import React from 'react';
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
        desc: "Find your ideal job with advanced filters."
    },
    {
        icon: <ChartLine className="w-6 h-6" />,
        title: "Salary Insights",
        desc: "Get real salary data to negotiate confidently."
    },
    {
        icon: <ChartColumn className="w-6 h-6" />,
        title: "Top Companies",
        desc: "Apply to vetted companies that are hiring."
    },
    {
        icon: <Bookmark className="w-6 h-6" />,
        title: "Saved Jobs",
        desc: "Manage apps & favorites on your dashboard."
    },
    {
        icon: <LayoutHeaderCursor className="w-6 h-6" />,
        title: "One-Click Apply",
        desc: "Simplify your job applications for an easier process."
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: "Resume Builder",
        desc: "Create professional resumes with modern templates."
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: "Skill-Based Matching",
        desc: "Discover jobs that match your skills and experience."
    },
    {
        icon: <ArrowUpRight className="w-6 h-6" />,
        title: "Career Growth Resources",
        desc: "Boost your career with quick interview tips."
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
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium tracking-widest mb-3"
                    >
                        <div className="w-2 h-px bg-blue-500"></div>
                        FEATURES JOB
                        <div className="w-2 h-px bg-blue-500"></div>
                    </motion.div>

                    <motion.h2 
                        variants={fadeInUp(0.1)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white"
                    >
                        Everything you need <br /> to succeed
                    </motion.h2>
                </div>

                {/* Features Grid with Premium Animation */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp(0.1 + index * 0.05)}
                            whileHover={{ 
                                y: -12, 
                                scale: 1.03,
                                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                            }}
                            className="group bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 hover:border-blue-400/60 dark:hover:border-blue-600/60 rounded-3xl p-8 transition-all duration-300 shadow-xl shadow-slate-200/70 dark:shadow-2xl dark:shadow-black/80 hover:shadow-2xl hover:shadow-blue-500/15"
                        >
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:bg-blue-600/10 transition-colors"
                            >
                                <div className="text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-colors">
                                    {feature.icon}
                                </div>
                            </motion.div>
                            
                            <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white">
                                {feature.title}
                            </h3>
                            
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}