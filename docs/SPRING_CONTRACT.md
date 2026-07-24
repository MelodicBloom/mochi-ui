# Mochi UI Spring Engine Contract v0

Status: standalone implementation slice
Scope: `src/physics/spring.ts`

## Purpose

Provide a deterministic mass-spring-damper engine that can be tested without React, Astro, a browser, or a rendering loop. Component hooks and visual components are intentionally excluded until this contract is verified.

## Physical parameters

| Parameter | Meaning | Constraint |
|---|---|---|
| `stiffness` | restoring force toward the target | finite and greater than zero |
| `damping` | velocity-proportional energy loss | finite and greater than zero |
| `mass` | resistance to acceleration | finite and greater than zero |
| `restSpeed` | velocity threshold for settlement | finite and greater than zero |
| `restDelta` | distance threshold for settlement | finite and greater than zero |
| `maxStepMs` | maximum numerical integration substep | finite and greater than zero |
| `overshootClamping` | stop at target after first crossing | boolean |

## Architecture

The module contains three layers:

1. Pure functions: `stepSpring`, `simulateSpring`, and `isSpringSettled`.
2. `SpringController`, which requires an injected scheduler.
3. `createBrowserScheduler`, an opt-in browser adapter.

No browser global is accessed when the module is imported. Server-side rendering may import and use the pure functions safely. Calling the browser scheduler in a non-browser runtime produces an explicit error.

## Integration method

`stepSpring` uses semi-implicit Euler integration and splits large frame intervals into bounded substeps. This reduces trajectory drift across different frame rates and prevents one delayed frame from becoming one unstable numerical step.

## Reduced motion

Reduced motion is represented as a controller policy, not as a hidden media-query read inside the physics engine. Consumers resolve the user's preference and pass `reducedMotion: true`, causing new targets to resolve immediately without scheduling animation frames.

This preserves:

- SSR safety;
- testability;
- explicit caller ownership;
- platform portability;
- deterministic behavior.

## Presets

The first preset family is:

- `clay`;
- `jelly`;
- `firm`;
- `snappy`;
- `luxurious`;
- `bouncy`.

Presets are conveniences, not semantic truth. Product components must document which behavioral role a preset serves and may not select one solely by aesthetic name.

## QA requirements

The standalone slice must prove:

- identical inputs produce identical outputs;
- 60 Hz and 120 Hz simulations converge within declared tolerances;
- overshoot clamping does not cross the target;
- simulations settle exactly at the target;
- invalid parameters are rejected;
- controllers cancel scheduled work on disposal;
- reduced-motion mode schedules no frame;
- Node import does not require `window`, `document`, `performance`, or animation-frame globals;
- Astro's production build and TypeScript check remain green.

## Explicit exclusions

This slice does not include:

- React hooks;
- `ClayButton`, `ClayCard`, or any other component;
- Storybook configuration;
- visual tokens or shadows;
- haptics;
- pointer or touch gestures;
- local storage;
- theme management;
- package publishing.

## Promotion gate

Hooks may be introduced only after the pure engine tests, strict typecheck, and Astro production build pass on the same commit. Components must then arrive in separate bounded PRs with keyboard, touch, focus, reduced-motion, hydration, and visual-regression evidence.
