
import React, { useRef, KeyboardEvent, ChangeEvent } from 'react';

interface ChatInputFieldProps {
  input: string;
  isDisabled: boolean;
  isRecording: boolean;
  isUploading: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const ChatInputField: React.FC<ChatInputFieldProps> = ({
  input,
  isDisabled,
  isRecording,
  isUploading,
  placeholder,
  onChange,
  onSubmit
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };
  
  const autoResize = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    
    onChange(e.target.value);
  };
  
  return (
    <textarea
      ref={inputRef}
      className="flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none px-2 py-2 h-10 max-h-[150px]"
      placeholder={placeholder}
      value={input}
      onChange={autoResize}
      onKeyDown={handleKeyDown}
      disabled={isDisabled || isRecording || isUploading}
      rows={1}
    />
  );
};

export default ChatInputField;
