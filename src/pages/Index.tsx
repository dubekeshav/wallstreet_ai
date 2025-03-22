
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ThreeDBackground from '@/components/ThreeDBackground';
import { ArrowRight, BarChartHorizontal, Compass, Database, LineChart, TrendingUp, Rocket, Calculator, DollarSign } from 'lucide-react';

const Index: React.FC = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Feature items with additional Gen Z appeal
  const features = [
    {
      icon: <LineChart className="w-6 h-6 text-primary" />,
      title: 'Stock Analysis',
      description: 'Get instant insights on any publicly traded company with detailed analysis and personalized recommendations.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: 'Market Trends',
      description: 'Stay ahead with real-time market trends, sector performance, and economic indicators explained in simple terms.',
    },
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: 'Investment Data',
      description: 'Access comprehensive data on mutual funds, ETFs, and other investment vehicles without the financial jargon.',
    },
    {
      icon: <BarChartHorizontal className="w-6 h-6 text-primary" />,
      title: 'Portfolio Management',
      description: 'Get recommendations to optimize your portfolio allocation based on your goals and risk tolerance.',
    },
    {
      icon: <Calculator className="w-6 h-6 text-primary" />,
      title: 'Financial Calculators',
      description: 'Use interactive tools to calculate compound interest, mortgage payments, and retirement savings targets.',
    },
    {
      icon: <DollarSign className="w-6 h-6 text-primary" />,
      title: 'Money Management',
      description: 'Learn practical strategies for budgeting, saving, and making your money work for you in everyday life.',
    },
    {
      icon: <Compass className="w-6 h-6 text-primary" />,
      title: 'Guided Learning',
      description: 'Learn investment concepts and strategies through interactive conversational guidance tailored to your knowledge level.',
    },
    {
      icon: <Rocket className="w-6 h-6 text-primary" />,
      title: 'Future Planning',
      description: 'Get help mapping out your financial future with personalized advice for short and long-term goals.',
    },
  ];
  
  // Example queries - expanded and made more Gen Z friendly
  const exampleQueries = [
    "Which tech stocks are actually worth investing in right now?",
    "Explain ETFs vs mutual funds like I'm a complete beginner",
    "How can I start investing with only $100?",
    "What's the deal with cryptocurrency as an investment?",
    "How do I build a portfolio that matches my values?",
    "Is real estate still a good investment for younger people?",
    "What should I prioritize: paying off student loans or investing?",
    "How can I save for retirement when I'm barely making ends meet?",
  ];
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ThreeDBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
            Your AI Financial Assistant
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-blue-400" style={{ animationDelay: '100ms' }}>
            Finance Made Simple, <br className="hidden md:block" />
            <span className="text-foreground">Just Ask</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Get instant, jargon-free answers to all your financial questions. From stock analysis to investment strategies, our AI assistant helps you navigate your financial journey with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link to="/chat">
              <Button size="lg" className="group px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 btn-shine bg-gradient-to-r from-primary to-blue-400 hover:from-blue-400 hover:to-primary">
                Start Chatting
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-6 rounded-full border-primary/20 hover:border-primary/40 transition-all duration-300"
              onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Features
            </Button>
          </div>
          
          {/* Demo preview - enhanced with gradient borders and modern styling */}
          <div className="relative max-w-4xl mx-auto mb-8 p-[2px] rounded-2xl bg-gradient-to-r from-primary/40 via-blue-400/40 to-purple-400/40 shadow-xl animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-inner">
              <div className="flex flex-col gap-4 p-6">
                {exampleQueries.map((query, index) => (
                  <div 
                    key={index}
                    className="chat-bubble chat-bubble-user text-left rounded-2xl animate-scale-in overflow-hidden"
                    style={{ 
                      animationDelay: `${500 + index * 150}ms`, 
                      opacity: index === 0 ? 1 : (1 - index * 0.12),
                      transform: `scale(${1 - index * 0.05}) translateY(${index * 3}px)`
                    }}
                  >
                    {query}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/30 to-blue-400/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-purple-400/30 to-primary/30 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>
      
      {/* Features Section - with enhanced Gen Z styling */}
      <section 
        ref={featuresRef}
        className="py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-transparent to-secondary/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Powerful Financial Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI assistant brings you comprehensive financial knowledge and analysis tools at your fingertips.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1 opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section - with enhanced Gen Z styling */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to level up your financial knowledge?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Start chatting with our AI financial assistant and get the insights you need to make informed decisions about your future.
          </p>
          
          <Link to="/chat">
            <Button size="lg" className="group px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 btn-shine bg-gradient-to-r from-primary via-blue-500 to-primary bg-size-200 hover:bg-pos-100">
              <span className="text-lg font-medium">Start Your Financial Journey</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-sm">
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
