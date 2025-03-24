
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FinancialModels3D from '@/components/FinancialModels3D';
import { ArrowRight, BarChart3, BookOpen, PiggyBank, Lightbulb, DollarSign, LineChart, TrendingUp, ArrowUpRight } from 'lucide-react';

const Index: React.FC = () => {
  // State for animated items
  const [animatedItemsVisible, setAnimatedItemsVisible] = useState(false);
  
  // Example queries - for visually appealing display only
  const exampleQueries = [
    "Which tech stocks should I be looking at right now?",
    "Explain crypto investing like I'm a complete beginner",
    "How do I build a stock portfolio with $1000?",
    "What's the difference between an ETF and a mutual fund?",
    "Is this a good time to invest in real estate?",
    "What are NFTs and should I invest in them?",
  ];

  // Features of the app
  const features = [
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      title: "Investment Guidance",
      description: "Get personalized advice on stocks, ETFs, bonds, and more"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Market Analysis",
      description: "Understand market trends and make informed decisions"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Learn Finance",
      description: "Simple explanations for complex financial concepts"
    },
    {
      icon: <PiggyBank className="h-8 w-8 text-green-500" />,
      title: "Save & Grow",
      description: "Strategies to maximize your savings and investments"
    }
  ];
  
  // Added financial statistics for visual appeal
  const financialStats = [
    { icon: <DollarSign />, label: "Assets Analyzed", value: "5,000+" },
    { icon: <LineChart />, label: "Market Predictions", value: "95% Accuracy" },
    { icon: <TrendingUp />, label: "Portfolio Growth", value: "32% Average" }
  ];

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedItemsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <FinancialModels3D />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-primary via-amber-500 to-yellow-500" style={{paddingTop: "3rem"}}>
            WallStreet AI
          </h1>
          
          <p className="text-xl text-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Your AI assistant for smarter investing. Get instant, jargon-free answers to all your financial questions and personalized investment advice.
          </p>

          {/* Financial stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {financialStats.map((stat, index) => (
              <div key={index} className="glass-morphism p-4 rounded-xl flex items-center justify-center gap-3 hover:scale-105 transition-all duration-500">
                <div className="bg-primary/20 p-2 rounded-full text-primary">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '350ms' }}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="glass-morphism p-6 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer group"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="relative mb-12">
            <Link to="/chat">
              <Button size="lg" className="group px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 btn-shine bg-gradient-to-r from-primary via-amber-500 to-yellow-500 bg-size-200 hover:bg-pos-100 animate-fade-in relative" style={{ animationDelay: '400ms' }}>
                <span className="text-lg font-medium relative z-10">Go to Chat</span>
                <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
                
                {/* Animated blob */}
                <div className="absolute -inset-px rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-500"></div>
              </Button>
            </Link>
          </div>
          
          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '450ms' }}>
            {['Investing Basics', 'Market Trends', 'Crypto Guide', 'Retirement Planning'].map((link, index) => (
              <Link 
                key={index}
                to="/chat"
                className="flex items-center gap-1 px-4 py-2 rounded-full bg-background/50 hover:bg-background shadow-sm hover:shadow transition-all border border-border text-sm text-foreground"
              >
                {link}
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
          
          {/* Visual preview of example queries */}
          <div className="relative max-w-2xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-full"></div>
            <div className="flex flex-col gap-3 max-h-[40vh] overflow-hidden">
              {exampleQueries.map((query, index) => (
                <div 
                  key={index}
                  className="chat-bubble chat-bubble-user text-left rounded-2xl animate-scale-in"
                  style={{ 
                    animationDelay: `${600 + index * 150}ms`, 
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
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-limited opacity-70">
          <div className="w-6 h-10 rounded-full border-2 border-primary flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse-slow"></div>
          </div>
        </div>
      </section>

      {/* Additional Section - How It Works */}
      <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-background to-background/90">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How WallStreet AI Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Ask Any Finance Question",
                description: "Simply type or speak your question about investing, markets, or financial concepts."
              },
              {
                number: "02",
                title: "Get AI-Powered Insights",
                description: "Our advanced AI analyzes market data and financial literature to provide informed answers."
              },
              {
                number: "03",
                title: "Make Smarter Decisions",
                description: "Use our personalized guidance to make more confident financial decisions."
              }
            ].map((step, index) => (
              <div key={index} className={`relative ${animatedItemsVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${300 + index * 200}ms` }}>
                <div className="text-7xl font-bold text-primary/10 absolute -top-8 -left-2">{step.number}</div>
                <div className="glass-morphism p-6 rounded-xl relative z-10">
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/chat">
              <Button variant="outline" size="lg" className="group">
                Try it now
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
