"use client";

import React from "react";
import { motion } from "motion/react"; 

export default function HeroSection() {
  const fadeInUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: delay,
        ease: [0.16, 1, 0.3, 1] // স্লিক প্রিমিয়াম কিউবিক বেজিয়ার কার্ভ
      }
    }
  });

  return (
    <section className="relative w-full min-h-screen bg-black text-white pt-20 pb-32 px-4 overflow-hidden flex flex-col items-center justify-center">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" 
      />

      <div className="relative max-w-4xl mx-auto w-full z-10 flex flex-col items-center text-center">
        
        <motion.div 
          variants={fadeInUp(0)}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 bg-[#121214] border border-zinc-800/60 rounded-full px-4 py-1.5 mb-8 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
        >
          <span className="text-base">💼</span>
          <p className="text-xs font-medium tracking-[0.15em] text-zinc-400 uppercase">
            <span className="text-white font-semibold">50,000+</span> New Jobs This Month
          </p>
        </motion.div>

        <motion.h1 
          variants={fadeInUp(0.15)}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 max-w-3xl leading-[1.15]"
        >
          Find Your Dream Job Today
        </motion.h1>

        <motion.p 
          variants={fadeInUp(0.3)}
          initial="hidden"
          animate="visible"
          className="text-zinc-400 text-base sm:text-lg font-light max-w-2xl leading-relaxed mb-12"
        >
          HireLoop connects top talent with world-class companies. Browse thousands of
          curated opportunities and land your next role — faster.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl bg-[#0c0c0e]/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2 shadow-2xl"
        >
          <div className="flex items-center gap-3 px-3 w-full py-2.5 sm:py-0">
            <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Job title, skill or company"
              className="bg-transparent text-white placeholder-zinc-600 text-sm w-full focus:outline-none"
            />
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-zinc-800" />

          <div className="flex items-center gap-3 px-3 w-full py-2.5 sm:py-0">
            <svg className="w-5 h-5 text-zinc-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder="Location or Remote"
              className="bg-transparent text-white placeholder-zinc-600 text-sm w-full focus:outline-none"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#4f46e5] hover:bg-[#4338ca] text-white p-3 sm:p-3.5 rounded-xl transition-colors shrink-0 w-full sm:w-auto flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8 text-sm"
        >
          <span className="text-zinc-500 font-medium">Trending Position</span>
          
          {["Product Designer", "AI Engineering", "Dev-ops Engineer"].map((position, index) => (
            <motion.button 
              key={index}
              whileHover={{ y: -2, backgroundColor: "rgba(24, 24, 27, 0.8)", borderColor: "rgba(63, 63, 70, 1)" }}
              className="bg-zinc-900/40 border border-zinc-800/80 text-zinc-300 px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
            >
              {position}
            </motion.button>
          ))}
        </motion.div>

      </div>

      <div className="absolute bottom-4 left-1/4 w-1 h-1 bg-zinc-700 rounded-full opacity-40" />
      <div className="absolute bottom-12 right-1/3 w-1 h-1 bg-zinc-600 rounded-full opacity-30" />
    </section>
  );
}