# P5 speed checkpoint

## Resume 1 reservation, 2026-10-29

The coordinator applied P5 and F1 and reported full-suite failures in held stock routines and story budget coverage. P5 resumes ownership of the original lane grant plus `tests/routine_jobs.test.js` and `tests/story_spine_qa.test.js`. The work-plan owner inspected is `src/feature_expansion_work_plan.js`; no edit to that file is planned. The scheduler must preserve an existing controller boundary when a running unreserved stock cursor depends on it, including inventory and support changes. Verify against the original-poll dial, compare seeded draws and receipts, and make any budget test use real scheduled work. Run both named tests, the original focused set and the headless matrix; no commit.

The earlier P5 results and release below are historical. The coordinator has since applied the integration patch and F1; the reported 3906/3908 full-suite run is not a passing full-suite gate. Resume results and the new release are recorded at the end of this checkpoint.

Status: **implemented, below floor**. The lane's equivalence and boundary-reduction checks pass; combined browser proof belongs to the coordinator. No commit or push. P5 reserved `src/expansion_engine.js`, `src/simulation.js`, `src/constraint_store.js`, `src/constraint_pack.js`, new focused tests, this checkpoint and `P5_INTEGRATION.patch`; ownership is released below. World files and `main.js` are patch-only. Other sessions' work stays untouched.

Authority: [P5 brief](P5_SPEED_BRIEF.md), [cast-lives card](../CAST_LIVES_CARD.md), PROJECT's cast-lives direction. Codes: AR1-AR16, AD36/43/45, MD3/6, CLR2/10/12. Seam: existing expansion scheduler and simulation controller decisions; no new clock, location owner, save slice or publication cadence. Local-life publication remains unchanged following P4 F4. Reversible default: predicates without a proven wake retain their existing interval.

Pre-edit verification plan: compare frozen baseline/candidate state and exact save bytes for fresh, beside-pack, reading-active and be-pack fixtures, preserving the span/stepped dial. Count internal boundaries and attribute controller, constraint, cast and publication work. Regress unknown predicate fallback and changes before a queued wake. Coordinator owns full suite, rebuilt browser timings and AD43 floor; lane uses focused tests and architecture/review checks.

## CLR2 probe and implementation

F1: Both loaded pack seats enroll one one-minute controller, `village.craftsman_controller`, on the Village craftsman. Its candidates check `actor.field.partsOrder == true` and `actor.work.order == true`. Both fields are stored actor facts with authored actor-fact effect writers; they do not accumulate with elapsed time. No pack actor names or source content are included in this public receipt. The local pack has 36 people, 77 schedule rows and 84 beat bindings, revision `cast-constraints-2026-10-28.1`.

F2: An isolated baseline be-seat 349-minute span took 18,705.62 ms in the Node DOM harness, with 349 boundaries. Inclusive controller scan was 1,278.18 ms (3.66 ms/boundary); the whole simulation-boundary function was 1,291.52 ms, leaving 13.35 ms of other work inside it. D1 `canonActionDecision` ran twice after the span, 0.20 ms inclusive, with 0.09 ms in reservation decisions. It was **not** running once per internal boundary in this fixture. Cast sync ran twice (0.16 ms), beat planning twice (2.36 ms) and durable publication twice (93.62 ms inclusive). These marks overlap by nesting and are not additive. Remaining time is outside these marked functions, including the contexts constructed before the kernel call; it is not a measured exclusive native-context category. Initial enrollment/index construction was outside the timed span. This is diagnostic attribution, not browser timing.

F3: The first instrumented candidate be-seat span retained equal state and exact `create_save()` bytes, with 3 boundaries and two publications, 1,811.43 ms. Later matrix timings are recorded separately because concurrent checks and source fixtures make these single samples unsuitable as stable speed ratios. No under-three-second browser claim.

Implementation:

- Controller wakes are derived per boundary from explicit clock comparisons and guards on stored actor facts identified by authored command effects. Conjunctions/disjunctions retain a sufficient blocker; arbitrary derived predicates, negation, supplied fact overrides, unguarded candidates and intervals other than one minute keep polling. `wake_queue.js` supplies the finite controller minimum; indefinite waits have no queued time. Every other scheduler boundary re-derives the guards. The first kernel boundary is retained for existing lazy construct initialization.
- Omitted no-op polls advance the saved controller `due` field arithmetically to the same phase. Before a real boundary the controller remains eligible for that minute, so jobs/checks/other controllers can enable work in the existing order. No wake map, queue or cache is saved. `setControllerWakeModeForTests` compares the new path with the original poll scheduler; the existing clock span/stepped dial remains intact.
- Constraint construction indexes people and anonymous anchor identities, preserving first-person and source-order semantics. The store exposes `byId` and compiles need/produce key selectors once for its existing row/index lifetime. Reads, time and settlement decisions remain live. Prepared world patch uses the ID index and reads the ledger lazily once per action decision, rather than cloning it again for each queried reservation. The measured wait did not identify D1 as a per-boundary hot path, so these changes are not credited with the boundary speedup.
- Local-life publication, RNG attempts/cursors, checks, jobs, cast settlement and save schemas keep their existing owners/cadence. Core owner files changed: `expansion_engine.js` and `simulation.js`; `main.js`, `display.js`, `save_files.js` registration growth: zero; new cycle edges: zero.

## Patch-only integration and tests

`P5_INTEGRATION.patch` contains `src/book_world_lotm_cast_host.js` and, named before preparation, `tests/simulation.test.js`. Neither shared file was edited. The existing catch-up test assumed that idle craftsman polls exhaust the 512-boundary budget; its patch uses a one-minute event director instead, preserving the actual RNG/check/catch-up invariant. The shared unpatched test therefore still fails that obsolete budget premise until the coordinator applies this patch. No production fallback or budget limit was removed.

New files: `tests/controller_wakes.test.js`, `tests/constraint_indexes.test.js`, `tests/headless/controller_wake_equivalence.test.js`, `tests/headless/controller_wake_fixture.mjs`. The headless differential lives outside the ordinary unit-test glob because it boots 16 full native fixtures. Run it explicitly. It freezes sources in temporary directories, applies the integration patch there, and stores exact state/save outputs locally. Fresh/beside/reading/be each run both clock modes, comparing original polling or a supplied frozen pre-P5 root against the new scheduler. It also checks unchanged publication counts and at least halved be-span boundaries. P4's fresh-life span/stepped difference is reported rather than normalized away.

A synthetic regression caught an omitted empty construct table when all first-boundary work was suppressed. Keeping the first ordinary boundary fixes that exact-byte difference. The initial differential's publication counter did not match the baseline's renamed instrumentation wrapper; its failed cadence assertions were harness errors, corrected in the subsequent matrix. An instrumented snapshot was also unsuitable for plain Node unit tests (`window` instrumentation); unit proof and the production build use `/tmp/yairpg-p5-clean`, without instrumentation. One overlapping log pathname was discarded; `/tmp/p5-focused-clean-final.log` is the unambiguous final focused receipt.

## MD6 final differential

Command: `YAIRPG_WAKE_BASELINE=/tmp/yairpg-p5-proof/before node --test tests/headless/controller_wake_equivalence.test.js`. PASS, four fixture subtests plus the parent (5/5), 16 independent full-game executions, each advancing 349 minutes. Every before/after comparison has **equal expansion state, exact save bytes and publication count**. Both named pack fixtures use the real loaded private pack. Be enrollment is a named fixture: fresh native shell plus the existing `lotm.enrollBeFresh` domain command, not a browser proof of the fresh-start portal lifecycle. Reading uses a supplied native manual, its inventory row and the existing start-reading command.

| Fixture / clock mode | Before / after boundaries | Before / after publications | Before / after diagnostic ms |
| --- | ---: | ---: | ---: |
| Fresh / span | 0 / 0 | 1 / 1 | 446.74 / 336.39 |
| Fresh / stepped | 0 / 0 | 349 / 349 | 4,925.34 / 3,834.22 |
| Beside pack / span | 349 / 3 | 2 / 2 | 38,755.22 / 3,651.61 |
| Beside pack / stepped | 349 / 3 | 351 / 351 | 108,853.56 / 77,556.50 |
| Active reading / span | 0 / 0 | 1 / 1 | 204.40 / 239.80 |
| Active reading / stepped | 0 / 0 | 349 / 349 | 5,120.27 / 8,038.56 |
| Be pack / span | **349 / 3** | 2 / 2 | 29,662.92 / 1,953.73 |
| Be pack / stepped | 349 / 3 | 351 / 351 | 59,358.03 / 37,418.16 |

The be-wait boundary reduction is **99.14%**, exceeding the half-boundary gate. Timing samples include concurrent checks and instrumentation, so the deterministic boundary result is the lane's performance proof. Natural pacing and browser throughput remain unmeasured.

Within each input's original clock mode the optimization is equal to baseline. Comparing the modes themselves still gives different state/save bytes for fresh, beside-pack and be-pack lives, and equal bytes for reading. The beside result differs from P4's older stable pre-D1 input; this matrix does not generalize that older result. No mode differences were discarded or normalized, and no local-life publication batching was added.

Exact fixture outputs, source snapshots, runner PID receipt and `receipt.json`: `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-controller-equivalence-gzMeov`. Matrix log: `/tmp/p5-equivalence-final.log`. All private inputs stayed local. Pack SHA-256: `76bd2b74ef7d9d8b40b46dd86627f26cae6ef97127a7079a22d3caa269b6cb99`; its file timestamp predates the frozen source capture and remained unchanged throughout the matrix. The reusable harness now copies private inputs into its temporary fixture so future concurrent pack edits cannot affect a run.

## Final checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/controller_wakes.test.js tests/constraint_indexes.test.js tests/constraint_store.test.js tests/simulation.test.js tests/simulation_extensions.test.js tests/simulation_optional_enrollment.test.js tests/expansion_engine.test.js tests/lotm_constraint_host.test.js tests/lotm_cast_week.test.js tests/lotm_be_seat.test.js` in `/tmp/yairpg-p5-clean` | PASS 105/105 | Frozen clean candidate includes patch; no full suite |
| `BUILD_OUT=/tmp/yairpg-p5-build npm run build` in `/tmp/yairpg-p5-clean` | PASS; bundle SHA-256 `276fd4579d2f488bafc447909f8eedf8dae6e1a92214ae862836626238fb9180` | Clean production build, not exercised in a browser |
| `npm run check:arch` | PASS: main 10056/10115, display 6730/6767, save 310/310; 6 grandfathered main imports, 205 cyclic edges | Shared checkout, no growth |
| `npm run check:rules` | PASS: 27 rows, 45 AD codes, 151 links; 16 receipts, zero problems | No rule/direction edits |
| `node scripts/lane_review.mjs` with all ten owned paths as grants/candidates | PASS: 8 source/test files, 118 private-name tokens, zero hits/await/outside grants | Patch body reviewed separately |
| `GIT_DIR=…/.git node scripts/lane_review.mjs --grant src/book_world_lotm_cast_host.js --grant tests/simulation.test.js src/book_world_lotm_cast_host.js tests/simulation.test.js` in the clean candidate | PASS: 2 files, 118 tokens, zero hits/await/outside grants | Read-only Git metadata; patch applied in scratch only |
| `git apply --check …/P5_INTEGRATION.patch`; `git diff --check --` four owned runtime files | PASS | Recheck against coordinator's final inputs |

Input identities: `/tmp/p5-input-manifest.json` records baseline/candidate source hashes, shared HEAD at audit time, patch, pack and production bundle hashes. All four owned runtime files and both new focused unit tests match `/tmp/yairpg-p5-clean` byte-for-byte. Build log: `/tmp/p5-build-clean.log`; focused log: `/tmp/p5-focused-clean-final.log`; rules log: `/tmp/p5-rules.log`. No full `npm test` was run by this lane.

## Known limits and remaining gate (AD45)

No new schedule/need-rate predictor is inferred for arbitrary domain facts: unknown owners retain minute stepping. The stored-fact index assumes the command definitions for that registry retain their authored actor-fact ownership; future dynamically replaced definitions need an explicit registry revision or a rebuilt derived index. Constraint selectors share the existing store's static row/index lifetime; hot pack edits rebuild the store rather than mutating its indexed rows. Active unrelated one-minute work can still dominate. The boundary cap continues to limit actual work; proven omitted no-op polls no longer consume it.

Browser launch is deliberately left to the coordinator as the brief directs. Remaining authoritative combined gate: apply the patch, run the coordinator's full suite once, rebuild and execute `scripts/floor/run_floor.cjs` at 1920×1080, with real timings and the relevant persisted-save checks. No native app or player save was read or changed; human review is optional. This lane's state is agent-verified at focused/Node-fixture scope, not human-reviewed, and **implemented, below floor** until the combined browser proof.

## Release

P5 releases all ten owned paths to the coordinator. The prepared patch additionally names its world-host and existing-test payload paths; those shared files were not edited. All P5 fixture, build and test processes have completed; no browser was started. No Git metadata write, commit, stash, reset, force or push was attempted. Apply `P5_INTEGRATION.patch` before the combined suite, then use the normal rebuilt floor runner for actual browser timing.

## Resume 1 findings and fix

F4: The stock failure was a gameplay defect. `workPlanNextBoundary` intentionally does not manufacture minute polls for a held stock cursor, but `advanceWorkPlansBoundary` previously observed inventory, custody and native support changes on ordinary controller boundaries. P5 suppressed those boundaries. `controllerWakeTimes` now returns the original controller due times while any running stock-policy cursor has no accepted job. The existing job still supplies its own due time while accepted; no timer is created where no controller or other boundary existed. `src/feature_expansion_work_plan.js` was inspected but not edited.

The new regression in `tests/routine_jobs.test.js` uses `setControllerWakeModeForTests` to compare whole plan outputs from the same held fixture with original polling and queued wakes. It covers stock 4→3, then 3→2 with the batch starting at the same next minute, loss of location support, and a no-controller fixture. The existing stock assertions remain intact. A held routine can still pay the original polling cost while it waits; this deliberately preserves its pre-P5 behavior until its owner has an explicit stock/support wake.

F5: The story budget assertion depended on idle polls. A direct 3,600-minute seed-43 comparison produced byte-identical story projections, including draws and receipts: original polling returned the boundary budget 6 times and the optimized path 0 times. The test now advances 7,200 minutes in one long request, with 600 actual daily story-deck checks, and still verifies budget continuation, repeated seed, 900-minute chunking, reload and distinct-seed draws. A separate test compares the original-poll and queued paths. The longer run passed and did exhaust the budget through real scheduled story work.

F6: The headless matrix's default baseline previously took a copy of the optimized source without exporting the test dial, so a default invocation compared the optimized path to itself. Its earlier explicitly supplied pre-P5 baseline was valid. The harness now freezes the shared source once for both candidates, exports the existing scheduler dial to both when no external baseline is supplied, and actually runs polling off/on. Its frozen private pack is shared by both fixture snapshots. This addresses the test gap without changing the clock span/stepped comparison or local-life publication.

Resume source identities: `src/simulation.js` SHA-256 `2f3bdb49559630943f2f069e81abc395842f6ff979786b592b0f84abd8dd2dda`; `tests/routine_jobs.test.js` `14ed69cfc4aaf6b9fde7de677a44f9043dc2004de761a64f9aa014130a54e820`; `tests/story_spine_qa.test.js` `a8bf7d0f5085d842befe0b4164c6ee8bff9918b294a77fa6fb8c717f04fa0237`; headless matrix test `96993dfe8760016bb3ee2ee480da1f2926450cbc04c20c06b5b35dd6aa8e12a4`. At the input check, the current checkout and the matrix's frozen `src/` matched across all 1,006 files. Local private pack SHA-256 `76bd2b74ef7d9d8b40b46dd86627f26cae6ef97127a7079a22d3caa269b6cb99`.

| Resume command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/routine_jobs.test.js` | PASS 19/19 | Node fixtures; new comparison covers original polling, changed stock and support |
| `node --test tests/story_spine_qa.test.js` | PASS 3/3 | Includes actual-work budget continuation, seed/chunk/reload and polling differential |
| `node --test tests/controller_wakes.test.js tests/constraint_indexes.test.js tests/constraint_store.test.js tests/simulation.test.js tests/simulation_extensions.test.js tests/simulation_optional_enrollment.test.js tests/expansion_engine.test.js tests/lotm_constraint_host.test.js tests/lotm_cast_week.test.js tests/lotm_be_seat.test.js` | PASS 105/105 | Focused set on integrated checkout; not the full suite |
| `BUILD_OUT=/tmp/yairpg-p5-resume-build npm run build` | PASS; bundle SHA-256 `b273a71dbec2c4c131fb102d8925f28f4c19b146055f1dc93c2b7564948d8919` | Rebuilt bundle not exercised in browser |
| `npm run check:arch`; `npm run check:rules` | PASS; 205 grandfathered cyclic edges, no growth; zero rules/receipt problems | Shared checkout |
| `node scripts/lane_review.mjs` with resume paths granted; `git diff --check -- src/simulation.js tests/routine_jobs.test.js tests/story_spine_qa.test.js` | PASS: four source/test files, zero private-name hits, top-level awaits or outside grants; whitespace clean | Scope is the resume changes |
| `node --test tests/headless/controller_wake_equivalence.test.js` | PASS 5/5: fresh, beside-pack, active-reading and be-pack, each in span and stepped modes, 349 minutes each | Node DOM fixtures only; polling off/on use same frozen integrated source |

The resumed matrix compared full expansion state, exact save bytes and publication counts in all eight mode/fixture pairs. All matched. Both beside and be span waits had 349 original polling boundaries and 3 queued boundaries; be span diagnostic time was 19,321.51 / 1,390.14 ms before / after. These are single Node samples, not browser timing. Span and stepped outcomes differed from each other in fresh, beside and be fixtures, as before; neither publication cadence nor those differences were normalized away. Receipt and frozen source: `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-controller-equivalence-o9gBlt/receipt.json`; log: `/tmp/p5-resume-headless.log`. The small baseline-export/frozen-source harness change is included in this completed run.

Resume release: P5 releases `src/simulation.js`, `tests/routine_jobs.test.js`, `tests/story_spine_qa.test.js`, `tests/headless/controller_wake_equivalence.test.js`, the checkpoint, and the other original P5-owned paths to the coordinator. No work-plan source or shared world file was edited in the resume, and no commit or push was made. Both previously reported full-suite failures now pass in their focused files, but the full suite has **not** been rerun by this lane. The next authoritative gate is the coordinator's combined `npm test`, followed by the rebuilt browser floor and persistence checks. This remains **implemented, below floor**, agent-verified, not human-reviewed.
