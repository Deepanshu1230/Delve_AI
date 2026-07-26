"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BentoGrid() {
  return (
    <section className="w-full bg-[#f8fafc] py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif  text-gray-900 tracking-tight leading-tight mb-4">
            Ideas. Notes. Clarity.<br />Wherever your mind goes.
          </h2>
          <p className="text-gray-600 text-base md:text-lg font-medium">
            Synthesize web intelligence instantly, then drill down into any topic or source through natural conversation.
          </p>
        </div>

        {/* --- TOP ROW: 2 Large Cards --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Purple Theme */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white border border-gray-100 rounded-[2.5rem] pt-2 pl-2 pr-2 pb-2 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Inner Colored Container covering the border */}
            <div className="relative w-full h-64 md:h-72 rounded-[2rem] overflow-hidden bg-purple-200/70 mb-6 border border-purple-200/50">
              <Image 
                src="/purple-prompt-insight.png" 
                alt="From prompt to structured insight"
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Enriched Typography with Matching Color */}
            <div className="px-2 pb-2">
              <h3 className="text-xl md:text-2xl font-serif text-purple-600 tracking-tight mb-2">
                From prompt to structured insight
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-serif">
                Describe what you need in your own words and watch Delve parse the entire web into clear, actionable summaries instantly.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Sky Blue Theme */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white border border-gray-100 rounded-[2.5rem] pt-2 pl-2 pr-2 pb-2 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Inner Colored Container covering the border */}
            <div className="relative w-full h-64 md:h-72 rounded-[2rem] overflow-hidden bg-sky-100/70 mb-6 border border-sky-200/50">
              <Image 
                src="/blue-chat-refinement.png" 
                alt="Refine answers through chat"
                fill
                priority
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Enriched Typography with Matching Color */}
            <div className="px-2 pb-2">
              <h3 className="text-xl md:text-2xl font-serif text-sky-950 tracking-tight mb-2">
                Refine answers through chat
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed font-serif">
                Ask to adjust tone, focus on specific domains, add technical benchmarks, or convert findings into markdown tables seamlessly.
              </p>
            </div>
          </motion.div>

        </div>

        {/* --- BOTTOM ROW: 3 Grid Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 3: Amber / Yellow Theme */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white border border-gray-100 rounded-[2.5rem] pt-2 pl-2 pr-2 pb-2 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Inner Colored Container */}
            <div className="relative w-full h-52 rounded-[1.8rem] overflow-hidden bg-amber-100/70 mb-5 border border-amber-200/50">
              <Image 
                src="/amber-multi-source-nodes.png" 
                alt="Multi-Source Intelligence"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="px-2 pb-2">
              <h4 className="text-xl md:text-2xl font-serif text-amber-950 tracking-tight mb-2">
                Multi-Source Intelligence
              </h4>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-serif">
                Connect web search, technical documentation, and academic repositories into one unified synthesis.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Emerald Green Theme */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white border border-gray-100 rounded-[2.5rem] pt-2 pl-2 pr-2 pb-2 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Inner Colored Container */}
            <div className="relative w-full h-52 rounded-[1.8rem] overflow-hidden bg-emerald-100/70 mb-5 border border-emerald-200/50">
              <Image 
                src="/green-speed-radar.png" 
                alt="Built for Speed"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="px-2 pb-2">
              <h4 className="text-xl md:text-2xl font-serif text-emerald-950 tracking-tight mb-2">
                Built for Speed
              </h4>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-serif">
                Real-time Server-Sent Events (SSE) streaming delivers answers word-by-word with zero latency.
              </p>
            </div>
          </motion.div>

          {/* Card 5: Indigo Theme */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="bg-white border border-gray-100 rounded-[2.5rem] pt-2 pl-2 pr-2 pb-2 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Inner Colored Container */}
            <div className="relative w-full h-52 rounded-[1.8rem] overflow-hidden bg-indigo-100/70 mb-5 border border-indigo-200/50">
              <Image 
                src="/indigo-citations-list.png" 
                alt="100% Verbatim Citations"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="px-2 pb-2">
              <h4 className="text-xl md:text-2xl font-serif text-indigo-950 tracking-tight mb-2">
                100% Verbatim Citations
              </h4>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-serif">
                Zero hallucinations. Every claim is backed by click-through links to authentic web sources.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}