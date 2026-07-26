"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      
      {/* LEFT COLUMN: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col">
        
        {/* Top Header */}
        <header className="flex justify-between items-center p-6 md:px-12 md:py-8">
          <Link href="/" className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
            delve<span className="opacity-70">.ai</span>
          </Link>
          <Link href="/signup" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Sign up
          </Link>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <h1 className="text-[32px] font-medium text-gray-900 text-center mb-8 tracking-tight">
              Welcome back
            </h1>

            {/* Social Auth Buttons */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition-colors shadow-sm">
                {/* Google SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>

              <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-xl transition-colors shadow-sm">
                {/* GitHub SVG */}
                <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                Sign in with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Email & Password Form */}
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-1 pb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#2D2D2D] hover:bg-[#1A1A1A] text-white font-medium py-3.5 rounded-xl transition-colors"
              >
                Sign in <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* RIGHT COLUMN: Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-50 p-4 pl-0">
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
          {/* Replace this src with your actual side image (e.g., the sky image from your screenshot) */}
          <Image
            src="/front.png" 
            alt="Sign in decorative background"
            fill
            className="object-cover"
            priority
          />
          {/* Optional Overlay to make it look premium */}
          <div className="absolute inset-0 bg-black/5 mix-blend-multiply"></div>
        </div>
      </div>

    </div>
  );
}