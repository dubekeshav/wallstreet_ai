
import axios from 'axios';
import { ChatMessage } from '@/types/chat';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatApi = {
  createNewChat: async () => {
    const response = await api.post('/chat/new');
    return response.data;
  },

  sendMessage: async (sessionId: string, query: string) => {
    const response = await api.post('/chat/send', {
      session_id: sessionId,
      query,
    });
    return response.data;
  },

  getChatHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/chat/history/${sessionId}`);
    const messages = response.data;
    
    // Convert API response format to our ChatMessage format
    return messages.map((msg: any) => ({
      id: `msg-${msg.timestamp || Date.now()}`,
      content: msg.content,
      sender: msg.role === 'user' ? 'user' : 'assistant',
      timestamp: msg.timestamp ? new Date(msg.timestamp * 1000) : new Date(),
      sources: msg.sources,
    }));
  },
  
  getAllChats: async () => {
    const response = await api.get('/chat/chats');
    return response.data.map((chat: any) => ({
      id: chat.id,
      title: chat.preview,
      preview: chat.preview,
      timestamp: new Date(chat.timestamp * 1000),
      isPinned: chat.pinned,
      tag: chat.tag,
    }));
  },
  
  pinChat: async (sessionId: string, pinned: boolean) => {
    const response = await api.post('/chat/pin', {
      session_id: sessionId,
      pinned,
    });
    return response.data;
  },
  
  tagChat: async (sessionId: string, tagName: string, tagColor: string) => {
    const response = await api.post('/chat/tag', {
      session_id: sessionId,
      tag_name: tagName,
      tag_color: tagColor,
    });
    return response.data;
  },
  
  deleteChat: async (sessionId: string) => {
    const response = await api.delete(`/chat/delete/${sessionId}`);
    return response.data;
  },
};

export default api;
