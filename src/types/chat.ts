export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  sources?: string;
}

export interface ChatResponse {
  response: string;
  sources?: string;
}

export interface ChatSession {
  session_id: string;
  message: string;
} 