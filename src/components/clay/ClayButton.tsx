import React, { useState, useCallback } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'motion/react';
import type { SpringOptions } from 'motion/react';
import { withClayReducedMotion } from './withClayReducedMotion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';

export interface ClayButtonProps {
  children: React.ReactNode;
  colorway?: 'mint' | 'blue' | 'pink' | 'lavender' | 'peach' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  bounce?: number;        // 0-1, how elastic
  duration?: number;      // ms, perceptual duration
  haptic?: 'soft' | 'medium' | 'firm';
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  disabled?: boolean;
  /** Shows a spinner, sets aria-busy and blocks clicks while true. */
  loading?: boolean;
  /** Accessible label announced while loading (default: "Loading"). */
  loadingLabel?: string;
  onClick?: () => void;
  className?: string;
}

// Colorway configurations
const colorways = {
  mint: { bg: 'hsl(142deg 76% 78%)', color: 'hsl(142deg 70% 18%)' },
  blue: { bg: 'hsl(200deg 90% 88%)', color: 'hsl(200deg 70% 22%)' },
  pink: { bg: 'hsl(350deg 90% 88%)', color: 'hsl(350deg 70% 24%)' },
  lavender: { bg: 'hsl(270deg 70% 88%)', color: 'hsl(270deg 60% 24%)' },
  peach: { bg: 'hsl(25deg 95% 78%)', color: 'hsl(25deg 75% 22%)' },
  neutral: { bg: 'hsl(30deg 15% 90%)', color: 'hsl(30deg 15% 28%)' },
};

// Size configurations
const sizes = {
  sm: { padding: '8px 16px', fontSize: '14px' },
  md: { padding: '16px 32px', fontSize: '16px' },
  lg: { padding: '24px 48px', fontSize: '18px' },
};

const ClayButtonBase: React.FC<ClayButtonProps> = ({
  children,
  colorway = 'mint',
  size = 'md',
  bounce = 0.4,
  duration = 300,
  haptic = 'soft',
  icon,
  iconPosition = 'leading',
  disabled: disabledProp = false,
  loading = false,
  loadingLabel = 'Loading',
  onClick,
  className = '',
}) => {
  const disabled = disabledProp || loading;
  const reduceMotion = useReducedMotionSafe();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Spring physics configuration
  const springConfig: SpringOptions = {
    stiffness: 300 - (bounce * 200),  // Higher bounce = lower stiffness = more elastic
    damping: 1000 / duration,          // Duration mapping
    mass: 1,
  };

  // Motion values for physics-driven animation
  const y = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const shadowY = useSpring(8, springConfig);
  const shadowBlur = useSpring(16, springConfig);

  // Shadow transform based on motion values
  const boxShadow = useTransform(
    [shadowY, shadowBlur],
    ([latestY, latestBlur]) => {
      const y = latestY as number;
      const blur = latestBlur as number;
      return `
        ${y}px ${y}px ${blur}px rgba(0,0,0,0.1),
        inset -4px -4px 8px rgba(0,0,0,0.05),
        inset 4px 4px 8px rgba(255,255,255,0.8)
      `;
    }
  );

  // Haptic feedback trigger
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const patterns = {
        soft: [10],
        medium: [15, 5, 10],
        firm: [20, 5, 15, 5, 10],
      };
      navigator.vibrate(patterns[haptic]);
    }
  }, [haptic]);

  // Interaction handlers
  const handlePointerDown = () => {
    if (disabled) return;
    setIsPressed(true);

    if (reduceMotion) { triggerHaptic(); return; }

    // Compression phase
    y.set(2);
    scale.set(0.95);
    shadowY.set(2);
    shadowBlur.set(4);

    triggerHaptic();
  };

  const handlePointerUp = () => {
    if (disabled) return;
    setIsPressed(false);

    if (reduceMotion) {
      y.jump(0); scale.jump(1); shadowY.jump(8); shadowBlur.jump(16);
      return;
    }

    // Release with overshoot (clay rebound)
    y.set(-6);
    scale.set(1.02);
    shadowY.set(12);
    shadowBlur.set(24);

    // Settle back
    setTimeout(() => {
      y.set(0);
      scale.set(1);
      shadowY.set(8);
      shadowBlur.set(16);
    }, duration * 0.6);
  };

  const handlePointerEnter = () => {
    if (!disabled) {
      setIsHovered(true);
      if (reduceMotion) return;
      y.set(-4);
      shadowY.set(12);
      shadowBlur.set(20);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    y.set(0);
    scale.set(1);
    shadowY.set(8);
    shadowBlur.set(16);
  };

  const colors = colorways[colorway];
  const sizeStyles = sizes[size];

  return (
    <motion.button
      className={`clay-button clay-button--${colorway} clay-button--${size} ${className}`}
      style={{
        background: colors.bg,
        color: colors.color,
        padding: sizeStyles.padding,
        fontSize: sizeStyles.fontSize,
        y,
        scale,
        boxShadow,
        opacity: disabledProp ? 0.5 : loading ? 0.85 : 1,
        cursor: loading ? 'progress' : disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      data-loading={loading || undefined}
      data-state={loading ? 'loading' : isPressed ? 'active' : isHovered ? 'hover' : 'default'}
      whileTap={disabled ? undefined : { scale: 0.95 }}
    >
      {loading && (
        <span className="clay-button__spinner" role="status" aria-label={loadingLabel}>
          <motion.svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }} aria-hidden>
            <path d="M12 3a9 9 0 1 1-9 9" opacity={0.9} />
          </motion.svg>
        </span>
      )}
      {!loading && icon && iconPosition === 'leading' && (
        <span className="clay-button__icon">{icon}</span>
      )}
      <span className="clay-button__text">{children}</span>
      {icon && iconPosition === 'trailing' && (
        <span className="clay-button__icon">{icon}</span>
      )}
    </motion.button>
  );
};

export const ClayButton = withClayReducedMotion(ClayButtonBase, 'ClayButton');

export default ClayButton;
