"use client";

import { Globe, Sparkles, Link2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Capabilities() {
  return (
    <section className="relative w-full bg-[#fcfcfd] py-24 px-4 overflow-hidden border-t border-gray-100">
      
      {/* Background Decorative Accent Elements */}
      <div className="absolute top-10 left-[10%] w-32 h-32 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-[10%] w-40 h-40 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Main Headline */}
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight leading-tight max-w-3xl mb-16"
        >
          You don't need dozens of open tabs to find clear answers.
        </motion.h2>

        {/* 3-Column Feature Layout with Vertical Dividers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 items-center mb-16"
        >
          
          {/* Column 1: Real-Time Web */}
          <div className="flex flex-col items-center px-6 md:border-r border-gray-200">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 mb-5 shadow-sm">
              <Globe size={30} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Real-time web search
            </h3>
            <p className="text-sm text-gray-500 max-w-xs font-normal leading-relaxed">
              Fetches up-to-the-second information directly from live web sources.
            </p>
          </div>

          {/* Column 2: AI Synthesis */}
          <div className="flex flex-col items-center px-6 md:border-r border-gray-200">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mb-5 shadow-sm">
              <Sparkles size={30} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Deep AI synthesis
            </h3>
            <p className="text-sm text-gray-500 max-w-xs font-normal leading-relaxed">
              Consolidates complex search results into concise, structured responses.
            </p>
          </div>

          {/* Column 3: Cited Sources */}
          <div className="flex flex-col items-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100/80 flex items-center justify-center text-sky-600 mb-5 shadow-sm">
              <Link2 size={30} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Verbatim citations
            </h3>
            <p className="text-sm text-gray-500 max-w-xs font-normal leading-relaxed">
              Every single fact is explicitly tied to inspectable source URLs and favicons.
            </p>
          </div>

        </motion.div>

        {/* Floating Pill Badge at Bottom */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-white border border-gray-200/80 shadow-md rounded-full px-6 py-3 text-sm text-gray-600"
        >
          <span>From a single prompt using</span>
          <span className="font-semibold text-blue-600">delve.ai</span>
        </motion.div>

      </div>
    </section>
  );
}