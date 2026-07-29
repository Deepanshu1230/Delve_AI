"use client";
import { use, useEffect, useRef, useState } from "react";
import { useDelveChat } from "../../contexts/DelveChatContext";
import { ConversationView } from "../../components/ConversationView";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId: paramId } = use(params);
  const { messages, conversationId, token, isStreaming, error, askFollowup, loadConversation } = useDelveChat();
  const [query, setQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token && conversationId !== paramId) {
      loadConversation(paramId, token);
    }
  }, [paramId, conversationId, token, loadConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !token || isStreaming) return;
    askFollowup(query.trim(), token);
    setQuery("");
  };

  const handleFollowupClick = (q: string) => {
    if (!token || isStreaming) return;
    askFollowup(q, token);
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full">
      {/* full-width scroll container — scrollbar sits at true right edge */}
      <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
        {/* centered, padded content lives INSIDE the scroll container */}
        <div className="max-w-3xl mx-auto w-full pt-16 px-6 pb-12">
          <ConversationView messages={messages} onFollowupClick={handleFollowupClick} />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="w-full bg-gradient-to-t from-white via-white to-transparent pt-4 pb-6 px-6">
        <div className="max-w-3xl mx-auto w-full">
          <form
            onSubmit={handleSearch}
            className="w-full bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:ring-4 focus-within:ring-gray-100 focus-within:border-gray-400 transition-all flex items-center gap-2 px-4 py-3"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a follow-up..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none"
              disabled={isStreaming}
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={!query.trim() || isStreaming}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
    </div>
  );
}