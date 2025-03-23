
import React, { useEffect, useRef } from 'react';
import { Message } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { BarChart3, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const isUser = message.sender === 'user';
  
  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLatest]);
  
  return (
    <div 
      ref={messageRef}
      className={cn(
        "flex mb-4 opacity-0",
        isUser ? "justify-end" : "justify-start",
        isLatest ? "animate-fade-in" : "opacity-100"
      )}
    >
      {!isUser && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mr-2 shrink-0">
          <BarChart3 className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div 
        className={cn(
          "chat-bubble",
          isUser 
            ? "chat-bubble-user rounded-tr-none" 
            : "chat-bubble-ai rounded-tl-none"
        )}
      >
        <div className="relative z-10">
          {message.content}
        </div>
      </div>
      
      {isUser && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary ml-2 shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
