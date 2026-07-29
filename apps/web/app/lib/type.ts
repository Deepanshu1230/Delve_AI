export type Role = "User" | "Assistant";

export interface Source {
  url: string;
  favicon?: string;
  image?: string | null;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  sources?: Source[];
  images?: string[];   // separate top-level gallery, unrelated to individual sources
  followups?: string[];
  isStreaming?: boolean;
}