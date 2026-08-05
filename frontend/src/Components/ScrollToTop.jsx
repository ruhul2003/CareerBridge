"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setIsVisible(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-20 right-6 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            title="Scroll to top"
            className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-slate-800/80 shadow-xl hover:shadow-indigo-500/20 dark:hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer"
          >
            {/* SVG Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
              {/* Background Track */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-zinc-200/60 dark:stroke-slate-800/80"
                strokeWidth="3"
                fill="none"
              />
              {/* Progress Ring */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-indigo-600 dark:stroke-cyan-400"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: "stroke-dashoffset 100ms linear",
                }}
              />
            </svg>

            {/* Up Arrow Icon */}
            <ArrowUp className="w-4 h-4 text-zinc-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 group-hover:-translate-y-0.5 transition-all duration-200 z-10" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
