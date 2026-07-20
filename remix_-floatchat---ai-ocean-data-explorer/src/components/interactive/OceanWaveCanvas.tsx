import React, { useEffect, useRef } from 'react';

export const OceanWaveCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    // Floating Particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vy: - (Math.random() * 0.4 + 0.1),
      vx: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    let step = 0;

    const render = () => {
      step += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep Ocean Gradient Background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 3, 50,
        width / 2, height / 2, Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#06283D');
      bgGrad.addColorStop(0.6, '#031B2E');
      bgGrad.addColorStop(1, '#020d18');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Animated Sine Waves
      const waves = [
        { amplitude: 30, frequency: 0.008, speed: step * 0.8, color: 'rgba(0, 180, 255, 0.08)' },
        { amplitude: 45, frequency: 0.005, speed: step * 0.5, color: 'rgba(94, 230, 255, 0.05)' },
        { amplitude: 20, frequency: 0.012, speed: step * 1.2, color: 'rgba(56, 189, 248, 0.07)' },
      ];

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 10) {
          const y = height * 0.6 + Math.sin(x * wave.frequency + wave.speed) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      // Render Floating Bioluminescent Particles
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 230, 255, ${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#5EE6FF';
        ctx.fill();
        ctx.shadowBlur = 0;
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
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-80"
    />
  );
};
