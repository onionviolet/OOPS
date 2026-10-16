# Engine simulation fuzzer (simfuzz)

Wave D of the engine perf work. Drives every registered command through the
pure engine API in Node (no DOM, no browser, no personal save) and checks
invariants after every step.

```bash
node scripts/simfuzz/run.mjs                       # 50 seeds x 2000 steps, 4 workers, writes the report
node scripts/simfuzz/run.mjs --seeds 6 --steps 300 --no-report
node scripts/simfuzz/run.mjs --repro 17 --stop-at 412   # trace one seed up to a step
node --test --test-concurrency=2 tests/simfuzz/*.test.js    # smoke: 3 seeds x 120 steps
```

Options: `--seeds` `--steps` `--from` (first seed) `--workers` (default 4; the
host is shared with other lanes) `--out <file.jsonl>` `--fresh` `--report <dir>`
`--no-report` `--report-only`. Seeds run in child processes, so every result
carries its own CPU-seconds. Each finished seed is appended to the JSONL
(default in the OS temp dir, named by seeds, steps and first seed) at once; a
rerun with the same arguments skips seeds already there, so an interrupted run
resumes. `--fresh` discards it. The report goes to
[docs/gm/dispatch/engine-perf-2026-10-14/simfuzz/](../../docs/gm/dispatch/engine-perf-2026-10-14/simfuzz/).
`tests/simfuzz/` is not part of `npm test` (`tests/*.test.js`). On the shared
host, queue suite runs through the wave-f test queue
(`node <wave-f-checks worktree>/scripts/test_queue.mjs suite -- <cmd>`).

Judge the 50 x 2000 budget by CPU-seconds per seed (REPORT.md "Cost"), not by
wall time on a loaded host.

## Files

- `harness.mjs`: module loading, catalog, synthetic context, policies, invariants, `runSeed`.
- `run.mjs`: child-process pool, resumable JSONL, determinism reruns, `--repro`.
- `report.mjs`: REPORT.md, COMMANDS.md, results.json.

## Catalog

`buildCatalog` lists every command the engine registers:

| Kind | Source | Committed through |
| --- | --- | --- |
| sim | `expeditionRegistry.simulation.commands` | the group's host commit (main.js `actFeatureExpansion` routing) or `commitSimulationCommand` |
| action | `expeditionRegistry.actions` | `commitAction` |
| transition | `simulation.transitions` | `commitCampaignTransition` |
| advancement | `simulation.advancements` | `advancePowerProgression` |
| response / event | encounter turn responses, event responses | `answerSimulationEncounter`, `respondSimulationEvent` |
| backlog | `backlogActions()` | `commitBacklogAction` with an `advanceSimulation` clock bridge |
| workplan | `expeditionRegistry.workPlans` | `startWorkPlan` |
| opener | owner-creating entry points (enroll, begin*, start*) | the host function |
| control | cancel, program, pause, resume, withdraw | the simulation controls |

Host commands get main.js's command shape (`{type, id, sequence, targetId}`);
hosts with their own conventions (tidemark, nested campaign, glasshouse,
society, nested chains, agreed duty, causal story token) are special-cased in
`commitRow`. Groups with no Node-callable host (ink, subtlety relay/reference,
feature battle, party, structured local) use `commitSimulationCommand`.

## Context

Fixtures are the committed perf saves in `tests/fixtures/perf/` (fresh, mid,
crowded). `fixturePlan` loads `expansion` through `loadExpansionState` and
builds a synthetic native snapshot: money, the player's and native NPCs'
inventories (counts), empty skills, fixed vitals. `fullContext` then runs the
same context layers as main.js `buildFeatureWaveContext`, in order. A layer that
throws is skipped and counted as a harness gap in the report. Facts that need
the live native game (skill levels, zone access, weather) are fixed values.
Advances pass per-actor simulation contexts shaped like `simulationNativeContexts`.
Equipment comes from the fixture envelope (Item.createInventoryKey codec) and
stays fixed: the harness has no native item registry to publish changes into.

Every accepted plan then passes main.js `persistExpansion`'s final publication
guards (`assertBacklogPublication`, `validateAuditRemainderNative`,
`validateGameAbsorptionAssay`, `assertQualifiedOfficePlan`). A plan they refuse
is never saved by the game, so the harness drops it and counts a host
rejection. The rest of `persistExpansion` (native publication, reconcilers,
schema bump) is lane C's headless runner, not this harness.
The save round-trip writes the synthetic money, bags and full vitals into the
envelope before `decodeSaveFile`, as the host's publication would.

## Policies

Seed `s` uses policy `s % 3` and fixture `floor(s / 3) % 3`, so seeds 0-8
cover every pair.

- **random**: each command step takes one statically plausible row (actor,
  world, location and enrollment prefilter), previews it, and commits it if
  eligible.
- **greedy**: same, but prefers an untried opener, then a row that was eligible
  and never committed, then an untried row. Novelty drives coverage.
- **adversarial**: a third of its steps are probes that must be rejected:
  stale sequence (host route), wrong actor (engine route), zero money and empty
  inventories for a command with player-paid costs (engine route), an unknown
  command ID, and invalid advance minutes (-1, 0.5, NaN, Infinity, MAX_SAFE_INTEGER).
  An accepted probe is a failure; a rejected probe must leave its input unchanged.

Every policy also advances time: 15% of steps when idle, 45% when the player
has a job. Hops are 1 minute (60%), 2-5 minutes (30%) or to the next
simulation boundary, capped at 15 minutes.

## Invariants

| Check | When |
| --- | --- |
| `validateExpansionState` passes | after every accepted step |
| no NaN or Infinity anywhere in state, external, gameplay | after every accepted step |
| money, inventory counts and owner counts are non-negative integers | after every accepted step |
| owners name a person, custody names real people and the holder holds what it borrowed, no duplicate job IDs | after every accepted step |
| clock and sequence never go backwards | after every accepted step |
| a call (accepted or rejected) never mutates its input plan | every 4th step, and every adversarial probe |
| save -> stringify -> `encodeSaveFile`/`decodeSaveFile` (envelope validation) -> `loadExpansionState` -> canonical-equal state | every 50th step |
| advance N equals N x advance 1 (canonical hash of state, external, gameplay) | every 10th step whose hop is 2-6 minutes |
| same seed, same final hash | every third seed is run twice |

Item conservation across arbitrary effects is not checked: commands legitimately
create and consume items. The custody check covers loans.

The cadences exist because each call is expensive on developed saves. A
`previewSimulationCommand` rebuilds the whole `simulationFacts` (about 8 ms on
`mid` with an idle host), and `advanceSimulation` rebuilds it every simulated
minute (20-80 ms per minute). The report's "Where the time went" table measures
this per run.

## Coverage seeds

Seeds 0, 4 and 8 also preview the whole catalog at their first and last step.
That gives COMMANDS.md its per-fixture "eligible at start" columns. A full
sweep is about 1,600 previews, so other seeds skip it.

## Determinism

The fuzzer's own RNG (mulberry32 from the seed) is separate from the engine's
`state.rng`. Neither `Math.random` nor wall time enters a run, so a seed and a
step count fully determine the trajectory. `--repro <seed> --stop-at <step>`
replays it.
