
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { chatApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sessionId: string | null;
  addMessage: (content: string, sender: 'user' | 'assistant') => void;
  clearMessages: () => void;
  setIsLoading: (isLoading: boolean) => void;
  loadChatHistory: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  allChats: Array<{
    id: string;
    title: string;
    preview: string;
    timestamp: Date;
    isPinned?: boolean;
    tag?: {
      name: string;
      color: string;
    };
  }>;
  fetchAllChats: () => Promise<void>;
  pinChat: (chatId: string, isPinned: boolean) => Promise<void>;
  tagChat: (chatId: string, tagName: string, tagColor: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Helper function to check if message is out of scope
const isOutOfScope = (content: string): boolean => {
  const outOfScopePatterns = [
    /are you (dumb|stupid|idiot)/i,
    /why do you exist/i,
    /what are you/i,
    /who are you/i,
    /are you real/i,
    /are you human/i,
    /are you alive/i,
    /do you have feelings/i,
    /do you think/i,
    /are you conscious/i,
    /are you sentient/i
  ];
  
  return outOfScopePatterns.some(pattern => pattern.test(content));
};

// Helper function to get out of scope response
const getOutOfScopeResponse = (): string => {
  const responses = [
    "I apologize, but I'm focused on providing financial analysis and market insights. How can I help you with that?",
    "I'm here to assist with financial market analysis and insights. What would you like to know about the markets?",
    "Let's focus on financial analysis and market insights. What specific information are you looking for?",
    "I'm specialized in financial market analysis. How can I help you with your investment questions?",
    "I'm here to help with financial analysis. What would you like to know about the markets?"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [allChats, setAllChats] = useState<Array<{
    id: string;
    title: string;
    preview: string;
    timestamp: Date;
    isPinned?: boolean;
    tag?: {
      name: string;
      color: string;
    };
  }>>([]);
  
  const { toast } = useToast();

  // Create a new chat session when the provider mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const session = await chatApi.createNewChat();
        setSessionId(session.session_id);
        console.log('Chat session initialized:', session.session_id);
        
        // Fetch all chats after initializing a new chat
        await fetchAllChats();
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Try to recover by creating a new session
        try {
          const session = await chatApi.createNewChat();
          setSessionId(session.session_id);
          console.log('Recovered chat session:', session.session_id);
        } catch (retryError) {
          console.error('Failed to recover chat session:', retryError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  const fetchAllChats = async () => {
    try {
      const chats = await chatApi.getAllChats();
      setAllChats(chats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch chat history.",
        variant: "destructive",
      });
    }
  };

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
    try {
      setIsLoading(true);
      
      // Check if message is out of scope
      if (isOutOfScope(content)) {
        addMessage(content, 'user');
        addMessage(getOutOfScopeResponse(), 'assistant');
        return;
      }
      
      // Ensure we have a valid session
      if (!sessionId) {
        console.log('No active session, creating new one...');
        const session = await chatApi.createNewChat();
        setSessionId(session.session_id);
        console.log('Created new session:', session.session_id);
      }

      // Add user message immediately
      addMessage(content, 'user');
      
      // Get response from API
      const response = await chatApi.sendMessage(sessionId!, content);
      
      // Add assistant message
      addMessage(response.response, 'assistant');
      
      // Refresh all chats after sending a message to update previews
      await fetchAllChats();
    } catch (error) {
      console.error('Error sending message:', error);
      
      // If the error is due to an invalid session, try to recover
      if (error instanceof Error && error.message.includes('Session not found')) {
        try {
          console.log('Session invalid, creating new one...');
          const session = await chatApi.createNewChat();
          setSessionId(session.session_id);
          console.log('Created new session:', session.session_id);
          
          // Retry sending the message
          const response = await chatApi.sendMessage(session.session_id, content);
          addMessage(response.response, 'assistant');
        } catch (retryError) {
          console.error('Failed to recover from session error:', retryError);
          addMessage("Sorry, I encountered an error. Please try again later.", 'assistant');
        }
      } else {
        addMessage("Sorry, I encountered an error. Please try again later.", 'assistant');
      }
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
      console.log('Cleared messages and created new session:', session.session_id);
      
      // Refresh all chats after creating a new one
      await fetchAllChats();
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
      setSessionId(chatId);
      
      console.log('Loaded chat history for session:', chatId);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history.",
        variant: "destructive", 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const pinChat = async (chatId: string, isPinned: boolean) => {
    try {
      await chatApi.pinChat(chatId, isPinned);
      // Update local state
      setAllChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId ? {...chat, isPinned} : chat
        )
      );
      
      toast({
        title: isPinned ? "Chat pinned" : "Chat unpinned",
        description: isPinned ? "Chat has been pinned to the top." : "Chat has been unpinned.",
      });
    } catch (error) {
      console.error('Error pinning chat:', error);
      toast({
        title: "Error",
        description: "Failed to update pin status.",
        variant: "destructive",
      });
    }
  };
  
  const tagChat = async (chatId: string, tagName: string, tagColor: string) => {
    try {
      await chatApi.tagChat(chatId, tagName, tagColor);
      
      // Update local state
      setAllChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? {...chat, tag: { name: tagName, color: tagColor }} 
            : chat
        )
      );
      
      toast({
        title: "Chat tagged",
        description: `Tagged as "${tagName}".`,
      });
    } catch (error) {
      console.error('Error tagging chat:', error);
      toast({
        title: "Error",
        description: "Failed to add tag.",
        variant: "destructive",
      });
    }
  };
  
  const deleteChat = async (chatId: string) => {
    try {
      await chatApi.deleteChat(chatId);
      
      // Update local state
      setAllChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
      
      // If the current chat was deleted, clear the messages
      if (sessionId === chatId) {
        clearMessages();
      }
      
      toast({
        title: "Chat deleted",
        description: "Chat has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error",
        description: "Failed to delete chat.",
        variant: "destructive",
      });
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
        allChats,
        fetchAllChats,
        pinChat,
        tagChat,
        deleteChat,
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
