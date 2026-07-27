// app/dashboard/layout.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { DelveChatProvider, useDelveChat } from "../contexts/DelveChatContext";
import { BACKEND_URL } from "../lib/config";

interface ConversationSummary { id: string; title: string; }

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, token, loading: authLoading, logout, conversationId, reset, isStreaming } = useDelveChat();
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${BACKEND_URL}/conversation`, { headers: { Authorization: `${token}` } })
      .then((res) => setConversations(res.data.conversations ?? []))
      .catch((err) => console.error("Failed to load conversations:", err));
  }, [token, pathname]); // refetch whenever the route changes, so a freshly-created chat appears

  const handleNewThread = () => {
    reset();
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  if (authLoading || !user) return null;

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col justify-between md:flex">
        <div className="p-4 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white font-bold text-xs">D</div>
            <span className="font-semibold text-lg tracking-tight">delve.</span>
          </div>

          <button
            onClick={handleNewThread}
            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors mb-6 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New thread
            </span>
            <span className="text-gray-400 text-xs border border-gray-200 px-1.5 rounded">⌘K</span>
          </button>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-3 mb-2">Recent</div>
            <div className="space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => router.push(`/dashboard/${c.id}`)}
                  className={`w-full text-left truncate px-3 py-2 text-sm rounded-lg transition-colors ${
                    c.id === conversationId ? "bg-gray-200/50 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="text-sm font-medium truncate">{user.email}</span>
            </div>
            <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-600 shrink-0">
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="absolute top-0 w-full p-6 flex justify-between items-center text-xs font-semibold tracking-widest text-gray-400 uppercase z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isStreaming ? "bg-amber-500" : "bg-green-500"}`}></span>
            {isStreaming ? "Thinking…" : "Online"}
          </div>
          <div>V.0.1 BETA</div>
        </header>
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DelveChatProvider>
      <DashboardShell>{children}</DashboardShell>
    </DelveChatProvider>
  );
}