# @melodicbloom/mochi-spring

A framework-neutral spring engine for Mochi interactions.

## Boundary

This package owns numerical spring behavior only:

- deterministic mass-spring-damper stepping;
- fixed-size substeps for irregular frames;
- finite-input and physical-parameter validation;
- scalar and keyed spring state;
- an injectable animation clock;
- an optional browser `requestAnimationFrame` adapter.

It does **not** own React hooks, DOM styles, haptics, component state, gesture recognition, tokens, audio, or product-specific interaction rules.

## Why it is independent

The existing v2 overhaul mixes physics, browser scheduling, React hooks, and thirteen UI components in one PR. This package is based on the repository default branch instead. It can be reviewed, tested, versioned, and adopted without accepting the v2 component overhaul.

The core never touches `window`, `document`, `performance`, or `requestAnimationFrame`. Browser APIs exist only in `createBrowserAnimationClock()` and are injected into `SpringRunner`.

## Example

```ts
import {
  MOCHI_SPRING_PRESETS,
  SpringRunner,
  SpringValue,
  createBrowserAnimationClock,
} from '@melodicbloom/mochi-spring';

const scale = new SpringValue(1, MOCHI_SPRING_PRESETS.clay);
const runner = new SpringRunner(scale, createBrowserAnimationClock());

scale.subscribe(({ value }) => {
  element.style.transform = `scale(${value})`;
});

scale.setTarget(0.94);
runner.start();
```

For reduced motion, snap the value or construct the runner with `{ immediate: true }`.

## Verification

```bash
npm install
npm run typecheck
npm test
```

The tests cover deterministic trajectories, long-frame subdivision, exact settlement, target clamping, and fail-closed configuration validation.

## Adoption gate

Do not replace `src/lib/spring-physics.ts` or React hooks in the v2 branch until:

1. this package builds and tests independently;
2. preset naming and parameter translation are approved;
3. component-level reduced-motion behavior is mapped explicitly;
4. browser cleanup and unmount behavior are tested in the consuming adapter;
5. the old engine and this engine are compared against the same trajectory fixtures.
