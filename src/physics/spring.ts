export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  restSpeed: number;
  restDelta: number;
  maxStepMs: number;
  overshootClamping: boolean;
}

export interface SpringState {
  value: number;
  velocity: number;
}

export interface SpringFrame extends SpringState {
  elapsedMs: number;
  settled: boolean;
}

export interface SimulationOptions {
  frameMs?: number;
  maxDurationMs?: number;
  initialVelocity?: number;
}

export interface AnimationScheduler {
  now(): number;
  request(callback: (time: number) => void): number;
  cancel(id: number): void;
}

export interface SpringControllerOptions {
  scheduler: AnimationScheduler;
  config?: Partial<SpringConfig>;
  initialValue?: number;
  initialVelocity?: number;
  reducedMotion?: boolean;
}

export const DEFAULT_SPRING_CONFIG: SpringConfig = Object.freeze({
  stiffness: 180,
  damping: 22,
  mass: 0.85,
  restSpeed: 0.001,
  restDelta: 0.001,
  maxStepMs: 8,
  overshootClamping: false,
});

export const SPRING_PRESETS = Object.freeze({
  clay: { stiffness: 180, damping: 22, mass: 0.85 },
  jelly: { stiffness: 120, damping: 14, mass: 0.9 },
  firm: { stiffness: 260, damping: 28, mass: 0.8 },
  snappy: { stiffness: 360, damping: 30, mass: 0.65 },
  luxurious: { stiffness: 110, damping: 24, mass: 1.35 },
  bouncy: { stiffness: 240, damping: 14, mass: 0.8 },
} as const);

const NUMERIC_CONFIG_KEYS = [
  'stiffness',
  'damping',
  'mass',
  'restSpeed',
  'restDelta',
  'maxStepMs',
] as const satisfies readonly (keyof SpringConfig)[];

export function resolveSpringConfig(
  config: Partial<SpringConfig> = {},
): SpringConfig {
  const resolved: SpringConfig = { ...DEFAULT_SPRING_CONFIG, ...config };

  for (const key of NUMERIC_CONFIG_KEYS) {
    const value = resolved[key];
    if (!Number.isFinite(value) || value <= 0) {
      throw new RangeError(`Spring ${key} must be a finite number greater than zero.`);
    }
  }

  return resolved;
}

export function isSpringSettled(
  state: SpringState,
  target: number,
  config: Partial<SpringConfig> = {},
): boolean {
  const resolved = resolveSpringConfig(config);
  return (
    Math.abs(state.velocity) <= resolved.restSpeed &&
    Math.abs(target - state.value) <= resolved.restDelta
  );
}

/**
 * Advances one spring by a caller-provided amount of time.
 *
 * The function is pure and browser-independent. Large frame intervals are split
 * into bounded substeps so 30 Hz, 60 Hz, and 120 Hz callers converge on nearly
 * the same trajectory instead of injecting one unstable integration step.
 */
export function stepSpring(
  state: SpringState,
  target: number,
  deltaMs: number,
  config: Partial<SpringConfig> = {},
): SpringState {
  if (!Number.isFinite(deltaMs) || deltaMs < 0) {
    throw new RangeError('deltaMs must be a finite non-negative number.');
  }

  const resolved = resolveSpringConfig(config);
  const alreadySettled = isSpringSettled(state, target, resolved);
  if (deltaMs === 0 || alreadySettled) {
    return alreadySettled
      ? { value: target, velocity: 0 }
      : { ...state };
  }

  let value = state.value;
  let velocity = state.velocity;
  let remainingMs = deltaMs;
  const initialDisplacement = target - value;

  while (remainingMs > 0) {
    const stepMs = Math.min(remainingMs, resolved.maxStepMs);
    const dt = stepMs / 1000;
    const displacement = target - value;
    const springForce = resolved.stiffness * displacement;
    const dampingForce = -resolved.damping * velocity;
    const acceleration = (springForce + dampingForce) / resolved.mass;

    // Semi-implicit Euler: velocity first, then position.
    velocity += acceleration * dt;
    value += velocity * dt;

    if (
      resolved.overshootClamping &&
      initialDisplacement !== 0 &&
      Math.sign(target - value) !== Math.sign(initialDisplacement)
    ) {
      value = target;
      velocity = 0;
      break;
    }

    remainingMs -= stepMs;
  }

  const next = { value, velocity };
  return isSpringSettled(next, target, resolved)
    ? { value: target, velocity: 0 }
    : next;
}

export function simulateSpring(
  from: number,
  to: number,
  config: Partial<SpringConfig> = {},
  options: SimulationOptions = {},
): SpringFrame[] {
  const resolved = resolveSpringConfig(config);
  const frameMs = options.frameMs ?? 1000 / 60;
  const maxDurationMs = options.maxDurationMs ?? 10_000;

  if (frameMs <= 0 || maxDurationMs <= 0) {
    throw new RangeError('Simulation timing values must be greater than zero.');
  }

  let state: SpringState = {
    value: from,
    velocity: options.initialVelocity ?? 0,
  };
  let elapsedMs = 0;
  const frames: SpringFrame[] = [
    { ...state, elapsedMs, settled: isSpringSettled(state, to, resolved) },
  ];

  while (elapsedMs < maxDurationMs && !isSpringSettled(state, to, resolved)) {
    state = stepSpring(state, to, frameMs, resolved);
    elapsedMs += frameMs;
    frames.push({
      ...state,
      elapsedMs,
      settled: isSpringSettled(state, to, resolved),
    });
  }

  return frames;
}

export class SpringController {
  private readonly scheduler: AnimationScheduler;
  private config: SpringConfig;
  private state: SpringState;
  private target: number;
  private reducedMotion: boolean;
  private frameId: number | null = null;
  private lastTime: number | null = null;
  private listeners = new Set<(frame: SpringFrame) => void>();

  constructor(options: SpringControllerOptions) {
    this.scheduler = options.scheduler;
    this.config = resolveSpringConfig(options.config);
    this.state = {
      value: options.initialValue ?? 0,
      velocity: options.initialVelocity ?? 0,
    };
    this.target = this.state.value;
    this.reducedMotion = options.reducedMotion ?? false;
  }

  subscribe(listener: (frame: SpringFrame) => void): () => void {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  setTarget(target: number): void {
    if (!Number.isFinite(target)) {
      throw new RangeError('Spring target must be finite.');
    }

    this.target = target;
    if (this.reducedMotion) {
      this.jumpTo(target);
      return;
    }

    if (this.frameId === null) {
      this.lastTime = this.scheduler.now();
      this.frameId = this.scheduler.request(this.tick);
    }
  }

  jumpTo(value: number): void {
    this.stop();
    this.target = value;
    this.state = { value, velocity: 0 };
    this.emit();
  }

  setReducedMotion(reduced: boolean): void {
    this.reducedMotion = reduced;
    if (reduced && this.frameId !== null) {
      this.jumpTo(this.target);
    }
  }

  updateConfig(config: Partial<SpringConfig>): void {
    this.config = resolveSpringConfig({ ...this.config, ...config });
  }

  getState(): SpringState {
    return { ...this.state };
  }

  getTarget(): number {
    return this.target;
  }

  getIsAnimating(): boolean {
    return this.frameId !== null;
  }

  stop(): void {
    if (this.frameId !== null) {
      this.scheduler.cancel(this.frameId);
    }
    this.frameId = null;
    this.lastTime = null;
  }

  dispose(): void {
    this.stop();
    this.listeners.clear();
  }

  private readonly tick = (time: number): void => {
    const previousTime = this.lastTime ?? time;
    const deltaMs = Math.max(0, Math.min(time - previousTime, 64));
    this.lastTime = time;
    this.state = stepSpring(this.state, this.target, deltaMs, this.config);
    this.emit();

    if (isSpringSettled(this.state, this.target, this.config)) {
      this.state = { value: this.target, velocity: 0 };
      this.frameId = null;
      this.lastTime = null;
      this.emit();
      return;
    }

    this.frameId = this.scheduler.request(this.tick);
  };

  private snapshot(): SpringFrame {
    return {
      ...this.state,
      elapsedMs: 0,
      settled: isSpringSettled(this.state, this.target, this.config),
    };
  }

  private emit(): void {
    const frame = this.snapshot();
    for (const listener of this.listeners) listener(frame);
  }
}

/**
 * Browser scheduling is opt-in. Calling this function during SSR throws a clear
 * error instead of touching browser globals at module evaluation time.
 */
export function createBrowserScheduler(): AnimationScheduler {
  const scope = globalThis as typeof globalThis & {
    requestAnimationFrame?: (callback: FrameRequestCallback) => number;
    cancelAnimationFrame?: (id: number) => void;
    performance?: Pick<Performance, 'now'>;
  };

  if (
    typeof scope.requestAnimationFrame !== 'function' ||
    typeof scope.cancelAnimationFrame !== 'function' ||
    typeof scope.performance?.now !== 'function'
  ) {
    throw new Error('Browser animation scheduling is unavailable in this runtime.');
  }

  return {
    now: () => scope.performance!.now(),
    request: (callback) => scope.requestAnimationFrame!(callback),
    cancel: (id) => scope.cancelAnimationFrame!(id),
  };
}
