import React, { useState, useEffect } from 'react';

interface StreamingTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const StreamingText: React.FC<StreamingTextProps> = ({ 
  text, 
  speed = 20,
  className = ''
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">▋</span>
      )}
    </div>
  );
};

export default StreamingText; 