# Simfuzz findings (wave D, 2026-10-14)

Hand-written reading of [REPORT.md](REPORT.md) (generated). Run: 50 seeds x 2000
steps plus 17 determinism reruns, 4 worker processes, base `ef876f2f`. Tool and
method: [scripts/simfuzz/README.md](../../../../../scripts/simfuzz/README.md).
These are reports for the owning lanes; this lane changed nothing in `src/`.

## Engine defects

**F1. Split-vs-jump: `state.sequence` depends on how time is chunked.**
Confirmed. 106 occurrences in 19 seeds, every one after the optional audit
remainder owner is open. N one-minute `advanceSimulation` calls end with
`sequence` N-1 higher than one N-minute call. Clock, RNG and every other
durable field are equal. Cause: `src/audit_remainder_runtime.js:25`,
`advanceAuditRemainder` bumps the sequence once per call whenever the clock
moved ("one nonce before exact receipt joins"). It runs at the end of every
`advanceSimulation`, so frame-stepped play, dev stepping and offline catch-up
save different sequences for the same played time. Gameplay effect is small
(sequence is a stale-check nonce), but it breaks chunk-independent determinism.
It also means a cross-build det check only passes when both builds tick in
identical chunks. Minimal repro: `node scripts/simfuzz/run.mjs --repro 33 --stop-at 440`
(random policy, crowded fixture, `advance 4`: sequence 589 jump vs 592 split).
Owner: audit remainder runtime / wave A loop. A fix would bump at most once per
played boundary, or only when receipts actually join.

**F2. `advanceSimulation` accepts `minutes = Number.MAX_SAFE_INTEGER` at clock 0, then time can never advance again.**
Confirmed. Before the simulation is enrolled (fresh fixture), the call moves
`clock` to 9007199254740991 and returns `remaining 0`. The state passes
`validateExpansionState` and the save round-trip. Every later advance then
throws "Invalid simulation duration" because `clock + minutes` is no longer a
safe integer. After enrollment the 512-boundary cap stops the same call at clock
512 (`budgetExhausted`), about 15 s of CPU per call on a fresh save. Only a
caller passing a huge duration reaches it (for example a corrupt offline
catch-up timestamp), so severity is low, but the result is a soft-bricked save.
Minimal repro: `--repro 2 --stop-at 10` (adversarial, fresh). Owner: expansion
engine. A fix would cap `minutes` (or the resulting clock) at a sane horizon and
reject the rest.

No other invariant failed: no NaN or Infinity, no negative money or counts, no
custody or owner inconsistency, no clock regression, no input mutation, no
save round-trip mismatch. 17/17 determinism reruns were identical. Adversarial
probes: 6,059 tried, 6,004 rejected; the 55 accepted are all F2. Stale sequence,
wrong actor, zero means and unknown IDs were always refused.

## Harness false positives found and fixed (not engine defects)

- **H1.** Round-trip "bell-yard bag, equipment or money seal changed" (seed 17).
  main.js `persistExpansion` runs `assertBacklogPublication` and refuses any
  durable change while the bell-yard time loop is open; the harness had skipped
  that gate. The harness now applies main's four final publication guards.
  1,106 plans were refused by `assertBacklogPublication` in the run and counted
  as host rejections.
- **H2.** Round-trip "unique brass specimen was duplicated, lost or also left
  loose" (seed 24). The harness wrote expansion state into the save envelope but
  left the fixture's native bags; `validateBacklogEnvelope` cross-checks them.
  The round-trip now publishes the synthetic bags, money, equipment codec and
  vitals into the envelope.

## Coverage

245 of 1,648 catalog rows were committed and 285 were ever eligible. 1,354
were never eligible from the three fixtures. REPORT.md "Entry gates" lists the
first failing requirement per group. They fall into three kinds:

- **Unspawned participants** (original frontier, management, nested chains and
  campaign, book worlds, causal story, glasshouse, foundation probes): the
  command's target or issuer does not exist until the world's own entry flow
  spawns it.
- **Owner flags** (`auditRemainder.enrolled`, `lore.enrolled`,
  `worldCompletion*.enrolled`, `steam*.enrolled`, `*.opened`): opened by host
  flows main.js drives (native dialogue, travel, a panel open) that the engine
  harness does not script.
- **Native-bound facts** (`paradise.nativeBound`, `mol.nativeBound`,
  `nested.nativeBound`, `*.supportedBody`): need a real native body binding,
  which only lane C's headless runner provides.

Reaching them needs scripted entry routes per world, or lane C's full-game
runner feeding this fuzzer a developed fixture. Random steps from these fixtures
will not get there.

## Cost and the 5-minute budget

Not met on this host; not judged yet. Measured: 4,206 CPU-seconds for the
whole run, of which about 1,000 s were F2 probes (each accepted huge advance
burns the 512-boundary budget). The harness now records F2 once per seed and
stops repeating it. Without that, the run is about 3,200 CPU-seconds, roughly
32 ms of CPU per step (median per seed: crowded 73, mid 59, fresh 46 CPU-s).
50 x 2000 in 5 minutes therefore needs about 11 free cores. The host's load
average was 66-400 throughout, so wall time (1,545 s at 4 workers) is not the
measure. Judge it on a quiet-host rerun as CPU-seconds per seed.

Where the CPU goes (perf leads for wave A, not defects):

- `advanceSimulation` is 39%: `advanceSimulationBoundary` rebuilds the full
  `simulationFacts` (world completion and audit remainder facts dominate) every
  simulated minute, about 20-80 ms per game minute on developed states.
- `previewSimulationCommand` is about 8 ms per call on `mid` and is not served
  by the frame facts cache, because it applies effects to a cloned state.
