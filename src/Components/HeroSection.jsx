"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Search, MapPin, Sparkles, Briefcase, Globe } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/banner-1.png",
    badgeIcon: <Briefcase className="w-4 h-4 text-indigo-400" />,
    badgeText: "50,000+ New Jobs This Month",
    title: "Find Your Dream Job Today",
    description:
      "CareerBridge connects top talent with world-class companies. Browse thousands of curated opportunities and land your next role — faster.",
    glowColor: "bg-indigo-600/20",
    buttonBg: "bg-indigo-600 hover:bg-indigo-500",
  },
  {
    id: 2,
    image: "/banner-2.png",
    badgeIcon: <Globe className="w-4 h-4 text-emerald-400" />,
    badgeText: "Global Tech Companies Hiring",
    title: "Connect With Industry Leaders",
    description:
      "Work remotely or hybrid with top tech enterprises and innovative startups around the world.",
    glowColor: "bg-emerald-600/20",
    buttonBg: "bg-emerald-600 hover:bg-emerald-500",
  },
  {
    id: 3,
    image: "/banner-3.png",
    badgeIcon: <Sparkles className="w-4 h-4 text-amber-400" />,
    badgeText: "Smart Skill Matching Engine",
    title: "Accelerate Your Career Growth",
    description:
      "Leverage real-time salary insights and AI-driven job recommendations to secure high-impact roles.",
    glowColor: "bg-amber-600/20",
    buttonBg: "bg-amber-600 hover:bg-amber-500",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  const slide = slides[currentSlide];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full min-h-[92vh] sm:min-h-screen bg-black text-white pt-24 pb-20 px-4 overflow-hidden flex flex-col items-center justify-center select-none"
    >
      {/* Background Image Slider with Motion Crossfade */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </AnimatePresence>

        {/* Multi-layered Vignette & Dark Gradients for Text Readability */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-10" />

        {/* Ambient Glow tied to current slide accent */}
        <motion.div
          key={`glow-${slide.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.8, scale: 1 }}
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
            className="inline-flex items-center gap-2 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 rounded-full px-4 py-1.5 mb-8 shadow-2xl"
          >
            {slide.badgeIcon}
            <p className="text-xs font-semibold tracking-[0.12em] text-zinc-300 uppercase">
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
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-3xl leading-[1.12] drop-shadow-lg"
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
            className="text-zinc-300 text-base sm:text-lg font-light max-w-2xl leading-relaxed mb-10 drop-shadow"
          >
            {slide.description}
          </motion.p>
        </AnimatePresence>

        {/* Search Bar Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-center gap-3 px-3 w-full py-2.5 sm:py-0">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="Job title, skill or company"
              className="bg-transparent text-white placeholder-zinc-500 text-sm w-full focus:outline-none"
            />
          </div>

          <div className="hidden sm:block h-6 w-[1px] bg-zinc-800" />

          <div className="flex items-center gap-3 px-3 w-full py-2.5 sm:py-0">
            <MapPin className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="Location or Remote"
              className="bg-transparent text-white placeholder-zinc-500 text-sm w-full focus:outline-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`${slide.buttonBg} text-white p-3 sm:p-3.5 rounded-xl transition-all shrink-0 w-full sm:w-auto flex items-center justify-center cursor-pointer shadow-lg`}
          >
            <Search className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Trending Positions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-8 text-sm"
        >
          <span className="text-zinc-400 font-medium text-xs tracking-wider uppercase">
            Trending Positions:
          </span>

          {["Product Designer", "AI Engineer", "DevOps Engineer", "Frontend Lead"].map(
            (position, index) => (
              <motion.button
                key={index}
                whileHover={{
                  y: -2,
                  backgroundColor: "rgba(39, 39, 42, 0.9)",
                  borderColor: "rgba(113, 113, 122, 0.8)",
                }}
                className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 text-zinc-300 px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
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
            className="p-2.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slide Dots with Animated Progress */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/70 border border-zinc-800/60 rounded-full backdrop-blur-md">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`relative h-2 rounded-full transition-all duration-500 cursor-pointer overflow-hidden ${
                  currentSlide === idx ? "w-8 bg-white" : "w-2 bg-zinc-600 hover:bg-zinc-400"
                }`}
              >
                {currentSlide === idx && !isPaused && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="absolute inset-0 bg-indigo-400"
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="p-2.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer shadow-lg backdrop-blur-md active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}