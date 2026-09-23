"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Send,
  Home
} from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  const [tokenInput, setTokenInput] = useState(tokenParam);
  const [emailInput, setEmailInput] = useState(emailParam || currentUser?.email || "");
  const [status, setStatus] = useState("idle"); // 'idle' | 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Sync email input from session if available
  useEffect(() => {
    if (!emailInput && currentUser?.email) {
      setEmailInput(currentUser.email);
    }
  }, [currentUser, emailInput]);

  // Handle countdown for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Automatic verification if token is present in URL
  useEffect(() => {
    if (tokenParam && status === "idle") {
      performVerification(tokenParam, emailParam);
    }
  }, [tokenParam, emailParam]);

  const performVerification = async (tokenToVerify, targetEmail) => {
    if (!tokenToVerify) {
      toast.error("Please provide a verification token.");
      return;
    }

    setStatus("verifying");
    setErrorMessage("");

    try {
      // 1. Try our dedicated verify-token route first
      const res = await fetch("/api/auth/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenToVerify,
          email: targetEmail || emailInput,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        toast.success("Email verified successfully!");

        // Refresh session if client supports it
        setTimeout(() => {
          const role = currentUser?.role || "seeker";
          const dest = role === "admin" ? "/dashboard/admin" : role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/seeker";
          router.push(dest);
        }, 3000);
      } else {
        // Fallback to Better-Auth native verifyEmail if applicable
        try {
          const baRes = await authClient.verifyEmail({
            query: { token: tokenToVerify },
          });

          if (baRes && !baRes.error) {
            setStatus("success");
            toast.success("Email verified successfully!");
            setTimeout(() => {
              router.push("/dashboard/seeker");
            }, 3000);
            return;
          }
        } catch (baErr) {
          // ignore fallback error
        }

        setStatus("error");
        setErrorMessage(data.message || "Failed to verify email. The token might have expired.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred during verification.");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      toast.error("Please enter the verification code or token from your email.");
      return;
    }
    performVerification(tokenInput.trim(), emailInput.trim());
  };

  const handleResendEmail = async () => {
    const target = emailInput.trim() || currentUser?.email;
    if (!target) {
      toast.error("Please specify your email address to receive a new link.");
      return;
    }

    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: target }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "New verification email sent!");
        setResendCooldown(60);
      } else {
        toast.error(data.message || "Failed to resend verification email.");
      }
    } catch (err) {
      toast.error(err.message || "Network error while resending verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/5 dark:bg-zinc-900/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-4">
            <span className="text-xl font-bold text-[#0284c7]">Career</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-500 bg-clip-text text-transparent">
              Bridge
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Email Verification
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            Confirm your email address to unlock your account and start connecting.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient glow */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500" />

          {/* STATE 1: VERIFYING IN PROGRESS */}
          {status === "verifying" && (
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 border border-sky-200 dark:border-sky-800/50 animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Validating Security Token...
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Please wait while we confirm your email and activate your CareerBridge account.
              </p>
            </div>
          )}

          {/* STATE 2: SUCCESS */}
          {status === "success" && (
            <div className="text-center py-6 space-y-5">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200 dark:border-emerald-800/50 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified & Active
                </span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Email Successfully Verified!
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Your CareerBridge account is now fully confirmed. You have unrestricted access to jobs, applications, and AI tools.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href={currentUser?.role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/seeker"}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition duration-200 shadow-lg shadow-sky-500/25"
                >
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* STATE 3: ERROR / LINK EXPIRED */}
          {status === "error" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 flex items-start gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Verification Problem</div>
                  <div className="text-xs opacity-90 mt-0.5">{errorMessage}</div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Verification links are valid for 24 hours. You can request a fresh verification link below:
                </p>
              </div>

              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isResending || resendCooldown > 0}
                className="w-full inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium py-3 px-5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Email...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Resend link in {resendCooldown}s
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Fresh Verification Link
                  </>
                )}
              </button>
            </div>
          )}

          {/* STATE 4: IDLE / MANUAL CODE ENTRY */}
          {status === "idle" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  We sent a confirmation email with a link and verification token to your address. Click the link in the email or enter the code below.
                </div>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Account Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-sky-500 dark:focus:border-sky-500 text-zinc-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Verification Code or Token
                  </label>
                  <input
                    type="text"
                    required
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Paste code from email..."
                    className="w-full font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-sky-500 dark:focus:border-sky-500 text-zinc-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition duration-200 shadow-md shadow-sky-500/20 text-sm"
                >
                  Verify Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Resend Action */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Didn&apos;t get the email?
                </span>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={isResending || resendCooldown > 0}
                  className="inline-flex items-center gap-1.5 font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Resend Verification Email
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back navigation */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition"
          >
            <Home className="w-3.5 h-3.5" />
            Back to CareerBridge Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
