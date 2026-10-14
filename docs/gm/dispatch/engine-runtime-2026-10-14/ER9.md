Read docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md and follow it.

Lane ER9: micro correctness audit. Output
docs/research/MICRO_CORRECTNESS_AUDIT_2026-10-14.md and
docs/gm/dispatch/engine-runtime-2026-10-14/ER9/REPORT.md.

Search src/ for the root palette MC1-MC21 and MC34 classes: timer
assumptions, wall vs monotonic clocks, timezone/DST, split vs single
advance (write small Node checks in your lane folder against pure modules
to MEASURE equality where possible), float accumulation, NaN/Infinity entry
points, rounding inconsistency, safe-integer counters, RNG consumption by
previews/views, every Math.random site classified (cosmetic vs gameplay),
iteration/sort tiebreakers, localeCompare on saved/rolled data,
re-entrancy, missing leave-save hooks, bfcache, JSON round-trip blind spots
in save code, tests depending on real clock/RNG. Rank by long-campaign
severity. Add any micro class the palette missed.
