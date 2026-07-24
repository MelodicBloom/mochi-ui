export interface SpringConfig {
  mass: number;
  stiffness: number;
  damping: number;
  restSpeed: number;
  restDelta: number;
  maxStepSeconds: number;
  clamp: boolean;
}

export interface SpringState {
  value: number;
  velocity: number;
}

export interface SpringSnapshot extends SpringState {
  target: number;
  settled: boolean;
}

export interface SpringStepResult {
  state: SpringState;
  settled: boolean;
}

export type SpringListener = (snapshot: Readonly<SpringSnapshot>) => void;

export const DEFAULT_SPRING_CONFIG: Readonly<SpringConfig> = Object.freeze({
  mass: 1,
  stiffness: 280,
  damping: 24,
  restSpeed: 0.001,
  restDelta: 0.001,
  maxStepSeconds: 1 / 120,
  clamp: false,
});

export const MOCHI_SPRING_PRESETS = Object.freeze({
  gentle: Object.freeze({ mass: 1.5, stiffness: 120, damping: 28 }),
  clay: Object.freeze({ mass: 1.1, stiffness: 240, damping: 22 }),
  snappy: Object.freeze({ mass: 0.8, stiffness: 400, damping: 22 }),
  bouncy: Object.freeze({ mass: 1.2, stiffness: 350, damping: 14 }),
  heavy: Object.freeze({ mass: 2.5, stiffness: 200, damping: 32 }),
  quick: Object.freeze({ mass: 0.5, stiffness: 500, damping: 30 }),
} as const);

export function resolveSpringConfig(
  partial: Partial<SpringConfig> = {},
): SpringConfig {
  const config: SpringConfig = { ...DEFAULT_SPRING_CONFIG, ...partial };

  assertPositiveFinite('mass', config.mass);
  assertPositiveFinite('stiffness', config.stiffness);
  assertNonNegativeFinite('damping', config.damping);
  assertNonNegativeFinite('restSpeed', config.restSpeed);
  assertNonNegativeFinite('restDelta', config.restDelta);
  assertPositiveFinite('maxStepSeconds', config.maxStepSeconds);

  return config;
}

export function isSpringSettled(
  state: Readonly<SpringState>,
  target: number,
  config: Readonly<SpringConfig>,
): boolean {
  return (
    Math.abs(state.velocity) <= config.restSpeed &&
    Math.abs(target - state.value) <= config.restDelta
  );
}

/**
 * Advances a mass-spring-damper system using fixed-size, semi-implicit Euler
 * substeps. Subdivision makes the result stable across long or irregular
 * animation frames while keeping the core independent from any clock.
 */
export function stepSpring(
  state: Readonly<SpringState>,
  target: number,
  deltaSeconds: number,
  partialConfig: Partial<SpringConfig> = {},
): SpringStepResult {
  assertFinite('state.value', state.value);
  assertFinite('state.velocity', state.velocity);
  assertFinite('target', target);
  assertNonNegativeFinite('deltaSeconds', deltaSeconds);

  const config = resolveSpringConfig(partialConfig);
  let value = state.value;
  let velocity = state.velocity;
  let remaining = deltaSeconds;

  while (remaining > 0) {
    const dt = Math.min(remaining, config.maxStepSeconds);
    const displacementBefore = value - target;
    const springForce = -config.stiffness * displacementBefore;
    const dampingForce = -config.damping * velocity;
    const acceleration = (springForce + dampingForce) / config.mass;

    velocity += acceleration * dt;
    value += velocity * dt;

    if (config.clamp) {
      const displacementAfter = value - target;
      const crossedTarget =
        displacementBefore !== 0 &&
        Math.sign(displacementBefore) !== Math.sign(displacementAfter);

      if (crossedTarget) {
        value = target;
        velocity = 0;
        remaining = 0;
        break;
      }
    }

    remaining -= dt;
  }

  const nextState = { value, velocity };
  const settled = isSpringSettled(nextState, target, config);

  return settled
    ? { state: { value: target, velocity: 0 }, settled: true }
    : { state: nextState, settled: false };
}

export class SpringValue {
  private config: SpringConfig;
  private state: SpringState;
  private target: number;
  private settled: boolean;
  private readonly listeners = new Set<SpringListener>();

  constructor(
    initialValue = 0,
    partialConfig: Partial<SpringConfig> = {},
  ) {
    assertFinite('initialValue', initialValue);
    this.config = resolveSpringConfig(partialConfig);
    this.state = { value: initialValue, velocity: 0 };
    this.target = initialValue;
    this.settled = true;
  }

  getSnapshot(): Readonly<SpringSnapshot> {
    return Object.freeze({
      ...this.state,
      target: this.target,
      settled: this.settled,
    });
  }

  setTarget(target: number): void {
    assertFinite('target', target);
    this.target = target;
    this.settled = isSpringSettled(this.state, target, this.config);
    this.notify();
  }

  setConfig(partialConfig: Partial<SpringConfig>): void {
    this.config = resolveSpringConfig({ ...this.config, ...partialConfig });
    this.settled = isSpringSettled(this.state, this.target, this.config);
  }

  setVelocity(velocity: number): void {
    assertFinite('velocity', velocity);
    this.state = { ...this.state, velocity };
    this.settled = isSpringSettled(this.state, this.target, this.config);
    this.notify();
  }

  snap(value: number): void {
    assertFinite('value', value);
    this.target = value;
    this.state = { value, velocity: 0 };
    this.settled = true;
    this.notify();
  }

  advance(deltaSeconds: number): Readonly<SpringSnapshot> {
    const result = stepSpring(
      this.state,
      this.target,
      deltaSeconds,
      this.config,
    );
    this.state = result.state;
    this.settled = result.settled;
    this.notify();
    return this.getSnapshot();
  }

  subscribe(listener: SpringListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) listener(snapshot);
  }
}

export class SpringGroup<Key extends string> {
  private readonly springs = new Map<Key, SpringValue>();

  add(
    key: Key,
    initialValue = 0,
    config: Partial<SpringConfig> = {},
  ): SpringValue {
    if (this.springs.has(key)) {
      throw new Error(`Spring dimension already exists: ${key}`);
    }
    const spring = new SpringValue(initialValue, config);
    this.springs.set(key, spring);
    return spring;
  }

  get(key: Key): SpringValue {
    const spring = this.springs.get(key);
    if (!spring) throw new Error(`Unknown spring dimension: ${key}`);
    return spring;
  }

  setTargets(targets: Partial<Record<Key, number>>): void {
    for (const [key, target] of Object.entries(targets) as Array<[Key, number]>) {
      this.get(key).setTarget(target);
    }
  }

  advance(deltaSeconds: number): Readonly<Record<Key, SpringSnapshot>> {
    const result = {} as Record<Key, SpringSnapshot>;
    for (const [key, spring] of this.springs) {
      result[key] = spring.advance(deltaSeconds) as SpringSnapshot;
    }
    return Object.freeze(result);
  }
}

function assertFinite(name: string, value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite; received ${String(value)}.`);
  }
}

function assertPositiveFinite(name: string, value: number): void {
  assertFinite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be greater than zero.`);
}

function assertNonNegativeFinite(name: string, value: number): void {
  assertFinite(name, value);
  if (value < 0) throw new RangeError(`${name} must be zero or greater.`);
}
