
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import LoadingDots from '@/components/LoadingDots';
import ChatSidebar from '@/components/ChatSidebar';
import SidebarBackdrop from '@/components/SidebarBackdrop';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Plus } from 'lucide-react';
import TagModal from '@/components/TagModal';

const Chat: React.FC = () => {
  const { messages, isLoading, clearMessages } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  const startNewChat = () => {
    clearMessages();
  };

  const openTagModal = (chatId: string) => {
    setCurrentChatId(chatId);
    setIsTagModalOpen(true);
  };
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/90 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:flex transition-transform duration-300"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 animate-in fade-in-50 zoom-in-95 duration-300" />
              ) : (
                <Menu className="h-5 w-5 animate-in fade-in-50 zoom-in-95 duration-300" />
              )}
            </Button>
            
            {!sidebarOpen && (
              <Button
                variant="outline"
                size="icon"
                onClick={startNewChat}
                className="ml-1 group"
                aria-label="New chat"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
              </Button>
            )}
          </div>
          
          {/* Wallstreet AI Logo */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
            <span className="bg-gradient-to-r from-primary via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              WallStreet AI
            </span>
          </Link>
        </div>
      </header>
      
      {/* Sidebar */}
      <ChatSidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
        onNewChat={startNewChat}
        onTagChat={openTagModal}
      />
      <SidebarBackdrop isOpen={sidebarOpen} onClick={closeSidebar} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20 pb-4 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto w-full">
        <div className="flex-1 flex flex-col glass-morphism rounded-2xl shadow-lg overflow-hidden">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 scroll-shadow"
          >
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isLatest={index === messages.length - 1}
              />
            ))}
            
            {isLoading && (
              <div className="flex mb-4">
                <div className="chat-bubble chat-bubble-ai rounded-tl-none opacity-90">
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>
          
          <ChatInput />
        </div>
      </main>

      {/* Tag Modal */}
      <TagModal 
        isOpen={isTagModalOpen} 
        onClose={() => setIsTagModalOpen(false)}
        chatId={currentChatId}
      />
    </div>
  );
};

export default Chat;
