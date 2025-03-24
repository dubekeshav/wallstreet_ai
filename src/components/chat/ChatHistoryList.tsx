
import React from 'react';
import { ChevronRight } from 'lucide-react';
import ChatHistoryItem, { ChatHistoryItemData } from './ChatHistoryItem';

interface ChatHistoryListProps {
  chats: ChatHistoryItemData[];
  visibleChats: number;
  pinnedChats: string[];
  onChatClick: (chatId: string, e: React.MouseEvent) => void;
  onPinChat: (chatId: string, e: React.MouseEvent) => void;
  onAddTag: (chatId: string, e: React.MouseEvent) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  onShowMoreChats: () => void;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  chats,
  visibleChats,
  pinnedChats,
  onChatClick,
  onPinChat,
  onAddTag,
  onDeleteChat,
  onShowMoreChats
}) => {
  // Sort chats with pinned ones at the top
  const sortedChats = [...chats].sort((a, b) => {
    const aIsPinned = pinnedChats.includes(a.id);
    const bIsPinned = pinnedChats.includes(b.id);
    
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
  
  return (
    <div className="px-3 py-2">
      <h3 className="text-sm font-medium text-indigo-900 mb-3">Recent Chats</h3>
      {sortedChats.length === 0 ? (
        <div className="text-center py-4 text-sm text-gray-500">
          No chat history yet. Start a new chat!
        </div>
      ) : (
        <ul className="space-y-2">
          {sortedChats.slice(0, visibleChats).map((chat) => (
            <li key={chat.id}>
              <ChatHistoryItem 
                chat={chat}
                isPinned={pinnedChats.includes(chat.id)}
                onChatClick={onChatClick}
                onPinChat={onPinChat}
                onAddTag={onAddTag}
                onDeleteChat={onDeleteChat}
              />
            </li>
          ))}
        </ul>
      )}
      
      {visibleChats < chats.length && (
        <button 
          onClick={onShowMoreChats}
          className="text-sm text-indigo-600 hover:underline mt-4 flex items-center"
        >
          See more
          <ChevronRight className="h-3 w-3 ml-0.5" />
        </button>
      )}
    </div>
  );
};

export default ChatHistoryList;
