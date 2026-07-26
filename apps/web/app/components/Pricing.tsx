"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Layout, Sparkles, Crown, ArrowRight, Check } from "lucide-react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="w-full bg-[#fcfcfd] py-24 px-4 md:px-8 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-serif  text-gray-900 tracking-tight mb-4"
          >
            Plans and Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-500 text-base md:text-lg font-normal leading-relaxed"
          >
            Flexible plans for real-time web synthesis, deep multi-model AI search, and structured research with a clean workflow.
          </motion.p>
        </div>

        {/* Monthly / Annual Billing Toggle Pill */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gray-100/80 p-1.5 rounded-full border border-gray-200/80 flex items-center gap-1 mb-16 shadow-inner"
        >
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !isAnnual 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              isAnnual 
                ? "bg-white text-gray-900 shadow-sm" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>Annually</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
              Save 30%
            </span>
          </button>
        </motion.div>

        {/* 3 Pricing Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* 1. STARTER CARD (Sky Blue) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="bg-[#f0f9ff]/90 border border-sky-100/80 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div>
              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
                  <Layout size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-none mb-1">Starter</h3>
                  <p className="text-xs text-gray-500">Perfect for getting started.</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {isAnnual ? "$6" : "$9"}
                </span>
                <span className="text-gray-500 text-sm font-medium"> / mo</span>
              </div>

              <p className="text-sm text-gray-600 font-normal leading-relaxed mb-6">
                Perfect for getting started with core search synthesis and web queries.
              </p>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-sky-600" /> 100 Real-Time Searches / mo
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-sky-600" /> Standard Model Access
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-sky-600" /> Verbatim Web Citations
                </li>
              </ul>
            </div>

            {/* Button */}
            <button className="w-full bg-white hover:bg-sky-50 text-sky-700 font-semibold py-3.5 px-6 rounded-2xl border border-sky-200 transition-colors flex items-center justify-center gap-2 text-sm shadow-xs">
              <span>Start Free Trial</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* 2. PRO CARD (Vibrant Purple) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="bg-[#f5f3ff]/90 border border-purple-100/80 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative"
          >
            <div>
              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-white border border-purple-200 flex items-center justify-center text-purple-600 shadow-xs">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-none mb-1">Pro</h3>
                  <p className="text-xs text-gray-500">For creators who want more.</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {isAnnual ? "$18" : "$25"}
                </span>
                <span className="text-gray-500 text-sm font-medium"> / mo</span>
              </div>

              <p className="text-sm text-gray-600 font-normal leading-relaxed mb-6">
                For researchers who want more renders, deeper web reasoning, and faster iteration.
              </p>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-600" /> Unlimited Real-Time Searches
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-600" /> Gemini & Mistral LLM Failover
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-600" /> Deep Research & Academic Focus
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-purple-600" /> Priority SSE Streaming
                </li>
              </ul>
            </div>

            {/* Button */}
            <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-md">
              <span>Start Free Trial</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* 3. MAX CARD (Cyan / Blue) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="bg-[#f0f9ff]/90 border border-sky-100/80 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div>
              {/* Icon & Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-white border border-sky-200 flex items-center justify-center text-sky-600 shadow-xs">
                  <Crown size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-none mb-1">Max</h3>
                  <p className="text-xs text-gray-500">Built for power users.</p>
                </div>
              </div>

              {/* Pricing with Discount */}
              <div className="mb-4 flex items-baseline gap-2">
                <span className="text-lg font-medium text-gray-400 line-through">$50</span>
                <span className="text-4xl font-bold text-gray-900">
                  {isAnnual ? "$22" : "$30"}
                </span>
                <span className="text-gray-500 text-sm font-medium"> / first mo</span>
              </div>

              <p className="text-sm text-gray-600 font-normal leading-relaxed mb-6">
                Best for power users who need maximum context window, custom API keys, and dedicated support.
              </p>

              {/* Features List */}
              <ul className="space-y-2.5 text-xs text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-sky-600" /> Everything in Pro Plan
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-sky-600" /> Extended Context Window
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-sky-600" /> Custom API Access & Dedicated Infra
                </li>
              </ul>
            </div>

            {/* Button */}
            <button className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm shadow-md">
              <span>Start Free Trial</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
}