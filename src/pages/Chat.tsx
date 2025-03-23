
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '@/context/ChatContext';
import { BarChart3, Menu } from 'lucide-react';
import ChatInput from '@/components/ChatInput';
import ChatMessage from '@/components/ChatMessage';
import ChatSidebar from '@/components/ChatSidebar';
import SidebarBackdrop from '@/components/SidebarBackdrop';
import LoadingDots from '@/components/LoadingDots';
import { useIsMobile } from '@/hooks/use-mobile';
import Logo from '@/components/Logo';

const Chat = () => {
  const navigate = useNavigate();
  const { messages, addMessage, isLoading, setIsLoading, clearMessages } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Mock sending a message to the API
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to the chat
    addMessage(message, 'user');
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Mock API call delay
      setTimeout(() => {
        const mockApiResponse = "Based on my analysis, investing in diversified ETFs such as VTI, VOO, or QQQ could be a good option for long-term growth. These provide exposure to a broad range of companies while minimizing risk compared to individual stocks. For beginners, I recommend starting with a small amount you're comfortable with, and consistently adding to your investments over time through dollar-cost averaging. Remember that past performance doesn't guarantee future results, and it's always good to do your own research or consult with a financial advisor.";
        addMessage(mockApiResponse, 'assistant');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      addMessage("Sorry, I encountered an error. Please try again later.", 'assistant');
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
        onTagChat={(chatId) => {
          // Placeholder for tag functionality
          console.log(`Adding tag to chat ${chatId}`);
        }}
      />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-16 border-b border-border z-30">
          <div className="flex items-center">
            <button 
              className="mr-4 p-2 rounded-full hover:bg-secondary transition-colors relative"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <Menu className={`w-5 h-5 transition-transform duration-300 ${isSidebarOpen ? 'rotate-90' : ''}`} />
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
        <div className="flex-1 overflow-y-auto pt-4 px-4 md:px-8 pb-24 scroll-shadow">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-center mb-2">Welcome to WallStreet AI</h1>
              <p className="text-center text-muted-foreground mb-8">
                I'm your personal financial assistant. Ask me anything about investments, 
                stocks, or financial concepts.
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
            <div className="max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                  isLatest={index === messages.length - 1} 
                />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4 max-w-[80%]">
                  <div className="bg-secondary rounded-2xl rounded-tl-none shadow-sm px-4 py-3">
                    <LoadingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:px-8 bg-gradient-to-t from-background to-background/80 pb-6">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
