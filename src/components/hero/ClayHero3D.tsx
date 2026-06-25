'use client';
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion } from 'motion/react';
import { useSpringTransform, useReducedMotion } from '../../hooks/spring-hooks';
import type { SpringConfig } from '../../hooks/spring-physics';

const Spline = React.lazy(() => import('@splinetool/react-spline').catch(() => ({
  default: () => null as unknown as JSX.Element,
})));

export interface ClayHero3DProps {
  splineUrl?: string;
  springConfig?: Partial<SpringConfig>;
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ClayHero3D: React.FC<ClayHero3DProps> = ({
  splineUrl,
  springConfig,
  headline,
  subheadline,
  cta,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { style: transformStyle, setTransform } = useSpringTransform({
    mass: 2, tension: 180, friction: 24,
    ...springConfig,
  });

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setTransform({ rotateX: -y * 14, rotateY: x * 14 });
    };
    const leave = () => setTransform({ rotateX: 0, rotateY: 0 });

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [prefersReducedMotion, setTransform]);

  const showFallback = !splineUrl || splineError || !splineLoaded;

  return (
    <section
      style={{
        position: 'relative', minHeight: '90vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', perspective: '1200px',
        ...style,
      }}
      className={className}
    >
      {!prefersReducedMotion && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '8%', left: '4%',
            width: 480, height: 480, borderRadius: '50%',
            background: 'var(--mochi-mint)', opacity: 0.12, filter: 'blur(90px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '8%', right: '4%',
            width: 560, height: 560, borderRadius: '50%',
            background: 'var(--mochi-lavender)', opacity: 0.10, filter: 'blur(110px)',
          }} />
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          position: 'relative', zIndex: 1,
          maxWidth: 1100, margin: '0 auto', padding: '0 24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48, alignItems: 'center',
        }}
      >
        <div>
          {headline ?? (
            <>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 800, lineHeight: 1.05, marginBottom: 20,
                color: 'var(--text-primary)',
              }}>
                Interfaces you can{' '}
                <span style={{
                  background: 'linear-gradient(135deg, var(--mochi-mint), var(--mochi-sky-blue))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>feel</span>
              </h1>
              <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 480, marginBottom: 28 }}>
                Claymorphism applies the physics of soft materials to digital space.
                Every interaction obeys real physical laws.
              </p>
            </>
          )}
          {subheadline}
          {cta}
        </div>

        <motion.div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transformStyle: 'preserve-3d',
            ...transformStyle,
          }}
        >
          {splineUrl && !splineError && (
            <Suspense fallback={<FallbackSphere />}>
              <div style={{ opacity: splineLoaded ? 1 : 0, transition: 'opacity 0.4s' }}>
                <Spline
                  scene={splineUrl}
                  onLoad={() => setSplineLoaded(true)}
                  onError={() => setSplineError(true)}
                />
              </div>
            </Suspense>
          )}
          {showFallback && <FallbackSphere />}
        </motion.div>
      </div>

      {!prefersReducedMotion && (
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)', opacity: 0.6 }}>Scroll</span>
          <motion.div
            style={{
              width: 22, height: 38, borderRadius: 11,
              border: '2px solid rgba(0,0,0,0.12)',
              display: 'flex', justifyContent: 'center', paddingTop: 6,
            }}
          >
            <motion.div
              style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-secondary)', opacity: 0.5 }}
              animate={{ y: [0, 12, 0], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      )}
    </section>
  );
};

function FallbackSphere() {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => { setPressed(false); setHovered(false); }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        scale: pressed ? 0.91 : hovered ? 1.04 : 1,
        rotateZ: pressed ? -3 : 0,
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 18, mass: 0.8 }}
      style={{
        width: 200, height: 200, borderRadius: '50%',
        border: 'none', cursor: 'pointer',
        background: 'linear-gradient(145deg, #ffffff, #efefef)',
        boxShadow: pressed
          ? 'inset 10px 10px 20px rgba(0,0,0,0.08), inset -10px -10px 20px rgba(255,255,255,0.9)'
          : '24px 24px 60px rgba(0,0,0,0.09), -24px -24px 60px rgba(255,255,255,0.95), 0 0 0 1.5px rgba(255,255,255,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, fontWeight: 700, color: 'var(--text-primary)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.35) 0%, transparent 55%, rgba(0,0,0,0.02) 100%)',
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>
        {pressed ? 'Squish!' : 'Touch'}
      </span>
    </motion.button>
  );
}

export default ClayHero3D;
