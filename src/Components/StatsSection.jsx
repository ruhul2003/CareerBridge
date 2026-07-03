"use client";

import React from "react";
import { motion } from "motion/react";

export default function StatsSection() {
  const stats = [
    {
      id: 1,
      number: "50K",
      label: "Active Jobs",
      icon: (
        <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .596-.237 1.168-.659 1.591a2.25 2.25 0 01-1.591.659H6a2.25 2.25 0 01-1.591-.659A2.25 2.25 0 013.75 18.4v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25m16.5 0V9.45c0-.596-.237-1.168-.659-1.591A2.25 2.25 0 0016.5 7.2h-1.2v-.3a2.25 2.25 0 00-2.25-2.25h-2.1a2.25 2.25 0 00-2.25 2.25v.3H7.5c-.596 0-1.168.237-1.591.659a2.25 2.25 0 00-.659 1.591v4.7m10.5-6.9v.3m0 0h-2.1m2.1 0h1.2M9 7.2h.3" />
        </svg>
      ),
    },
    {
      id: 2,
      number: "12K",
      label: "Companies",
      icon: (
        <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      ),
    },
    {
      id: 3,
      number: "2M",
      label: "Job Seekers",
      icon: (
        <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 4,
      number: "97%",
      label: "Satisfaction Rate",
      icon: (
        <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.151-.39 1.137-.39 1.287 0l2.18 4.417 4.872.708c.423.061.593.58.285.88l-3.522 3.434.83 4.846a.75.75 0 01-1.088.791L12 16.347l-4.352 2.288a.75.75 0 01-1.088-.79l.83-4.847-3.522-3.434a.75.75 0 01.285-.88l4.872-.708 2.18-4.417z" />
        </svg>
      ),
    },
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
    <section className="relative w-full bg-black text-white py-28 px-6 overflow-hidden min-h-[700px] flex flex-col justify-end">
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-80 pointer-events-none"
        style={{ backgroundImage: "url('/globe.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />

      <div className="relative max-w-6xl mx-auto w-full z-10 flex flex-col items-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="text-center lg:text-5xl md:text-4xl text-3xl font-light tracking-tight max-w-3xl leading-[1.3] text-zinc-300 mb-20 select-none"
        >
          Assisting over <span className="font-semibold text-white">15,000 job seekers</span> <br />
          find their dream positions.
        </motion.h2>

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
                borderColor: "rgba(63, 63, 70, 0.6)",
                backgroundColor: "rgba(15, 15, 18, 0.95)"
              }}
              className="bg-[#0c0c0e]/90 backdrop-blur-md border border-zinc-900 rounded-2xl p-8 flex flex-col justify-between min-h-[210px] shadow-2xl transition-colors duration-300"
            >
              <div className="flex items-center">
                {stat.icon}
              </div>
              
              <div className="mt-8">
                <div className="text-5xl font-bold tracking-tight text-white mb-2.5">
                  {stat.number}
                </div>
                <div className="text-sm text-zinc-400 font-medium tracking-wide">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}