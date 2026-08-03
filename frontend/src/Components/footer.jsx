import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-100 dark:bg-black text-zinc-600 dark:text-zinc-400 text-sm font-light pt-16 pb-8 border-t border-zinc-200 dark:border-zinc-900/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
          
          {/* Brand Info (Takes 5 columns on desktop) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-2xl tracking-tight select-none">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-sm overflow-hidden">
                <img
                  src="/logo.png"
                  alt="CareerBridge Logo"
                  className="w-full h-full object-cover rounded-[7px]"
                />
              </div>
              <span className="text-[#38bdf8]">Career</span>
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-500 bg-clip-text text-transparent">
                Bridge
              </span>
            </Link>
            <p className="max-w-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              The AI-native career platform. Built for people who take their work seriously.
            </p>
          </div>

          {/* Links Sections (Takes 7 columns on desktop) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Product Column */}
            <div className="flex flex-col gap-3.5">
              <h3 className="text-indigo-600 dark:text-indigo-400 font-medium text-base tracking-wide mb-1">Product</h3>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Job discovery</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Worker AI</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Companies</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Salary data</Link>
            </div>

            {/* Navigations Column */}
            <div className="flex flex-col gap-3.5">
              <h3 className="text-indigo-600 dark:text-indigo-400 font-medium text-base tracking-wide mb-1">Navigations</h3>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Help center</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Career library</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Contact</Link>
            </div>

            {/* Resources Column */}
            <div className="flex flex-col gap-3.5 col-span-2 sm:col-span-1">
              <h3 className="text-indigo-600 dark:text-indigo-400 font-medium text-base tracking-wide mb-1">Resources</h3>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Brand Guideline</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Newsroom</Link>
            </div>

          </div>
        </div>

        {/* Bottom Section (Socials & Copyright) */}
        <div className="border-t border-zinc-200 dark:border-zinc-900/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-900/50 hover:bg-zinc-300 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            {/* Pinterest */}
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.27 2.68 7.91 6.46 9.33-.09-.8-.17-2.03.03-2.91.19-.82 1.24-5.27 1.24-5.27s-.32-.63-.32-1.57c0-1.47.85-2.57 1.91-2.57.9 0 1.34.68 1.34 1.49 0 .91-.58 2.27-.88 3.53-.25 1.05.52 1.91 1.56 1.91 1.87 0 3.31-1.97 3.31-4.81 0-2.51-1.81-4.27-4.38-4.27-2.99 0-4.74 2.24-4.74 4.55 0 .9.35 1.87.78 2.39.09.1.1.19.07.31-.08.33-.25.99-.28 1.13-.04.18-.14.22-.33.13-1.27-.59-2.07-2.44-2.07-3.93 0-3.2 2.33-6.14 6.71-6.14 3.52 0 6.26 2.51 6.26 5.87 0 3.5-2.2 6.32-5.26 6.32-1.03 0-2-.53-2.33-1.17l-.63 2.42c-.23.88-.85 1.98-1.27 2.66C10.05 21.82 11 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-900/50 hover:bg-zinc-300 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>

          {/* Copyright Text */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-zinc-600 dark:text-zinc-400 font-normal">
            <span>Copyright 2026 — Hire Loop</span>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-800" />
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Terms & Policy - Privacy Guideline</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}