// contexts/DelveChatContext.tsx
"use client";
import { createContext, useContext } from "react";
import { useDelveStream } from "../hooks/useDelveStream";
import { useAuthToken } from "../hooks/useAuthToken";

function useDelveChatInternal() {
  const auth = useAuthToken();
  const chat = useDelveStream();
  return { ...auth, ...chat };
}

type DelveChatValue = ReturnType<typeof useDelveChatInternal>;
const DelveChatContext = createContext<DelveChatValue | null>(null);

export function DelveChatProvider({ children }: { children: React.ReactNode }) {
  const value = useDelveChatInternal();
  return <DelveChatContext.Provider value={value}>{children}</DelveChatContext.Provider>;
}

export function useDelveChat() {
  const ctx = useContext(DelveChatContext);
  if (!ctx) throw new Error("useDelveChat must be used inside DelveChatProvider");
  return ctx;
}