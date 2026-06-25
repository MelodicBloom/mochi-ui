import React, { lazy, Suspense, useState } from 'react';
import { motion } from 'motion/react';
import { useSpringTransform } from '../animations/SpringPhysics';

const SplineScene = lazy(() => import('@splinetool/react-spline').catch(() => ({ default: () => null })));

interface ClayHero3DProps {
  splineUrl?: string;
  headline?: React.ReactNode;
  subheadline?: React.ReactNode;
  cta?: React.ReactNode;
  minHeight?: number | string;
}

const ClayBlob: React.FC = () => {
  const { style } = useSpringTransform({ scale: 1 });
  return (
    <motion.div
      style={{
        width: 260,
        height: 260,
        borderRadius: '62% 38% 46% 54% / 60% 44% 56% 40%',
        background: 'linear-gradient(135deg, var(--mochi-mint) 0%, var(--mochi-baby-blue) 60%, var(--mochi-blossom) 100%)',
        boxShadow: '0 24px 64px rgba(94,231,176,0.28), inset 0 2px 0 rgba(255,255,255,0.55)',
        ...style,
      }}
      animate={{ borderRadius: [
        '62% 38% 46% 54% / 60% 44% 56% 40%',
        '45% 55% 60% 40% / 50% 60% 40% 50%',
        '62% 38% 46% 54% / 60% 44% 56% 40%',
      ]}}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.93 }}
    />
  );
};

export const ClayHero3D: React.FC<ClayHero3DProps> = ({
  splineUrl,
  headline,
  subheadline,
  cta,
  minHeight = 520,
}) => {
  const [splineError, setSplineError] = useState(false);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 40,
      alignItems: 'center',
      minHeight,
      padding: '64px 0 48px',
    }}>
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {headline}
        {subheadline}
        {cta}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {splineUrl && !splineError ? (
          <Suspense fallback={<ClayBlob />}>
            <SplineScene scene={splineUrl} onError={() => setSplineError(true)} style={{ width: '100%', maxWidth: 480, height: 360 }} />
          </Suspense>
        ) : (
          <ClayBlob />
        )}
      </motion.div>
    </div>
  );
};

export default ClayHero3D;
