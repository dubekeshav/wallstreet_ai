
import React from 'react';

interface SidebarBackdropProps {
  isOpen: boolean;
  onClick: () => void;
}

const SidebarBackdrop: React.FC<SidebarBackdropProps> = ({ isOpen, onClick }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-amber-900/20 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300 ease-in-out"
      onClick={onClick}
      aria-hidden="true"
    />
  );
};

export default SidebarBackdrop;
