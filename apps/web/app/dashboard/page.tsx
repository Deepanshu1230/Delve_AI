"use client";
import { useEffect, useRef, useState } from "react";
import { useDelveChat } from "../contexts/DelveChatContext";
import { useRouter } from "next/navigation";
import { ConversationView } from "../components/ConversationView";

const SUGGESTIONS = [
  {
    label: "Learn",
    text: "Explain transformers like I'm a physicist.",
    icon: (
      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.4-1.5 3.2-.6.7-1 1.3-1 2.3v1h-3v-1c0-1 .4-1.6 1-2.3.7-.8 1.5-1.7 1.5-3.2a2 2 0 1 0-4 0H7a4 4 0 0 1 4-4z" />
    ),
  },
  {
    label: "News",
    text: "What's the state of fusion energy in 2026?",
    icon: <path d="M4 4h16v16H4z M4 9h16 M9 4v16" />,
  },
  {
    label: "Code",
    text: "Compare React Server Components vs. Remix.",
    icon: <path d="M8 6l-6 6 6 6 M16 6l6 6-6 6" />,
  },
  {
    label: "Travel",
    text: "A weekend itinerary for Lisbon, under €400.",
    icon: (
      <path d="M12 2l2.4 6.5L21 10l-5.5 4.2L17 21l-5-3.5L7 21l1.5-6.8L3 10l6.6-1.5z" />
    ),
  },
];

export default function NewChatPage() {
  const { user, token, isStreaming, askInitial, messages, askFollowup } = useDelveChat();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !token || isStreaming) return;

    const userQuery = query.trim();
    setQuery("");

    const newConvId = await askInitial(userQuery, token);
    if (newConvId) {
      router.push(`/dashboard/${newConvId}`);
    }
  };

  const handleFollowupClick = (q: string) => {
    if (!token || isStreaming) return;
    askFollowup(q, token);
  };

  if (messages.length > 0) {
    return (
      <div className="flex flex-col flex-1 h-full w-full">
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-3xl mx-auto w-full pt-16 px-6 pb-12">
            <ConversationView messages={messages} onFollowupClick={handleFollowupClick} />
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="w-full bg-gradient-to-t from-white via-white to-transparent pt-4 pb-6 px-6">
          <div className="max-w-3xl mx-auto w-full">
            <form
              onSubmit={handleSearch}
              className="w-full bg-white border border-gray-200 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] focus-within:ring-4 focus-within:ring-gray-100 focus-within:border-gray-300 transition-all duration-200 flex items-center gap-2 px-4 py-3"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a follow-up..."
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-[15px]"
                disabled={isStreaming}
              />
              <button
                type="submit"
                className="p-2.5 rounded-full bg-black text-white hover:bg-gray-800 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:hover:bg-black"
                disabled={!query.trim() || isStreaming}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Landing hero
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-4xl mx-auto w-full h-full overflow-hidden">
      {/* soft ambient glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-100/70 rounded-full blur-3xl -z-10" />

      <div className="text-center mb-10 w-full">
        <div className="inline-flex items-center justify-center gap-2 text-[11px] font-sans font-semibold tracking-[0.2em] text-gray-400 uppercase mb-5 px-3 py-1 rounded-full border border-gray-200 bg-white/60 backdrop-blur-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          A Quieter Search
        </div>
        <h1 className="text-5xl md:text-6xl font-medium font-serif tracking-tight text-gray-900 mb-5">
          Ask anything.
        </h1>
        <p className="text-gray-500 text-base font-serif md:text-lg max-w-xl mx-auto leading-relaxed">
          Delve reads the open web so you don't have to — then hands you back
          a clear, sourced answer in plain sentences.
        </p>
      </div>

      <div className="w-full mb-10 relative">
        <form
          onSubmit={handleSearch}
          className="w-full bg-white border border-gray-200 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] focus-within:ring-4 focus-within:ring-gray-100 focus-within:border-gray-300 transition-all duration-200 flex flex-col pt-4 pb-2 px-4"
        >
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to know?"
            className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-lg resize-none outline-none min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSearch(e);
              }
            }}
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                Web
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                <span className="border border-gray-200 rounded px-1.5 py-0.5">↵</span> to send
              </span>
              <button
                type="submit"
                className="p-2.5 rounded-full bg-black text-white hover:bg-gray-800 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:hover:bg-black"
                disabled={!query.trim() || isStreaming}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 font-serif md:grid-cols-2 gap-3 w-full max-w-3xl">
        {SUGGESTIONS.map((card, idx) => (
          <button
            key={idx}
            className="flex items-start gap-3.5 p-4 text-left border border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-150 group"
            onClick={() => setQuery(card.text)}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-gray-900 group-hover:border-gray-300 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {card.icon}
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
                {card.label}
              </div>
              <div className="text-sm text-gray-700 font-medium leading-snug group-hover:text-black">
                {card.text}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}