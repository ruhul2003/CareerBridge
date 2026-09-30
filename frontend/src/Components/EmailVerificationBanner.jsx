"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { Mail, AlertTriangle, ArrowRight, RefreshCw, X, Loader2 } from "lucide-react";

export default function EmailVerificationBanner() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [dismissed, setDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Check session storage for dismiss state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("cb_verification_banner_dismissed");
      if (isDismissed === "true") {
        setDismissed(true);
      }
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // If not logged in, or already verified, or user dismissed for this tab session: do not show
  if (!user || user.emailVerified || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("cb_verification_banner_dismissed", "true");
    }
  };

  const handleResend = async () => {
    if (!user.email) return;

    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Verification email sent! Check your inbox.");
        setCooldown(60);
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
    <div className="bg-secondary-50/90 dark:bg-zinc-950/90 border-b border-secondary-200/80 dark:border-secondary-900/50 text-zinc-900 dark:text-zinc-200 px-4 py-2.5 text-xs transition-all relative z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-1 rounded-md bg-secondary-100 dark:bg-secondary-950/60 text-secondary-600 dark:text-secondary-400 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </span>
          <p className="truncate">
            <span className="font-semibold text-secondary-800 dark:text-secondary-300">Verify your email:</span> Please confirm{" "}
            <span className="font-mono underline opacity-90">{user.email}</span> to secure your account and unlock all features.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className="inline-flex items-center gap-1.5 font-medium hover:underline text-secondary-700 dark:text-secondary-300 disabled:opacity-50 disabled:no-underline cursor-pointer"
          >
            {isResending ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Sending...
              </>
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                Resend Link
              </>
            )}
          </button>

          <Link
            href={`/verify-email?email=${encodeURIComponent(user.email)}`}
            className="inline-flex items-center gap-1 bg-secondary hover:bg-secondary-600 text-white font-bold px-2.5 py-1 rounded-lg transition text-[11px] shadow-sm shadow-secondary/25"
          >
            Verify Now
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1 rounded hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
