"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Search, MapPin, Sparkles, Briefcase, Globe } from "lucide-react";

const slides = [
  {
    id: 1,
    badgeIcon: <Briefcase className="w-4 h-4 text-primary dark:text-primary-400" />,
    badgeText: "50,000+ Curated Open Roles",
    title: "Find Your Dream Career Faster",
    description:
      "CareerBridge connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role.",
    glowColor: "bg-primary-500/20 dark:bg-primary-600/25",
    buttonBg: "bg-primary hover:bg-primary-700 text-white shadow-primary/25",
    activeDot: "bg-primary dark:bg-primary-400",
  },
  {
    id: 2,
    badgeIcon: <Globe className="w-4 h-4 text-secondary dark:text-secondary-400" />,
    badgeText: "Global Tech Companies Hiring",
    title: "Connect With Industry Leaders",
    description:
      "Work remotely or hybrid with top tech enterprises and innovative startups around the world.",
    glowColor: "bg-secondary-500/20 dark:bg-secondary-600/25",
    buttonBg: "bg-secondary hover:bg-secondary-600 text-white shadow-secondary/25",
    activeDot: "bg-secondary dark:bg-secondary-400",
  },
  {
    id: 3,
    badgeIcon: <Sparkles className="w-4 h-4 text-primary dark:text-secondary-400" />,
    badgeText: "Smart Skill Matching Engine",
    title: "Accelerate Your Career Growth",
    description:
      "Leverage real-time salary insights and AI-driven job recommendations to secure high-impact roles.",
    glowColor: "bg-gradient-to-r from-primary-500/20 to-secondary-500/20",
    buttonBg: "bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white shadow-primary/25",
    activeDot: "bg-primary dark:bg-secondary-400",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (locationQuery.trim()) params.set("location", locationQuery.trim());

    const queryString = params.toString();
    router.push(queryString ? `/jobs?${queryString}` : "/jobs");
  };

  const handleTrendingClick = (position) => {
    router.push(`/jobs?search=${encodeURIComponent(position)}`);
  };

  const slide = slides[currentSlide];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[92vh] sm:min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white pt-24 pb-20 px-4 overflow-hidden flex flex-col items-center justify-center select-none transition-colors duration-300"
    >
      {/* Modern Ambient Mesh Backdrop with Primary & Secondary Accents */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {/* Primary Ambient Gradient Orb (Top Left) */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-primary-500/15 dark:bg-primary-600/20 blur-[130px] rounded-full" />

        {/* Secondary Ambient Gradient Orb (Bottom Right) */}
        <div className="absolute -bottom-32 -right-32 w-[550px] h-[550px] bg-secondary-500/15 dark:bg-secondary-600/20 blur-[130px] rounded-full" />

        {/* Center Dynamic Accent Orb responsive to slide */}
        <motion.div
          key={`ambient-glow-${slide.id}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[500px] ${slide.glowColor} blur-[150px] rounded-full`}
        />

        {/* Precision Geometric Dot Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(79,70,229,0.12)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(6,182,212,0.10)_1px,transparent_1px)] [background-size:28px_28px] opacity-70" />

        {/* Top/Bottom Seamless Fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white dark:from-black/80 dark:via-transparent dark:to-black" />
      </div>

      {/* Main Hero Content */}
      <div className="relative max-w-4xl mx-auto w-full z-20 flex flex-col items-center text-center">
        {/* Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${slide.id}`}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 bg-white/95 dark:bg-zinc-950/85 backdrop-blur-xl border border-primary-200/80 dark:border-primary-900/60 rounded-full px-4.5 py-2 mb-8 shadow-md shadow-primary-500/10 dark:shadow-2xl dark:shadow-black/60 hover:shadow-lg hover:shadow-secondary-500/15 hover:border-secondary-400/60 dark:hover:border-secondary-500/50 transition-all duration-300"
          >
            {slide.badgeIcon}
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <p className="text-xs font-bold tracking-[0.12em] text-slate-800 dark:text-zinc-200 uppercase">
              {slide.badgeText}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Main Heading */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${slide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-6 max-w-3xl leading-[1.12] drop-shadow-sm dark:drop-shadow-lg"
          >
            {slide.title}
          </motion.h1>
        </AnimatePresence>

        {/* Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`desc-${slide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-800 dark:text-zinc-300 text-base sm:text-lg font-medium max-w-2xl leading-relaxed mb-10 drop-shadow-sm"
          >
            {slide.description}
          </motion.p>
        </AnimatePresence>

        {/* Search Bar Container Form */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl bg-white dark:bg-zinc-950/90 backdrop-blur-2xl border border-slate-200/90 dark:border-zinc-800/90 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center gap-2 shadow-2xl shadow-slate-300/70 dark:shadow-2xl dark:shadow-black/90 hover:shadow-primary/10 hover:border-primary-300/60 dark:hover:border-zinc-700 transition-all duration-300 group focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/20"
        >
          <div className="flex items-center gap-3 px-3 w-full py-2.5 sm:py-0">
            <Search className="w-5 h-5 text-slate-400 dark:text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-secondary-400 shrink-0 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Job title, skill or company"
              className="bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm w-full focus:outline-none font-medium"
            />
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-slate-200 dark:bg-zinc-800" />

          <div className="flex items-center gap-3 px-3 w-full py-2.5 sm:py-0">
            <MapPin className="w-5 h-5 text-slate-400 dark:text-zinc-400 group-focus-within:text-primary dark:group-focus-within:text-secondary-400 shrink-0 transition-colors" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Location (e.g. Dhaka, Remote)"
              className="bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm w-full focus:outline-none font-medium"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`${slide.buttonBg} text-white p-3.5 sm:p-4 rounded-xl transition-all shrink-0 w-full sm:w-auto flex items-center justify-center cursor-pointer shadow-lg`}
          >
            <Search className="w-5 h-5" />
          </motion.button>
        </motion.form>

        {/* Trending Positions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mt-8 text-sm"
        >
          <span className="text-slate-500 dark:text-zinc-400 font-semibold text-xs tracking-wider uppercase">
            Trending Positions:
          </span>

          {["Product Designer", "AI Engineer", "DevOps Engineer", "Frontend Specialist"].map(
            (position, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleTrendingClick(position)}
                whileHover={{
                  y: -2,
                }}
                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200/90 dark:border-zinc-800/90 text-slate-700 dark:text-zinc-300 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:border-primary-400/60 dark:hover:border-secondary-500/50 hover:text-primary dark:hover:text-secondary-300 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-md shadow-slate-200/60 dark:shadow-lg dark:shadow-black/50 hover:shadow-lg hover:shadow-primary-500/15"
              >
                {position}
              </motion.button>
            )
          )}
        </motion.div>

        {/* Navigation Slider Controls */}
        <div className="flex items-center gap-4 mt-12">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="p-3 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800/90 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-lg shadow-slate-200/80 dark:shadow-xl dark:shadow-black/70 hover:shadow-xl hover:shadow-indigo-500/15 backdrop-blur-md active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slide Dots with Animated Progress */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/90 dark:bg-zinc-950/80 border border-slate-200/90 dark:border-zinc-800/80 rounded-full backdrop-blur-md shadow-lg shadow-slate-200/80 dark:shadow-xl dark:shadow-black/70">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`relative h-2 rounded-full transition-all duration-500 cursor-pointer overflow-hidden ${
                  currentSlide === idx ? "w-8 bg-slate-900 dark:bg-white" : "w-2 bg-slate-300 dark:bg-zinc-600 hover:bg-slate-400 dark:hover:bg-zinc-400"
                }`}
              >
                {currentSlide === idx && !isPaused && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className={`absolute inset-0 ${slide.activeDot}`}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="p-3 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800/90 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-lg shadow-slate-200/80 dark:shadow-xl dark:shadow-black/70 hover:shadow-xl hover:shadow-indigo-500/15 backdrop-blur-md active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
