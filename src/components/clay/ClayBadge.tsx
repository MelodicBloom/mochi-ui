import React from 'react';
import { motion } from 'motion/react';

export interface ClayBadgeProps {
  children: React.ReactNode;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach' | 'neutral';
  size?: 'sm' | 'md';
  pulse?: boolean;
  dot?: boolean;
  onClick?: () => void;
}

// All token-resolved — no raw hsl()
const colorwayTokens: Record<string, { bg: string; color: string; pulse: string }> = {
  mint:     { bg: 'var(--mochi-mint-pale)',     color: 'var(--mochi-mint-vivid)',     pulse: 'var(--mochi-mint)' },
  blue:     { bg: 'var(--mochi-baby-blue)',     color: 'var(--mochi-sky-blue)',       pulse: 'var(--mochi-sky-blue)' },
  pink:     { bg: 'var(--mochi-blush-pink)',    color: 'var(--mochi-soft-rose)',      pulse: 'var(--mochi-soft-rose)' },
  lavender: { bg: 'var(--mochi-lavender)',      color: 'var(--mochi-lavender-vivid)', pulse: 'var(--mochi-lavender-vivid)' },
  peach:    { bg: 'var(--mochi-peach-pale)',    color: 'var(--mochi-peach)',          pulse: 'var(--mochi-peach)' },
  neutral:  { bg: 'var(--bg-inset)',            color: 'var(--text-secondary)',       pulse: 'var(--border-strong)' },
};

const sizes = {
  sm: { padding: 'var(--space-1) var(--space-3)',  fontSize: 'var(--type-micro-size, 10px)' },
  md: { padding: 'var(--space-1) var(--space-4)',  fontSize: 'var(--type-meta-size)' },
};

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  children, colorway = 'mint', size = 'md',
  pulse = false, dot = false, onClick,
}) => {
  const tokens = colorwayTokens[colorway];
  const dims   = sizes[size];

  return (
    <motion.span
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center',
        gap: dot ? 'var(--space-2)' : 'var(--space-1)',
        padding: dims.padding,
        borderRadius: 'var(--radius-pill)',
        background: tokens.bg,
        color: tokens.color,
        fontSize: dims.fontSize,
        fontWeight: 600,
        fontFamily: 'var(--font-family)',
        letterSpacing: 'var(--type-label-track)',
        textTransform: 'uppercase',
        boxShadow: '2px 2px 6px rgba(0,0,0,0.08), inset -1px -1px 2px rgba(0,0,0,0.03), inset 1px 1px 2px rgba(255,255,255,0.7)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative', overflow: 'hidden',
      }}
      onClick={onClick}
      whileHover={onClick ? { y: -2, scale: 1.05 } : undefined}
      whileTap={onClick  ? { scale: 0.95 }        : undefined}
    >
      {/* Live-activity dot */}
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: tokens.pulse, flexShrink: 0,
        }} />
      )}

      {/* Pulse halo */}
      {pulse && (
        <motion.span
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            borderRadius: 'inherit',
            background: tokens.pulse,
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.span>
  );
};

export default ClayBadge;
