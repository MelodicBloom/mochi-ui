// Spring physics config
export { SPRING_PRESETS, DEFAULT_CONFIG } from './spring-physics';
export type { SpringConfig, SpringState } from './spring-physics';

// Spring hooks — export what actually exists in spring-hooks.ts
export {
  useClayShadow,
  useClayPress,
  useMouseTilt,
  useClayFloat,
  useScrollVelocityScale,
  useSpringCounter,
  useMagneticAttraction,
  useClayDrag,
} from './spring-hooks';

// Utility hooks
export { useCountUp }       from './useCountUp';
export { useActiveSection } from './useActiveSection';
export { useToast }         from './useToast';
