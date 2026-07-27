export type Role = "User" | "Assistant";

export interface Source {
  url: string;
  favicon?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  sources?: Source[];
  followups?: string[];
  isStreaming?: boolean;
}