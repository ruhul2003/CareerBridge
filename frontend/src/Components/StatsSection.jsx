"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";

function AnimatedCounter({ value, suffix = "", duration = 1.6 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easedProgress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const stats = [
    {
      id: 1,
      number: "50K+",
      rawNumber: 50,
      suffix: "K+",
      label: "Active Jobs",
      growth: "+34% YoY",
      description: "Verified roles across tech, product & design",
      category: "talent",
      accent: "text-primary dark:text-primary-400",
      bgAccent: "bg-primary-50 dark:bg-primary-950/40 border-primary-200/60 dark:border-primary-900/40",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .596-.237 1.168-.659 1.591a2.25 2.25 0 01-1.591.659H6a2.25 2.25 0 01-1.591-.659A2.25 2.25 0 013.75 18.4v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25m16.5 0V9.45c0-.596-.237-1.168-.659-1.591A2.25 2.25 0 0016.5 7.2h-1.2v-.3a2.25 2.25 0 00-2.25-2.25h-2.1a2.25 2.25 0 00-2.25 2.25v.3H7.5c-.596 0-1.168.237-1.591.659a2.25 2.25 0 00-.659 1.591v4.7m10.5-6.9v.3m0 0h-2.1m2.1 0h1.2M9 7.2h.3" />
        </svg>
      ),
    },
    {
      id: 2,
      number: "12K+",
      rawNumber: 12,
      suffix: "K+",
      label: "Vetted Companies",
      growth: "+18% MoM",
      description: "Vetted startups & Fortune 500 organizations",
      category: "enterprise",
      accent: "text-secondary dark:text-secondary-400",
      bgAccent: "bg-secondary-50 dark:bg-secondary-950/40 border-secondary-200/60 dark:border-secondary-900/40",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
    },
    {
      id: 3,
      number: "2M+",
      rawNumber: 2,
      suffix: "M+",
      label: "Active Candidates",
      growth: "+45% YoY",
      description: "Pre-screened professionals actively looking",
      category: "talent",
      accent: "text-primary dark:text-primary-400",
      bgAccent: "bg-primary-50 dark:bg-primary-950/40 border-primary-200/60 dark:border-primary-900/40",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 4,
      number: "98%",
      rawNumber: 98,
      suffix: "%",
      label: "Satisfaction Rate",
      growth: "4.9★ Rating",
      description: "Rated highly by recruiters and candidates",
      category: "enterprise",
      accent: "text-secondary dark:text-secondary-400",
      bgAccent: "bg-secondary-50 dark:bg-secondary-950/40 border-secondary-200/60 dark:border-secondary-900/40",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.151-.39 1.137-.39 1.287 0l2.18 4.417 4.872.708c.423.061.593.58.285.88l-3.522 3.434.83 4.846a.75.75 0 01-1.088.791L12 16.347l-4.352 2.288a.75.75 0 01-1.088-.79l.83-4.847-3.522-3.434a.75.75 0 01.285-.88l4.872-.708 2.18-4.417z" />
        </svg>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", label: "All Benchmarks" },
    { id: "talent", label: "Talent & Roles" },
    { id: "enterprise", label: "Enterprise Scale" },
  ];

  const globalHubs = [
    { id: "na", name: "San Francisco", region: "North America", x: "18%", y: "38%", candidates: "420K+", delay: 0 },
    { id: "eu", name: "London", region: "Europe", x: "47%", y: "30%", candidates: "580K+", delay: 0.3 },
    { id: "sa", name: "São Paulo", region: "Latin America", x: "32%", y: "68%", candidates: "190K+", delay: 0.6 },
    { id: "bd", name: "Dhaka", region: "South Asia", x: "71%", y: "46%", candidates: "310K+", delay: 0.2 },
    { id: "ap", name: "Tokyo", region: "East Asia", x: "84%", y: "36%", candidates: "380K+", delay: 0.5 },
    { id: "au", name: "Sydney", region: "Oceania", x: "88%", y: "74%", candidates: "160K+", delay: 0.8 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        delayChildren: 0.3, 
        staggerChildren: 0.25 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  return (
    <section className="relative w-full bg-zinc-100 dark:bg-black text-zinc-900 dark:text-white py-28 px-6 overflow-hidden min-h-[700px] flex flex-col justify-end transition-colors duration-300">
      {/* Modern Ambient Mesh & Radial Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Globe Map Background Layer */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-25 dark:opacity-75 pointer-events-none transition-opacity duration-500"
          style={{ backgroundImage: "url('/globe.png')" }}
        />

        {/* Global Talent Hub Radar Pins */}
        <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none hidden sm:block">
          {globalHubs.map((hub) => (
            <div
              key={hub.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group/hub cursor-pointer"
              style={{ left: hub.x, top: hub.y }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-7 h-7 rounded-full bg-secondary-400/30 dark:bg-secondary-400/40 animate-ping" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(6,182,212,0.9)] border border-white/80 dark:border-cyan-200 group-hover/hub:scale-125 transition-transform" />
                
                {/* Floating Hub Hover Card */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/hub:opacity-100 group-hover/hub:-translate-y-1 pointer-events-none transition-all duration-200 z-30 whitespace-nowrap">
                  <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-secondary-200 dark:border-zinc-700 shadow-xl shadow-secondary-500/10 flex items-center gap-2 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span className="font-semibold text-slate-800 dark:text-zinc-100">{hub.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-400">•</span>
                    <span className="text-secondary font-bold">{hub.candidates}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Connected Flight Arcs */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block opacity-35 dark:opacity-60" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M 180 228 Q 325 120 470 180" fill="none" stroke="url(#arcGlow)" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 470 180 Q 590 200 710 276" fill="none" stroke="url(#arcGlow)" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 710 276 Q 775 240 840 216" fill="none" stroke="url(#arcGlow)" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 470 180 Q 395 300 320 408" fill="none" stroke="url(#arcGlow)" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        {/* Central Atmospheric Globe Backlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] md:w-[900px] h-[450px] bg-gradient-to-tr from-primary-600/15 via-secondary-500/20 to-primary-400/15 dark:from-primary-600/25 dark:via-secondary-500/25 dark:to-primary-400/20 blur-[130px] rounded-full pointer-events-none" />

        {/* Subtle Primary Radial Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary-500/10 dark:bg-primary-600/15 blur-[120px] rounded-full" />
        
        {/* Secondary Radial Glow */}
        <div className="absolute -bottom-20 left-1/4 w-[500px] h-[300px] bg-secondary-500/10 dark:bg-secondary-600/15 blur-[120px] rounded-full" />

        {/* Global Horizon Rim Light */}
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-secondary-400/15 dark:bg-secondary-500/20 blur-[100px] rounded-full pointer-events-none" />

        {/* Ambient Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(79,70,229,0.08)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(6,182,212,0.08)_1px,transparent_1px)] [background-size:32px_32px] opacity-60" />

        {/* Top Vignette Fade */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-zinc-100 dark:from-black to-transparent pointer-events-none" />

        {/* Bottom Horizon Feathering Mask */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-zinc-100 dark:from-black via-zinc-100/70 dark:via-black/70 to-transparent pointer-events-none" />

        {/* Smooth Blend Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/40 via-transparent to-zinc-100 dark:from-black/40 dark:via-transparent dark:to-black" />
      </div>

      <div className="relative max-w-6xl mx-auto w-full z-10 flex flex-col items-center">
        
        {/* Live Ecosystem Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800 text-xs font-semibold text-slate-700 dark:text-zinc-300 shadow-sm mb-6 select-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
          </span>
          <span className="tracking-wide uppercase text-[11px] font-bold text-slate-600 dark:text-zinc-400">Global Career Ecosystem</span>
          <span className="text-slate-300 dark:text-zinc-700">•</span>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">140+ Countries Connected</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="text-center lg:text-5xl md:text-4xl text-3xl font-light tracking-tight max-w-3xl leading-[1.3] text-zinc-700 dark:text-zinc-300 mb-20 select-none"
        >
          Empowering over <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">15,000 candidates</span> <br />
          to accelerate their career trajectory.
        </motion.h2>

        {/* Metric Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-zinc-900/90 border border-slate-300/60 dark:border-zinc-800 backdrop-blur-md mb-12 select-none"
        >
          {categories.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "text-white shadow-md shadow-primary/20"
                    : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeStatsTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              whileHover={{ 
                y: -6, 
              }}
              className="bg-white dark:bg-[#0c0c0e]/90 backdrop-blur-md border border-slate-200/90 dark:border-zinc-800/90 rounded-2xl p-8 flex flex-col justify-between min-h-[210px] shadow-xl shadow-slate-200/70 dark:shadow-2xl dark:shadow-black/80 hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-300 dark:hover:border-secondary-500/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${stat.bgAccent} ${stat.accent} group-hover:scale-105`}>
                  {stat.icon}
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                  <span>{stat.growth}</span>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-2.5 group-hover:text-primary dark:group-hover:text-secondary-300 transition-colors">
                  <AnimatedCounter value={stat.rawNumber} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-700 dark:text-zinc-300 font-semibold tracking-wide">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}