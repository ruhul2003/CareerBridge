"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Search, MapPin, Sparkles, Briefcase, Globe } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/banner-1.png",
    lightImage: "/banner-light-1.png",
    badgeIcon: <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    badgeText: "50,000+ New Jobs This Month",
    title: "Find Your Dream Job Today",
    description:
      "CareerBridge connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role — faster.",
    glowColor: "bg-indigo-500/15 dark:bg-indigo-600/20",
    buttonBg: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25",
    activeDot: "bg-indigo-600 dark:bg-indigo-400",
  },
  {
    id: 2,
    image: "/banner-2.png",
    lightImage: "/banner-light-2.png",
    badgeIcon: <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    badgeText: "Global Tech Companies Hiring",
    title: "Connect With Industry Leaders",
    description:
      "Work remotely or hybrid with top tech enterprises and innovative startups around the world.",
    glowColor: "bg-emerald-500/15 dark:bg-emerald-600/20",
    buttonBg: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25",
    activeDot: "bg-emerald-600 dark:bg-emerald-400",
  },
  {
    id: 3,
    image: "/banner-3.png",
    lightImage: "/banner-light-3.png",
    badgeIcon: <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    badgeText: "Smart Skill Matching Engine",
    title: "Accelerate Your Career Growth",
    description:
      "Leverage real-time salary insights and AI-driven job recommendations to secure high-impact roles.",
    glowColor: "bg-amber-500/15 dark:bg-amber-600/20",
    buttonBg: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25",
    activeDot: "bg-amber-600 dark:bg-amber-400",
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
      {/* Background Image Slider with Motion Crossfade & Theme Reactivity */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Dark Mode Background Image */}
          <motion.div
            key={`dark-${slide.id}`}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden dark:block absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-100 transition-opacity duration-500"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Light Mode Specific Background Image */}
          <motion.div
            key={`light-${slide.id}`}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="block dark:hidden absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-50 transition-opacity duration-500"
            style={{ backgroundImage: `url(${slide.lightImage})` }}
          />
        </AnimatePresence>

        {/* Ambient Grid Pattern for Professional Light Mode Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-60 dark:opacity-40 pointer-events-none z-10" />

        {/* Multi-layered Vignette & Adaptive Light/Dark Gradients */}
        <div className="absolute inset-0 bg-white/75 dark:bg-black/60 z-10 transition-colors duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-white/40 dark:from-black dark:via-black/75 dark:to-black/40 z-10 transition-colors duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-transparent to-white/90 dark:from-black/80 dark:via-transparent dark:to-black/80 z-10 transition-colors duration-500" />

        {/* Ambient Color Glow tied to current slide accent */}
        <motion.div
          key={`glow-${slide.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${slide.glowColor} blur-[140px] rounded-full pointer-events-none z-10`}
        />
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
            className="inline-flex items-center gap-2.5 bg-slate-100/90 dark:bg-zinc-950/80 backdrop-blur-xl border border-slate-200/90 dark:border-zinc-800/80 rounded-full px-4.5 py-2 mb-8 shadow-md shadow-slate-200/80 dark:shadow-2xl dark:shadow-black/60 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
          >
            {slide.badgeIcon}
            <p className="text-xs font-semibold tracking-[0.12em] text-slate-700 dark:text-zinc-300 uppercase">
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
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 max-w-3xl leading-[1.12] drop-shadow-sm dark:drop-shadow-lg"
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
            className="text-slate-600 dark:text-zinc-300 text-base sm:text-lg font-normal sm:font-light max-w-2xl leading-relaxed mb-10"
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
          className="w-full max-w-3xl bg-white dark:bg-zinc-950/90 backdrop-blur-2xl border border-slate-200/90 dark:border-zinc-800/90 rounded-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center gap-2 shadow-2xl shadow-slate-300/70 dark:shadow-2xl dark:shadow-black/90 hover:shadow-indigo-500/10 hover:border-slate-300/90 dark:hover:border-zinc-700 transition-all duration-300 group focus-within:border-indigo-500/60 focus-within:ring-4 focus-within:ring-indigo-500/15"
        >
          <div className="flex items-center gap-3 px-3 w-full py-2.5 sm:py-0">
            <Search className="w-5 h-5 text-slate-400 dark:text-zinc-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 shrink-0 transition-colors" />
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
            <MapPin className="w-5 h-5 text-slate-400 dark:text-zinc-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 shrink-0 transition-colors" />
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
            className={`${slide.buttonBg} text-white p-3.5 sm:p-4 rounded-xl transition-all shrink-0 w-full sm:w-auto flex items-center justify-center cursor-pointer shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40`}
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
                className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200/90 dark:border-zinc-800/90 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-md shadow-slate-200/60 dark:shadow-lg dark:shadow-black/50 hover:shadow-lg hover:shadow-indigo-500/10"
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
