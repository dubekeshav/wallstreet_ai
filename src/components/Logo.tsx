
import React from 'react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => {
  return (
    <div className={`flex items-center ${className}`} onClick={onClick}>
      <span className="text-lg font-display font-bold text-primary">WallStreet AI</span>
    </div>
  );
};

export default Logo;
