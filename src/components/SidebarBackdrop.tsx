
import React from 'react';

interface SidebarBackdropProps {
  isOpen: boolean;
  onClick: () => void;
}

const SidebarBackdrop: React.FC<SidebarBackdropProps> = ({ isOpen, onClick }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 md:hidden"
      onClick={onClick}
      aria-hidden="true"
    />
  );
};

export default SidebarBackdrop;
