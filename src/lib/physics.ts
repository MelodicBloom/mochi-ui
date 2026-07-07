/**
 * MOCHI UI — Physics-only sub-entry (no React, no 'use client')
 *
 * Available as @mochi-ui/react/physics — safe to import in:
 *   - React Server Components
 *   - Node.js build scripts (e.g. pre-generating CSS keyframes)
 *   - Non-React environments
 *
 * Do NOT add React imports or DOM APIs here.
 */

export {
  SpringPhysics,
  MultiSpring,
  springToCubicBezier,
  generateSpringKeyframes,
  SPRING_PRESETS,
  DEFAULT_CONFIG,
} from './spring-physics';
export type { SpringConfig, SpringState } from './spring-physics';
