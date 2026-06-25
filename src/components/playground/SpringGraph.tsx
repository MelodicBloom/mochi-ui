'use client';
import React, { useEffect, useRef } from 'react';
import type { SpringConfig } from '../../hooks/spring-physics';

interface SpringGraphProps {
  config: SpringConfig;
  duration?: number;
}

export const SpringGraph: React.FC<SpringGraphProps> = ({ config, duration = 2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const pad = { t: 14, r: 12, b: 20, l: 10 };
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (ph * i) / 4;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(W - pad.r, y);
      ctx.stroke();
    }

    const { mass, tension, friction } = config;
    const safeTension = Math.max(tension, 1);
    const safeMass = Math.max(mass, 0.01);
    const zeta = friction / (2 * Math.sqrt(safeMass * safeTension));
    const omega = Math.sqrt(safeTension / safeMass);

    const color = zeta < 1 ? '#5bc8b0' : zeta < 1.05 ? '#7ab87a' : '#b0a0c8';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * duration;
      let y;

      if (zeta < 1) {
        const wd = omega * Math.sqrt(1 - zeta ** 2);
        const env = Math.exp(-zeta * omega * t);
        y = env * (Math.cos(wd * t) + (zeta * omega / wd) * Math.sin(wd * t));
      } else if (Math.abs(zeta - 1) < 0.02) {
        y = Math.exp(-omega * t) * (1 + omega * t);
      } else {
        const r1 = -omega * (zeta - Math.sqrt(Math.max(0, zeta ** 2 - 1)));
        const r2 = -omega * (zeta + Math.sqrt(Math.max(0, zeta ** 2 - 1)));
        const c2 = r1 / (r1 - r2);
        const c1 = 1 - c2;
        y = c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
      }

      const px = pad.l + (i / 200) * pw;
      const py = pad.t + ph / 2 + y * (ph / 2.6);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t + ph / 2);
    ctx.lineTo(W - pad.r, pad.t + ph / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.font = '9px monospace';
    ctx.fillText('0s', pad.l, H - 4);
    ctx.fillText(`${duration}s`, W - pad.r - 14, H - 4);

    const regime = zeta < 1 ? 'under' : Math.abs(zeta - 1) < 0.05 ? 'critical' : 'over';
    ctx.fillStyle = color;
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`ζ=${zeta.toFixed(2)} (${regime})`, pad.l, pad.t + 10);
    ctx.fillText(`ω₀=${omega.toFixed(1)} rad/s`, pw / 2, pad.t + 10);
  }, [config, duration]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
        <span>Damping Response</span>
        <span style={{ fontFamily: 'monospace' }}>ζ = {(config.friction / (2 * Math.sqrt(Math.max(config.mass, 0.01) * Math.max(config.tension, 1)))).toFixed(2)}</span>
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: 100, borderRadius: 8, display: 'block' }} />
    </div>
  );
};

export default SpringGraph;
