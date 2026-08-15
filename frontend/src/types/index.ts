export interface User {
  id: number;
  full_name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface KnowledgeBase {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export type DocumentStatus = "PENDING" | "PROCESSING" | "PROCESSED" | "FAILED";

export interface Document {
  id: number;
  kb_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  description?: string;
  doc_status: DocumentStatus;
  user_id: number;
  created_at: string;
  updated_at: string;
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
  full_name: string;
}

export interface QueryResponse {
  answer: string;
  sources: SourceCitation[];
}

