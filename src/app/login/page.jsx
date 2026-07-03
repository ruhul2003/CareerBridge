"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { At, Lock, ArrowRight, CircleXmarkFill } from "@gravity-ui/icons";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authClient.signIn.email({
        email,
        password,
      }, {
        onSuccess: () => {
          toast.success("Welcome back!");
          router.push(redirectTo);
          router.refresh();
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Invalid email or password");
        },
      });
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo || "/",
      });
    } catch (err) {
      console.error("Google Sign In Error:", err);
      setError(err.message || "Google sign in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">

        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-0.5 font-bold text-3xl tracking-tight">
              <span className="text-[#38bdf8]">Career</span>
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-500 bg-clip-text text-transparent">
                Bridge
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-bold mt-6 tracking-tight">Welcome back</h2>
          <p className="text-zinc-500 mt-2">Sign in to continue your career journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-10">

            {error && (
              <div className="mb-6 p-4 bg-rose-950/50 border border-rose-900/60 rounded-2xl flex gap-3 text-rose-400 text-sm">
                <CircleXmarkFill className="w-5 h-5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-6">

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <At className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-600 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">Password</label>
                  {/* আপনি চাইলে এখানে পরবর্তীতে Forgot Password এর লিংক যুক্ত করতে পারেন */}
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-600 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
              >
                {isLoading ? "Signing In..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-zinc-950 px-4 text-xs text-zinc-500">OR</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-zinc-700 hover:border-zinc-600 bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70"
            >
              <FcGoogle className="w-5 h-5" />
              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </button>

          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-zinc-500 text-sm">
          Do not have an account?{" "}
          <Link href={`/auth/signup?redirect=${redirectTo}`} className="text-indigo-400 hover:text-indigo-300 font-medium">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}