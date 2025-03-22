
import React, { useEffect, useRef } from 'react';

const ThreeDBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Set canvas size
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Define particles
    const particlesArray: Particle[] = [];
    const numberOfParticles = Math.min(width, height) / 10;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        
        // Financial-themed color palette
        const colors = [
          'rgba(79, 70, 229, 0.7)',  // Indigo
          'rgba(6, 182, 212, 0.7)',   // Cyan
          'rgba(16, 185, 129, 0.7)',  // Emerald (green for profit)
          'rgba(245, 158, 11, 0.7)',  // Amber (gold for finance)
          'rgba(236, 72, 153, 0.7)',  // Pink
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y > height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const createParticles = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    
    const connectParticles = () => {
      if (!ctx) return;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect particles within a certain distance
          if (distance < Math.min(width, height) / 10) {
            // Create a gradient between two particles
            const gradient = ctx.createLinearGradient(
              particlesArray[a].x, 
              particlesArray[a].y, 
              particlesArray[b].x, 
              particlesArray[b].y
            );
            
            gradient.addColorStop(0, particlesArray[a].color);
            gradient.addColorStop(1, particlesArray[b].color);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            
            // Make lines more transparent the further apart particles are
            ctx.globalAlpha = (1 - distance / (Math.min(width, height) / 8)) * 0.5;
            
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };
    
    const animate = () => {
      if (!ctx) return;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(30, 41, 59, 0.05)');  // Slate-800 with low opacity
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.1)');   // Slate-900 with low opacity
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      connectParticles();
      requestAnimationFrame(animate);
    };
    
    // Handle mouse interaction
    const mouse = {
      x: undefined as number | undefined,
      y: undefined as number | undefined,
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
      
      // Attract particles to mouse
      for (let i = 0; i < particlesArray.length; i++) {
        const dx = mouse.x! - particlesArray[i].x;
        const dy = mouse.y! - particlesArray[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (300 - distance) / 300;
          
          particlesArray[i].speedX += forceDirectionX * force * 0.2;
          particlesArray[i].speedY += forceDirectionY * force * 0.2;
          
          // Limit speed
          particlesArray[i].speedX = Math.min(Math.max(particlesArray[i].speedX, -2), 2);
          particlesArray[i].speedY = Math.min(Math.max(particlesArray[i].speedY, -2), 2);
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Start animation
    createParticles();
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full -z-10 bg-background"
    />
  );
};

export default ThreeDBackground;
