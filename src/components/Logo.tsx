
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface LogoProps {
  variant?: 'default' | 'simple';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <BarChart3 
          className="text-primary w-6 h-6 animate-pulse-slow" 
          strokeWidth={2.5} 
        />
        <div className="absolute -inset-0.5 bg-primary/20 rounded-md blur-sm animate-pulse-slow" />
      </div>
      {variant !== 'simple' && (
        <span className="font-display font-bold text-xl tracking-tight">
          Finance<span className="text-primary">IQ</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
