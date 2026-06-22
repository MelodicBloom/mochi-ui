/**
 * MochiBounce — springy squircle pinball game
 * Drag from launcher at bottom, release to fling the mochi blob.
 * Mobile pointer-event driven. Squash-and-stretch on bounce.
 */
'use client';
import React, { useEffect, useRef, useState } from 'react';

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}
function rand(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

type Peg = { x: number; y: number; r: number; cd: number };
type Star = { x: number; y: number; r: number; alive: boolean };
type Ball = {
  x: number; y: number; vx: number; vy: number;
  r: number; active: boolean;
  sqX: number; sqY: number; rot: number;
};

// Superellipse path — squircle n≈4.8
function drawSuperellipse(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  rx: number, ry: number,
  n = 4.8, rot = 0
) {
  const S = 72;
  ctx.beginPath();
  for (let i = 0; i <= S; i++) {
    const t = (i / S) * Math.PI * 2;
    const ct = Math.cos(t), st = Math.sin(t);
    const x = Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n) * rx;
    const y = Math.sign(st) * Math.pow(Math.abs(st), 2 / n) * ry;
    const xr = x * Math.cos(rot) - y * Math.sin(rot);
    const yr = x * Math.sin(rot) + y * Math.cos(rot);
    i === 0 ? ctx.moveTo(cx + xr, cy + yr) : ctx.lineTo(cx + xr, cy + yr);
  }
  ctx.closePath();
}

function buildLayout(w: number, h: number): { pegs: Peg[]; stars: Star[] } {
  const pegs: Peg[] = [];
  const stars: Star[] = [];
  const cols = w < 440 ? 4 : 5;
  const rows = w < 440 ? 5 : 6;
  const padX = 40, topY = 100;
  const ySpan = h * 0.60 / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellW = (w - padX * 2) / cols;
      const offset = r % 2 === 0 ? 0 : cellW * 0.5;
      const x = padX + c * cellW + cellW * 0.5 + offset;
      const y = topY + r * ySpan + rand(-8, 8);
      if (x < w - padX) pegs.push({ x, y, r: rand(13, 19), cd: 0 });
    }
  }
  for (let i = 0; i < 8; i++) {
    stars.push({ x: rand(50, w - 50), y: rand(104, h * 0.62), r: 9, alive: true });
  }
  return { pegs, stars };
}

export const MochiBounce: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const scoreRef = useRef(0);
  const shotsRef = useRef(0);

  const worldRef = useRef<{
    w: number; h: number;
    ball: Ball;
    pegs: Peg[];
    stars: Star[];
    anchor: { x: number; y: number };
    drag: boolean;
    ptr: { x: number; y: number };
    raf: number; last: number;
  } | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const cv = cvRef.current!;
    const ctx = cv.getContext('2d')!;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.width = `${w}px`; cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const anchor = { x: w / 2, y: h - 64 };
      const layout = buildLayout(w, h);
      worldRef.current = {
        w, h, anchor,
        pegs: layout.pegs, stars: layout.stars,
        drag: false, ptr: { ...anchor },
        last: performance.now(), raf: 0,
        ball: { x: anchor.x, y: anchor.y, vx: 0, vy: 0, r: 21, active: false, sqX: 1, sqY: 1, rot: 0 },
      };
    };

    const addScore = (n: number) => { scoreRef.current += n; setScore(scoreRef.current); };
    const addShot = () => { shotsRef.current++; setShots(shotsRef.current); };
    const vib = (ms: number) => { try { navigator.vibrate?.(ms); } catch {} };

    const respawn = () => {
      const w = worldRef.current!;
      const layout = buildLayout(w.w, w.h);
      w.pegs = layout.pegs; w.stars = layout.stars;
      w.ball.active = false; w.ball.vx = 0; w.ball.vy = 0;
      w.ball.x = w.anchor.x; w.ball.y = w.anchor.y;
    };

    const frame = (now: number) => {
      const W = worldRef.current!;
      const dt = Math.min((now - W.last) / 1000, 1 / 30);
      W.last = now;
      const { w, h, ball, anchor } = W;

      if (!ball.active) {
        ball.x += (anchor.x - ball.x) * 0.2;
        ball.y += (anchor.y - ball.y) * 0.2;
        if (W.drag) {
          const dx = W.ptr.x - anchor.x, dy = W.ptr.y - anchor.y;
          ball.x = anchor.x - dx * 0.1;
          ball.y = anchor.y - dy * 0.1;
        }
      } else {
        ball.vy += 1280 * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        ball.rot += ball.vx * 0.001;
        if (ball.x - ball.r < 12) { ball.x = 12 + ball.r; ball.vx = Math.abs(ball.vx) * 0.88; ball.sqX = 0.78; ball.sqY = 1.22; }
        if (ball.x + ball.r > w - 12) { ball.x = w - 12 - ball.r; ball.vx = -Math.abs(ball.vx) * 0.88; ball.sqX = 0.78; ball.sqY = 1.22; }
        if (ball.y - ball.r < 90) { ball.y = 90 + ball.r; ball.vy = Math.abs(ball.vy) * 0.9; ball.sqX = 1.22; ball.sqY = 0.78; }
      }

      for (const p of W.pegs) {
        p.cd = Math.max(0, p.cd - dt);
        if (!ball.active) continue;
        const dx = ball.x - p.x, dy = ball.y - p.y;
        const dist = Math.hypot(dx, dy);
        const min = ball.r + p.r;
        if (dist < min) {
          const nx = dx / (dist || 1), ny = dy / (dist || 1);
          ball.x += nx * (min - dist); ball.y += ny * (min - dist);
          const vn = ball.vx * nx + ball.vy * ny;
          if (vn < 0) { ball.vx -= 2.1 * vn * nx; ball.vy -= 2.1 * vn * ny; }
          const imp = clamp(Math.hypot(ball.vx, ball.vy) / 900, 0, 1);
          ball.sqX = 1 - imp * 0.24; ball.sqY = 1 + imp * 0.30;
          if (p.cd === 0) { p.cd = 0.07; addScore(1); vib(7); }
        }
      }

      for (const s of W.stars) {
        if (!s.alive || !ball.active) continue;
        if (Math.hypot(ball.x - s.x, ball.y - s.y) < ball.r + s.r + 2) {
          s.alive = false; addScore(5); vib(12);
        }
      }

      if (W.stars.every(s => !s.alive)) { addScore(20); respawn(); }
      if (ball.y - ball.r > h + 80) {
        ball.active = false; ball.vx = 0; ball.vy = 0; ball.x = anchor.x; ball.y = anchor.y;
      }

      ball.sqX += (1 - ball.sqX) * 0.14;
      ball.sqY += (1 - ball.sqY) * 0.14;

      // ─── DRAW ───────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);

      // BG
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#FBF8FF');
      bg.addColorStop(1, '#F0EEFF');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

      // dot grid
      for (let gy = 0; gy < h; gy += 30) for (let gx = 0; gx < w; gx += 30) {
        ctx.fillStyle = 'rgba(130,90,200,0.06)';
        ctx.beginPath(); ctx.arc(gx + 6, gy + 6, 1, 0, Math.PI * 2); ctx.fill();
      }

      // pegs
      for (const p of W.pegs) {
        const lit = p.cd > 0;
        ctx.fillStyle = lit ? 'rgba(168,85,247,0.22)' : 'rgba(168,85,247,0.08)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = lit ? '#C084FC' : '#D8B4FE';
        drawSuperellipse(ctx, p.x, p.y, p.r, p.r, 4.8, 0); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        drawSuperellipse(ctx, p.x - 2, p.y - 2, p.r * 0.55, p.r * 0.55, 4.8, 0); ctx.fill();
      }

      // stars
      for (const s of W.stars) {
        if (!s.alive) continue;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(now * 0.0018);
        ctx.fillStyle = '#FCD34D';
        ctx.shadowColor = 'rgba(251,191,36,0.5)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const a = (Math.PI / 5) * i - Math.PI / 2;
          const r = i % 2 === 0 ? s.r : s.r * 0.44;
          i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }

      // aim line
      if (W.drag) {
        const dx = W.ptr.x - anchor.x, dy = W.ptr.y - anchor.y;
        ctx.save();
        ctx.strokeStyle = 'rgba(109,40,217,0.3)';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 10]);
        ctx.beginPath(); ctx.moveTo(anchor.x, anchor.y);
        ctx.lineTo(anchor.x - dx * 0.5, anchor.y - dy * 0.5);
        ctx.stroke(); ctx.restore();
      }

      // ball
      ctx.save();
      ctx.shadowColor = 'rgba(109,40,217,0.30)';
      ctx.shadowBlur = 28;
      const g = ctx.createRadialGradient(ball.x - 5, ball.y - 6, 2, ball.x, ball.y, ball.r * 1.4);
      g.addColorStop(0, '#6EE7B7');
      g.addColorStop(0.45, '#3DD68C');
      g.addColorStop(1, '#22C55E');
      ctx.fillStyle = g;
      drawSuperellipse(ctx, ball.x, ball.y, ball.r * ball.sqX, ball.r * ball.sqY, 4.8, ball.rot);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.60)';
      drawSuperellipse(ctx, ball.x - ball.r * 0.2, ball.y - ball.r * 0.22, ball.r * 0.44 * ball.sqX, ball.r * 0.32 * ball.sqY, 4.8, ball.rot);
      ctx.fill();
      ctx.restore();

      W.raf = requestAnimationFrame(frame);
    };

    const pt = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (e: PointerEvent) => {
      const W = worldRef.current!;
      W.drag = true; W.ptr = pt(e);
      W.ball.active = false; W.ball.vx = 0; W.ball.vy = 0;
      W.ball.x = W.anchor.x; W.ball.y = W.anchor.y;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => { const W = worldRef.current!; if (W.drag) W.ptr = pt(e); };
    const onUp = () => {
      const W = worldRef.current!;
      if (!W.drag) return;
      W.drag = false;
      const dx = W.ptr.x - W.anchor.x, dy = W.ptr.y - W.anchor.y;
      const pull = clamp(Math.hypot(dx, dy), 0, 120);
      const nx = -dx / (pull || 1), ny = -dy / (pull || 1);
      W.ball.x = W.anchor.x; W.ball.y = W.anchor.y;
      W.ball.vx = nx * pull * 6.4; W.ball.vy = ny * pull * 7.0;
      W.ball.active = true; W.ball.sqX = 0.76; W.ball.sqY = 1.28;
      addShot(); vib(5);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    cv.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    worldRef.current!.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(worldRef.current?.raf ?? 0);
      ro.disconnect();
      cv.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        height: 'min(78svh, 720px)',
        margin: '0 auto',
        borderRadius: 'var(--radius-squircle-xl)',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FBF8FF 0%, #F0EEFF 100%)',
        boxShadow: '0 24px 80px rgba(94,49,157,0.16), inset 0 1px 0 rgba(255,255,255,0.8)',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <canvas ref={cvRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* HUD */}
      <div style={{
        position: 'absolute', top: 14, left: 14, right: 14,
        display: 'flex', gap: 10, justifyContent: 'space-between',
        pointerEvents: 'none',
      }}>
        {[{ label: 'Score', value: score }, { label: 'Shots', value: shots }].map(item => (
          <div key={item.label} style={{
            minWidth: 100, padding: '10px 14px',
            borderRadius: 'var(--radius-squircle-md)',
            background: 'rgba(255,255,255,0.76)',
            backdropFilter: 'blur(12px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 24px rgba(111,74,171,0.11)',
          }}>
            <div style={{ fontSize: 'var(--type-label-size)', letterSpacing: 'var(--type-label-tracking)', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* instructions */}
      <div style={{
        position: 'absolute', bottom: 16, left: 0, right: 0,
        textAlign: 'center', pointerEvents: 'none',
        fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
        color: 'rgba(88,40,140,0.55)',
      }}>
        Drag · Aim · Release
      </div>
    </div>
  );
};

export default MochiBounce;
