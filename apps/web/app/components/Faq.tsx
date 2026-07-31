"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

// Adapted FAQ data for Delve AI
const faqs = [
  {
    question: "What can I do with Delve AI?",
    answer: "You can synthesize complex web searches into actionable summaries, gather structured insights from multiple sources, and verify claims with 100% verbatim citations in real-time."
  },
  {
    question: "How do search limits work?",
    answer: "On the Starter plan, you have an allowance of 100 real-time searches per month. If you need more volume, our Pro and Max plans offer unlimited searches and deeper web reasoning capabilities."
  },
  {
    question: "Can I refine the output after it generates?",
    answer: "Absolutely. Once an initial summary is generated, you can use the chat interface to adjust the tone, focus on specific academic domains, or format the findings into markdown tables."
  },
  {
    question: "Do I need technical experience?",
    answer: "Not at all. You just need to describe what you are looking for in natural language. Delve handles the complex querying, parsing, and synthesis behind the scenes."
  },
  {
    question: "Does it replace human research?",
    answer: "Delve AI is designed to drastically accelerate your research process by doing the heavy lifting of gathering and parsing data. It acts as an advanced research assistant, empowering you rather than replacing your critical analysis."
  }
];

function FaqItem({ question, answer, isLast }: { question: string, answer: string, isLast: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div  className={`border-gray-100 ${!isLast ? "border-b" : ""}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-6 md:px-8 text-left focus:outline-none group transition-colors hover:bg-gray-50/50"
      >
        <span className="text-[17px] font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
          {question}
        </span>
        <div className="flex-shrink-0 ml-4 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 bg-white shadow-sm group-hover:border-gray-300 transition-all">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 px-6 md:px-8 text-gray-600 text-[15px] leading-relaxed pr-12 md:pr-24">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="how-it-works" className="w-full bg-[#fcfcfd] py-24 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-[44px] font-serif font-bold text-gray-900 tracking-tight mb-4"
          >
            Frequently Asked
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-500 text-base font-normal leading-relaxed max-w-xl mx-auto"
          >
            A quick look at how Delve AI works before you start, with answers to the most common things people ask.
          </motion.p>
        </div>

        {/* Accordion Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden"
        >
          {faqs.map((faq, index) => (
            <FaqItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
              isLast={index === faqs.length - 1} 
            />
          ))}
        </motion.div>

      </div>
    </section>
  );
}