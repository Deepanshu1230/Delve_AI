// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useDelveChat } from "../contexts/DelveChatContext";
import { useRouter } from "next/navigation";

export default function NewChatPage() {
  const { token, isStreaming, askInitial ,conversationId} = useDelveChat();
  const router = useRouter();
  const [query, setQuery] = useState("");

 
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !token || isStreaming) return;
    
    const userQuery = query.trim();
    setQuery(""); // Clear input immediately for better UX
    
    // Await the function and capture the newly generated ID
    const newConvId = await askInitial(userQuery, token); 
    
    // Imperatively route ONLY when the new chat is actually created
    if (newConvId) {
      router.push(`/dashboard/${newConvId}`);
    }
  };
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 max-w-4xl mx-auto w-full h-full">
      <div className="text-center mb-10 w-full">
        <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          A Quieter Search
        </div>
        <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-gray-900 mb-6">Ask anything.</h1>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Welcome back. Delve scours the open web, then writes you back — in full sentences, with every source receipt attached.
        </p>
      </div>

      <div className="w-full mb-8 relative">
        <form
          onSubmit={handleSearch}
          className="w-full bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:ring-4 focus-within:ring-gray-100 focus-within:border-gray-400 transition-all flex flex-col pt-4 pb-2 px-4"
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
              <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Web
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                <span className="border border-gray-200 rounded px-1.5 py-0.5">↵</span> to send
              </span>
              <button type="submit" className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50" disabled={!query.trim() || isStreaming}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
        {[
          { label: "LEARN", text: "Explain transformers like I'm a physicist." },
          { label: "NEWS", text: "What's the state of fusion energy in 2026?" },
          { label: "CODE", text: "Compare React Server Components vs. Remix." },
          { label: "TRAVEL", text: "A weekend itinerary for Lisbon, under €400." },
        ].map((card, idx) => (
          <button key={idx} className="flex items-start gap-4 p-4 text-left border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors group" onClick={() => setQuery(card.text)}>
            <div className="text-[10px] font-bold tracking-widest text-gray-400 w-12 pt-1">{card.label}</div>
            <div className="text-sm text-gray-700 font-medium leading-snug group-hover:text-black">{card.text}</div>
          </button>
        ))}
      </div>

      <footer className="absolute bottom-6 w-full text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        Powered By Supabase • Prisma • Next.js
      </footer>
    </div>
  );
}