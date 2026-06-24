import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'motion/react';

export interface ClayChartBarProps {
  value: number;
  max?: number;
  label?: string;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach';
  width?: number;
  delay?: number;
  onHover?: (value: number) => void;
}

// Token gradient pairs — no raw hex
const colorwayGradients: Record<string, [string, string]> = {
  mint:     ['var(--mochi-mint)',        'var(--mochi-sage)'],
  blue:     ['var(--mochi-sky-blue)',    'var(--mochi-baby-blue)'],
  pink:     ['var(--mochi-soft-rose)',   'var(--mochi-blush-pink)'],
  lavender: ['var(--mochi-lavender-vivid)', 'var(--mochi-lavender)'],
  peach:    ['var(--mochi-peach)',       'var(--mochi-peach-pale)'],
};

const colorwayTooltipBg: Record<string, string> = {
  mint:     'var(--mochi-mint)',
  blue:     'var(--mochi-sky-blue)',
  pink:     'var(--mochi-soft-rose)',
  lavender: 'var(--mochi-lavender-vivid)',
  peach:    'var(--mochi-peach)',
};

export const ClayChartBar: React.FC<ClayChartBarProps> = ({
  value, max = 100, label,
  colorway = 'mint', width = 48, delay = 0, onHover,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [gradTop, gradBot] = colorwayGradients[colorway];
  const tooltipBg = colorwayTooltipBg[colorway];
  const percentage = Math.min((value / max) * 100, 100);

  // Scroll-trigger: animate only once the bar is in viewport
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.4 });

  const height = useSpring(0, { stiffness: 160, damping: 22, mass: 1.2 });
  const scale  = useSpring(1, { stiffness: 400, damping: 25 });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => height.set(percentage), delay);
    return () => clearTimeout(t);
  }, [inView, percentage, delay, height]);

  const shadowY    = useTransform(height, (h) => Math.max(4, h / 10));
  const shadowBlur = useTransform(height, (h) => Math.max(8, h / 5));
  const boxShadow  = useTransform(
    [shadowY, shadowBlur],
    ([sy, sb]) => `0 ${sy}px ${sb}px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(0,0,0,0.05), inset 2px 2px 4px rgba(255,255,255,0.5)`
  );

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${label ?? 'Bar'}: ${Math.round(value)}${max === 100 ? '%' : ` of ${max}`}`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}
    >
      {/* Hover value tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 4 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8, y: isHovered ? -4 : 4 }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
        style={{
          padding: 'var(--space-1) var(--space-3)',
          borderRadius: 'var(--radius-squircle-xs)',
          background: tooltipBg,
          color: 'white',
          fontSize: 'var(--type-meta-size)',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {Math.round(value)}{max === 100 ? '%' : ''}
      </motion.div>

      {/* Bar container — fixed 200px tall, bar grows from bottom */}
      <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
        <motion.div
          style={{
            width,
            height: useTransform(height, (h) => `${h}%`),
            borderRadius: 'var(--radius-pill)',
            background: `linear-gradient(180deg, ${gradTop}, ${gradBot})`,
            boxShadow,
            scale,
            originY: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={() => { setIsHovered(true); scale.set(1.06); onHover?.(value); }}
          onMouseLeave={() => { setIsHovered(false); scale.set(1); }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Cylinder highlight */}
          <div style={{
            position: 'absolute', top: 0,
            left: '15%', right: '15%',
            height: '30%', borderRadius: '50%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.55), transparent)',
            pointerEvents: 'none',
          }} />
          {/* Side shadow */}
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            width: '20%',
            borderRadius: '0 var(--radius-pill) var(--radius-pill) 0',
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08))',
            pointerEvents: 'none',
          }} />
        </motion.div>
      </div>

      {label && (
        <span style={{
          fontSize: 'var(--type-meta-size)',
          fontWeight: 600,
          fontFamily: 'var(--font-family)',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--type-label-track)',
        }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default ClayChartBar;
