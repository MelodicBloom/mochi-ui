/**
 * MOCHI UI — Spring Physics Engine v2.0
 * 
 * Mass-spring-damper physics for all animations.
 * Provides real physical feel with configurable mass, tension, and friction.
 */

export interface SpringConfig {
  mass: number;
  tension: number;
  friction: number;
  precision?: number;
  initialVelocity?: number;
  clamp?: boolean;
}

export interface SpringState {
  value: number;
  velocity: number;
}

export const DEFAULT_CONFIG: SpringConfig = {
  mass: 1,
  tension: 280,
  friction: 24,
  precision: 0.001,
  initialVelocity: 0,
  clamp: false,
};

export const SPRING_PRESETS = {
  gentle: { mass: 1.5, tension: 120, friction: 28 },
  snappy: { mass: 0.8, tension: 400, friction: 22 },
  bouncy: { mass: 1.2, tension: 350, friction: 14 },
  heavy: { mass: 2.5, tension: 200, friction: 32 },
  quick: { mass: 0.5, tension: 500, friction: 30 },
  dramatic: { mass: 3, tension: 100, friction: 20 },
} as const;

export class SpringPhysics {
  private config: Required<SpringConfig>;
  private state: SpringState;
  private target: number = 0;
  private animationId: number | null = null;
  private callbacks: Set<(value: number, velocity: number) => void> = new Set();
  private isAnimating: boolean = false;

  constructor(config: Partial<SpringConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config } as Required<SpringConfig>;
    this.state = {
      value: 0,
      velocity: this.config.initialVelocity,
    };
  }

  animateTo(target: number, immediate: boolean = false): void {
    this.target = target;
    if (immediate) {
      this.state.value = target;
      this.state.velocity = 0;
      this.notify();
      return;
    }
    if (!this.isAnimating) {
      this.start();
    }
  }

  setValue(value: number): void {
    this.state.value = value;
    this.state.velocity = 0;
    this.notify();
  }

  getValue(): number {
    return this.state.value;
  }

  getVelocity(): number {
    return this.state.velocity;
  }

  subscribe(callback: (value: number, velocity: number) => void): () => void {
    this.callbacks.add(callback);
    callback(this.state.value, this.state.velocity);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  updateConfig(config: Partial<SpringConfig>): void {
    this.config = { ...this.config, ...config } as Required<SpringConfig>;
  }

  stop(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isAnimating = false;
  }

  getIsAnimating(): boolean {
    return this.isAnimating;
  }

  static computeAtTime(
    t: number,
    from: number,
    to: number,
    config: SpringConfig
  ): number {
    const { mass, tension, friction } = { ...DEFAULT_CONFIG, ...config };
    const displacement = from - to;
    const dampingRatio = friction / (2 * Math.sqrt(mass * tension));
    const angularFreq = Math.sqrt(tension / mass);

    if (dampingRatio < 1) {
      const dampedFreq = angularFreq * Math.sqrt(1 - dampingRatio ** 2);
      const envelope = Math.exp(-dampingRatio * angularFreq * t);
      return (
        to +
        envelope *
          displacement *
          (Math.cos(dampedFreq * t) +
            (dampingRatio * angularFreq / dampedFreq) * Math.sin(dampedFreq * t))
      );
    } else if (dampingRatio === 1) {
      const envelope = Math.exp(-angularFreq * t);
      return to + envelope * displacement * (1 + angularFreq * t);
    } else {
      const r1 = -angularFreq * (dampingRatio - Math.sqrt(dampingRatio ** 2 - 1));
      const r2 = -angularFreq * (dampingRatio + Math.sqrt(dampingRatio ** 2 - 1));
      const c2 = (displacement * r1) / (r1 - r2);
      const c1 = displacement - c2;
      return to + c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
    }
  }

  private start(): void {
    this.isAnimating = true;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.064);
      lastTime = currentTime;

      const { mass, tension, friction, precision, clamp } = this.config;
      const displacement = this.state.value - this.target;
      const springForce = -tension * displacement;
      const dampingForce = -friction * this.state.velocity;
      const acceleration = (springForce + dampingForce) / mass;

      this.state.velocity += acceleration * dt;
      this.state.value += this.state.velocity * dt;

      if (clamp) {
        const maxDisplacement = Math.abs(this.target) * 2;
        if (Math.abs(displacement) > maxDisplacement) {
          this.state.value = this.target + Math.sign(displacement) * maxDisplacement;
        }
      }

      this.notify();

      const isSettled =
        Math.abs(displacement) < precision &&
        Math.abs(this.state.velocity) < precision;

      if (isSettled) {
        this.state.value = this.target;
        this.state.velocity = 0;
        this.notify();
        this.isAnimating = false;
        this.animationId = null;
        return;
      }

      this.animationId = requestAnimationFrame(tick);
    };

    this.animationId = requestAnimationFrame(tick);
  }

  private notify(): void {
    this.callbacks.forEach((cb) => cb(this.state.value, this.state.velocity));
  }
}

export class MultiSpring {
  private springs: Map<string, SpringPhysics> = new Map();

  addDimension(key: string, config?: Partial<SpringConfig>): void {
    this.springs.set(key, new SpringPhysics(config));
  }

  animateTo(values: Record<string, number>, immediate: boolean = false): void {
    Object.entries(values).forEach(([key, target]) => {
      const spring = this.springs.get(key);
      if (spring) spring.animateTo(target, immediate);
    });
  }

  getValues(): Record<string, number> {
    const result: Record<string, number> = {};
    this.springs.forEach((spring, key) => {
      result[key] = spring.getValue();
    });
    return result;
  }

  subscribe(callback: (values: Record<string, number>) => void): () => void {
    const unsubscribers: (() => void)[] = [];
    this.springs.forEach((spring, key) => {
      unsubscribers.push(
        spring.subscribe((value) => {
          callback({ ...this.getValues(), [key]: value });
        })
      );
    });
    return () => unsubscribers.forEach((unsub) => unsub());
  }
}

export function springToCubicBezier(
  config: SpringConfig
): [number, number, number, number] {
  const { mass, tension, friction } = config;
  const dampingRatio = friction / (2 * Math.sqrt(mass * tension));
  const x1 = 0.4;
  const y1 = dampingRatio < 1 ? 0.8 + dampingRatio * 0.2 : 0.8;
  const x2 = 0.2;
  const y2 = dampingRatio < 1 ? 1.1 : 1.0;
  return [x1, y1, x2, y2];
}

export function generateSpringKeyframes(
  from: number,
  to: number,
  config: SpringConfig,
  steps: number = 60,
  duration: number = 1000
): string {
  const keyframes: string[] = [];
  const dt = duration / steps;
  for (let i = 0; i <= steps; i++) {
    const t = (i * dt) / 1000;
    const value = SpringPhysics.computeAtTime(t, from, to, config);
    const percent = (i / steps) * 100;
    keyframes.push(`  ${percent.toFixed(2)}% { transform: translateY(${value.toFixed(2)}px); }`);
  }
  return `@keyframes spring-bounce {\n${keyframes.join('\n')}\n}`;
}

export default SpringPhysics;
