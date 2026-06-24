/**
 * MOCHI UI — spring-physics.ts
 *
 * Type definitions and preset configs for the spring system.
 * The actual animation engine is Framer Motion (motion/react);
 * this file provides the shared SpringConfig interface so all
 * components and hooks use the same parameter names.
 */

export interface SpringConfig {
  /** Spring stiffness — higher = snappier (maps to Framer `stiffness`) */
  tension: number;
  /** Damping coefficient — higher = less bounce (maps to Framer `damping`) */
  friction: number;
  /** Mass of the animated object — higher = more inertia (maps to Framer `mass`) */
  mass: number;
}

export interface SpringState {
  value: number;
  velocity: number;
  done: boolean;
}

/** Ready-made spring presets for consistent feel across the system */
export const SPRING_PRESETS = {
  /** Gentle, slow settle — good for page-level transitions */
  gentle: { tension: 120, friction: 14, mass: 1 } satisfies SpringConfig,
  /** Default interactive feel — buttons, cards */
  default: { tension: 300, friction: 28, mass: 1 } satisfies SpringConfig,
  /** Snappy — toggles, segmented controls */
  snappy: { tension: 450, friction: 24, mass: 0.8 } satisfies SpringConfig,
  /** Bouncy — badges, tooltips, toasts */
  bouncy: { tension: 500, friction: 18, mass: 0.6 } satisfies SpringConfig,
  /** Stiff — sliders, immediate feedback */
  stiff: { tension: 600, friction: 30, mass: 0.5 } satisfies SpringConfig,
} as const;

export const DEFAULT_CONFIG: SpringConfig = SPRING_PRESETS.default;
