import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SpringController,
  createBrowserScheduler,
  simulateSpring,
  stepSpring,
  type AnimationScheduler,
} from '../../src/physics/spring.ts';

class FakeScheduler implements AnimationScheduler {
  private time = 0;
  private nextId = 1;
  private callbacks = new Map<number, (time: number) => void>();
  cancelled: number[] = [];

  now(): number {
    return this.time;
  }

  request(callback: (time: number) => void): number {
    const id = this.nextId++;
    this.callbacks.set(id, callback);
    return id;
  }

  cancel(id: number): void {
    this.cancelled.push(id);
    this.callbacks.delete(id);
  }

  advance(deltaMs: number): void {
    this.time += deltaMs;
    const callbacks = [...this.callbacks.entries()];
    this.callbacks.clear();
    for (const [, callback] of callbacks) callback(this.time);
  }

  pending(): number {
    return this.callbacks.size;
  }
}

test('stepSpring is deterministic for identical inputs', () => {
  const config = { stiffness: 180, damping: 22, mass: 0.85 };
  let first = { value: 0, velocity: 0 };
  let second = { value: 0, velocity: 0 };

  for (let index = 0; index < 120; index += 1) {
    first = stepSpring(first, 1, 1000 / 60, config);
    second = stepSpring(second, 1, 1000 / 60, config);
  }

  assert.deepEqual(first, second);
});

test('bounded substeps produce near-equivalent 60 Hz and 120 Hz results', () => {
  const config = { stiffness: 180, damping: 22, mass: 0.85, maxStepMs: 4 };
  const at60 = simulateSpring(0, 1, config, {
    frameMs: 1000 / 60,
    maxDurationMs: 1000,
  }).at(-1)!;
  const at120 = simulateSpring(0, 1, config, {
    frameMs: 1000 / 120,
    maxDurationMs: 1000,
  }).at(-1)!;

  assert.ok(Math.abs(at60.value - at120.value) < 0.005);
  assert.ok(Math.abs(at60.velocity - at120.velocity) < 0.02);
});

test('overshoot clamping never crosses the target', () => {
  const frames = simulateSpring(
    0,
    1,
    {
      stiffness: 300,
      damping: 8,
      mass: 0.7,
      overshootClamping: true,
    },
    { maxDurationMs: 2000 },
  );

  assert.ok(frames.every((frame) => frame.value <= 1));
  assert.equal(frames.at(-1)!.value, 1);
  assert.equal(frames.at(-1)!.velocity, 0);
});

test('simulation settles at the requested target', () => {
  const frames = simulateSpring(12, -4, {}, { maxDurationMs: 10_000 });
  const last = frames.at(-1)!;

  assert.equal(last.settled, true);
  assert.equal(last.value, -4);
  assert.equal(last.velocity, 0);
});

test('controller uses injected scheduling and cancels work on dispose', () => {
  const scheduler = new FakeScheduler();
  const controller = new SpringController({ scheduler, initialValue: 0 });
  const values: number[] = [];
  const unsubscribe = controller.subscribe((frame) => values.push(frame.value));

  controller.setTarget(1);
  assert.equal(scheduler.pending(), 1);

  scheduler.advance(16);
  assert.ok(values.at(-1)! > 0);
  assert.equal(scheduler.pending(), 1);

  controller.dispose();
  assert.equal(controller.getIsAnimating(), false);
  assert.equal(scheduler.pending(), 0);

  unsubscribe();
});

test('reduced motion resolves immediately without scheduling a frame', () => {
  const scheduler = new FakeScheduler();
  const controller = new SpringController({
    scheduler,
    initialValue: 0,
    reducedMotion: true,
  });

  controller.setTarget(8);

  assert.deepEqual(controller.getState(), { value: 8, velocity: 0 });
  assert.equal(scheduler.pending(), 0);
});

test('module evaluation is SSR-safe and browser scheduler fails explicitly', () => {
  assert.throws(
    () => createBrowserScheduler(),
    /Browser animation scheduling is unavailable/,
  );
});

test('invalid physical parameters are rejected', () => {
  assert.throws(
    () => stepSpring({ value: 0, velocity: 0 }, 1, 16, { mass: 0 }),
    /mass must be a finite number greater than zero/,
  );
});
