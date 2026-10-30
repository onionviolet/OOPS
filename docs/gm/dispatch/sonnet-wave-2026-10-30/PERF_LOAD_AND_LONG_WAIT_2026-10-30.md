# Load time and long-wait blockers (audit F9), measured 2026-10-30

Status: diagnosis, measurements and two fixes in `src/main.js` (sections 3 and 4). Agent-verified, not human-reviewed.
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
**Finding: not reproduced at normal load. Decision: no cut made.** A further cut (compile each content registry once, skip the defensive clone of already frozen definitions)
is possible but would touch `src/simulation_contracts.js` for about 1 s; not needed to unblock the whole-book run.

## 2. 45-day wait "crash at 90,000 ticks" (first reading, superseded by section 3)

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

## 3. Real crash cause: off-heap memory in one unbroken batch (reproduced, fixed)

The first reading above was wrong about "no leak". A single `fastForward(64800)` in Chrome crashed the page ("Target crashed"), as did
30,000 and 12,000+ tick single calls, always near 13,000 ticks (about 145 s). JS heap stayed at 90-140 MB, nodes at 28k, but the
renderer's resident memory grew by about 10 GB (`ps`). Each tick builds and drops whole-save strings and buffers; only idle time lets the
browser release them, and a single call never idles (5,000-tick calls end, idle, and ran 70,000 ticks clean with heap flat).
Fix: `fastForward` rests 25 ms after every 500 ms of work (about 5% slower). A single 30,000-tick call then completed.

## 4. Batched envelope validation (per supervisor go-ahead)

Inside `openStepperBatch` the per-minute `validateSaveEnvelope` runs at the batch's first write, once per 60 in-game minutes, and at close
(the last skipped envelope). A failed write still sets `foundationSaveBlocked` at the first checkpoint, within one in-game hour; a failure
only the closing check sees blocks at close. Regression: `tests/stepper_batch_validation.test.js` (3 tests). Outcome check: 1,440 minutes
headless, seed 7, one batch: canonical save byte-identical with a 60-minute interval and a 0-minute (every minute) interval.
A separate 1,440-run comparing 1-minute chunks with one 1,440 chunk differs by one idle counter in two skill records; not checked against
the old code, so it may be existing behaviour.

| Measure (Chrome, fresh village hero) | Before | After |
| --- | --- | --- |
| `fastForward(6000)` wall time | 105 s | 88.8 s (machine load 27 vs about 10 before) |
| Longest slice | 70.6 ms | 85.9 ms (223.9 ms in the 45-day run) |
| Single call of 30,000 ticks | crashed near 13,000 | completes |

## 5. Proof: 45-day wait in Chrome 1920x1080, fresh origin

`fastForward(64800)` (45 days): 757 s, 25,202 slices, longest slice 224 ms, one 565 ms long task, heap 98 -> 158 MB, zero page errors,
clock 01/04/999 -> 16/05/999 08:00. Then save, reload (`window.save_to_file` export, reload, `load_progress` import): the clock reads
16/05/999 08:00 after save, after reload and after import; zero page errors. Agent-verified, not human-reviewed. Not run: a full
`npm test` (focused stepper tests and `check:arch` pass), and a LOTM-seat long wait.
`advanceTicks` and `fastForward` are test hooks only, so no UI path needed rerouting; the player's wait uses `update_timer`.
