
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-background/80 backdrop-blur-lg shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
          >
            About
          </Link>
          <Link 
            to="/features" 
            className="text-foreground/80 hover:text-foreground transition-colors font-medium"
          >
            Features
          </Link>
        </nav>
        
        <Link to="/chat">
          <Button 
            className="group btn-shine shadow-md"
          >
            Get Started
            <ChevronRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
