
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import ChatInputField from '@/components/chat/ChatInputField';
import FileUploader from '@/components/chat/FileUploader';
import VoiceRecorder from '@/components/chat/VoiceRecorder';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = async () => {
    if (!input.trim() || disabled) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    // Send message
    await onSendMessage(userMessage);
  };
  
  const handleVoiceTranscription = (text: string) => {
    setInput(text);
    setIsRecording(false);
  };
  
  const handleFileMessage = async (message: string) => {
    setIsUploading(false);
    await onSendMessage(message);
  };
  
  return (
    <div className="border-t bg-background/95 backdrop-blur-sm p-4 rounded-b-lg">
      <div className="relative flex flex-col items-end gap-2 max-w-3xl mx-auto">
        <div className="w-full flex items-center gap-2 bg-background rounded-lg border shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition-all p-1">
          <FileUploader 
            disabled={disabled} 
            isRecording={isRecording}
            onFileMessage={handleFileMessage}
          />
          
          <ChatInputField
            input={input}
            isDisabled={disabled}
            isRecording={isRecording}
            isUploading={isUploading}
            placeholder={isRecording ? `Recording...` : "Ask about stocks, funds, investments..."}
            onChange={setInput}
            onSubmit={handleSubmit}
          />
          
          <div className="flex items-center gap-1">
            <VoiceRecorder
              disabled={disabled}
              isUploading={isUploading}
              onTranscription={handleVoiceTranscription}
            />
            
            <Button 
              onClick={handleSubmit} 
              disabled={(!input.trim() && !isRecording) || disabled || isUploading}
              className="flex-shrink-0 group transition-transform hover:scale-105 active:scale-95 disabled:scale-100"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground px-2">
          WallStreet AI may display inaccurate information, including about people, finance, or investments.
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
