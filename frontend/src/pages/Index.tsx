
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FinancialModels3D from '@/components/FinancialModels3D';
import { ArrowRight, BarChart3, BookOpen, PiggyBank, Lightbulb, DollarSign, LineChart, TrendingUp } from 'lucide-react';

const Index: React.FC = () => {
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
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">
      <FinancialModels3D />
      
      {/* Top navigation */}
      <header className="absolute top-0 left-0 right-0 z-10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-primary via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              WallStreet AI
            </span>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-primary via-amber-500 to-yellow-500">
            WallStreet AI
          </h1>
          
          <p className="text-xl text-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
            Your AI assistant for smarter investing. Get instant, jargon-free answers to all your financial questions and personalized investment advice.
          </p>

          {/* Financial stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {financialStats.map((stat, index) => (
              <div key={index} className="glass-morphism p-4 rounded-xl flex items-center justify-center gap-3">
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
              <div key={index} className="glass-morphism p-6 rounded-xl hover:scale-105 transition-transform">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <Link to="/chat">
            <Button size="lg" className="group px-8 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 btn-shine bg-gradient-to-r from-primary via-amber-500 to-yellow-500 bg-size-200 hover:bg-pos-100 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <span className="text-lg font-medium">Go to Chat</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
          
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
      </section>
    </div>
  );
};

export default Index;
