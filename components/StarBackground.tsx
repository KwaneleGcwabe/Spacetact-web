import React, { useEffect, useRef } from 'react';

const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Configuration
    const particleCount = 200;
    const particles: { 
      x: number; 
      y: number; 
      size: number; 
      speed: number; 
      angle: number; 
      radius: number; 
    }[] = [];

    const centerX = () => canvas.width / 2;
    const centerY = () => -100; // Position black hole slightly above viewport

    // Initialize Particles
    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        // Distribute particles randomly
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * 1000 + 200, // Distance from center
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawEventHorizon = (cx: number, cy: number, t: number) => {
      // 1. Clear with Deep Space Background (slightly transparent to allow trailing if desired, but we use solid here)
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a0015'); // Deep purple black at top
      bgGradient.addColorStop(0.4, '#000000');
      bgGradient.addColorStop(1, '#000000');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. The Singularity Glow (The Purple Eclipse)
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.8;
      const glow = ctx.createRadialGradient(cx, cy, 100, cx, cy, maxRadius);
      
      // Pulsating intensity
      const pulse = Math.sin(t * 0.5) * 0.1 + 0.9;
      
      glow.addColorStop(0, '#ffffff'); // Core White
      glow.addColorStop(0.05, `rgba(168, 85, 247, ${0.8 * pulse})`); // Bright Purple
      glow.addColorStop(0.15, `rgba(124, 58, 237, ${0.4 * pulse})`); // Deep Violet
      glow.addColorStop(0.4, `rgba(88, 28, 135, ${0.1 * pulse})`);  // Dark Violet
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Accretion Disk Rays (Rotating)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.05); // Slow rotation

      const rayCount = 12;
      for (let i = 0; i < rayCount; i++) {
        ctx.beginPath();
        ctx.rotate((Math.PI * 2) / rayCount);
        const rayGradient = ctx.createLinearGradient(0, 0, 0, 800);
        rayGradient.addColorStop(0, 'rgba(192, 132, 252, 0)');
        rayGradient.addColorStop(0.2, 'rgba(192, 132, 252, 0.05)');
        rayGradient.addColorStop(1, 'rgba(192, 132, 252, 0)');
        
        ctx.fillStyle = rayGradient;
        ctx.moveTo(-20, 100);
        ctx.lineTo(20, 100);
        ctx.lineTo(100 + Math.sin(t + i) * 50, 1000); // Ray spreads out
        ctx.lineTo(-100 - Math.sin(t + i) * 50, 1000);
        ctx.fill();
      }
      ctx.restore();

      // 4. Horizon Arcs
      ctx.globalCompositeOperation = 'source-over';
      ctx.save();
      ctx.translate(cx, cy);
      
      // Main bright arc
      ctx.beginPath();
      ctx.arc(0, 0, 160 + Math.sin(t) * 5, 0, Math.PI, false); // Bottom half arc
      ctx.strokeStyle = '#e9d5ff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#d8b4fe';
      ctx.stroke();

      // Secondary purple arc
      ctx.beginPath();
      ctx.arc(0, 0, 200 + Math.cos(t * 0.8) * 10, 0, Math.PI, false);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();

      ctx.restore();
    };

    const drawParticles = (cx: number, cy: number, t: number) => {
      ctx.fillStyle = '#ffffff';
      
      particles.forEach((p) => {
        // Warp Movement Logic: Particles spiral towards or float around the center
        // Simple physics: move up towards the light, slight spiral
        
        p.y -= p.speed;
        p.x += Math.sin(t + p.y * 0.01) * 0.5; // Wobbly path

        // Reset if out of bounds (top)
        if (p.y < -100) {
          p.y = canvas.height + 100;
          p.x = Math.random() * canvas.width;
        }

        // Draw
        const distToCenter = Math.sqrt(Math.pow(p.x - cx, 2) + Math.pow(p.y - cy, 2));
        const closeness = Math.max(0, 1 - distToCenter / (canvas.height * 1.5));
        
        ctx.globalAlpha = (Math.random() * 0.5 + 0.3) * closeness;
        
        // Stretch effect (warp speed look) near the edges or moving fast
        const length = p.speed * 4;
        
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 0.5, p.size + length, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      time += 0.02;
      
      const cx = centerX();
      const cy = centerY();

      drawEventHorizon(cx, cy, time);
      drawParticles(cx, cy, time);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-black"
    />
  );
};

export default StarBackground;