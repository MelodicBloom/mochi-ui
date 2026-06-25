import { useRef, useState, useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import { useSpring, useTransform, useMotionValue, useAnimationFrame } from 'motion/react';
import type { MotionValue, SpringOptions } from 'motion/react';

// ─── useClayShadow ───
// Computes a dynamic clay box-shadow from a spring-driven elevation value.
export function useClayShadow(elevation: number = 8) {
  const springEl = useSpring(elevation, { stiffness: 200, damping: 20 });
  const shadow = useTransform(springEl, (el) =>
    `0 ${el}px ${el * 2}px rgba(0,0,0,0.1),` +
    `inset -10px -10px 20px rgba(0,0,0,0.05),` +
    `inset 10px 10px 20px rgba(255,255,255,0.8)`
  );
  return { shadow, springEl };
}

// ─── useClayPress ───
// Returns motion values for scale / y that compress on press and rebound.
export function useClayPress(config?: Partial<SpringOptions>) {
  const cfg: SpringOptions = { stiffness: 300, damping: 20, mass: 1, ...config };
  const scale = useSpring(1, cfg);
  const y     = useSpring(0, cfg);

  const onPress   = useCallback(() => { scale.set(0.92); y.set(4); }, [scale, y]);
  const onRelease = useCallback(() => { scale.set(1);    y.set(0); }, [scale, y]);

  return { scale, y, onPress, onRelease };
}

// ─── useMouseTilt ───
// 3-D tilt effect driven by mouse position relative to an element.
export function useMouseTilt<T extends HTMLElement>(maxAngle: number = 12) {
  const ref      = useRef<T>(null) as RefObject<T>;
  const rotateX  = useSpring(0, { stiffness: 200, damping: 25 });
  const rotateY  = useSpring(0, { stiffness: 200, damping: 25 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect    = el.getBoundingClientRect();
    const cx      = rect.left + rect.width  / 2;
    const cy      = rect.top  + rect.height / 2;
    rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -maxAngle);
    rotateY.set(((e.clientX - cx) / (rect.width  / 2)) *  maxAngle);
  }, [rotateX, rotateY, maxAngle]);

  const onMouseLeave = useCallback(() => { rotateX.set(0); rotateY.set(0); }, [rotateX, rotateY]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove',  onMouseMove  as EventListener);
    el.addEventListener('mouseleave', onMouseLeave as EventListener);
    return () => {
      el.removeEventListener('mousemove',  onMouseMove  as EventListener);
      el.removeEventListener('mouseleave', onMouseLeave as EventListener);
    };
  }, [onMouseMove, onMouseLeave]);

  return { ref, rotateX, rotateY };
}

// ─── useClayFloat ───
// Ambient breathing / floating animation via requestAnimationFrame.
export function useClayFloat(amplitude: number = 8, frequency: number = 0.5, delay: number = 0) {
  const y      = useMotionValue(0);
  const rotate = useMotionValue(0);

  useAnimationFrame((time) => {
    const t    = (time / 1000 + delay) * frequency;
    y.set(Math.sin(t * Math.PI * 2) * amplitude);
    rotate.set(Math.sin(t * Math.PI * 2 * 0.7) * 2);
  });

  return { y, rotate };
}

// ─── useScrollVelocityScale ───
// Scales an element based on scroll velocity — shrinks when scrolling fast.
export function useScrollVelocityScale(factor: number = 0.002) {
  const velocity = useMotionValue(0);
  const scale    = useTransform(velocity, (v) => Math.max(0.92, 1 - Math.abs(v) * factor));
  const lastY    = useRef(0);
  const lastT    = useRef(0);

  useAnimationFrame((time) => {
    const dt = time - lastT.current;
    if (dt > 0) {
      const v = (window.scrollY - lastY.current) / dt;
      velocity.set(v);
    }
    lastY.current = window.scrollY;
    lastT.current = time;
  });

  return { scale, velocity };
}

// ─── useSpringCounter ───
// Animates a number from 0 to target with a spring easing — for stats/counters.
export function useSpringCounter(target: number, config?: Partial<SpringOptions>) {
  const [displayed, setDisplayed] = useState(0);
  const mv  = useMotionValue(0);
  const cfg: SpringOptions = { stiffness: 60, damping: 20, ...config };
  const spr = useSpring(mv, cfg);

  useEffect(() => {
    mv.set(target);
  }, [target, mv]);

  useEffect(() => {
    return spr.on('change', (v) => setDisplayed(Math.round(v)));
  }, [spr]);

  return displayed;
}

// ─── useMagneticAttraction ───
// Pulls an element toward the cursor when the cursor is within `radius` px.
export function useMagneticAttraction<T extends HTMLElement>(radius: number = 80, strength: number = 0.35) {
  const ref = useRef<T>(null) as RefObject<T>;
  const x   = useSpring(0, { stiffness: 250, damping: 18 });
  const y   = useSpring(0, { stiffness: 250, damping: 18 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y, radius, strength]);

  return { ref, x, y };
}

// ─── useClayDrag ───
// Returns motion values that track pointer drag delta with spring smoothing.
export function useClayDrag(config?: Partial<SpringOptions>) {
  const cfg: SpringOptions = { stiffness: 300, damping: 30, ...config };
  const rawX  = useMotionValue(0);
  const rawY  = useMotionValue(0);
  const dragX = useSpring(rawX, cfg);
  const dragY = useSpring(rawY, cfg);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const startY     = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current     = e.clientX;
    startY.current     = e.clientY;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    rawX.set(e.clientX - startX.current);
    rawY.set(e.clientY - startY.current);
  }, [rawX, rawY]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { dragX, dragY, onPointerDown, onPointerMove, onPointerUp };
}
