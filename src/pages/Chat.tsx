
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import LoadingDots from '@/components/LoadingDots';
import ChatSidebar from '@/components/ChatSidebar';
import SidebarBackdrop from '@/components/SidebarBackdrop';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Plus, ChevronLeft } from 'lucide-react';
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
          
          {/* Back to home */}
          <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Home</span>
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
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to WallStreet AI</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Ask me anything about investing, markets, financial concepts, or get personalized advice.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {[
                  "What stocks should I invest in?",
                  "Explain ETFs vs. mutual funds",
                  "How do I start investing with $500?",
                  "What's happening with tech stocks?"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    className="bg-accent hover:bg-accent/80 text-accent-foreground px-4 py-3 rounded-lg text-sm text-left transition-colors hover:scale-105 transform duration-200"
                    onClick={() => {
                      addMessage(suggestion, 'user');
                      // Simulate a response
                      setIsLoading(true);
                      setTimeout(() => {
                        mockApiResponse(suggestion).then(response => {
                          addMessage(response, 'assistant');
                          setIsLoading(false);
                        });
                      }, 1000);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
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
          )}
          
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

const BarChart3 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="4" height="5" x="3" y="14" rx="1" />
    <rect width="4" height="10" x="10" y="9" rx="1" />
    <rect width="4" height="15" x="17" y="4" rx="1" />
  </svg>
);

export default Chat;
