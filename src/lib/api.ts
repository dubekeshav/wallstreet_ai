import { ChatMessage, ChatResponse, ChatSession } from '@/types/chat';

const API_BASE_URL = 'http://localhost:8000';

export const chatApi = {
  // Create a new chat session
  createNewChat: async (): Promise<ChatSession> => {
    const response = await fetch(`${API_BASE_URL}/chat/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to create new chat session');
    }
    
    return response.json();
  },

  // Send a message and get response
  sendMessage: async (sessionId: string, query: string): Promise<ChatResponse> => {
    const response = await fetch(`${API_BASE_URL}/chat/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        query,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  },

  // Get chat history
  getChatHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_BASE_URL}/chat/history/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get chat history');
    }
    
    return response.json();
  },
}; 