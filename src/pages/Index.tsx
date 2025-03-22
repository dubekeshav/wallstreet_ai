
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ThreeDBackground from '@/components/ThreeDBackground';
import { ArrowRight, BarChartHorizontal, Compass, Database, LineChart, TrendingUp } from 'lucide-react';

const Index: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Feature items
  const features = [
    {
      icon: <LineChart className="w-6 h-6 text-primary" />,
      title: 'Stock Analysis',
      description: 'Get insights on any publicly traded company with detailed analysis and recommendations.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: 'Market Trends',
      description: 'Stay updated with the latest market trends, sector performance, and economic indicators.',
    },
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: 'Investment Data',
      description: 'Access comprehensive data on mutual funds, ETFs, and other investment vehicles.',
    },
    {
      icon: <BarChartHorizontal className="w-6 h-6 text-primary" />,
      title: 'Portfolio Management',
      description: 'Get recommendations to optimize your portfolio allocation based on your goals.',
    },
    {
      icon: <Compass className="w-6 h-6 text-primary" />,
      title: 'Guided Learning',
      description: 'Learn investment concepts and strategies through interactive conversational guidance.',
    },
  ];
  
  // Example queries
  const exampleQueries = [
    "What are the best performing tech stocks this quarter?",
    "Explain the difference between ETFs and mutual funds",
    "How should I diversify my investment portfolio?",
    "What's the current outlook for the real estate market?",
    "How do interest rates affect bond prices?",
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <ThreeDBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
            Your AI-Powered Financial Assistant
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
            Make Smarter Investment Decisions with <span className="text-primary">AI</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Get instant, accurate answers to all your financial questions. From stock analysis to investment strategies, our AI assistant helps you navigate the market with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link to="/chat">
              <Button size="lg" className="group px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 btn-shine">
                Try It Now
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-6 rounded-full transition-all duration-300"
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
          
          {/* Demo preview */}
          <div className="relative max-w-4xl mx-auto mb-8 p-1 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 shadow-xl animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="bg-card rounded-xl overflow-hidden shadow-inner">
              <div className="flex flex-col gap-4 p-6">
                {exampleQueries.map((query, index) => (
                  <div 
                    key={index}
                    className="chat-bubble chat-bubble-user text-left rounded-2xl animate-scale-in"
                    style={{ animationDelay: `${500 + index * 200}ms`, opacity: index === 0 ? 1 : 0.5 }}
                  >
                    {query}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent to-secondary/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Financial Insights</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI assistant brings you comprehensive financial knowledge and analysis tools at your fingertips.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your investment strategy?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Start chatting with our AI financial assistant and get the insights you need to make informed decisions.
          </p>
          
          <Link to="/chat">
            <Button size="lg" className="group px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 btn-shine">
              <span className="text-lg">Start Your Financial Journey</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-lg font-semibold">
                Finance<span className="text-primary">IQ</span>
              </span>
            </Link>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
            © {new Date().getFullYear()} FinanceIQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
