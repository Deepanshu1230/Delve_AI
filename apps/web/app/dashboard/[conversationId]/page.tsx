
"use client";
import { use, useEffect, useState } from "react";
import { useDelveChat } from "../../contexts/DelveChatContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Helper function to safely extract the domain name
const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "Source Link";
  }
};

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId: paramId } = use(params);

  const { messages, conversationId, token, isStreaming, error, askFollowup, loadConversation } = useDelveChat();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (token && conversationId !== paramId) {
      loadConversation(paramId, token);
    }
  }, [paramId, conversationId, token, loadConversation]);

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
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full h-full pt-20 px-4 md:px-0">
      <div className="flex-1 overflow-y-auto space-y-6 pb-4">
        {messages.map((m) =>
          m.role === "User" ? (
            <p key={m.id} className="text-2xl font-medium text-gray-900">{m.content}</p>
          ) : (
            <div key={m.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              {m.sources && m.sources.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {m.sources.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs bg-gray-100 rounded-full px-3 py-1 shrink-0 hover:bg-gray-200"
                    >
                      {s.favicon && <img src={s.favicon} className="w-3 h-3" alt="" />}
                      {getDomain(s.url)}
                    </a>
                  ))}
                </div>
              )}

              <div className="prose prose-sm max-w-none text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                {m.isStreaming && <span className="animate-pulse">▍</span>}
              </div>

              {!m.isStreaming && m.followups && m.followups.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
                  {m.followups.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleFollowupClick(q)}
                      className="w-full text-left text-sm text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>

      <form
        onSubmit={handleSearch}
        className="w-full bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:ring-4 focus-within:ring-gray-100 focus-within:border-gray-400 transition-all flex items-center gap-2 px-4 py-3 mb-6 sticky bottom-0"
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </form>

      {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}
    </div>
  );
}