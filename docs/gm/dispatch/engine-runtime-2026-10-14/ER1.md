Read docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md and follow it.

Lane ER1: runtime hotspot audit. Output
docs/research/RUNTIME_HOTSPOT_AUDIT_2026-10-14.md and
docs/gm/dispatch/engine-runtime-2026-10-14/ER1/REPORT.md.

Find where per-tick and per-render cost goes in the current source:
- Every timer (setTimeout/setInterval/rAF), its period, what it does, and
  whether it could be event-driven (RT1, RT3).
- Whole-state clones, JSON stringify/parse on hot paths, full-array scans per
  tick, DOM rebuilds per tick, listeners added without removal.
- Save path cost: what serializes on autosave, how big a synthetic
  developed save gets (build it from fixtures/tests, not real saves).
- Where native main.js uses Math.random and global mutable state (RT9, RT2).
- Write a small Node microbenchmark (in your lane folder) for whatever pure
  paths can run headless (expansion advanceSimulation, save serialize and
  validate, planners) at fresh/mid/crowded sizes. Report MEASURED numbers.
Rank the top 10 hotspots by likely cost and fix effort. Do not change source.
