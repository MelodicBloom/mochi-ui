import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';

export interface ClayHero3DProps {
  splineUrl?: string;
  headline?: string;
  subheadline?: string;
  cta?: React.ReactNode;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach';
}

const blobColors: Record<string, string[]> = {
  mint:     ['#5ee7b0', '#a3f7bf', '#c8f6d8'],
  blue:     ['#7cb9f5', '#a8d4ff', '#c7e6ff'],
  pink:     ['#ffb6c1', '#ffd6dc', '#ffe8ec'],
  lavender: ['#c9a7f5', '#ddc4fb', '#eeddff'],
  peach:    ['#ffd1aa', '#ffe3c7', '#fff0e0'],
};

// Animated clay blob fallback — no external dependency
const ClayBlob: React.FC<{ colorway: string }> = ({ colorway }) => {
  const colors = blobColors[colorway] ?? blobColors.mint;
  return (
    <motion.div
      animate={{
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '60% 40% 30% 70% / 60% 30% 70% 40%',
        ],
        scale: [1, 1.04, 1],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: 340, height: 340,
        background: `radial-gradient(circle at 30% 30%, ${colors[0]}, ${colors[1]} 50%, ${colors[2]})`,
        boxShadow: `0 32px 80px ${colors[0]}88, inset 0 2px 0 rgba(255,255,255,0.7)`,
      }}
    />
  );
};

// Lazy Spline loader — only attempts import if splineUrl is provided
const SplineLazy: React.FC<{ url: string; fallback: React.ReactNode }> = ({ url, fallback }) => {
  const [SplineComp, setSplineComp] = useState<React.ComponentType<{ scene: string }> | null>(null);
  const [failed, setFailed]         = useState(false);

  useEffect(() => {
    import('@splinetool/react-spline')
      .then((mod) => setSplineComp(() => mod.default as React.ComponentType<{ scene: string }>))
      .catch(() => setFailed(true));
  }, []);

  if (failed || !SplineComp) return <>{fallback}</>;
  return <SplineComp scene={url} />;
};

export const ClayHero3D: React.FC<ClayHero3DProps> = ({
  splineUrl,
  headline = 'Design that feels alive.',
  subheadline = 'Spring physics. Tactile depth. Claymorphism.',
  cta,
  colorway = 'mint',
}) => {
  const blob = <ClayBlob colorway={colorway} />;

  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      alignItems: 'center',
      gap: 48,
      padding: '80px 48px',
      minHeight: '90vh',
    }}>
      {/* Text column */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.15, color: 'var(--text-primary)', margin: '0 0 20px' }}
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', margin: '0 0 32px', lineHeight: 1.6 }}
        >
          {subheadline}
        </motion.p>
        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {cta}
          </motion.div>
        )}
      </div>

      {/* 3D / blob column */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {splineUrl
          ? <SplineLazy url={splineUrl} fallback={blob} />
          : blob
        }
      </div>
    </section>
  );
};

export default ClayHero3D;
