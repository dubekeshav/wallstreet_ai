
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThreeDBackground from '@/components/ThreeDBackground';
import { ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  // Example queries - for visually appealing display only
  const exampleQueries = [
    "Which tech stocks should I be looking at right now?",
    "Explain crypto investing like I'm a complete beginner",
    "How do I build a stock portfolio with $1000?",
    "What's the difference between an ETF and a mutual fund?",
    "Is this a good time to invest in real estate?",
    "What are NFTs and should I invest in them?",
    "How do I start investing while paying off student loans?",
    "What are some passive income strategies?",
  ];
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <ThreeDBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-blue-400">
            WallStreet AI
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Your AI assistant for finance and investments. Get instant, jargon-free answers to all your financial questions.
          </p>
          
          <Link to="/chat">
            <Button size="lg" className="group px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 btn-shine bg-gradient-to-r from-primary via-blue-500 to-primary bg-size-200 hover:bg-pos-100 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <span className="text-lg font-medium">Go to Chat</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          
          {/* Visual preview of example queries */}
          <div className="relative max-w-2xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-full"></div>
            <div className="flex flex-col gap-3 max-h-[40vh] overflow-hidden">
              {exampleQueries.map((query, index) => (
                <div 
                  key={index}
                  className="chat-bubble chat-bubble-user text-left rounded-2xl animate-scale-in"
                  style={{ 
                    animationDelay: `${500 + index * 150}ms`, 
                    opacity: 1 - (index * 0.12),
                    transform: `scale(${1 - index * 0.05}) translateY(${index * 3}px)`
                  }}
                >
                  {query}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
