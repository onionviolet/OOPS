# Load time and long-wait blockers (audit F9), measured 2026-10-30

Status: diagnosis and measurements only; **no source change**. Agent-verified, not human-reviewed.
Machine load average was 7-12 throughout (18 cores). Scripts were scratch files, not committed.

## 1. 1,500-person cast pack load: not reproducible as 30 s

| Measure (Chrome 1920x1080, fresh origin, fresh bundle from HEAD `c8244211`) | Result |
| --- | --- |
| Play button visible, whole-book pack in `private_packs/lotm-cast/cast.json` (3.9 MB, 1,500 people) | 4.7 s, 4.4 s, 4.8 s, 5.1 s; zero page errors |
| Same build with the cast file returning 404 | 3.5 s, 5.8 s (noise is larger than the pack's cost) |
| Node: parse + `validateLotmCast` + `deepFreeze` of the pack | 11 + 60 + 3 ms |
| Node headless `boot` (whole game, pack ready) | 4.5 s total, pack ready in 86 ms after boot |

The 30 s and 15 s figures come from P8 runs before its lazy-body work landed (P8 resume 3 records the be seat at about 1 s per minute)
and from sessions when load average was 194-377 (audit F4). With today's lazy definitions the pack itself costs under one second.
CPU profile of the 5 s load: generic content-registry compilation (`createSimulationRegistry`: `structuredClone` 1.2 s, `jsonData`
0.4 s, freeze 0.2 s, registered three times), `getComputedStyle` in workspace panel setup 0.8 s. None is specific to cast size.
**Decision: no cut made.** A further cut (compile each content registry once, skip the defensive clone of already frozen definitions)
is possible but would touch `src/simulation_contracts.js` for about 1 s; not needed to unblock the whole-book run.

## 2. 45-day wait "crash at 90,000 ticks": no leak, a very long single task

| Measure | Result |
| --- | --- |
| Node headless fresh game, 45 days stepped one day at a time | 13.5 min, heap flat (436 -> ~660-700 MB), no errors |
| Chrome, `advanceTicks(4000)` x2, fresh village hero | 71 s and 64 s per 4,000 ticks; JS heap 119 -> 117 MB (flat) |
| Chrome CPU profile, 1,000 ticks (18 s) | 17.7 ms per tick; 72% under `persistExpansion` (`writeExpansionPlan` 58%: `validateSaveEnvelope` 23%, `create_save` 14%, `setEnvelope` 8%); the rest `simulateTick` work |
| Chrome, `fastForward(6000)` (the sliced stepper, RT8) | 105 s, 4,670 slices, longest slice 70.6 ms, one 483 ms long task, heap 91 -> 114 MB, zero errors |

One tick is one game minute, so 45 days is about 64,800 ticks, about 19 min at 17.7 ms per tick. P3c ran `advanceTicks(4000)` per
evaluate under load average over 100: each call is a minute-long synchronous task, and the page died after about 22 of them. Heap does
not grow, so the cause is the unresponsive-page kill of long synchronous work, not an unbounded log, recursion or per-tick allocation.
Callers that wait long should use `fastForward` (yields every 30 ms; result byte-identical to `advanceTicks`, per RT8), not `advanceTicks`.

**Real cost: every simulated minute is a full durable commit** (build envelope, parse, validate every domain, stringify, store). Cutting
it needs deferring or coalescing the per-minute validate and write inside a batch. That changes when a failed write is noticed
(`foundationSaveBlocked`) and touches the save path, so it is stopped here for sign-off rather than done. Proposal: inside
`openStepperBatch`, validate the envelope every N minutes and at close; expected saving about 30% (validate 23% + setEnvelope 8%), outcome
identical when no write fails.
