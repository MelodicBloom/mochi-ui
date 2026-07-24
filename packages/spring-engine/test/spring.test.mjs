import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SpringValue,
  resolveSpringConfig,
  stepSpring,
} from '../dist/index.js';

test('identical inputs produce identical spring trajectories', () => {
  const config = { mass: 1, stiffness: 280, damping: 24 };
  const deltas = [0.016, 0.017, 0.008, 0.032, 0.016, 0.011];

  const run = () => {
    let state = { value: 0, velocity: 0 };
    return deltas.map((delta) => {
      const result = stepSpring(state, 1, delta, config);
      state = result.state;
      return { ...state };
    });
  };

  assert.deepEqual(run(), run());
});

test('long frames are subdivided and remain finite', () => {
  const result = stepSpring(
    { value: 0, velocity: 0 },
    100,
    0.5,
    { maxStepSeconds: 1 / 240 },
  );

  assert.equal(Number.isFinite(result.state.value), true);
  assert.equal(Number.isFinite(result.state.velocity), true);
});

test('SpringValue converges and snaps exactly to the target', () => {
  const spring = new SpringValue(0, {
    restDelta: 0.0001,
    restSpeed: 0.0001,
  });
  spring.setTarget(1);

  let snapshot = spring.getSnapshot();
  for (let index = 0; index < 2000 && !snapshot.settled; index += 1) {
    snapshot = spring.advance(1 / 120);
  }

  assert.equal(snapshot.settled, true);
  assert.equal(snapshot.value, 1);
  assert.equal(snapshot.velocity, 0);
});

test('clamp prevents target overshoot', () => {
  const result = stepSpring(
    { value: 0, velocity: 20 },
    1,
    0.25,
    { stiffness: 500, damping: 1, clamp: true },
  );

  assert.equal(result.state.value <= 1, true);
});

test('invalid physical parameters fail closed', () => {
  assert.throws(() => resolveSpringConfig({ mass: 0 }), /mass/);
  assert.throws(() => resolveSpringConfig({ stiffness: Number.NaN }), /stiffness/);
  assert.throws(() => stepSpring({ value: 0, velocity: 0 }, 1, -1), /deltaSeconds/);
});
