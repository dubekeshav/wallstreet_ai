
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Logo from '@/components/Logo';

interface ChatSidebarHeaderProps {
  onClose: () => void;
}

const ChatSidebarHeader: React.FC<ChatSidebarHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 border-b border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100">
      <div className="flex items-center justify-between">
        <Logo className="h-8 w-auto" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-amber-800 transition-transform duration-300 hover:bg-amber-200/50 md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebarHeader;
