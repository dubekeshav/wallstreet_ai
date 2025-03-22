
import React, { useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import LoadingDots from '@/components/LoadingDots';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chat: React.FC = () => {
  const { messages, isLoading, clearMessages } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col pt-24 pb-4 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground group">
              <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearMessages}
            className="text-muted-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            New Chat
          </Button>
        </div>
        
        <div className="flex-1 flex flex-col glass-morphism rounded-lg shadow-lg">
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
    </div>
  );
};

export default Chat;
