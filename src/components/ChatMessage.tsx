
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
  
  // Format the message content with appropriate line breaks and spacing
  const formatContent = (content: string) => {
    // Split into paragraphs
    return content.split('\n').map((paragraph, i) => (
      <p key={i} className={i > 0 ? 'mt-4' : ''}>
        {paragraph}
      </p>
    ));
  };
  
  return (
    <div 
      ref={messageRef}
      className={cn(
        "flex mb-6 opacity-0",
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
          "chat-bubble max-w-[80%] sm:max-w-[70%]",
          isUser 
            ? "chat-bubble-user rounded-tr-none shadow-md" 
            : "chat-bubble-ai rounded-tl-none shadow-sm"
        )}
      >
        <div className="relative z-10">
          {formatContent(message.content)}
        </div>
        
        {/* Timestamp */}
        <div className={cn(
          "text-[10px] mt-1 opacity-70",
          isUser ? "text-right text-primary-foreground/80" : "text-left text-muted-foreground"
        )}>
          {formatTime(message.timestamp)}
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

// Helper function to format the timestamp
const formatTime = (date: Date) => {
  const now = new Date();
  const isToday = date.getDate() === now.getDate() && 
                 date.getMonth() === now.getMonth() && 
                 date.getFullYear() === now.getFullYear();
  
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  if (isToday) {
    return `Today at ${formattedHours}:${formattedMinutes} ${ampm}`;
  } else {
    return `${date.toLocaleDateString()} at ${formattedHours}:${formattedMinutes} ${ampm}`;
  }
};

export default ChatMessage;
