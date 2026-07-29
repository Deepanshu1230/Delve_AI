// app/components/ConversationView.tsx
"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "../lib/type";

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "Source Link";
  }
};

export function ConversationView({
  messages,
  onFollowupClick,
}: {
  messages: ChatMessage[];
  onFollowupClick?: (q: string) => void;
}) {
  return (
    <div className="space-y-10">
      {messages.map((m) =>
        m.role === "User" ? (
          // Matches the large, bold prompt header seen in the image
          <h2 key={m.id} className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900 mt-8 ">
            {m.content}
          </h2>
        ) : (
          <div key={m.id} className="flex flex-col gap-8 pb-4 border-b border-gray-100 last:border-0">
            
            {/* SOURCES SECTION */}
            {m.sources && m.sources.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                  Sources
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {m.sources.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col flex-none w-40 h-24 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-3 justify-between group"
                    >
                      {/* Top area for a thumbnail/image */}
<div className="w-full h-10 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
  {s.image ? (
    <img 
      src={s.image} 
      alt="Source thumbnail" 
      className="w-full h-full object-cover"
      onError={(e) => {
        // Hides the broken image icon if the URL fails to load
        e.currentTarget.style.display = 'none'; 
      }}
    />
  ) : (
    // Fallback text if no image exists
    <span className="text-gray-400 text-[10px] font-medium uppercase tracking-widest truncate px-2">
      {getDomain(s.url).split('.')[0]}
    </span>
  )}
</div>
                      
                      {/* Bottom area for favicon and domain */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {s.favicon ? (
                          <img src={s.favicon} className="w-3 h-3 grayscale group-hover:grayscale-0 transition-all" alt="" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-gray-300" />
                        )}
                        <span className="text-[11px] font-medium text-gray-600 truncate">
                          {getDomain(s.url)}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ANSWER SECTION */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Answer
                {m.isStreaming && (
                  <span className="text-gray-400 normal-case tracking-normal font-normal ml-2">
                    Searching the web...
                  </span>
                )}
              </div>
              <div className="prose prose-base md:prose-lg max-w-none text-gray-800 leading-relaxed prose-a:text-blue-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                {m.isStreaming && <span className="animate-pulse ml-1">▍</span>}
              </div>
            </div>

            {/* RELATED / FOLLOW-UPS SECTION */}
            {!m.isStreaming && m.followups && m.followups.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Related
                </div>
                
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  {m.followups.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => onFollowupClick?.(q)}
                      className="w-full text-left flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        {/* Number prefix (01, 02, etc.) */}
                        <span className="text-xs font-mono font-medium text-gray-400 mt-0.5">
                          0{i + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {q}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-4">
                        ask &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )
      )}
    </div>
  );
}