/**
 * MOCHI UI — React Spring Hooks v2.0
 * 
 * Production-ready React hooks for spring physics animations.
 * Compatible with React 18+ concurrent features.
 */

'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { SpringPhysics, SpringConfig, SPRING_PRESETS, DEFAULT_CONFIG } from './spring-physics';

export interface UseSpringOptions extends Partial<SpringConfig> {
  from?: number;
  immediate?: boolean;
  onRest?: () => void;
  onChange?: (value: number, velocity: number) => void;
}

export interface UseSpringReturn {
  value: number;
  velocity: number;
  set: (target: number, immediate?: boolean) => void;
  jump: (value: number) => void;
  isAnimating: boolean;
}

export function useSpring(options: UseSpringOptions = {}): UseSpringReturn {
  const { from = 0, immediate = false, onRest, onChange, ...springConfig } = options;
  const springRef = useRef<SpringPhysics | null>(null);
  const onRestRef = useRef(onRest);
  const onChangeRef = useRef(onChange);
  const [state, setState] = useState({ value: from, velocity: 0, isAnimating: false });

  useEffect(() => {
    onRestRef.current = onRest;
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    const spring = new SpringPhysics({ ...DEFAULT_CONFIG, ...springConfig, initialVelocity: 0 });
    spring.setValue(from);
    springRef.current = spring;
    const unsubscribe = spring.subscribe((value, velocity) => {
      const isAnimating = spring.getIsAnimating();
      setState({ value, velocity, isAnimating });
      onChangeRef.current?.(value, velocity);
      if (!isAnimating && onRestRef.current) onRestRef.current();
    });
    return () => {
      unsubscribe();
      spring.stop();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = useCallback((target: number, imm?: boolean) => {
    springRef.current?.animateTo(target, imm ?? immediate);
  }, [immediate]);

  const jump = useCallback((value: number) => {
    springRef.current?.setValue(value);
  }, []);

  return { value: state.value, velocity: state.velocity, set, jump, isAnimating: state.isAnimating };
}

export interface UseSpringsOptions {
  count: number;
  config?: Partial<SpringConfig>;
  from?: number | number[];
}

export function useSprings(options: UseSpringsOptions) {
  const { count, config = {}, from = 0 } = options;
  const springsRef = useRef<SpringPhysics[]>([]);
  const [values, setValues] = useState<number[]>(() => {
    const initial = typeof from === 'number' ? Array(count).fill(from) : from;
    return initial.slice(0, count);
  });

  useEffect(() => {
    const springs: SpringPhysics[] = [];
    const initial = typeof from === 'number' ? Array(count).fill(from) : from;
    for (let i = 0; i < count; i++) {
      const spring = new SpringPhysics(config);
      spring.setValue(initial[i] ?? 0);
      springs.push(spring);
    }
    springsRef.current = springs;
    const unsubscribers = springs.map((spring, i) =>
      spring.subscribe((value) => {
        setValues((prev) => {
          const next = [...prev];
          next[i] = value;
          return next;
        });
      })
    );
    return () => {
      unsubscribers.forEach((unsub) => unsub());
      springs.forEach((s) => s.stop());
    };
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = useCallback((targets: number[]) => {
    springsRef.current.forEach((spring, i) => spring.animateTo(targets[i] ?? 0));
  }, []);

  const setOne = useCallback((index: number, target: number) => {
    springsRef.current[index]?.animateTo(target);
  }, []);

  return { values, set, setOne };
}

export interface TransformValues {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
}

export function useSpringTransform(config: Partial<SpringConfig> = {}) {
  const x = useSpring({ from: 0, ...config });
  const y = useSpring({ from: 0, ...config });
  const scale = useSpring({ from: 1, ...config });
  const rotate = useSpring({ from: 0, ...config });
  const rotateX = useSpring({ from: 0, ...config });
  const rotateY = useSpring({ from: 0, ...config });

  const setTransform = useCallback(
    (values: TransformValues, immediate?: boolean) => {
      if (values.x !== undefined) x.set(values.x, immediate);
      if (values.y !== undefined) y.set(values.y, immediate);
      if (values.scale !== undefined) scale.set(values.scale, immediate);
      if (values.rotate !== undefined) rotate.set(values.rotate, immediate);
      if (values.rotateX !== undefined) rotateX.set(values.rotateX, immediate);
      if (values.rotateY !== undefined) rotateY.set(values.rotateY, immediate);
    },
    [x, y, scale, rotate, rotateX, rotateY]
  );

  const style: React.CSSProperties = {
    transform: `translate3d(${x.value}px, ${y.value}px, 0) scale(${scale.value}) rotate(${rotate.value}deg) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
    willChange: 'transform',
  };

  return { style, setTransform };
}

export function useScrollSpring(config: Partial<SpringConfig> = {}) {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const springRef = useRef<SpringPhysics | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const spring = new SpringPhysics({ mass: 1.5, tension: 150, friction: 30, ...config });
    springRef.current = spring;
    const unsubscribe = spring.subscribe((value) => {
      setScrollY(value);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? value / docHeight : 0);
    });
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        spring.animateTo(window.scrollY);
        rafRef.current = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
      spring.stop();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { scrollY, scrollProgress };
}

/**
 * useMagnetic — always called unconditionally.
 * Pass enabled=false to no-op the effect without changing hook call count.
 */
export function useMagnetic(
  ref: React.RefObject<HTMLElement | null>,
  config: Partial<SpringConfig> = {},
  radius: number = 50,
  enabled: boolean = true
) {
  const { style, setTransform } = useSpringTransform({ mass: 1.2, tension: 300, friction: 20, ...config });

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      if (distance < radius) {
        const strength = 1 - distance / radius;
        setTransform({ x: distanceX * strength * 0.3, y: distanceY * strength * 0.3 });
      } else {
        setTransform({ x: 0, y: 0 });
      }
    };
    const handleMouseLeave = () => setTransform({ x: 0, y: 0 });
    window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, radius, setTransform, enabled]);

  return style;
}

/**
 * useSquish — always called unconditionally.
 * Pass enabled=false to no-op the effect without changing hook call count.
 */
export function useSquish(
  ref: React.RefObject<HTMLElement | null>,
  config: Partial<SpringConfig> = {},
  enabled: boolean = true
) {
  const scale = useSpring({ from: 1, mass: 0.8, tension: 500, friction: 25, ...config });
  const y = useSpring({ from: 0, mass: 0.8, tension: 500, friction: 25, ...config });

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;
    const handlePointerDown = () => { scale.set(0.94); y.set(2); };
    const handlePointerUp = () => { scale.set(1); y.set(0); };
    element.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      element.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [ref, scale, y, enabled]);

  return { transform: `scale(${scale.value}) translateY(${y.value}px)`, willChange: 'transform' } as React.CSSProperties;
}

export function useStaggeredReveal(
  itemCount: number,
  options: { staggerDelay?: number; fromY?: number; fromOpacity?: number; config?: Partial<SpringConfig> } = {}
) {
  const { staggerDelay = 50, fromY = 30, fromOpacity = 0, config = {} } = options;
  const springs = useSprings({ count: itemCount, config: { mass: 1, tension: 280, friction: 24, ...config }, from: 0 });
  const [revealed, setRevealed] = useState(false);

  const reveal = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
    springs.values.forEach((_, i) => {
      setTimeout(() => springs.setOne(i, 1), i * staggerDelay);
    });
  }, [revealed, springs, staggerDelay]);

  const getStyle = useCallback(
    (index: number): React.CSSProperties => {
      const progress = springs.values[index] ?? 0;
      return {
        opacity: fromOpacity + (1 - fromOpacity) * progress,
        transform: `translateY(${fromY * (1 - progress)}px)`,
        willChange: 'opacity, transform',
      };
    },
    [springs.values, fromY, fromOpacity]
  );

  return { reveal, getStyle, revealed };
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    () => false
  );
}

export { SPRING_PRESETS, DEFAULT_CONFIG };
export type { SpringConfig };
