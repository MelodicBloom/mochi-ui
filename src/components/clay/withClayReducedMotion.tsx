import React from 'react';
import { MotionConfig } from 'motion/react';

/**
 * Wraps a Clay primitive in <MotionConfig reducedMotion="user"> so declarative
 * motion (animate / whileTap / whileHover / layout) honours prefers-reduced-motion.
 * Imperative springs (useSpring .set) are NOT covered by MotionConfig; components
 * that use them gate overshoot explicitly via useReducedMotionSafe.
 */
export function withClayReducedMotion<P extends object>(Component: React.ComponentType<P>, name: string): React.FC<P> {
  const Wrapped: React.FC<P> = (props) => (
    <MotionConfig reducedMotion="user">
      <Component {...props} />
    </MotionConfig>
  );
  Wrapped.displayName = name;
  return Wrapped;
}
