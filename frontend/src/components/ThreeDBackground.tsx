
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
    const numberOfParticles = Math.min(Math.floor(width / 10), 200); // Cap at 200 particles
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      mass: number;
      interactive: boolean;
      initialSize: number;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.initialSize = Math.random() * 5 + 1;
        this.size = this.initialSize;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.mass = this.size; // Mass proportional to size for physics calculations
        this.interactive = Math.random() > 0.7; // Only some particles are interactive
        
        // Financial-themed color palette
        const colors = [
          'rgba(79, 70, 229, 0.7)',  // Indigo
          'rgba(6, 182, 212, 0.7)',   // Cyan
          'rgba(16, 185, 129, 0.7)',  // Emerald (green for profit)
          'rgba(245, 158, 11, 0.7)',  // Amber (gold for finance)
          'rgba(236, 72, 153, 0.7)',  // Pink
          'rgba(139, 92, 246, 0.7)',  // Purple
          'rgba(14, 165, 233, 0.7)',  // Sky
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      
      update(mouse: { x: number | undefined; y: number | undefined; radius: number; isActive: boolean }) {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x + this.size > width || this.x - this.size < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y + this.size > height || this.y - this.size < 0) {
          this.speedY = -this.speedY;
        }
        
        // Mouse interaction
        if (mouse.x !== undefined && mouse.y !== undefined && this.interactive) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            if (mouse.isActive) {
              // Push effect - particles move away from cursor
              const forceDirectionX = dx / distance;
              const forceDirectionY = dy / distance;
              const force = (mouse.radius - distance) / mouse.radius;
              
              this.speedX -= forceDirectionX * force * 0.6;
              this.speedY -= forceDirectionY * force * 0.6;
              
              // Visual effect - particles grow when mouse is active
              this.size = Math.min(this.initialSize * 1.5, this.initialSize + 3);
            } else {
              // Attraction effect - particles move towards cursor
              const forceDirectionX = dx / distance;
              const forceDirectionY = dy / distance;
              const force = (mouse.radius - distance) / mouse.radius;
              
              this.speedX += forceDirectionX * force * 0.2;
              this.speedY += forceDirectionY * force * 0.2;
            }
          } else {
            // Return to normal size gradually
            if (this.size > this.initialSize) {
              this.size -= 0.1;
            }
          }
        }
        
        // Apply drag to slow particles
        this.speedX *= 0.99;
        this.speedY *= 0.99;
        
        // Limit speed
        const maxSpeed = 2;
        const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (currentSpeed > maxSpeed) {
          this.speedX = (this.speedX / currentSpeed) * maxSpeed;
          this.speedY = (this.speedY / currentSpeed) * maxSpeed;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
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
      
      const connectionRadius = Math.min(width, height) / 8;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only connect particles within a certain distance
          if (distance < connectionRadius) {
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
            ctx.globalAlpha = (1 - distance / connectionRadius) * 0.5;
            
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };
    
    // Mouse interaction setup
    const mouse = {
      x: undefined as number | undefined,
      y: undefined as number | undefined,
      radius: 150,
      isActive: false // Track if mouse button is pressed
    };
    
    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    
    // Handle mouse down/up for interactive effects
    const handleMouseDown = () => {
      mouse.isActive = true;
      mouse.radius = 200; // Larger radius when active
    };
    
    const handleMouseUp = () => {
      mouse.isActive = false;
      mouse.radius = 150; // Normal radius
    };
    
    // Handle touch events for mobile
    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      mouse.isActive = true;
      mouse.radius = 200;
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
      }
    };
    
    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
      }
    };
    
    const handleTouchEnd = () => {
      mouse.isActive = false;
      mouse.radius = 150;
    };
    
    // Handle mouse leaving canvas
    const handleMouseLeave = () => {
      mouse.x = undefined;
      mouse.y = undefined;
    };
    
    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);
    
    const animate = () => {
      if (!ctx) return;
      
      // Semi-transparent background to create trails
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'; // Dark background with low opacity
      ctx.fillRect(0, 0, width, height);
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(mouse);
        particlesArray[i].draw();
      }
      
      connectParticles();
      requestAnimationFrame(animate);
    };
    
    // Start animation
    createParticles();
    animate();
    
    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full -z-10 bg-background cursor-pointer"
    />
  );
};

export default ThreeDBackground;
