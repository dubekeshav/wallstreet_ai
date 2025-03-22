
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Mic, Image, Paperclip } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { toast } from 'sonner';

const mockApiResponse = (query: string): Promise<string> => {
  // This is where you would call your actual API
  console.log('Sending query to API:', query);
  
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Sample responses based on query keywords
      if (query.toLowerCase().includes('stock') || query.toLowerCase().includes('stocks')) {
        resolve("Stocks are ownership shares in a company. When you buy a stock, you're buying a small piece of that company. Stock prices can fluctuate based on company performance, market conditions, and investor sentiment. It's important to research before investing and consider your risk tolerance.");
      } else if (query.toLowerCase().includes('mutual fund')) {
        resolve("Mutual funds pool money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities. They're professionally managed, which can be good for beginners. They typically have higher fees than ETFs but may offer active management strategies.");
      } else if (query.toLowerCase().includes('etf')) {
        resolve("Exchange-Traded Funds (ETFs) are similar to mutual funds in that they hold a basket of securities, but they trade on exchanges like stocks. They generally have lower fees than mutual funds and offer intraday trading. Many ETFs track specific indexes or sectors.");
      } else if (query.toLowerCase().includes('bond')) {
        resolve("Bonds are debt securities where you loan money to an entity (government or company) in exchange for periodic interest payments and the return of the bond's face value when it matures. They're generally considered less risky than stocks but offer lower potential returns over the long term.");
      } else if (query.toLowerCase().includes('invest') || query.toLowerCase().includes('investing')) {
        resolve("Investing is the process of putting money into assets with the expectation of generating income or profit over time. The key to successful investing is diversification, understanding your time horizon, and managing risk appropriately. Consider speaking with a financial advisor to develop a personalized investment strategy.");
      } else {
        resolve("Thank you for your question about finance. For the most accurate information, try asking about specific investment types like stocks, bonds, mutual funds, or ETFs. I'm also happy to explain concepts like diversification, risk management, or how different market conditions might affect your investments.");
      }
    }, 1500);
  });
};

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, isLoading, setIsLoading } = useChat();
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    // Add user message to chat
    addMessage(userMessage, 'user');
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Get response from API
      const response = await mockApiResponse(userMessage);
      
      // Add assistant response
      addMessage(response, 'assistant');
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };
  
  return (
    <div className="border-t bg-background/95 backdrop-blur-sm p-4 rounded-b-lg">
      <div className="relative flex flex-col items-end gap-2 max-w-3xl mx-auto">
        <div className="w-full flex items-center gap-2 bg-background rounded-lg border shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition-all p-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="flex-shrink-0 text-muted-foreground hover:text-foreground" 
            disabled={isLoading}
            onClick={() => toast.info("Attachment functionality coming soon!")}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <textarea
            ref={inputRef}
            className="flex-1 resize-none bg-transparent border-0 focus:ring-0 focus:outline-none px-2 py-2 h-10 max-h-[150px]"
            placeholder="Ask about stocks, funds, investments..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize(e);
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0 text-muted-foreground hover:text-foreground" 
              disabled={isLoading}
              onClick={() => toast.info("Image upload functionality coming soon!")}
            >
              <Image className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0 text-muted-foreground hover:text-foreground" 
              disabled={isLoading}
              onClick={() => toast.info("Voice input functionality coming soon!")}
            >
              <Mic className="h-5 w-5" />
            </Button>
            
            <Button 
              onClick={handleSubmit} 
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 group transition-transform hover:scale-105 active:scale-95 disabled:scale-100"
            >
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground px-2">
          FinanceIQ may display inaccurate information, including about people, finance, or investments.
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
