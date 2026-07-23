import React, { useEffect, useRef } from 'react';

export const OceanWaveCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating Ocean Particles & ARGO Buoys
    const numParticles = 40;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vy: -(Math.random() * 0.4 + 0.1),
      vx: Math.sin(Math.random() * Math.PI) * 0.2,
      alpha: Math.random() * 0.5 + 0.2,
      isBuoy: Math.random() > 0.8,
    }));

    let step = 0;

    const render = () => {
      step += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle wave gradient at bottom
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 30) {
        const y = height - 80 + Math.sin(step + x * 0.005) * 20 + Math.cos(step * 0.8 + x * 0.003) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.fillStyle = 'rgba(0, 180, 255, 0.03)';
      ctx.fill();

      // Render floating ocean particles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += Math.sin(step + p.y * 0.01) * 0.3;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.isBuoy ? `rgba(94, 230, 255, ${p.alpha * 1.5})` : `rgba(0, 180, 255, ${p.alpha})`;
        ctx.fill();

        if (p.isBuoy) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(94, 230, 255, ${p.alpha * 0.4})`;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
};
