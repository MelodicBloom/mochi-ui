import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { SpringOptions } from 'motion/react';
import { useSpring } from 'motion/react';
import type { MotionValue } from 'motion/react';

export interface PhysicsConfig {
  bounce: number;
  duration: number;
  mass?: number;
}

const defaultPhysics: PhysicsConfig = { bounce: 0.4, duration: 300, mass: 1 };

const PhysicsContext = createContext<PhysicsConfig>(defaultPhysics);

export const PhysicsProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<PhysicsConfig>;
}> = ({ children, config }) => {
  // useMemo ensures config prop changes propagate to all consumers reactively
  const physics = useMemo(
    () => ({ ...defaultPhysics, ...config }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config?.bounce, config?.duration, config?.mass]
  );
  return <PhysicsContext.Provider value={physics}>{children}</PhysicsContext.Provider>;
};

export const usePhysics = () => useContext(PhysicsContext);

export const toSpringConfig = (physics: PhysicsConfig): SpringOptions => ({
  stiffness: Math.max(50, 300 - physics.bounce * 250),
  damping:   Math.max(5, 1000 / physics.duration),
  mass:      physics.mass ?? 1,
});

export const physicsPresets = {
  jelly:     { bounce: 0.8, duration: 500, mass: 1.2 },
  clay:      { bounce: 0.4, duration: 300, mass: 1   },
  firm:      { bounce: 0.15, duration: 200, mass: 0.8 },
  snappy:    { bounce: 0.2, duration: 150, mass: 0.6 },
  luxurious: { bounce: 0.5, duration: 600, mass: 1.5 },
  bouncy:    { bounce: 0.9, duration: 400, mass: 1   },
};

export type PhysicsPreset = keyof typeof physicsPresets;

export interface HapticConfig {
  enabled: boolean;
  intensity: 'soft' | 'medium' | 'firm' | 'custom';
  pattern?: number[];
}

export const triggerHaptic = (config: HapticConfig = { enabled: true, intensity: 'soft' }) => {
  if (!config.enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  const patterns = {
    soft:   [10],
    medium: [15, 5, 10],
    firm:   [20, 5, 15, 5, 10],
    custom: config.pattern || [10],
  };
  navigator.vibrate(patterns[config.intensity]);
};

export type ClayState = 'default' | 'hover' | 'pressed' | 'dragging' | 'settling';

export const useClayState = (initial: ClayState = 'default') => {
  const [state, setState] = useState<ClayState>(initial);
  const [previousState, setPreviousState] = useState<ClayState>(initial);
  const transition = useCallback((newState: ClayState) => {
    setPreviousState(state);
    setState(newState);
  }, [state]);
  return { state, previousState, transition, is: (s: ClayState) => state === s };
};

export const useSpringTransform = (
  target: { scale?: number; x?: number; y?: number },
  overrideConfig?: Partial<SpringOptions>
): { style: { scale?: MotionValue<number>; x?: MotionValue<number>; y?: MotionValue<number> } } => {
  const physics = useContext(PhysicsContext);
  const cfg: SpringOptions = { ...toSpringConfig(physics), ...overrideConfig };
  const scale = useSpring(target.scale ?? 1, cfg);
  const x     = useSpring(target.x ?? 0, cfg);
  const y     = useSpring(target.y ?? 0, cfg);
  return {
    style: {
      ...(target.scale !== undefined && { scale }),
      ...(target.x     !== undefined && { x }),
      ...(target.y     !== undefined && { y }),
    },
  };
};

export default PhysicsContext;
