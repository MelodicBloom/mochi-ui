import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MOCHI_SPRING_PRESETS,
  SpringValue,
  createBrowserAnimationClock,
  SpringRunner,
} from '../../../packages/spring-engine/src/index';

export interface SpringPlaygroundProps {
  initialStiffness?: number;
  initialDamping?: number;
  initialMass?: number;
  /** Force reduced motion (otherwise follows prefers-reduced-motion). */
  reducedMotion?: boolean;
}

type Params = { stiffness: number; damping: number; mass: number };

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Damping ratio ζ = c / (2√(km)); "bounce" = 1 − ζ clamped to [0,1]. */
export function dampingRatio({ stiffness, damping, mass }: Params): number {
  return damping / (2 * Math.sqrt(stiffness * mass));
}

/**
 * Semi-implicit Euler is only stable while dt stays well under both √(m/k) and m/c.
 * The sliders allow e.g. mass 0.1 + damping 80, where the engine default (1/120 s)
 * diverges, so pick an integration step that is stable for the current params.
 */
export function stableStepSeconds({ stiffness, damping, mass }: Params): number {
  const limit = 0.5 * Math.min(Math.sqrt(mass / stiffness), damping > 0 ? mass / damping : Infinity);
  return Math.min(1 / 120, limit);
}

function withStableStep(p: Params) {
  return { ...p, maxStepSeconds: stableStepSeconds(p) };
}

/** Precompute a 1.5s step response for the curve plot (deterministic). */
function sampleCurve(p: Params, seconds = 1.5, n = 180): number[] {
  const s = new SpringValue(0, withStableStep(p));
  s.setTarget(1);
  const out: number[] = [0];
  for (let i = 1; i <= n; i++) out.push(s.advance(seconds / n).value);
  return out;
}

const slider = (
  label: string,
  value: number,
  min: number,
  max: number,
  step: number,
  onChange: (v: number) => void,
) => (
  <label style={{ display: 'grid', gridTemplateColumns: '90px 1fr 56px', gap: 12, alignItems: 'center' }}>
    <span style={{ fontWeight: 600 }}>{label}</span>
    <input
      type="range" min={min} max={max} step={step} value={value}
      aria-label={label}
      onChange={(e) => onChange(Number(e.target.value))}
    />
    <output style={{ fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{value}</output>
  </label>
);

export const SpringPlayground: React.FC<SpringPlaygroundProps> = ({
  initialStiffness = MOCHI_SPRING_PRESETS.clay.stiffness,
  initialDamping = MOCHI_SPRING_PRESETS.clay.damping,
  initialMass = MOCHI_SPRING_PRESETS.clay.mass,
  reducedMotion,
}) => {
  const systemReduced = usePrefersReducedMotion();
  const reduced = reducedMotion ?? systemReduced;
  const [p, setP] = useState<Params>({ stiffness: initialStiffness, damping: initialDamping, mass: initialMass });
  const [pressed, setPressed] = useState(false);
  const blobRef = useRef<HTMLButtonElement>(null);
  const springRef = useRef<SpringValue | null>(null);
  const runnerRef = useRef<SpringRunner | null>(null);

  // One spring drives "squish" (0 = rest, 1 = fully pressed; overshoot = rebound).
  useEffect(() => {
    const spring = new SpringValue(0, withStableStep(p));
    springRef.current = spring;
    const runner = new SpringRunner(spring, createBrowserAnimationClock(), { immediate: reduced });
    runnerRef.current = runner;
    const unsub = spring.subscribe(({ value }) => {
      const el = blobRef.current;
      if (!el) return;
      const sx = 1 + value * 0.22;
      const sy = 1 - value * 0.28;
      el.style.transform = `translateY(${value * 18}px) scale(${sx}, ${sy})`;
      el.style.borderRadius = `${48 - value * 10}% ${48 + value * 6}% ${44 - value * 8}% ${52 + value * 4}%`;
    });
    return () => { unsub(); runner.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { springRef.current?.setConfig(withStableStep(p)); }, [p]);
  useEffect(() => { runnerRef.current?.setImmediate(reduced); }, [reduced]);

  const kick = (target: number) => {
    springRef.current?.setTarget(target);
    runnerRef.current?.start();
  };

  const press = () => { setPressed(true); kick(1); };
  const release = () => { setPressed(false); kick(0); };

  const zeta = dampingRatio(p);
  const curve = useMemo(() => sampleCurve(p), [p]);
  const max = Math.max(1.05, ...curve);
  const path = curve
    .map((v, i) => `${i ? 'L' : 'M'}${(i / (curve.length - 1)) * 300},${100 - (v / max) * 90}`)
    .join(' ');

  return (
    <div
      className="clay-surface"
      // auto-fit collapses to one column below ~628px (2×280 + gap + padding) and keeps two columns above.
      style={{ padding: 32, display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', width: '100%', maxWidth: 860, boxSizing: 'border-box', background: '#fbf6f0' }}
    >
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 280 }}>
        <button
          ref={blobRef}
          type="button"
          aria-label="Squish the clay blob"
          aria-pressed={pressed}
          onPointerDown={press}
          onPointerUp={release}
          onPointerLeave={() => { if (pressed) release(); }}
          onKeyDown={(e) => {
            if (e.key !== ' ' && e.key !== 'Enter') return;
            e.preventDefault();
            if (e.repeat || pressed) return;
            press();
          }}
          onKeyUp={(e) => { if ((e.key === ' ' || e.key === 'Enter') && pressed) { e.preventDefault(); release(); } }}
          onBlur={() => { if (pressed) release(); }}
          style={{
            width: 180, height: 180, border: 'none', cursor: 'pointer',
            borderRadius: '48% 48% 44% 52%',
            background: 'radial-gradient(circle at 35% 30%, #ffd9e4, #f7a8c0 60%, #e98aa8)',
            boxShadow: '0 24px 40px rgba(233,138,168,.35), inset -12px -14px 24px rgba(0,0,0,.08), inset 14px 14px 28px rgba(255,255,255,.7)',
            transformOrigin: '50% 100%',
            touchAction: 'none',
          }}
        />
        <small style={{ opacity: 0.7 }}>
          Press &amp; hold (or Space) to squish{reduced ? ' — reduced motion: snaps instantly' : ''}
        </small>
      </div>

      <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
        <h3 style={{ margin: 0 }}>Spring parameters</h3>
        {slider('Stiffness', p.stiffness, 20, 800, 5, (v) => setP({ ...p, stiffness: v }))}
        {slider('Damping', p.damping, 0, 80, 0.5, (v) => setP({ ...p, damping: v }))}
        {slider('Mass', p.mass, 0.1, 5, 0.1, (v) => setP({ ...p, mass: v }))}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(MOCHI_SPRING_PRESETS).map(([name, cfg]) => (
            <button
              key={name} type="button" className="clay-button"
              style={{ padding: '6px 12px', borderRadius: 999, border: 'none', background: '#efe6dc', cursor: 'pointer' }}
              onClick={() => setP({ ...cfg })}
            >{name}</button>
          ))}
        </div>
        <p style={{ margin: 0, fontVariantNumeric: 'tabular-nums' }}>
          ζ (damping ratio) = <strong>{zeta.toFixed(2)}</strong>{' '}
          — {zeta < 1 ? `underdamped, bounce ≈ ${(1 - zeta).toFixed(2)}` : zeta === 1 ? 'critically damped' : 'overdamped'}
        </p>
        <svg viewBox="0 0 300 100" role="img" aria-label="Step response curve over 1.5 seconds" style={{ width: '100%', background: '#f3ece4', borderRadius: 16 }}>
          <line x1="0" x2="300" y1={100 - (1 / max) * 90} y2={100 - (1 / max) * 90} stroke="#c9b8a8" strokeDasharray="4 4" />
          <path d={path} fill="none" stroke="#e46f95" strokeWidth="2.5" />
        </svg>
        <code style={{ fontSize: 12, opacity: 0.8 }}>
          {`{ stiffness: ${p.stiffness}, damping: ${p.damping}, mass: ${p.mass} }`}
        </code>
      </div>
    </div>
  );
};

export default SpringPlayground;
