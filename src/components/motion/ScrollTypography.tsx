'use client';
import React, { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useReducedMotion } from '../../hooks/spring-hooks';

export interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 36,
  once = true,
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const initial: Record<string, number> = { opacity: 0 };
  if (!prefersReducedMotion) {
    if (direction === 'up') initial.y = distance;
    if (direction === 'down') initial.y = -distance;
    if (direction === 'left') initial.x = distance;
    if (direction === 'right') initial.x = -distance;
    if (direction === 'scale') initial.scale = 0.92;
  }

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: prefersReducedMotion ? 0 : duration, delay, ease: [0.34, 1.2, 0.64, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export interface SplitTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  animation?: 'chars' | 'words';
  stagger?: number;
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  as: Tag = 'h2',
  animation = 'chars',
  stagger = 0.03,
  delay = 0,
  duration = 0.5,
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const elements = useMemo(() => {
    return animation === 'words'
      ? text.split(' ').map((w, i) => ({ key: i, text: w, space: true }))
      : text.split('').map((c, i) => ({ key: i, text: c, space: c === ' ' }));
  }, [text, animation]);

  if (prefersReducedMotion) {
    const El = Tag;
    return <El className={className} style={style}>{text}</El>;
  }

  return (
    <Tag className={className} style={{ ...style, perspective: '800px' }}>
      {elements.map(({ key, text: unit, space }) => (
        <motion.span
          key={key}
          initial={{ opacity: 0, y: 24, rotateX: -35 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration, delay: delay + key * stagger, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ display: 'inline-block', whiteSpace: space && animation === 'chars' ? 'pre' : undefined }}
        >
          {space && animation === 'chars' ? '\u00A0' : unit}
          {animation === 'words' && key < elements.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Tag>
  );
};

export interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ children, speed = 0.4, className, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rawY = useTransform(scrollYProgress, [0, 1], [`${-speed * 60}px`, `${speed * 60}px`]);
  const y = useSpring(rawY, { stiffness: 80, damping: 18 });

  if (prefersReducedMotion) return <div ref={ref} className={className} style={style}>{children}</div>;
  return <motion.div ref={ref} style={{ y, ...style }} className={className}>{children}</motion.div>;
};

export interface ScrollProgressBarProps {
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
  zIndex?: number;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  color = 'var(--mochi-mint)',
  height = 3,
  position = 'top',
  zIndex = 1000,
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <motion.div
      style={{
        position: 'fixed',
        [position]: 0,
        left: 0,
        right: 0,
        height,
        background: color,
        transformOrigin: 'left',
        scaleX,
        zIndex,
      }}
    />
  );
};

export interface TextRevealBlockProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const TextRevealBlock: React.FC<TextRevealBlockProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  color = 'var(--mochi-mint)',
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return <div className={className} style={style}>{children}</div>;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }} className={className}>
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0% 0 100%)'] }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: duration * 1.3, delay: delay * 0.7, times: [0, 0.45, 1], ease: [0.76, 0, 0.24, 1] }}
        style={{ position: 'absolute', inset: 0, background: color, pointerEvents: 'none' }}
      />
    </div>
  );
};

export default ScrollReveal;
