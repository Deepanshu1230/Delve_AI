import { ChatMessage } from "../lib/type";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

interface MessageListProps {
  messages: ChatMessage[];
  onFollowupClick: (query: string) => void;
}

export function MessageList({ messages, onFollowupClick }: MessageListProps) {
  return (
    <div className="flex flex-col gap-8 pb-32">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex w-full ${
            m.role === "User" ? "justify-end" : "justify-start"
          }`}
        >
          {m.role === "User" ? (
            // User Message: Soft, clean light-gray bubble
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[80%] bg-gray-100 border border-gray-200/60 text-gray-900 px-6 py-4 rounded-3xl rounded-tr-sm shadow-sm"
            >
              <p className="text-lg leading-relaxed">{m.content}</p>
            </motion.div>
          ) : (
            // Assistant Message: Crisp White Perplexity Vibe
            <div className="w-full max-w-4xl text-gray-800 space-y-6">
              
              {/* Core Markdown Text rendering (Note: prose-invert is removed) */}
              <div className="prose prose-slate max-w-none text-base md:text-lg leading-relaxed text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
                
                {/* Dark Custom Blinking Cursor for light mode */}
                {m.isStreaming && (
                  <span className="inline-block w-2.5 h-5 ml-1 bg-gray-800 animate-pulse rounded-sm align-middle" />
                )}
              </div>

              {/* Related Follow-ups (Light Mode) */}
              {!m.isStreaming && m.followups && m.followups.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="pt-6 border-t border-gray-200 mt-6"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 uppercase tracking-widest font-semibold">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    Related
                  </div>
                  
                  {/* Follow-up Buttons */}
                  <div className="flex flex-col gap-3">
                    {m.followups.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => onFollowupClick(q)}
                        className="text-left px-5 py-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm md:text-base transition-all flex items-center justify-between group shadow-sm"
                      >
                        <span className="pr-4">{q}</span>
                        <span className="text-gray-400 group-hover:text-gray-800 transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                          </svg>
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}