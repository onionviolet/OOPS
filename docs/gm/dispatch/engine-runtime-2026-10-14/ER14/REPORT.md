# ER14 lane report

## CHECKPOINT

Complete: scratch kernel, two copied module adapters, 15 headless checks, fresh/crowded benchmarks, chunk write measurements and final artifact copy. No remaining ER14 worker. Proposal/source evidence only. No production kernel or gameplay acceptance.

## Return

**ER14-F5 is the main finding:** the heap is cheap between due jobs, but replacing whole domain slices makes each due completion copy all actors/facts. Crowded idle advance: 0.341375 ms median / 0.437791 ms p95. Crowded 128-job settlement: 92.914875 / 107.133459 ms. Update ownership/granularity is the next seam to resolve before a production extraction.

[Full research report](../../../../research/KERNEL_SPIKE_2026-10-14.md) owns findings, scope, commands, evidence labels, comparisons and ranked proposals. [Spike README](spike/README.md) explains execution and limits. Root palette and existing engine/save/offline owners remain unchanged.

## Files written

| Code | File | Purpose |
| --- | --- | --- |
| ER14-O1 | `docs/research/KERNEL_SPIKE_2026-10-14.md` | Main adaptation findings, equality, costs and limits. |
| ER14-O2 | `docs/gm/dispatch/engine-runtime-2026-10-14/ER14/REPORT.md` | This lane return. |
| ER14-O3 | `ER14/spike/kernel.mjs`, `adapter.mjs`, `check.mjs`, `benchmark.mjs`, `README.md` | Runnable scratch source, no dependencies. |
| ER14-O4 | `ER14/spike/copied/pacing.mjs`, `copied/world_rhythm.mjs`, `LICENSE` | Exact source copies and retained license. |
| ER14-O5 | `ER14/spike/check-results.json`, `benchmark-results.json`, `benchmark-output.jsonl`, `source-snapshot.json` | Measured evidence and provenance. |

Only these owned paths were copied into the repo after work in `/tmp/yairpg-er14`. Scratch filesystem chunk generations stay under `/tmp/yairpg-er14/writes`; they are not committed/copied. Existing shared dirty files were preserved. No SECRETS-named file or personal save was opened. No commit, push, install or repo build occurred.

## Commands and results

MEASURED, executed from the owning checkout unless a full scratch path is shown:

```sh
cp src/absorb_e1/pacing.js /tmp/yairpg-er14/copied/pacing.mjs
cp src/world_rhythm.js /tmp/yairpg-er14/copied/world_rhythm.mjs
cp LICENSE /tmp/yairpg-er14/LICENSE
node /tmp/yairpg-er14/check.mjs > /tmp/yairpg-er14/check-results.json
node /tmp/yairpg-er14/benchmark.mjs > /tmp/yairpg-er14/benchmark-output.jsonl
wc -l /tmp/yairpg-er14/*.mjs
```

Final checks exit 0: 15 pass; enabled-hunger numerical counterexample also asserted and recorded. Final benchmark exit 0: four warmups and 31 samples for each advance and each filesystem chunk write. Kernel 101 lines; new kernel/adapter/check/benchmark source total 198 lines, excluding unchanged copies. Kernel output is not the repo bundle.

An earlier benchmark attempt exited 1 with ENOENT for an actor chunk when switching backend. ER14-F7 records the fix: backend identity invalidates saved-hash references. Repeated checks then passed, and the final benchmark completed at 2026-10-14 05:10:12 UTC. Initial 12 checks were extended to 15 to cover backend switching, missed claims and invalid/budget-limited advance. Timing is not a controlled whole-game speedup comparison.

Artifact publication used a scratch Python script to copy the named files only. Final copy/provenance and link checks passed; `node .../ER14/spike/check.mjs` then independently ran from the copied artifact, with the same 15 checks and numerical counterexample. No benchmark rerun was needed after report-only edits.

## Open questions and acceptance

| Code | Open contract |
| --- | --- |
| ER14-Q1 | Which existing plan boundary can inject per-entity mutation without losing native custody/resource/clock invariants? |
| ER14-Q2 | Which real validation edges must rerun on a slice change, and which are safely local? |
| ER14-Q3 | How should replay/receipts/checkpoints be retained without changing history-aware behavior or idempotency? |
| ER14-Q4 | Which browser backend and native transaction route will retain one writer, last-good recovery and exact legacy full-envelope compatibility? |

These are proposals for a future authorized extraction, not blockers on this completed scratch lane. Native game/bundle, browser save/reload/export/literal import, context transitions, choice/death barriers, storage durability and human acceptance remain untested by this spike. Live command commit is separate from save, so failed save preserves stored history but does not roll live state back. No migration/backend/gameplay policy is selected.
