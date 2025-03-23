
import React, { useEffect, useRef } from 'react';

const FinancialModels3D: React.FC = () => {
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
    
    // Define particles and shapes
    const particlesArray: Particle[] = [];
    const numberOfParticles = Math.min(Math.floor(width / 8), 250); // More particles for richer animation
    
    // Shapes to represent financial objects
    const shapes = ['circle', 'dollar', 'chart', 'coin'];
    
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
      shape: string;
      rotation: number;
      rotationSpeed: number;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.initialSize = Math.random() * 6 + 2; // Slightly larger particles
        this.size = this.initialSize;
        this.speedX = Math.random() * 1.2 - 0.6;
        this.speedY = Math.random() * 1.2 - 0.6;
        this.mass = this.size; // Mass proportional to size for physics calculations
        this.interactive = Math.random() > 0.6; // More particles are interactive
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        
        // Financial color palette (warm gold/amber tones for finance theme)
        const colors = [
          'rgba(255, 193, 7, 0.8)',    // Amber (gold)
          'rgba(255, 152, 0, 0.8)',    // Orange (copper)
          'rgba(255, 87, 34, 0.8)',    // Deep Orange
          'rgba(121, 85, 72, 0.8)',    // Brown (bronze)
          'rgba(158, 158, 158, 0.8)',  // Grey (silver)
          'rgba(66, 66, 66, 0.8)',     // Dark grey (graphite)
          'rgba(141, 110, 99, 0.8)',   // Brown (copper)
        ];
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
        
        // Assign random shape
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      }
      
      update(mouse: { x: number | undefined; y: number | undefined; radius: number; isActive: boolean }) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
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
              
              this.speedX -= forceDirectionX * force * 0.8;
              this.speedY -= forceDirectionY * force * 0.8;
              
              // Visual effect - particles grow when mouse is active
              this.size = Math.min(this.initialSize * 1.8, this.initialSize + 4);
            } else {
              // Attraction effect - particles move towards cursor
              const forceDirectionX = dx / distance;
              const forceDirectionY = dy / distance;
              const force = (mouse.radius - distance) / mouse.radius;
              
              this.speedX += forceDirectionX * force * 0.3;
              this.speedY += forceDirectionY * force * 0.3;
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
        const maxSpeed = 2.5;
        const currentSpeed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
        if (currentSpeed > maxSpeed) {
          this.speedX = (this.speedX / currentSpeed) * maxSpeed;
          this.speedY = (this.speedY / currentSpeed) * maxSpeed;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        switch (this.shape) {
          case 'dollar':
            this.drawDollar(ctx);
            break;
          case 'chart':
            this.drawChart(ctx);
            break;
          case 'coin':
            this.drawCoin(ctx);
            break;
          case 'circle':
          default:
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
      }
      
      drawDollar(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        // Draw dollar sign
        const size = this.size * 2;
        ctx.beginPath();
        ctx.arc(0, 0, size/1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = size/5;
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(0, size/2);
        ctx.stroke();
        
        // Draw the S curves
        ctx.beginPath();
        ctx.arc(-size/6, -size/4, size/4, Math.PI/2, Math.PI * 1.5, false);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(size/6, size/4, size/4, Math.PI * 1.5, Math.PI/2, false);
        ctx.stroke();
      }
      
      drawChart(ctx: CanvasRenderingContext2D) {
        const size = this.size * 2;
        
        // Draw chart background
        ctx.fillStyle = this.color;
        ctx.fillRect(-size/1.5, -size/1.5, size*1.1, size*1.1);
        
        // Draw chart lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = size/10;
        ctx.beginPath();
        
        // Draw a simple line chart
        ctx.moveTo(-size/2, 0);
        ctx.lineTo(-size/4, -size/3);
        ctx.lineTo(0, size/4);
        ctx.lineTo(size/4, -size/2);
        ctx.lineTo(size/2, 0);
        ctx.stroke();
      }
      
      drawCoin(ctx: CanvasRenderingContext2D) {
        const size = this.size * 1.5;
        
        // Draw coin
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw coin border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = size/5;
        ctx.beginPath();
        ctx.arc(0, 0, size*0.85, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw inner detail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
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
      
      const connectionRadius = Math.min(width, height) / 7;
      
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
            ctx.lineWidth = 0.6;
            
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
      radius: 180,
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
      mouse.radius = 220; // Larger radius when active
    };
    
    const handleMouseUp = () => {
      mouse.isActive = false;
      mouse.radius = 180; // Normal radius
    };
    
    // Handle touch events for mobile
    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      mouse.isActive = true;
      mouse.radius = 220;
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
      mouse.radius = 180;
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
      ctx.fillStyle = 'rgba(36, 33, 27, 0.04)'; // Dark beige with low opacity
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

export default FinancialModels3D;
