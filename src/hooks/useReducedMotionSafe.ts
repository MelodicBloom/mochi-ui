import { useReducedMotion } from 'motion/react';

/** SSR-safe boolean: true when the user prefers reduced motion. */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false;
}

/** Returns an instant transition when reduced motion is preferred, else the given spring. */
export function useClayTransition<T extends object>(spring: T): T | { duration: 0 } {
  return useReducedMotionSafe() ? { duration: 0 } : spring;
}
