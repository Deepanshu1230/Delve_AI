// hooks/useDelveStream.ts — full updated version
import { useCallback, useRef, useState } from "react";
import { ChatMessage, Source } from "../lib/type";
import { BACKEND_URL } from "../lib/config";



// hooks/useDelveStream.ts
function parseAssistantOutput(raw: string): { text: string; sources: Source[]; followups: string[] } {
  // Sources block your backend appends after the LLM finishes
  let sources: Source[] = [];
  let working = raw;
  const sourcesMatch = raw.match(/<SOURCES>([\s\S]*?)<\/SOURCES>/);
  if (sourcesMatch) {
    working = raw.slice(0, sourcesMatch.index) + raw.slice(sourcesMatch.index! + sourcesMatch[0].length);
    try { sources = JSON.parse(sourcesMatch[1]!); } catch { /* ignore malformed JSON */ }
  }

  // Answer block from the model — "|$" lets it match an unclosed tag while still streaming
  const answerMatch = working.match(/<ANSWER>([\s\S]*?)(<\/ANSWER>|$)/);
  const text = answerMatch ? answerMatch[1]!.trim() : working.replace(/<[^>]*>/g, "").trim();

  // Follow-up suggestions
  const followupsMatch = working.match(/<FOLLOWUPS>([\s\S]*?)(<\/FOLLOWUPS>|$)/);
  const followups = followupsMatch
    ? [...followupsMatch[1]!.matchAll(/<question>([\s\S]*?)<\/question>/g)].map((m) => m[1]!.trim())
    : [];

  return { text, sources, followups };
}

interface PersistedMessage {
  id: string;
  role: "User" | "Assistant";
  content: string;
}

function hydrate(raw: PersistedMessage[]): ChatMessage[] {
  return raw.map((m) =>
    m.role === "User"
      ? { id: m.id, role: "User" as const, content: m.content }
      : (() => {
          const { text, sources } = parseAssistantOutput(m.content);
          return { id: m.id, role: "Assistant" as const, content: text, sources };
        })()
  );
}

export function useDelveStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rawBufferRef = useRef("");

  const reset = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

 const consumeStream = useCallback(async (res: Response, assistantId: string) => {
  if (!res.body) throw new Error("No response body");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  rawBufferRef.current = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    rawBufferRef.current += decoder.decode(value, { stream: true });
    const { text, sources, followups } = parseAssistantOutput(rawBufferRef.current);
    setMessages((prev) =>
      prev.map((m) => (m.id === assistantId ? { ...m, content: text, sources, followups, isStreaming: true } : m))
    );
  }
  setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m)));
}, []);

  const askInitial = useCallback(async (query: string, token: string) => {
    setError(null);
    setIsStreaming(true);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "User", content: query };
    const assistantId = crypto.randomUUID();
    setMessages([userMsg, { id: assistantId, role: "Assistant", content: "", isStreaming: true }]);

    try {
      const res = await fetch(`${BACKEND_URL}/delve_Ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `${token}` },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const convId = res.headers.get("X-Conversation-Id");
      if (convId) setConversationId(convId);
      await consumeStream(res, assistantId);
      return convId;
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setIsStreaming(false);
    }
  }, [consumeStream]);

  const askFollowup = useCallback(async (newMessage: string, token: string) => {
    if (!conversationId) return;
    setError(null);
    setIsStreaming(true);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "User", content: newMessage };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, userMsg, { id: assistantId, role: "Assistant", content: "", isStreaming: true }]);

    try {
      const res = await fetch(`${BACKEND_URL}/delve_ask/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `${token}` },
        body: JSON.stringify({ conversationId, newMessage }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      await consumeStream(res, assistantId);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setIsStreaming(false);
    }
  }, [conversationId, consumeStream]);

  const loadConversation = useCallback(async (id: string, token: string) => {
    setError(null);
    const res = await fetch(`${BACKEND_URL}/conversation/${id}`, {
      headers: { Authorization: `${token}` },
    });
    if (!res.ok) {
      setError("Couldn't load that conversation");
      return;
    }
    const data = await res.json();
    setConversationId(data.id);
    setMessages(hydrate(data.messages ?? []));
  }, []);

  return { messages, conversationId, isStreaming, error, askInitial, askFollowup, loadConversation, reset };
}