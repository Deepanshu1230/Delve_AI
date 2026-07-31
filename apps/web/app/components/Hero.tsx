"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUp, Globe, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState("Web Search");
  const [scrolled, setScrolled] = useState(false);
  const router=useRouter();

  useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > window.innerHeight - 100);
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    console.log("Sending query:", query, "Mode:", searchMode);
    // Trigger backend fetch here
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-50 flex flex-col justify-between overflow-hidden">
      
      {/* 1. Background Image */}
      <Image
        src="/front.png" 
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* 2. Floating Navbar (unchanged structure/background) */}
      <header className="fixed top-6 left-0 w-full z-50 flex justify-center px-4">
        <nav className="w-full max-w-4xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-full px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-xl font-bold tracking-tight drop-shadow transition-colors duration-500 ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              delve
              <span className={`transition-colors duration-500 ${scrolled ? "text-gray-500" : "text-white/70"}`}>
                .ai
              </span>
            </span>
          </div>

          <div
            className={`hidden md:flex items-center gap-8 text-sm font-medium drop-shadow-sm transition-colors duration-500 ${
              scrolled ? "text-gray-800" : "text-white/90"
            }`}
          >
            <a href="#how-it-works" className={`transition-colors duration-500 ${scrolled ? "hover:text-black" : "hover:text-white"}`}>
              How it works
            </a>
            <a href="#features" className={`transition-colors duration-500 ${scrolled ? "hover:text-black" : "hover:text-white"}`}>
              Capabilities
            </a>
            <a href="#pricing" className={`transition-colors duration-500 ${scrolled ? "hover:text-black" : "hover:text-white"}`}>
              Pricing
            </a>
            <a href="/login" className={`transition-colors duration-500 ${scrolled ? "hover:text-black" : "hover:text-white"}`}>
              Sign in
            </a>
          </div>

          <button onClick={()=> router.push("/login")}
            className={`font-semibold px-5 py-2 rounded-full text-sm transition-colors duration-500 shadow-md ${
              scrolled
                ? "bg-[#0284c7] text-white hover:bg-[#0369a1]"
                : "bg-white text-[#0284c7] hover:bg-gray-50"
            }`}
          >
            Get started
          </button>
        </nav>
      </header>

      {/* 3. Main Center Content (unchanged) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-12 pb-6 max-w-4xl mx-auto mt-20 md:mt-0">
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-tight mb-4 drop-shadow-lg"
        >
          Delve Deeper
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white/90 text-lg md:text-xl font-normal max-w-2xl mb-10 drop-shadow-md leading-relaxed"
        >
          Ask anything. Get real-time web research, synthesized insights, and accurate citations in seconds.
        </motion.p>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSearch}
          className="w-full max-w-2xl bg-white/80 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-white/60 text-left flex flex-col justify-between min-h-[140px]"
        >
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSearch(e);
              }
            }}
            placeholder="Ask anything or search the web..."
            className="w-full bg-transparent outline-none resize-none text-gray-800 placeholder-gray-400 text-lg font-normal p-2 min-h-[60px]"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
            <div className="flex items-center gap-2 bg-gray-100/80 hover:bg-gray-200/80 transition-colors px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 cursor-pointer">
              <Globe size={14} className="text-blue-600" />
              <span>{searchMode}</span>
              <ChevronDown size={12} className="text-gray-500" />
            </div>

            <button
              type="submit"
              disabled={!query.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white p-2.5 rounded-full transition-all shadow-md flex items-center justify-center"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </motion.form>
      </main>

      <footer className="relative z-10 pb-6 text-center text-white/60 text-xs drop-shadow-sm">
        Powered by Delve Engine & Real-time Web Search
      </footer>
    </div>
  );
}