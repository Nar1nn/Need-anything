import { useEffect, useRef } from 'react';

export default function StarParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create particles
    const starCount = 65;
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speed: number;
      color: string;
    }> = [];

    const goldColors = [
      'rgba(212, 175, 55, 0.4)',  // Gold dust
      'rgba(244, 215, 143, 0.3)', // Champagne dust
      'rgba(255, 255, 255, 0.45)', // Warm white sparkling
      'rgba(184, 134, 11, 0.25)', // Dark gold
    ];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        opacity: Math.random(),
        speed: Math.random() * 0.2 + 0.05,
        color: Math.random() > 0.6 ? goldColors[Math.floor(Math.random() * goldColors.length)] : 'rgba(255,255,255,0.3)',
      });
    }

    // Mouse movement influence
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) * 0.02;
      mouseY = (e.clientY - height / 2) * 0.02;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw starry sky
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        
        // Gentle movement + mouse offset
        s.y -= s.speed;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }

        // Pulse opacity
        s.opacity += Math.random() * 0.02 - 0.01;
        if (s.opacity < 0.1) s.opacity = 0.1;
        if (s.opacity > 0.8) s.opacity = 0.8;

        ctx.beginPath();
        // Offset drawing by mouse movement
        const renderX = (s.x + mouseX) % width;
        const renderY = (s.y + mouseY) % height;
        ctx.arc(renderX < 0 ? renderX + width : renderX, renderY < 0 ? renderY + height : renderY, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace(/, [\d.]+\)/, `, ${s.opacity})`);
        ctx.shadowBlur = s.radius > 1 ? 4 : 0;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      id="ambient-stars-background"
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-b from-[#090a0c] via-[#101216] to-[#0f1114]"
    />
  );
}
