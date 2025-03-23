
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  return (
    <div className="p-3">
      <Button 
        onClick={onClick} 
        className="w-full justify-start group bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
      >
        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
        New Chat
      </Button>
    </div>
  );
};

export default NewChatButton;
