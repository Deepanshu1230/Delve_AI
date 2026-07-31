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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleNewThread = () => {
    reset();
    router.push("/dashboard");
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      router.push("/auth");
    } finally {
      setLoggingOut(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 font-sans relative overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
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
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 p-1 hover:text-gray-600 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <button
            onClick={handleNewThread}
            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-400 active:scale-[0.98] transition-all duration-150 mb-6 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              New thread
            </span>
            <span className="hidden md:inline text-gray-400 text-xs border border-gray-200 px-1.5 rounded">⌘K</span>
          </button>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-3 mb-2">Recent</div>
            {conversations.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400 italic">No threads yet</div>
            ) : (
              <div className="space-y-1">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      router.push(`/dashboard/${c.id}`);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left truncate px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                      c.id === conversationId
                        ? "bg-gray-200/60 font-medium text-gray-900"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* USER / LOGOUT FOOTER */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-100/70 transition-colors duration-150 group">
            <div className="w-8 h-8 shrink-0 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm ring-2 ring-white shadow-sm">
              {user.email?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate leading-tight">{user.email}</div>
              <div className="text-[11px] text-gray-400 leading-tight">Free plan</div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Log out"
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all duration-150 disabled:opacity-50"
            >
              {loggingOut ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <main className="flex-1 flex flex-col relative overflow-hidden min-w-0">
        <header className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-center text-xs font-semibold tracking-widest text-gray-400 uppercase z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1 text-gray-500 hover:text-gray-700 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${isStreaming ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}></span>
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