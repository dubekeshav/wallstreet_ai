import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { chatApi } from '@/lib/api';

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string | null;
  addMessage: (content: string, sender: 'user' | 'assistant') => void;
  clearMessages: () => void;
  setIsLoading: (isLoading: boolean) => void;
  loadChatHistory: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Create a new chat session when the provider mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const session = await chatApi.createNewChat();
        setSessionId(session.session_id);
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async (content: string) => {
    if (!sessionId) {
      console.error('No active chat session');
      return;
    }

    try {
      setIsLoading(true);
      // Add user message immediately
      addMessage(content, 'user');
      
      // Get response from API
      const response = await chatApi.sendMessage(sessionId, content);
      
      // Add assistant message with empty content first
      const assistantMessageId = `msg-${Date.now()}`;
      addMessage('', 'assistant');
      
      // Update the message with the actual content
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: response.response }
          : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage("Sorry, I encountered an error. Please try again later.", 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = async () => {
    try {
      setIsLoading(true);
      const session = await chatApi.createNewChat();
      setSessionId(session.session_id);
      setMessages([]);
    } catch (error) {
      console.error('Error starting new chat:', error);
      // Fallback to just clearing messages if API fails
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatHistory = async (chatId: string) => {
    try {
      setIsLoading(true);
      const history = await chatApi.getChatHistory(chatId);
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        sessionId,
        addMessage,
        clearMessages,
        setIsLoading,
        loadChatHistory,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
