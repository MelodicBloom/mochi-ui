import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';

// ─── ScrollReveal ───
export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children, delay = 0, duration = 0.6, distance = 36, once = true, className, style,
}) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, y: distance }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: '-72px' }}
    transition={{ duration, delay, ease: [0.34, 1.56, 0.64, 1] }}
  >
    {children}
  </motion.div>
);

// ─── SplitText ───
// `as` is constrained to string tag names so TypeScript can resolve the element’s
// intrinsic props without narrowing `children` to `never`.
// We render via a typed intermediate variable to keep JSX happy.
export interface SplitTextProps {
  text: string;
  as?: string;
  stagger?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  as: tagName = 'div',
  stagger = 0.035,
  delay = 0,
  className,
  style,
}) => {
  const words = text.split(' ');
  return React.createElement(
    tagName,
    { className, style: { ...style, display: 'block' }, 'aria-label': text },
    words.map((word, wi) =>
      React.createElement(
        'span',
        { key: wi, 'aria-hidden': true, style: { display: 'inline-block', overflow: 'hidden', marginRight: '0.25em' } },
        React.createElement(
          motion.span,
          {
            initial: { y: '110%', opacity: 0 },
            whileInView: { y: '0%', opacity: 1 },
            viewport: { once: true, margin: '-40px' },
            transition: { duration: 0.55, delay: delay + wi * stagger, ease: [0.34, 1.56, 0.64, 1] },
            style: { display: 'inline-block' },
          },
          word
        )
      )
    )
  );
};

// ─── ParallaxLayer ───
export interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ children, speed = 0.3, className, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rawY = useTransform(scrollYProgress, [0, 1], [`${-speed * 60}px`, `${speed * 60}px`]);
  const y    = useSpring(rawY, { stiffness: 80, damping: 20 });
  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
};

// ─── ScrollProgressBar ───
export interface ScrollProgressBarProps {
  height?: number;
  color?: string;
  zIndex?: number;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  height = 3, color = 'var(--mochi-mint)', zIndex = 1000,
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height, background: color, transformOrigin: 'left',
        scaleX, zIndex,
      }}
    />
  );
};

// ─── TextRevealBlock ───
export interface TextRevealBlockProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const TextRevealBlock: React.FC<TextRevealBlockProps> = ({
  children, color = 'var(--mochi-mint)', duration = 0.7, className, style,
}) => {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <motion.div
        initial={{ y: '100%' }}
        animate={inView ? { y: '0%' } : { y: '100%' }}
        transition={{ duration, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        initial={{ scaleX: 0, originX: 0 }}
        animate={inView ? { scaleX: [0, 1, 1, 0], originX: ['0%', '0%', '100%', '100%'] } : {}}
        transition={{ duration, ease: 'easeInOut', times: [0, 0.45, 0.55, 1] }}
        style={{ position: 'absolute', inset: 0, background: color, borderRadius: 4 }}
      />
    </div>
  );
};
