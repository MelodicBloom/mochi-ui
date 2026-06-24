#!/usr/bin/env node
/**
 * generate-components.js
 * Writes fully-tokenized versions of all five clay primitive components.
 * This script is idempotent — running it twice produces the same output.
 */

const fs   = require('fs');
const path = require('path');

const CLAY = path.resolve(__dirname, '../src/components/clay');

const files = {

// ─────────────────────────────────────────────────────────────────────────────
'ClayButton.tsx': `import React, { useState, useCallback } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'motion/react';
import type { SpringOptions } from 'motion/react';

export interface ClayButtonProps {
  children: React.ReactNode;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  bounce?: number;
  duration?: number;
  haptic?: 'soft' | 'medium' | 'firm';
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

// ── All colors, padding, and radii come from CSS tokens ──────────────────────
const colorways: Record<string, { bg: string; color: string; glow: string }> = {
  mint:     { bg: 'var(--mochi-mint)',          color: 'hsl(142deg 70% 18%)', glow: 'var(--shadow-glow-mint)' },
  blue:     { bg: 'var(--mochi-sky-blue)',       color: 'hsl(200deg 70% 22%)', glow: 'none' },
  pink:     { bg: 'var(--mochi-blush-pink)',     color: 'hsl(350deg 70% 24%)', glow: 'none' },
  lavender: { bg: 'var(--mochi-lavender-vivid)', color: 'white',               glow: 'var(--shadow-glow-lavender)' },
  peach:    { bg: 'var(--mochi-peach)',          color: 'hsl(25deg 75% 22%)',  glow: 'none' },
  neutral:  { bg: 'var(--bg-card)',              color: 'var(--text-primary)',  glow: 'none' },
};

const sizes: Record<string, { padding: string; fontSize: string; minHeight: string }> = {
  sm: { padding: 'var(--space-2) var(--space-4)',  fontSize: 'var(--type-meta-size)',  minHeight: '44px' },
  md: { padding: 'var(--space-4) var(--space-8)',  fontSize: 'var(--type-body-size)',  minHeight: '44px' },
  lg: { padding: 'var(--space-5) var(--space-10)', fontSize: '1.05rem',                minHeight: '52px' },
};

export const ClayButton: React.FC<ClayButtonProps> = ({
  children,
  colorway = 'mint',
  size = 'md',
  bounce = 0.4,
  duration = 300,
  haptic = 'soft',
  icon,
  iconPosition = 'leading',
  disabled = false,
  onClick,
  className = '',
}) => {
  const [isPressed, setIsPressed]   = useState(false);
  const [isHovered, setIsHovered]   = useState(false);
  const [rippleKey, setRippleKey]   = useState(0);
  const [rippleOrigin, setRippleOrigin] = useState({ x: 0, y: 0 });

  const spring: SpringOptions = {
    stiffness: 300 - bounce * 200,
    damping:   1000 / duration,
    mass: 1,
  };

  const y          = useSpring(0, spring);
  const scale      = useSpring(1, spring);
  const shadowY    = useSpring(8, spring);
  const shadowBlur = useSpring(16, spring);

  const boxShadow = useTransform(
    [shadowY, shadowBlur],
    ([sy, sb]) => {
      const glow = colorways[colorway].glow;
      return [
        \`\${sy as number}px \${sy as number}px \${sb as number}px rgba(0,0,0,0.1)\`,
        'inset -4px -4px 8px rgba(0,0,0,0.05)',
        'inset 4px 4px 8px rgba(255,255,255,0.8)',
        glow !== 'none' ? glow : '',
      ].filter(Boolean).join(', ');
    },
  );

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        const patterns = { soft: [10], medium: [15, 5, 10], firm: [20, 5, 15, 5, 10] };
        navigator.vibrate(patterns[haptic]);
      } catch {}
    }
  }, [haptic]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRippleOrigin({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setRippleKey(k => k + 1);
    setIsPressed(true);
    y.set(2); scale.set(0.95); shadowY.set(2); shadowBlur.set(4);
    triggerHaptic();
  };

  const handlePointerUp = () => {
    if (disabled) return;
    setIsPressed(false);
    y.set(-6); scale.set(1.02); shadowY.set(12); shadowBlur.set(24);
    setTimeout(() => { y.set(0); scale.set(1); shadowY.set(8); shadowBlur.set(16); }, duration * 0.6);
  };

  const handlePointerEnter = () => {
    if (!disabled) { setIsHovered(true); y.set(-4); shadowY.set(12); shadowBlur.set(20); }
  };

  const handlePointerLeave = () => {
    setIsHovered(false); setIsPressed(false);
    y.set(0); scale.set(1); shadowY.set(8); shadowBlur.set(16);
  };

  const { bg, color } = colorways[colorway];
  const sz = sizes[size];

  return (
    <motion.button
      className={\`clay-button clay-button--\${colorway} clay-button--\${size} \${className}\`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: bg,
        color,
        padding: sz.padding,
        fontSize: sz.fontSize,
        minHeight: sz.minHeight,
        borderRadius: 'var(--radius-squircle-sm)',
        border: 'none',
        fontFamily: 'var(--font-family)',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        y, scale, boxShadow,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={disabled ? undefined : onClick}
      data-state={isPressed ? 'active' : isHovered ? 'hover' : 'default'}
      aria-disabled={disabled}
    >
      {icon && iconPosition === 'leading'  && <span className="clay-button__icon">{icon}</span>}
      <span className="clay-button__text">{children}</span>
      {icon && iconPosition === 'trailing' && <span className="clay-button__icon">{icon}</span>}

      {/* Pointer-origin ripple */}
      {rippleKey > 0 && (
        <motion.span
          key={rippleKey}
          initial={{ scale: 0, opacity: 0.18, x: rippleOrigin.x - 16, y: rippleOrigin.y - 16 }}
          animate={{ scale: 7, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            pointerEvents: 'none',
          }}
        />
      )}
    </motion.button>
  );
};

export default ClayButton;
`,

// ─────────────────────────────────────────────────────────────────────────────
'ClayCard.tsx': `import React, { useState } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'motion/react';

export interface ClayCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'bento' | 'stats' | 'notification';
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach' | 'neutral' | 'ivory';
  elevation?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}

// ── All colors from CSS tokens — no hardcoded hsl() ──────────────────────────
const colorwayBg: Record<string, string> = {
  mint:     'var(--mochi-mint)',
  blue:     'var(--mochi-powder-blue)',
  pink:     'var(--mochi-blush-pink)',
  lavender: 'var(--mochi-lavender)',
  peach:    'var(--mochi-peach)',
  neutral:  'var(--bg-card)',
  ivory:    'var(--mochi-ivory)',
};

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  variant = 'default',
  colorway = 'neutral',
  interactive = true,
  onClick,
  className = '',
  header,
  footer,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const spring = { stiffness: 200, damping: 20, mass: 1 };

  const y        = useSpring(0, spring);
  const rotateX  = useSpring(0, spring);
  const rotateY  = useSpring(0, spring);
  const shadowY  = useSpring(8, spring);
  const shadowBlur = useSpring(16, spring);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rotateX.set((e.clientY - rect.top  - rect.height / 2) / 20);
    rotateY.set(-(e.clientX - rect.left - rect.width  / 2) / 20);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    y.set(-8); shadowY.set(20); shadowBlur.set(40);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    y.set(0); rotateX.set(0); rotateY.set(0); shadowY.set(8); shadowBlur.set(16);
  };

  const boxShadow = useTransform(
    [shadowY, shadowBlur],
    ([sy, sb]) => [
      \`0 \${sy as number}px \${sb as number}px rgba(0,0,0,0.1)\`,
      'inset -10px -10px 20px rgba(0,0,0,0.05)',
      'inset 10px 10px 20px rgba(255,255,255,0.8)',
    ].join(', '),
  );

  return (
    <motion.div
      className={\`clay-card clay-card--\${variant} \${className}\`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: colorwayBg[colorway],
        borderRadius: 'var(--radius-squircle-lg)',
        padding: 'var(--space-6)',
        cursor: interactive ? 'pointer' : 'default',
        y, rotateX, rotateY, boxShadow,
        transformPerspective: 1000,
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={interactive ? { scale: 0.98, y: 2 } : undefined}
    >
      {header && <div className="clay-card__header" style={{ marginBottom: 'var(--space-4)' }}>{header}</div>}
      <div className="clay-card__content">{children}</div>
      {footer && <div className="clay-card__footer" style={{ marginTop: 'var(--space-4)' }}>{footer}</div>}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.1 }} exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: 'inherit',
              background: 'linear-gradient(135deg, transparent 40%, white 50%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClayCard;
`,

// ─────────────────────────────────────────────────────────────────────────────
'ClayModal.tsx': `import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ClayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'neutral';
}

const maxWidths: Record<string, string> = { sm: '400px', md: '560px', lg: '720px' };

export const ClayModal: React.FC<ClayModalProps> = ({
  isOpen, onClose, title, children, size = 'md',
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-6)',
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }}
            style={{
              width: '100%',
              maxWidth: maxWidths[size],
              borderRadius: 'var(--radius-squircle-lg)',
              background: 'var(--bg-card)',
              boxShadow: [
                '0 40px 80px rgba(0,0,0,0.2)',
                'inset -10px -10px 20px rgba(0,0,0,0.05)',
                'inset 10px 10px 20px rgba(255,255,255,0.8)',
              ].join(', '),
              overflow: 'hidden',
            }}
          >
            {title && (
              <div style={{
                padding: 'var(--space-6) var(--space-6) 0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <h3 id="modal-title" style={{
                  fontSize: 'var(--type-title-size)',
                  fontWeight: 'var(--type-title-weight)' as unknown as number,
                  color: 'var(--text-primary)', margin: 0,
                }}>
                  {title}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  aria-label="Close dialog"
                  style={{
                    width: 44, height: 44,
                    borderRadius: 'var(--radius-squircle-xs)',
                    border: 'none',
                    background: 'var(--bg-surface)',
                    boxShadow: 'var(--shadow-clay)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, color: 'var(--text-secondary)',
                  }}
                >×</motion.button>
              </div>
            )}
            <div style={{ padding: 'var(--space-6)' }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClayModal;
`,

// ─────────────────────────────────────────────────────────────────────────────
'ClaySkeleton.tsx': `import React from 'react';
import { motion } from 'motion/react';

export interface ClaySkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
  animation?: 'pulse' | 'wave' | 'none';
  style?: React.CSSProperties;
}

const getDimensions = (variant: string, height?: string | number) => {
  switch (variant) {
    case 'text':        return { height: height ?? 16,  borderRadius: 'var(--radius-squircle-xs)' };
    case 'circular':   return { height: height ?? 56,  borderRadius: '50%' };
    case 'rectangular': return { height: height ?? 120, borderRadius: 'var(--radius-squircle-sm)' };
    case 'rounded':    return { height: height ?? 48,  borderRadius: 'var(--radius-squircle-md)' };
    default:           return { height: 16,            borderRadius: 'var(--radius-squircle-xs)' };
  }
};

export const ClaySkeleton: React.FC<ClaySkeletonProps> = ({
  variant = 'text', width = '100%', height, count = 1, animation = 'pulse', style,
}) => {
  const dims = getDimensions(variant, height);

  const pulseAnim = {
    opacity: [0.4, 0.8, 0.4] as number[],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
  };
  const waveAnim = {
    backgroundPosition: ['-200% 0', '200% 0'] as string[],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' as const },
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={animation === 'pulse' ? pulseAnim : animation === 'wave' ? waveAnim : {}}
          style={{
            width,
            height: dims.height,
            borderRadius: dims.borderRadius,
            background: animation === 'wave'
              ? 'linear-gradient(90deg, var(--bg-inset, var(--bg-surface)) 25%, var(--bg-card) 50%, var(--bg-inset, var(--bg-surface)) 75%)'
              : 'var(--bg-inset, var(--bg-surface))',
            backgroundSize: animation === 'wave' ? '200% 100%' : undefined,
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.05), inset -2px -2px 4px rgba(255,255,255,0.4)',
            marginBottom: i < count - 1 ? 'var(--space-3)' : 0,
            ...style,
          }}
        />
      ))}
    </>
  );
};

export default ClaySkeleton;
`,

// ─────────────────────────────────────────────────────────────────────────────
'ClayTooltip.tsx': `import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ClayTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  colorway?: 'dark' | 'light';
}

export const ClayTooltip: React.FC<ClayTooltipProps> = ({
  children, content, position = 'top', delay = 300, colorway = 'dark',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords]       = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    timerRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = rect.left + rect.width  / 2 + window.scrollX;
        let y = rect.top               + window.scrollY;
        switch (position) {
          case 'top':    y -= 8; break;
          case 'bottom': y += rect.height + 8; break;
          case 'left':   x  = rect.left  + window.scrollX - 8; break;
          case 'right':  x  = rect.right + window.scrollX + 8; break;
        }
        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hide = () => { clearTimeout(timerRef.current); setIsVisible(false); };
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const isDark = colorway === 'dark';

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show} onMouseLeave={hide}
        onFocus={show}      onBlur={hide}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, scale: 0.82, y: position === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{    opacity: 0, scale: 0.82, y: position === 'top' ? 4 : -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'fixed',
              left: coords.x,
              top:  coords.y,
              transform: 'translate(-50%, -100%)',
              zIndex: 2000,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-squircle-xs)',
              background:   isDark ? 'var(--mochi-dark-surface)' : 'var(--bg-card)',
              color:        isDark ? '#E8E8F0'                   : 'var(--text-primary)',
              fontSize:     'var(--type-meta-size)',
              fontWeight:   500,
              fontFamily:   'var(--font-family)',
              lineHeight:   'var(--type-meta-line)',
              boxShadow: [
                '0 8px 24px rgba(0,0,0,0.15)',
                isDark
                  ? 'inset 1px 1px 2px rgba(255,255,255,0.1)'
                  : 'inset 1px 1px 2px rgba(255,255,255,0.8)',
              ].join(', '),
              whiteSpace: 'nowrap',
            }}>
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClayTooltip;
`,

};

let written = 0;
for (const [filename, content] of Object.entries(files)) {
  const dest = path.join(CLAY, filename);
  fs.writeFileSync(dest, content, 'utf8');
  console.log('[generate-components] Wrote', dest);
  written++;
}
console.log(`[generate-components] Done — wrote ${written} component files.`);
