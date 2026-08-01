# Spring Engine Post-Merge Acceptance

Status: approved QA contract
Approved: 2026-07-30

## Acceptance matrix

The independent spring engine must be evaluated before component migration.

| Concern | Required check |
|---|---|
| Frame-rate parity | Compare 60 Hz and 120 Hz trajectories with an explicit maximum positional and velocity delta |
| Long frames | Clamp and subdivide large deltas without instability or time dilation surprises |
| Overshoot | Verify preset-specific overshoot bounds |
| Settlement | Verify deterministic rest thresholds and maximum settle time |
| Cancellation | Cancelling a scheduled step prevents later callbacks |
| Cleanup | Subscribers and scheduler handles are released after completion and disposal |
| SSR | Importing the package without browser globals succeeds |
| Reduced motion | Motion resolves immediately to the target with completion semantics preserved |
| Migration | Legacy presets map explicitly to new stiffness, damping, mass, and rest thresholds |

## Evidence requirements

- Deterministic fixtures for every named preset.
- Numeric assertions rather than screenshot-only approval.
- Recorded integrator version, time-step policy, and tolerances.
- A failure fixture showing the suite detects divergence.

## Scope boundary

Allowed paths:

- `packages/spring-engine/**`
- `docs/SPRING_ENGINE_PARITY.md`
- `.github/workflows/spring-engine.yml`

No React hooks, clay components, styling, tokens, audio, haptics, publishing, or root dependency changes.

## Approval gate

The branch remains draft until all numeric checks pass twice from a clean install and the migration table has reviewer sign-off.
