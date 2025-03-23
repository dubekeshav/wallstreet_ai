
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  disabled: boolean;
  isRecording: boolean;
  onFileMessage: (message: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  disabled, 
  isRecording, 
  onFileMessage 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
        onFileMessage(`I've uploaded an image: ${files[0].name}. Can you analyze this chart for me?`);
      } else {
        onFileMessage(`I've uploaded: ${fileNames}. Can you analyze this data?`);
      }
    }, 1500);
    
    // Reset the file input so the same file can be selected again
    e.target.value = '';
  };
  
  return (
    <>
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
    </>
  );
};

export default FileUploader;
