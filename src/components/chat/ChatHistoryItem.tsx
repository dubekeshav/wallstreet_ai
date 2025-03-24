
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pin, Tag, Trash2, MoreHorizontal } from 'lucide-react';

export interface ChatHistoryItemData {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  isPinned?: boolean;
  tag?: {
    name: string;
    color: string;
  };
}

interface ChatHistoryItemProps {
  chat: ChatHistoryItemData;
  isPinned: boolean;
  onChatClick: (chatId: string, e: React.MouseEvent) => void;
  onPinChat: (chatId: string, e: React.MouseEvent) => void;
  onAddTag: (chatId: string, e: React.MouseEvent) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  chat,
  isPinned,
  onChatClick,
  onPinChat,
  onAddTag,
  onDeleteChat
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  return (
    <div className="relative group">
      <div 
        className={`flex flex-col text-left rounded-md px-3 py-3 transition-colors text-sm ${
          chat.tag 
            ? `hover:bg-opacity-80 cursor-pointer` 
            : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer'
        }`}
        style={chat.tag ? { 
          backgroundColor: `${chat.tag.color}25`,
        } : {}}
        onClick={(e) => onChatClick(chat.id, e)}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium truncate flex items-center gap-1.5 max-w-[82%] text-xs">
            {isPinned && (
              <Pin className="inline h-4 w-4 text-primary fill-primary" />
            )}
            {chat.preview.length > 30 ? chat.preview.substring(0, 30) + '...' : chat.preview}
            {chat.tag && (
              <span 
                className="inline-block px-1.5 py-0.5 text-[10px] rounded-full text-white ml-1 shadow-sm"
                style={{ backgroundColor: chat.tag.color }}
              >
                {chat.tag.name}
              </span>
            )}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={toggleDropdown}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-2 top-10 z-10 bg-popover shadow-md rounded-md py-1 animate-in slide-in-from-top-5 fade-in-20 w-48">
          <button 
            className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => onPinChat(chat.id, e)}
          >
            <Pin className="mr-2 h-4 w-4" stroke={isPinned ? "currentColor" : "currentColor"} fill={isPinned ? "currentColor" : "none"} />
            {isPinned ? 'Unpin chat' : 'Pin chat'}
          </button>
          <button 
            className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => onAddTag(chat.id, e)}
          >
            <Tag className="mr-2 h-4 w-4" />
            Add Tag
          </button>
          <button 
            className="flex w-full items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            onClick={(e) => onDeleteChat(chat.id, e)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHistoryItem;
