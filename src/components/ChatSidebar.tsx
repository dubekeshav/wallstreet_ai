
import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { Plus, History, ArrowLeft, ArrowRight, Settings, X } from 'lucide-react';
import Logo from '@/components/Logo';
import ChatHistoryList from './chat/ChatHistoryList';
import NewChatButton from './chat/NewChatButton';
import ChatSidebarHeader from './chat/ChatSidebarHeader';
import ChatSidebarFooter from './chat/ChatSidebarFooter';
import TagModal from './TagModal';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onTagChat: (chatId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onTagChat
}) => {
  const [visibleChats, setVisibleChats] = useState(5);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const { allChats, fetchAllChats, loadChatHistory, pinChat, deleteChat } = useChat();

  // Get pinned chat IDs
  const pinnedChats = allChats
    .filter(chat => chat.isPinned)
    .map(chat => chat.id);

  useEffect(() => {
    fetchAllChats();
  }, [fetchAllChats]);

  const handleShowMoreChats = () => {
    setVisibleChats(prev => prev + 5);
  };

  const handleChatClick = (chatId: string, e: React.MouseEvent) => {
    // Stop propagation to prevent dropdown from closing
    e.stopPropagation();
    loadChatHistory(chatId);
    
    // On mobile, close the sidebar after selecting a chat
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handlePinChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isPinned = pinnedChats.includes(chatId);
    pinChat(chatId, !isPinned);
  };

  const handleAddTag = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChatId(chatId);
    setIsTagModalOpen(true);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  return (
    <>
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-72 flex-shrink-0 flex flex-col overflow-hidden transform transition-transform duration-300 ease-in-out bg-sidebar border-r border-sidebar-border ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <ChatSidebarHeader onClose={onClose} />
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent px-2 py-4">
          <NewChatButton onClick={onNewChat} />
          
          <div className="mt-6">
            <ChatHistoryList 
              chats={allChats}
              visibleChats={visibleChats}
              pinnedChats={pinnedChats}
              onChatClick={handleChatClick}
              onPinChat={handlePinChat}
              onAddTag={handleAddTag}
              onDeleteChat={handleDeleteChat}
              onShowMoreChats={handleShowMoreChats}
            />
          </div>
        </div>
        
        <ChatSidebarFooter />
      </div>
      
      {/* Tag Modal */}
      <TagModal 
        isOpen={isTagModalOpen} 
        onClose={() => setIsTagModalOpen(false)} 
        chatId={selectedChatId} 
      />
    </>
  );
};

export default ChatSidebar;
