
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ChevronRight, 
  Pin, 
  Tag, 
  Trash2, 
  MoreHorizontal, 
  Menu
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useToast } from '@/components/ui/use-toast';

// Define the chat history type
interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  isPinned?: boolean;
  tag?: {
    name: string;
    color: string;
  };
}

// Mock data for chat history
const mockChatHistory: ChatHistoryItem[] = [
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [visibleChats, setVisibleChats] = useState(3);
  const [pinnedChats, setPinnedChats] = useState<string[]>(
    mockChatHistory.filter(chat => chat.isPinned).map(chat => chat.id)
  );
  
  const { toast } = useToast();
  const { clearMessages } = useChat();
  const navigate = useNavigate();
  
  const toggleDropdown = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the chat
    e.preventDefault(); // Prevent any navigation
    setActiveDropdown(activeDropdown === chatId ? null : chatId);
  };
  
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
    
    setActiveDropdown(null);
  };
  
  const handleAddTag = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the chat
    e.preventDefault(); // Prevent any navigation
    onTagChat(chatId);
    setActiveDropdown(null);
  };
  
  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the chat
    e.preventDefault(); // Prevent any navigation
    toast({
      title: "Chat deleted",
      description: "The chat has been removed from your history.",
      duration: 2000,
    });
    
    setActiveDropdown(null);
  };
  
  const handleChatClick = (chatId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default Link behavior
    
    // Here we would load the specific chat data
    // For demo purposes, we'll just navigate to the chat page
    // In a real app, you'd load the chat by ID from your API
    
    // No need to close sidebar - it stays open as requested
    
    // This is where you would load the chat data
    console.log(`Loading chat ${chatId}`);
    
    // Optional: if we're already on the chat page, we don't need to navigate
    // This prevents unnecessary page reloads
    if (window.location.pathname !== '/chat') {
      navigate('/chat');
    }
  };
  
  const showAllChats = () => {
    setVisibleChats(mockChatHistory.length);
  };
  
  // Sort chats with pinned ones at the top
  const sortedChats = [...mockChatHistory].sort((a, b) => {
    const aIsPinned = pinnedChats.includes(a.id);
    const bIsPinned = pinnedChats.includes(b.id);
    
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
  
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-30 w-72 bg-sidebar shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-sidebar-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-3">
          <Button 
            onClick={() => {
              onNewChat();
              clearMessages();
            }} 
            className="w-full justify-start group bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          >
            <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
            New Chat
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2">
            <h3 className="text-sm font-medium text-sidebar-foreground mb-3">Recent Chats</h3>
            <ul className="space-y-4"> {/* Increased spacing between chat items */}
              {sortedChats.slice(0, visibleChats).map((chat) => (
                <li key={chat.id} className="relative group">
                  <a 
                    href="#"
                    onClick={(e) => handleChatClick(chat.id, e)}
                    className={`flex flex-col text-left rounded-md px-3 py-3 transition-colors text-sm ${
                      chat.tag 
                        ? `hover:bg-opacity-80` 
                        : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                    style={chat.tag ? { 
                      backgroundColor: `${chat.tag.color}25`,
                    } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate flex items-center gap-1 max-w-[82%] text-sm">
                        {pinnedChats.includes(chat.id) && (
                          <Pin className="inline h-3 w-3 text-sidebar-primary" />
                        )}
                        {chat.preview.length > 30 ? chat.preview.substring(0, 30) + '...' : chat.preview}
                        {chat.tag && (
                          <span 
                            className="inline-block px-1.5 py-0.5 text-xs rounded-full text-white ml-1"
                            style={{ backgroundColor: chat.tag.color }}
                          >
                            {chat.tag.name}
                          </span>
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => toggleDropdown(chat.id, e)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </a>
                  
                  {/* Dropdown menu */}
                  {activeDropdown === chat.id && (
                    <div className="absolute right-2 top-10 z-10 bg-popover shadow-md rounded-md py-1 animate-in slide-in-from-top-5 fade-in-20 w-48">
                      <button 
                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={(e) => handlePinChat(chat.id, e)}
                      >
                        <Pin className="mr-2 h-4 w-4" />
                        {pinnedChats.includes(chat.id) ? 'Unpin chat' : 'Pin chat'}
                      </button>
                      <button 
                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={(e) => handleAddTag(chat.id, e)}
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        Add Tag
                      </button>
                      <button 
                        className="flex w-full items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete chat
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            
            {visibleChats < mockChatHistory.length && (
              <button 
                onClick={showAllChats}
                className="text-sm text-sidebar-primary hover:underline mt-4 flex items-center"
              >
                See more
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            )}
          </div>
        </div>
        
        <div className="p-3 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/70">
            <p>© {new Date().getFullYear()} WallStreet AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
