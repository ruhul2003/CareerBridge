"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/Components/ThemeToggle";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Sparkles,
  Home,
  Building2,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Browse Jobs", href: "/jobs", icon: Briefcase },
    { label: "Companies", href: "/companies", icon: Building2 },
    { label: "Pricing", href: "/plans", icon: Sparkles },
  ];

  const dashboardLinks = {
    seeker: "/dashboard/seeker",
    recruiter: "/dashboard/recruiter",
  };

  if (user?.email) {
    navLinks.push({
      label: "Dashboard",
      href: dashboardLinks[user?.role] || "/dashboard/seeker",
      icon: LayoutDashboard,
    });
  }

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="sticky top-4 sm:top-5 z-50 max-w-7xl mx-auto px-4 sm:px-6 my-4 sm:my-6">
      <div className="relative bg-white/80 dark:bg-[#0d1322]/85 backdrop-blur-xl border border-zinc-200/80 dark:border-slate-800/80 rounded-full px-6 sm:px-7 py-3.5 sm:py-4 shadow-xl shadow-indigo-500/5 dark:shadow-cyan-500/5 transition-all duration-300 flex items-center justify-between min-h-[64px]">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-sm group-hover:shadow-indigo-500/25 transition-all duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10.5px] flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-cyan-400 group-hover:rotate-6 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5 text-2xl font-black tracking-tight leading-none">
              <span className="text-cyan-500 dark:text-cyan-400">Career</span>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Bridge
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-zinc-100/60 dark:bg-slate-900/60 p-1.5 rounded-full border border-zinc-200/50 dark:border-slate-800/50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-4.5 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                  active
                    ? "text-indigo-600 dark:text-cyan-400"
                    : "text-zinc-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-slate-200"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-zinc-200/80 dark:border-slate-700/60 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-cyan-400" : "text-zinc-400 dark:text-slate-500"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section Actions */}
        <div className="hidden sm:flex items-center gap-3.5">
          <ThemeToggle className="rounded-full w-9 h-9 !p-2" />

          <div className="h-5 w-[1px] bg-zinc-200 dark:bg-slate-800" />

          {/* Session controls */}
          {isPending ? (
            <div className="w-28 h-9 bg-zinc-200 dark:bg-slate-800 animate-pulse rounded-full" />
          ) : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 pr-2.5 rounded-full bg-zinc-100/80 dark:bg-slate-800/80 hover:bg-zinc-200/80 dark:hover:bg-slate-700/80 border border-zinc-200/70 dark:border-slate-700/60 transition-all duration-200 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {userInitial}
                </div>
                <span className="text-xs font-semibold text-zinc-700 dark:text-slate-200 max-w-[100px] truncate">
                  {user?.name || "Account"}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-slate-800/80 rounded-2xl p-2 shadow-2xl z-50"
                  >
                    <div className="px-3 py-2.5 mb-1 bg-zinc-50 dark:bg-slate-800/50 rounded-xl border border-zinc-100 dark:border-slate-800/60">
                      <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">Signed in as</p>
                      <p className="text-xs font-bold text-zinc-800 dark:text-slate-100 truncate">{user?.name || "User"}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-slate-400 truncate">{user?.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-cyan-400 border border-indigo-200 dark:border-cyan-800/50 capitalize">
                        <ShieldCheck className="w-3 h-3" />
                        {user?.role || "Seeker"}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href={dashboardLinks[user?.role] || "/dashboard/seeker"}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-500 dark:text-cyan-400" />
                        Dashboard
                      </Link>
                    </div>

                    <div className="my-1 border-t border-zinc-100 dark:border-slate-800" />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 px-3.5 py-2 rounded-full transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="group relative flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Action Bar */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle className="rounded-full w-8 h-8 !p-1.5" />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full bg-zinc-100 dark:bg-slate-800 text-zinc-700 dark:text-slate-200 hover:bg-zinc-200 dark:hover:bg-slate-700 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden mt-2 bg-white/95 dark:bg-[#0d1322]/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-slate-800/80 rounded-3xl p-4 shadow-2xl space-y-3 z-50"
          >
            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      active
                        ? "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 border border-indigo-100 dark:border-slate-700/60"
                        : "text-zinc-600 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-indigo-600 dark:text-cyan-400" : "text-zinc-400"}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Session Section */}
            <div className="border-t border-zinc-100 dark:border-slate-800 pt-3">
              {isPending ? (
                <div className="w-full h-10 bg-zinc-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
              ) : session ? (
                <div className="space-y-2">
                  <div className="px-4 py-2.5 bg-zinc-50 dark:bg-slate-800/50 rounded-2xl border border-zinc-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-slate-100">{user?.name}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400 capitalize">
                      {user?.role || "Seeker"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-2xl hover:bg-rose-100 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center py-2.5 text-xs font-semibold text-zinc-700 dark:text-slate-200 hover:bg-zinc-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 rounded-2xl shadow-md shadow-indigo-500/20"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
