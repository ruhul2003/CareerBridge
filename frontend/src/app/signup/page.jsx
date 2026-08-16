"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { At, Lock, ArrowRight, Person, Camera, CircleXmarkFill } from "@gravity-ui/icons";
import { FcGoogle } from "react-icons/fc";

// Inner Component (contains useSearchParams)
function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("seeker");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    
    const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
    if (!apiKey) throw new Error("ImgBB API key is not configured");

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const payload = await res.json();
    if (!res.ok) throw new Error(payload.error?.message || "Failed to upload image");
    return payload.data.url;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please ensure both password fields are identical.");
      setIsLoading(false);
      return;
    }

    try {
      let avatarUrl = "";
      if (imageFile) {
        avatarUrl = await uploadToImgBB(imageFile);
      }

      const plan = role === "seeker" ? "seeker_free" : "recruiter_free";

      await authClient.signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
        role,
        plan,
        image: avatarUrl || undefined,
      }, {
        onSuccess: () => {
          toast.success("Account created successfully!");
          router.push(redirectTo);
          router.refresh();
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Failed to create account");
        },
      });
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo || "/",
        additionalData: {
          role: role,
          plan: role === "seeker" ? "seeker_free" : "recruiter_free",
        },
      });
    } catch (err) {
      console.error("Google Sign In Error:", err);
      
      if (err.message?.includes("account_not_linked")) {
        setError("এই ইমেইলটি দিয়ে আগে পাসওয়ার্ড দিয়ে অ্যাকাউন্ট খোলা হয়েছিল। দয়া করে প্রথমে ইমেইল-পাসওয়ার্ড দিয়ে লগইন করুন।");
      } else {
        setError(err.message || "Google authentication failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
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
        <h2 className="text-3xl font-bold mt-6 tracking-tight">Create your account</h2>
        <p className="text-zinc-500 mt-2">Join the best platform for job seekers and recruiters</p>
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

          <form onSubmit={handleSignUp} className="space-y-6">

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-600 transition-all"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-600 transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email & Password */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Password</label>
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

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-11 pr-12 py-3 bg-zinc-900 border rounded-2xl text-white placeholder-zinc-500 focus:outline-none transition-all ${
                      confirmPassword && confirmPassword !== password
                        ? "border-rose-500/80 focus:border-rose-500"
                        : "border-zinc-800 focus:border-indigo-600"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-400 hover:text-white"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[11px] text-rose-400 mt-1.5 font-medium">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Profile Picture */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl">
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Profile Picture (Optional)</label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-24 h-24 rounded-2xl bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <Camera className="w-10 h-10 text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-5 file:rounded-xl file:border-0 file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                  />
                  <p className="text-xs text-zinc-500 mt-2">JPG, PNG • Max 2MB</p>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="w-full max-w-md mx-auto">
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2.5">
                I am a
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="relative cursor-pointer select-none">
                  <input type="radio" name="role" value="seeker" checked={role === "seeker"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200
                    ${role === "seeker" ? "border-sky-500/40 bg-sky-500/[0.06]" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"}`}>
                    <span className="text-base text-zinc-400">👤</span>
                    <div className="leading-tight">
                      <p className="text-sm font-medium text-zinc-200">Job Seeker</p>
                      <p className="text-[11px] text-zinc-500">Find work</p>
                    </div>
                    {role === "seeker" && <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-sky-400" />}
                  </div>
                </label>

                <label className="relative cursor-pointer select-none">
                  <input type="radio" name="role" value="recruiter" checked={role === "recruiter"} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200
                    ${role === "recruiter" ? "border-violet-500/40 bg-violet-500/[0.06]" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"}`}>
                    <span className="text-base text-zinc-400">💼</span>
                    <div className="leading-tight">
                      <p className="text-sm font-medium text-zinc-200">Recruiter</p>
                      <p className="text-[11px] text-zinc-500">Hire talent</p>
                    </div>
                    {role === "recruiter" && <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-violet-400" />}
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign in
        </Link>
      </p>
    </>
  );
}

// Main Page with Suspense Boundary
export default function SignUpPage() {
  return (
    <main className="w-full min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
              <p className="text-zinc-500 text-sm mt-4">Loading signup form...</p>
            </div>
          }
        >
          <SignUpForm />
        </Suspense>
      </div>
    </main>
  );
}