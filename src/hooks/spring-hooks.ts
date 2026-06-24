/**
 * MOCHI UI — spring-hooks.ts
 *
 * React hooks for spring-physics animations.
 * Built on top of Framer Motion (motion/react) to stay consistent
 * with the existing ClayButton / ClayCard implementation.
 *
 * Exports:
 *  useSpring          — single animated value with spring physics
 *  useSprings         — multiple animated values
 *  useSpringTransform — 3D transform object driven by springs
 *  useScrollSpring    — value that tracks scroll position
 *  useMagnetic        — magnetic cursor pull (translateX/Y)
 *  useSquish          — scaleX/scaleY squish on pointer press
 *  useStaggeredReveal — intersection-observer stagger for lists
 *  useReducedMotion   — respects prefers-reduced-motion
 */

'use client';

import {
  useSpring as useFramerSpring,
  useMotionValue,
  useTransform,
  useScroll,
  useReducedMotion as useFramerReducedMotion,
  animate,
  type SpringOptions,
  type MotionValue,
} from 'motion/react';
import { useRef, useEffect, useCallback, useState, RefObject } from 'react';
import type { SpringConfig } from './spring-physics';

// ─── Type helpers ──────────────────────────────────────────────────────────────

/** Map from our SpringConfig shape → Framer SpringOptions */
function toFramerSpring(config?: Partial<SpringConfig>): SpringOptions {
  if (!config) return { stiffness: 300, damping: 28, mass: 1 };
  return {
    stiffness: config.tension ?? 300,
    damping: config.friction ?? 28,
    mass: config.mass ?? 1,
  };
}

// ─── useReducedMotion ──────────────────────────────────────────────────────────

/**
 * Returns true when the user has enabled prefers-reduced-motion.
 * SSR-safe: defaults to false on the server.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

// ─── useSpring ─────────────────────────────────────────────────────────────────

export interface SpringHandle {
  value: number;
  set: (target: number) => void;
  motionValue: MotionValue<number>;
}

/**
 * A single spring-animated number.
 *
 * @example
 * const opacity = useSpring({ from: 0, tension: 300, friction: 28 });
 * opacity.set(1);
 * <div style={{ opacity: opacity.value }} />
 */
export function useSpring(options?: {
  from?: number;
} & Partial<SpringConfig>): SpringHandle {
  const initial = options?.from ?? 0;
  const mv = useMotionValue(initial);
  const springOpts = toFramerSpring(options);
  const sprung = useFramerSpring(mv, springOpts);

  const set = useCallback(
    (target: number) => {
      mv.set(target);
    },
    [mv]
  );

  return {
    get value() {
      return sprung.get();
    },
    set,
    motionValue: sprung,
  };
}

// ─── useSprings ────────────────────────────────────────────────────────────────

/**
 * Multiple spring handles from a single config.
 *
 * @example
 * const [x, y, scale] = useSprings(3, { tension: 400, friction: 22 });
 */
export function useSprings(
  count: number,
  config?: Partial<SpringConfig>
): SpringHandle[] {
  const handles: SpringHandle[] = [];
  for (let i = 0; i < count; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    handles.push(useSpring(config));
  }
  return handles;
}

// ─── useSpringTransform ────────────────────────────────────────────────────────

export interface TransformState {
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
}

export interface SpringTransformResult {
  style: React.CSSProperties;
  setTransform: (state: TransformState) => void;
}

/**
 * Returns a `style` object and `setTransform` setter.
 * All values animate with spring physics via Framer Motion.
 *
 * @example
 * const { style, setTransform } = useSpringTransform({ tension: 200, friction: 26 });
 * <div style={style} onMouseMove={...} />
 */
export function useSpringTransform(
  config?: Partial<SpringConfig>
): SpringTransformResult {
  const opts = toFramerSpring(config);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rotateZ = useMotionValue(0);
  const scale = useMotionValue(1);
  const translateX = useMotionValue(0);
  const translateY = useMotionValue(0);

  const sRotateX = useFramerSpring(rotateX, opts);
  const sRotateY = useFramerSpring(rotateY, opts);
  const sRotateZ = useFramerSpring(rotateZ, opts);
  const sScale = useFramerSpring(scale, opts);
  const sTranslateX = useFramerSpring(translateX, opts);
  const sTranslateY = useFramerSpring(translateY, opts);

  const transform = useTransform(
    [sRotateX, sRotateY, sRotateZ, sScale, sTranslateX, sTranslateY],
    ([rx, ry, rz, sc, tx, ty]) =>
      `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc}) translateX(${tx}px) translateY(${ty}px)`
  );

  const setTransform = useCallback(
    (state: TransformState) => {
      if (state.rotateX !== undefined) rotateX.set(state.rotateX);
      if (state.rotateY !== undefined) rotateY.set(state.rotateY);
      if (state.rotateZ !== undefined) rotateZ.set(state.rotateZ);
      if (state.scale !== undefined) scale.set(state.scale);
      if (state.translateX !== undefined) translateX.set(state.translateX);
      if (state.translateY !== undefined) translateY.set(state.translateY);
    },
    [rotateX, rotateY, rotateZ, scale, translateX, translateY]
  );

  return {
    style: { transform } as React.CSSProperties,
    setTransform,
  };
}

// ─── useScrollSpring ───────────────────────────────────────────────────────────

/**
 * Maps scroll progress (0→1) to a spring-animated output range.
 *
 * @example
 * const opacity = useScrollSpring([0, 1], { tension: 200 });
 * <div style={{ opacity }} />
 */
export function useScrollSpring(
  outputRange: [number, number],
  config?: Partial<SpringConfig>
): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  const mapped = useTransform(scrollYProgress, [0, 1], outputRange);
  const sprung = useFramerSpring(mapped, toFramerSpring(config));
  return sprung;
}

// ─── useMagnetic ──────────────────────────────────────────────────────────────

/**
 * Pulls an element toward the cursor when the pointer is within `radius` px.
 * Returns a style object with a spring-animated `transform`.
 *
 * @example
 * const magneticStyle = useMagnetic(ref, config, 60);
 * <button ref={ref} style={magneticStyle} />
 */
export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  config?: Partial<SpringConfig>,
  radius = 60
): React.CSSProperties {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opts = toFramerSpring(config ?? { tension: 300, friction: 22, mass: 0.8 });
  const sx = useFramerSpring(x, opts);
  const sy = useFramerSpring(y, opts);

  const transform = useTransform(
    [sx, sy],
    ([lx, ly]) => `translateX(${lx}px) translateY(${ly}px)`
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const strength = 1 - dist / radius;
        x.set(dx * strength * 0.4);
        y.set(dy * strength * 0.4);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref, radius, prefersReducedMotion, x, y]);

  return prefersReducedMotion ? {} : { transform } as React.CSSProperties;
}

// ─── useSquish ────────────────────────────────────────────────────────────────

/**
 * Squishes an element on pointer-down and rebounds on pointer-up.
 * Returns a style object with spring-animated scaleX/scaleY.
 *
 * @example
 * const squishStyle = useSquish(ref, config);
 * <button ref={ref} style={squishStyle} />
 */
export function useSquish(
  ref: RefObject<HTMLElement | null>,
  config?: Partial<SpringConfig>
): React.CSSProperties {
  const prefersReducedMotion = useReducedMotion();
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const opts = toFramerSpring(config ?? { tension: 500, friction: 20, mass: 0.5 });
  const sx = useFramerSpring(scaleX, opts);
  const sy = useFramerSpring(scaleY, opts);

  const transform = useTransform(
    [sx, sy],
    ([lx, ly]) => `scaleX(${lx}) scaleY(${ly})`
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const down = () => { scaleX.set(1.12); scaleY.set(0.88); };
    const up = () => { scaleX.set(1); scaleY.set(1); };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointerleave', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointerleave', up);
    };
  }, [ref, prefersReducedMotion, scaleX, scaleY]);

  return prefersReducedMotion ? {} : { transform } as React.CSSProperties;
}

// ─── useStaggeredReveal ───────────────────────────────────────────────────────

/**
 * Adds `.is-visible` to a container element when it enters the viewport,
 * triggering the `.stagger-children` CSS animation defined in animations.css.
 *
 * @example
 * const containerRef = useStaggeredReveal();
 * <ul ref={containerRef} className="stagger-children"> ... </ul>
 */
export function useStaggeredReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
