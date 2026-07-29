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
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer state

  useEffect(() => {
    if (!authLoading && !user) router.push("/auth");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${BACKEND_URL}/conversation`, { headers: { Authorization: `${token}` } })
      .then((res) => setConversations(res.data.conversations ?? []))
      .catch((err) => console.error("Failed to load conversations:", err));
  }, [token, pathname]);

  // Close the drawer automatically whenever the route changes (mobile UX)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleNewThread = () => {
    reset();
    router.push("/dashboard");
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  if (authLoading || !user) return null;

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 font-sans relative overflow-hidden">
      {/* Mobile overlay — click to close drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR — fixed drawer on mobile, static column on md+ */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-gray-50 border-r border-gray-200
          flex flex-col justify-between z-30
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <div className="p-4 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white font-bold text-xs">D</div>
              <span className="font-semibold text-lg tracking-tight">delve.</span>
            </div>
            {/* Close button, mobile only */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <button
            onClick={handleNewThread}
            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors mb-6 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New thread
            </span>
            <span className="hidden md:inline text-gray-400 text-xs border border-gray-200 px-1.5 rounded">⌘K</span>
          </button>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-3 mb-2">Recent</div>
            <div className="space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    router.push(`/dashboard/${c.id}`);
                    setSidebarOpen(false);
                  }}
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
      <main className="flex-1 flex flex-col relative overflow-hidden min-w-0">
        <header className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center text-xs font-semibold tracking-widest text-gray-400 uppercase z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1 text-gray-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span className={`w-2 h-2 rounded-full ${isStreaming ? "bg-amber-500" : "bg-green-500"}`}></span>
            <span className="hidden sm:inline">{isStreaming ? "Thinking…" : "Online"}</span>
          </div>
          <div className="hidden sm:block">V.0.1 BETA</div>
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