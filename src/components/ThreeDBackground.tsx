
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
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Gen Z Vibrant Particle Class
    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
      originalX: number;
      originalY: number;
      angle: number;
      velocity: number;
      wobble: number;
      
      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.size = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        
        // Generate vibrant colors for Gen Z appeal
        const hue = Math.floor(Math.random() * 360); // Random hue for full color spectrum
        const saturation = 70 + Math.random() * 30; // High saturation for vibrant colors
        const lightness = 50 + Math.random() * 20; // Medium to high lightness
        
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${Math.random() * 0.5 + 0.2})`;
        
        // For circular motion
        this.angle = Math.random() * Math.PI * 2;
        this.velocity = Math.random() * 0.02 + 0.01;
        this.wobble = Math.random() * 2;
      }
      
      update(mouseX: number | null, mouseY: number | null) {
        // Basic movement
        this.x += this.vx;
        this.y += this.vy;
        
        // Add some circular/wave motion for more dynamic effect
        this.angle += this.velocity;
        this.x += Math.cos(this.angle) * this.wobble;
        this.y += Math.sin(this.angle) * this.wobble;
        
        // Mouse interaction (if mouse position provided)
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Repel particles from mouse with fancy effect
          if (distance < 100) {
            const force = (100 - distance) / 100;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 0.2;
            this.vy += Math.sin(angle) * force * 0.2;
          }
        }
        
        // Add slight gravity toward original position (like elastic)
        this.vx += (this.originalX - this.x) * 0.003;
        this.vy += (this.originalY - this.y) * 0.003;
        
        // Add friction to slow particles
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // Bounce off edges with damping
        if (this.x < 0 || this.x > width) {
          this.vx *= -0.7;
          this.x = this.x < 0 ? 0 : width;
        }
        if (this.y < 0 || this.y > height) {
          this.vy *= -0.7;
          this.y = this.y < 0 ? 0 : height;
        }
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles - more particles for Gen Z visual appeal
    const particleCount = Math.min(200, Math.floor(width * height / 8000));
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(
        Math.random() * width, 
        Math.random() * height
      ));
    }
    
    // Track mouse position for interactive effects
    let mouseX: number | null = null;
    let mouseY: number | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouseX = null;
      mouseY = null;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Connect particles with gradient lines
    const connectParticles = (ctx: CanvasRenderingContext2D) => {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            // Create gradient for more vibrant connections
            const gradient = ctx.createLinearGradient(
              particles[i].x, 
              particles[i].y, 
              particles[j].x, 
              particles[j].y
            );
            
            // Extract hue from each particle's color
            const color1 = particles[i].color;
            const color2 = particles[j].color;
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = opacity * 0.5;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      // Clear with slight trail effect for smoother motion
      ctx.fillStyle = 'rgba(var(--background), 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw(ctx);
      });
      
      connectParticles(ctx);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 right-0 bottom-0 w-full h-full -z-10"
    />
  );
};

export default ThreeDBackground;
