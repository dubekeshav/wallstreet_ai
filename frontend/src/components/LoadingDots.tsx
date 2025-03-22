
import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-1.5 px-2 py-1">
      <div className="typing-dot animate-dots-1" />
      <div className="typing-dot animate-dots-2" />
      <div className="typing-dot animate-dots-3" />
    </div>
  );
};

export default LoadingDots;
