"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-zinc-800/50 border border-zinc-700/50 animate-pulse ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative p-2 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-center ${
        isDark
          ? "bg-zinc-900/90 border-zinc-800 text-secondary-400 hover:bg-zinc-800 hover:text-secondary-300 hover:border-secondary-500/40"
          : "bg-zinc-100 border-zinc-300 text-primary hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300"
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {isDark ? <Sun className="w-4 h-4 fill-secondary-400/20" /> : <Moon className="w-4 h-4 fill-primary/20" />}
      </motion.div>
    </motion.button>
  );
}
