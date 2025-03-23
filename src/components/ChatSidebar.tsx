
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import { useToast } from '@/components/ui/use-toast';
import ChatSidebarHeader from '@/components/chat/ChatSidebarHeader';
import NewChatButton from '@/components/chat/NewChatButton';
import ChatHistoryList from '@/components/chat/ChatHistoryList';
import ChatSidebarFooter from '@/components/chat/ChatSidebarFooter';
import { ChatHistoryItemData } from '@/components/chat/ChatHistoryItem';

// Mock data for chat history
const mockChatHistory: ChatHistoryItemData[] = [
  {
    id: '1',
    title: 'Stock Analysis',
    preview: 'What are the best performing tech stocks this quarter?',
    timestamp: new Date(2023, 6, 12),
    isPinned: true,
    tag: {
      name: 'Stocks',
      color: '#FF8C00'
    }
  },
  {
    id: '2',
    title: 'Investment Strategy',
    preview: 'How should I diversify my investment portfolio?',
    timestamp: new Date(2023, 6, 11)
  },
  {
    id: '3',
    title: 'ETFs vs Mutual Funds',
    preview: 'What are the main differences between ETFs and mutual funds?',
    timestamp: new Date(2023, 6, 10),
    tag: {
      name: 'Learning',
      color: '#4682B4'
    }
  },
  {
    id: '4',
    title: 'Real Estate Investment',
    preview: 'Is real estate a good investment in the current market?',
    timestamp: new Date(2023, 6, 9)
  },
  {
    id: '5',
    title: 'Retirement Planning',
    preview: 'What are the best strategies for retirement planning in my 30s?',
    timestamp: new Date(2023, 6, 8),
    tag: {
      name: 'Retirement',
      color: '#2E8B57'
    }
  }
];

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onTagChat: (chatId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose, onNewChat, onTagChat }) => {
  const [visibleChats, setVisibleChats] = useState(3);
  const [pinnedChats, setPinnedChats] = useState<string[]>(
    mockChatHistory.filter(chat => chat.isPinned).map(chat => chat.id)
  );
  
  const { toast } = useToast();
  const { clearMessages, loadChatHistory } = useChat();
  
  const handlePinChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the chat
    e.preventDefault(); // Prevent any navigation
    setPinnedChats(prev => 
      prev.includes(chatId) 
        ? prev.filter(id => id !== chatId) 
        : [...prev, chatId]
    );
    
    toast({
      title: pinnedChats.includes(chatId) ? "Chat unpinned" : "Chat pinned",
      duration: 2000,
    });
  };
  
  const handleAddTag = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the chat
    e.preventDefault(); // Prevent any navigation
    onTagChat(chatId);
  };
  
  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the chat
    e.preventDefault(); // Prevent any navigation
    toast({
      title: "Chat deleted",
      description: "The chat has been removed from your history.",
      duration: 2000,
    });
  };
  
  const handleChatClick = (chatId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default Link behavior
    
    // Find the chat with this ID
    const chat = mockChatHistory.find(c => c.id === chatId);
    
    if (chat) {
      console.log(`Loading chat ${chatId}: ${chat.preview}`);
      // Load this chat's history without closing the sidebar
      loadChatHistory(chatId);
    }
  };
  
  const handleNewChat = () => {
    onNewChat();
    clearMessages();
  };
  
  const showAllChats = () => {
    setVisibleChats(mockChatHistory.length);
  };
  
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-30 w-72 bg-sidebar shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <ChatSidebarHeader onClose={onClose} />
        <NewChatButton onClick={handleNewChat} />
        
        <div className="flex-1 overflow-y-auto">
          <ChatHistoryList 
            chats={mockChatHistory}
            visibleChats={visibleChats}
            pinnedChats={pinnedChats}
            onChatClick={handleChatClick}
            onPinChat={handlePinChat}
            onAddTag={handleAddTag}
            onDeleteChat={handleDeleteChat}
            onShowMoreChats={showAllChats}
          />
        </div>
        
        <ChatSidebarFooter />
      </div>
    </div>
  );
};

export default ChatSidebar;
