
import React, { useState, useContext, ReactNode, createContext } from 'react';

export type MessageSender = 'user' | 'assistant';

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  addMessage: (content: string, sender: MessageSender) => void;
  clearMessages: () => void;
  setIsLoading: (isLoading: boolean) => void;
  loadChatHistory: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample chat histories for demo
  const chatHistories: Record<string, Message[]> = {
    '1': [
      {
        id: '1-1',
        content: 'What are the best performing tech stocks this quarter?',
        sender: 'user',
        timestamp: new Date(2023, 6, 12, 10, 0)
      },
      {
        id: '1-2',
        content: 'Based on recent market data, the top performing tech stocks this quarter include NVIDIA (NVDA), which has seen significant growth due to AI demand, Apple (AAPL) with strong iPhone sales, and Microsoft (MSFT) with cloud services growth. AMD has also performed well with new chip releases. Remember that past performance doesn\'t guarantee future results, and it\'s always wise to diversify your investments.',
        sender: 'assistant',
        timestamp: new Date(2023, 6, 12, 10, 1)
      }
    ],
    '2': [
      {
        id: '2-1',
        content: 'How should I diversify my investment portfolio?',
        sender: 'user',
        timestamp: new Date(2023, 6, 11, 14, 30)
      },
      {
        id: '2-2',
        content: 'A well-diversified portfolio typically includes a mix of asset classes such as stocks, bonds, and cash equivalents. Within stocks, consider diversifying across different sectors (tech, healthcare, consumer goods) and geographies (US, international markets). Also include different market caps (large, mid, small). For bonds, vary between government, municipal, and corporate bonds with different maturities. Consider adding alternative investments like REITs or commodities depending on your risk tolerance and investment timeline.',
        sender: 'assistant',
        timestamp: new Date(2023, 6, 11, 14, 32)
      }
    ],
    // Add more sample histories as needed
  };

  const addMessage = (content: string, sender: MessageSender) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const loadChatHistory = (chatId: string) => {
    const history = chatHistories[chatId];
    if (history) {
      setMessages(history);
    } else {
      console.log(`No history found for chat ID: ${chatId}`);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        addMessage,
        clearMessages,
        setIsLoading,
        loadChatHistory
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
