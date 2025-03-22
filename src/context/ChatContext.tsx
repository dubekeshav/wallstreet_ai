
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define message types
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Define context type
interface ChatContextType {
  messages: Message[];
  addMessage: (content: string, sender: 'user' | 'assistant') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create provider
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your WallStreet AI assistant. Ask me anything about stocks, mutual funds, ETFs, or other investments.",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm your WallStreet AI assistant. Ask me anything about stocks, mutual funds, ETFs, or other investments.",
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
  };

  // Create the value object
  const value = {
    messages,
    addMessage,
    isLoading,
    setIsLoading,
    clearMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Create hook for using the context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};
