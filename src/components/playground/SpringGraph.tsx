import React, { useEffect, useRef } from 'react';

interface SpringGraphProps {
  mass: number;
  tension: number;
  friction: number;
  width?: number;
  height?: number;
}

function simulateSpring(mass: number, stiffness: number, damping: number, steps = 120, dt = 1 / 60): number[] {
  let x = -1, v = 0;
  const out: number[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (-stiffness * x - damping * v) / mass;
    v += a * dt;
    x += v * dt;
    out.push(x);
  }
  return out;
}

function dampingRatio(mass: number, stiffness: number, damping: number) {
  return damping / (2 * Math.sqrt(mass * stiffness));
}

export const SpringGraph: React.FC<SpringGraphProps> = ({ mass, tension, friction, width = 260, height = 80 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const samples = simulateSpring(mass, tension, friction);
    const zeta    = dampingRatio(mass, tension, friction);

    ctx.clearRect(0, 0, width, height);

    // zero line
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // spring curve
    const color = zeta < 1 ? '#5ee7b0' : zeta < 1.5 ? '#7cb9f5' : '#c9a7f5';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    samples.forEach((y, i) => {
      const px = (i / (samples.length - 1)) * width;
      const py = height / 2 - (y * (height * 0.42));
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();

    // label
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.font = '10px ui-monospace, monospace';
    const label = zeta < 1 ? `ζ=${zeta.toFixed(2)} underdamped` : zeta < 1.05 ? 'ζ≈1 critically damped' : `ζ=${zeta.toFixed(2)} overdamped`;
    ctx.fillText(label, 6, height - 6);
  }, [mass, tension, friction, width, height]);

  return <canvas ref={canvasRef} style={{ display: 'block', borderRadius: 8, background: 'var(--bg-base)' }} />;
};

export default SpringGraph;
