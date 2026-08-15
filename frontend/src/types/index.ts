export interface User {
  id: number;
  full_name: string;
  email: string;
}

export interface KnowledgeBase {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  document_count?: number;
}

export type DocumentStatus = "uploaded" | "processing" | "completed" | "failed";

export interface Document {
  id: number;
  filename: string;
  file_type: string;
  status: DocumentStatus;
  error_message: string | null;
  created_at: string;
}

export interface SourceCitation {
  document_id: number;
  filename: string;
  chunk_index: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitation[];
  timestamp: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: User;
}

export interface QueryResponse {
  answer: string;
  sources: SourceCitation[];
}
