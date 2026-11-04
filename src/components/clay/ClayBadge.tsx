import React from 'react';
import { motion } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';

export interface ClayBadgeProps {
  children: React.ReactNode;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach' | 'neutral';
  size?: 'sm' | 'md';
  pulse?: boolean;
  onClick?: () => void;
}

const colorwayStyles = {
  mint: { bg: 'hsl(142deg 76% 85%)', color: 'hsl(142deg 60% 30%)', border: 'hsl(142deg 76% 70%)' },
  blue: { bg: 'hsl(200deg 90% 90%)', color: 'hsl(200deg 60% 35%)', border: 'hsl(200deg 90% 75%)' },
  pink: { bg: 'hsl(350deg 90% 90%)', color: 'hsl(350deg 60% 40%)', border: 'hsl(350deg 90% 75%)' },
  lavender: { bg: 'hsl(270deg 70% 90%)', color: 'hsl(270deg 50% 40%)', border: 'hsl(270deg 70% 75%)' },
  peach: { bg: 'hsl(25deg 95% 85%)', color: 'hsl(25deg 70% 35%)', border: 'hsl(25deg 95% 70%)' },
  neutral: { bg: 'hsl(30deg 20% 92%)', color: 'hsl(30deg 20% 35%)', border: 'hsl(30deg 20% 80%)' },
};

const sizes = {
  sm: { padding: '2px 10px', fontSize: 10 },
  md: { padding: '4px 16px', fontSize: 12 },
};

const ClayBadgeBase: React.FC<ClayBadgeProps> = ({
  children,
  colorway = 'mint',
  size = 'md',
  pulse = false,
  onClick,
}) => {
  const colors = colorwayStyles[colorway];
  const dims = sizes[size];

  return (
    <motion.span
      className="clay-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: dims.padding,
        borderRadius: 999,
        background: colors.bg,
        color: colors.color,
        fontSize: dims.fontSize,
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        boxShadow: `
          2px 2px 6px rgba(0,0,0,0.08),
          inset -1px -1px 2px rgba(0,0,0,0.03),
          inset 1px 1px 2px rgba(255,255,255,0.7)
        `,
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
      whileHover={onClick ? { y: -2, scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      {/* Pulse animation */}
      {pulse && (
        <motion.span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: colors.border,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.span>
  );
};

export const ClayBadge = withClayReducedMotion(ClayBadgeBase, 'ClayBadge');

export default ClayBadge;
