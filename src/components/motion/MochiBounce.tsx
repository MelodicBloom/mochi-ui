import React, { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  emoji: string;
}

interface MochiBounceProps {
  density?: number;
  colors?: string[];
  emojis?: string[];
  className?: string;
}

const COLORS = [
  'var(--mochi-mint)',
  'var(--mochi-blue)',
  'var(--mochi-pink)',
  'var(--mochi-lavender)',
  'var(--mochi-peach)',
];

const EMOJIS = ['✦', '◎', '⬡', '✿', '❋', '◈'];

export function MochiBounce({
  density = 6,
  colors = COLORS,
  emojis = EMOJIS,
  className = '',
}: MochiBounceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const frame = useRef<number>(0);
  const mousePos = useRef({ x: -999, y: -999 });
  let idCounter = 0;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnParticles = (x: number, y: number) => {
      for (let i = 0; i < density; i++) {
        const angle = (Math.PI * 2 * i) / density + Math.random() * 0.5;
        const speed = 2 + Math.random() * 4;
        particles.current.push({
          id: idCounter++,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 1,
          maxLife: 40 + Math.random() * 30,
          size: 8 + Math.random() * 12,
          color: colors[Math.floor(Math.random() * colors.length)],
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (Math.random() < 0.15) spawnParticles(e.clientX, e.clientY);
    };

    const onClick = (e: MouseEvent) => spawnParticles(e.clientX, e.clientY);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.life > 0);

      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.vx *= 0.98;
        p.life -= 1 / p.maxLife;

        const alpha = Math.min(1, p.life * 3);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillStyle = p.color;
        ctx.fillText(p.emoji, p.x, p.y);
        ctx.restore();
      }

      frame.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
    };
  }, [density, colors, emojis]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      aria-hidden
    />
  );
}

export default MochiBounce;
