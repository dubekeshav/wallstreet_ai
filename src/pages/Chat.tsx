
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import { BarChart3, Menu, X } from 'lucide-react';
import ChatInput from '@/components/ChatInput';
import ChatMessage from '@/components/ChatMessage';
import ChatSidebar from '@/components/ChatSidebar';
import SidebarBackdrop from '@/components/SidebarBackdrop';
import LoadingDots from '@/components/LoadingDots';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/Logo';
import TagModal from '@/components/TagModal';

const Chat = () => {
  const navigate = useNavigate();
  const { messages, isLoading, clearMessages, sendMessage, sessionId } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Function to scroll to the last message
  const scrollToLastMessage = useCallback(() => {
    if (lastMessageRef.current && chatContainerRef.current) {
      const container = chatContainerRef.current;
      const messageElement = lastMessageRef.current;
      
      // Get container dimensions
      const containerHeight = container.clientHeight;
      const containerScrollHeight = container.scrollHeight;
      
      // Get message position
      const messageTop = messageElement.offsetTop;
      const messageHeight = messageElement.clientHeight;
      
      // Calculate the scroll position to show the message
      const scrollPosition = messageTop - (containerHeight / 2) + (messageHeight / 2);
      
      // Ensure we don't scroll past the container bounds
      const maxScroll = containerScrollHeight - containerHeight;
      const finalScrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll));
      
      // Apply the scroll position with smooth behavior
      container.scrollTo({
        top: finalScrollPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Function to scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Handle scrolling based on message changes and loading state
  useEffect(() => {
    if (messages.length > 0) {
      // If we're loading (streaming response), scroll to last message
      if (isLoading) {
        scrollToLastMessage();
      } else {
        // If not loading, scroll to bottom
        scrollToBottom();
      }
    }
  }, [messages, isLoading, scrollToLastMessage, scrollToBottom]);

  // Handle sending messages
  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [sendMessage]);
  
  const openTagModal = () => {
    if (sessionId) {
      setIsTagModalOpen(true);
    }
  };
  
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar overlay backdrop (mobile) */}
      {isMobile && (
        <SidebarBackdrop 
          isOpen={isSidebarOpen} 
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <ChatSidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
        onNewChat={clearMessages}
        onTagChat={openTagModal}
      />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-gradient-to-b from-background to-secondary/5">
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-16 border-b border-border z-30 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center">
            <button 
              className="mr-4 p-2 rounded-full hover:bg-secondary transition-colors relative"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 transition-transform duration-300" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-300" />
              )}
            </button>
            
            <Logo onClick={() => navigate('/')} className="cursor-pointer" />
          </div>
          
          <div className="flex items-center">
            <button 
              className="flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              onClick={() => navigate('/')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Home
            </button>
          </div>
        </header>
        
        {/* Chat container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto pt-4 px-4 md:px-6 pb-32 scroll-shadow"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-amber-500 mb-4 text-white shadow-lg">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-center mb-2">Welcome to WallStreet AI</h1>
              <p className="text-center text-muted-foreground mb-8 max-w-xl">
                Hi, I am Wallstreet AI — your finance companion and tutor. I help you understand various assets, 
                financial terminologies, market insights, and much more.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {["What's a good investment strategy for beginners?", 
                  "Explain the difference between stocks and bonds.", 
                  "What are ETFs and how do they work?", 
                  "How should I diversify my portfolio?"].map((suggestion, i) => (
                  <button 
                    key={i}
                    className="p-4 text-left rounded-xl border border-border hover:bg-secondary/50 transition-colors"
                    onClick={() => handleSendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full mx-auto">
              {messages.map((message, index) => (
                <div 
                  key={message.id}
                  ref={index === messages.length - 1 ? lastMessageRef : undefined}
                >
                  <ChatMessage 
                    message={message}
                    isLatest={index === messages.length - 1} 
                  />
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4 max-w-[80%]">
                  <div className="bg-secondary rounded-2xl rounded-tl-none shadow-sm px-4 py-3">
                    <LoadingDots />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className="fixed bottom-0 left-0 right-0 p-4 md:px-6 bg-gradient-to-t from-background via-background/95 to-transparent pb-6">
          <div className="mx-auto w-full md:pl-[72px]">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
      
      {/* Tag Modal */}
      <TagModal 
        isOpen={isTagModalOpen} 
        onClose={() => setIsTagModalOpen(false)} 
        chatId={sessionId} 
      />
    </div>
  );
};

export default Chat;
