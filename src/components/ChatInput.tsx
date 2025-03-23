import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Mic, Paperclip, MicOff } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { toast } from 'sonner';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
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
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };
  
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const fileNames = Array.from(files).map(file => file.name).join(', ');
      toast.success(`File${files.length > 1 ? 's' : ''} uploaded: ${fileNames}`);
      setIsUploading(false);
      
      // For demo, add a message about the uploaded files
      if (files.length === 1 && files[0].type.startsWith('image/')) {
        onSendMessage(`I've uploaded an image: ${files[0].name}. Can you analyze this chart for me?`);
      } else {
        onSendMessage(`I've uploaded: ${fileNames}. Can you analyze this data?`);
      }
    }, 1500);
    
    // Reset the file input so the same file can be selected again
    e.target.value = '';
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      toast.info(`Voice recording stopped (${recordingTime}s)`);
      setRecordingTime(0);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      // In a real app, you would process the recording here
      // Simulate a transcription for demo purposes
      if (recordingTime > 1) {
        setTimeout(() => {
          const demoTranscriptions = [
            "What stocks should I invest in if I'm interested in renewable energy?",
            "How do I start investing with a small budget of $1000?",
            "Can you explain what a P/E ratio is and why it matters?",
            "What's the difference between a bull and bear market?"
          ];
          const randomTranscription = demoTranscriptions[Math.floor(Math.random() * demoTranscriptions.length)];
          setInput(randomTranscription);
          toast.success("Voice transcribed successfully");
        }, 1000);
      }
    } else {
      // Check for microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          toast.info("Voice recording started... speak now");
          
          // Start timer for recording duration
          recordingTimerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
          }, 1000);
        })
        .catch((err) => {
          console.error('Error accessing microphone:', err);
          toast.error('Unable to access microphone. Please check permissions.');
        });
    }
  };
  
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="border-t bg-background/95 backdrop-blur-sm p-4 rounded-b-lg">
      <div className="relative flex flex-col items-end gap-2 max-w-3xl mx-auto">
        <div className="w-full flex items-center gap-2 bg-background rounded-lg border shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition-all p-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`flex-shrink-0 ${isUploading ? 'text-primary animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}
            disabled={disabled || isRecording || isUploading}
            onClick={handleFileClick}
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileChange}
            accept="image/*,application/pdf,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
          
          <textarea
            ref={inputRef}
            className="flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none px-2 py-2 h-10 max-h-[150px]"
            placeholder={isRecording ? `Recording... ${formatRecordingTime(recordingTime)}` : "Ask about stocks, funds, investments..."}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize(e);
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled || isRecording || isUploading}
            rows={1}
          />
          
          <div className="flex items-center gap-1">
            <Button 
              variant={isRecording ? "destructive" : "ghost"}
              size="icon" 
              className={`flex-shrink-0 ${isRecording ? 'text-white animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}
              disabled={disabled || isUploading}
              onClick={toggleRecording}
              aria-label={isRecording ? "Stop recording" : "Start voice recording"}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
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
