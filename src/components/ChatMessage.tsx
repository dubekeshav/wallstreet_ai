import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { User, Bot } from 'lucide-react';
import StreamingText from './StreamingText';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest = false }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-secondary text-secondary-foreground rounded-tl-none'
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <StreamingText 
              text={message.content} 
              className="whitespace-pre-wrap"
              speed={isLatest ? 20 : 0} // Only animate the latest message
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
