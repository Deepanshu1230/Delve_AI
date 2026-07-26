"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    // Minimized outer padding so the card stretches edge-to-edge
    <footer className="w-full bg-[#fcfcfd] pb-1 px-1 md:pb-4 md:px-4">
      
      {/* Inner Floating Card Container - Tightened padding and expanded max-width */}
      <div className="max-w-7xl mx-auto relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden p-6 md:p-8 lg:p-10 shadow-lg min-h-[350px] flex flex-col justify-between">
        
        {/* Background Image (Absolute positioned behind content) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/front.png" 
            alt="Scenic Mountain Background"
            fill
            className="object-cover object-bottom"
            priority
          />
          {/* Subtle gradient overlay to ensure the white text remains readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-black/40 mix-blend-multiply"></div>
        </div>

        {/* --- Top Row: Content (z-10 keeps it above the image) --- */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 mt-2">
          
          {/* Brand & Description Column */}
          <div className="md:col-span-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white/20 p-1 rounded-lg backdrop-blur-sm">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Delve AI</span>
            </div>
            <p className="text-white/90 text-sm max-w-sm leading-relaxed font-medium">
              Your simple space to capture intelligence, verify sources, and never lose a structured insight.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {/* Product */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold text-base mb-1 tracking-tight">Product</h4>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">Features</Link>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">How It Works</Link>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">Pricing</Link>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold text-base mb-1 tracking-tight">Company</h4>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">About</Link>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">Careers</Link>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">Contact</Link>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">Press</Link>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-3">
              <h4 className="text-white font-semibold text-base mb-1 tracking-tight">Resources</h4>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">Help Center</Link>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">Updates</Link>
              <Link href="#" className="text-white/80 hover:text-white text-sm transition-colors">Guides</Link>
            </div>
          </div>
        </div>

        {/* --- Bottom Row: Divider, Copyright & Socials --- */}
        <div className="relative z-10 mt-auto">
          {/* Thin white divider line */}
          <div className="w-full h-px bg-white/30 mb-5 rounded-full"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/90 text-sm font-medium">
            <p>© 2026 Delve AI. All rights reserved.</p>
            
            {/* <div className="flex items-center gap-3">
              <Link href="#" className="bg-white/20 p-2 rounded-md hover:bg-white/30 transition-colors backdrop-blur-sm">
                <Linkedin size={16} className="text-white fill-current" />
              </Link>
              <Link href="#" className="bg-white/20 p-2 rounded-md hover:bg-white/30 transition-colors backdrop-blur-sm">
                <Twitter size={16} className="text-white fill-current" />
              </Link>
            </div> */}
          </div>
        </div>

      </div>
    </footer>
  );
}