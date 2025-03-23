
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface ChatSidebarHeaderProps {
  onClose: () => void;
}

const ChatSidebarHeader: React.FC<ChatSidebarHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-sidebar-foreground transition-transform duration-300"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebarHeader;
