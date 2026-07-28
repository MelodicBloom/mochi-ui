import { SpringValue, type SpringSnapshot } from './core.js';

export interface AnimationClock {
  now(): number;
  request(callback: (timeMilliseconds: number) => void): number;
  cancel(handle: number): void;
}

export interface SpringRunnerOptions {
  maxFrameSeconds?: number;
  immediate?: boolean;
}

export function createBrowserAnimationClock(): AnimationClock {
  const request = globalThis.requestAnimationFrame;
  const cancel = globalThis.cancelAnimationFrame;
  const performanceNow = globalThis.performance?.now.bind(globalThis.performance);

  if (!request || !cancel || !performanceNow) {
    throw new Error(
      'Browser animation APIs are unavailable. Inject an AnimationClock in non-browser runtimes.',
    );
  }

  return {
    now: performanceNow,
    request: request.bind(globalThis),
    cancel: cancel.bind(globalThis),
  };
}

export class SpringRunner {
  private handle: number | null = null;
  private previousTime: number | null = null;
  private readonly maxFrameSeconds: number;
  private immediate: boolean;

  constructor(
    private readonly spring: SpringValue,
    private readonly clock: AnimationClock,
    options: SpringRunnerOptions = {},
  ) {
    this.maxFrameSeconds = options.maxFrameSeconds ?? 0.064;
    this.immediate = options.immediate ?? false;

    if (!Number.isFinite(this.maxFrameSeconds) || this.maxFrameSeconds <= 0) {
      throw new RangeError('maxFrameSeconds must be a positive finite number.');
    }
  }

  setImmediate(immediate: boolean): void {
    this.immediate = immediate;
    if (immediate) {
      const snapshot = this.spring.getSnapshot();
      this.spring.snap(snapshot.target);
      this.stop();
    }
  }

  start(): void {
    if (this.handle !== null) return;

    if (this.immediate) {
      const snapshot = this.spring.getSnapshot();
      this.spring.snap(snapshot.target);
      return;
    }

    this.previousTime = this.clock.now();
    this.handle = this.clock.request(this.tick);
  }

  stop(): void {
    if (this.handle !== null) this.clock.cancel(this.handle);
    this.handle = null;
    this.previousTime = null;
  }

  isRunning(): boolean {
    return this.handle !== null;
  }

  private readonly tick = (timeMilliseconds: number): void => {
    const previousTime = this.previousTime ?? timeMilliseconds;
    const deltaSeconds = Math.min(
      Math.max((timeMilliseconds - previousTime) / 1000, 0),
      this.maxFrameSeconds,
    );

    this.previousTime = timeMilliseconds;
    const snapshot: Readonly<SpringSnapshot> = this.spring.advance(deltaSeconds);

    if (snapshot.settled) {
      this.handle = null;
      this.previousTime = null;
      return;
    }

    this.handle = this.clock.request(this.tick);
  };
}
