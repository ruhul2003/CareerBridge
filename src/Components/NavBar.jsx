"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
          router.refresh();
        },
      },
    });
  };

  const navLinks = [
    {
      label: "Browse Jobs",
      href: "/jobs",
    },
    {
      label: "Companies",
      href: "/companies",
    },
    {
      label: "Pricing",
      href: "/plans",
    },
  ];

  const dashboardLinks =
    {
      seeker: "/dashboard/seeker",
      recruiter: "/dashboard/recruiter",
    }
  

  if(user?.email){
    navLinks.push(
      {
        label:'Dashboard',
        href: dashboardLinks[user?.role] || 'seeker'
      }
    )
  }

  return (
    <nav className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-4">
      <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl px-6 py-3 flex items-center justify-between shadow-xl">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-0.5 font-bold text-2xl tracking-tight select-none">
            <span className="text-[#38bdf8]">Career</span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-500 bg-clip-text text-transparent">
              Bridge
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6">
          {/* Nav Links using map */}
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-zinc-400 hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-5 w-[1px] bg-zinc-800 mx-1" />

          {/* Dynamic Session Rendering */}
          {isPending ? (
            <div className="w-20 h-7 bg-zinc-800 animate-pulse rounded-lg" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-zinc-300 text-sm font-medium bg-zinc-900 px-3 py-1.5 border border-zinc-800 rounded-xl">
                {session.user?.name}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors duration-200 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#6366f1] hover:text-[#4f46e5] text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 hover:opacity-90 active:scale-[0.98] transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden text-zinc-400 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden mt-2 bg-[#121214] border border-zinc-800/80 rounded-2xl px-6 py-6 shadow-xl">
          <div className="flex flex-col gap-4">
            {/* Nav Links */}
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-3 px-4 text-zinc-400 hover:text-white text-base font-medium transition-colors duration-200 rounded-xl hover:bg-zinc-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-zinc-800 pt-4 mt-2">
              {isPending ? (
                <div className="w-20 h-7 bg-zinc-800 animate-pulse rounded-lg" />
              ) : session ? (
                <div className="flex flex-col gap-3">
                  <div className="text-zinc-300 text-sm font-medium bg-zinc-900 px-4 py-3 border border-zinc-800 rounded-xl">
                    {session.user?.name}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-3 px-4 text-rose-400 hover:text-rose-300 hover:bg-zinc-900 rounded-xl transition-colors duration-200 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/auth/signin"
                    className="w-full text-center py-3 px-4 text-[#6366f1] hover:bg-zinc-900 rounded-xl transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-indigo-600/10 hover:opacity-90 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}