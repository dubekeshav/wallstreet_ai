
import React from 'react';

const ChatSidebarFooter: React.FC = () => {
  return (
    <div className="p-3 border-t border-sidebar-border">
      <div className="text-xs text-sidebar-foreground/70">
        <p>© {new Date().getFullYear()} WallStreet AI</p>
      </div>
    </div>
  );
};

export default ChatSidebarFooter;
