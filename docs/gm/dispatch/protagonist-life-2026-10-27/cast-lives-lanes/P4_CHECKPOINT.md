# P4 clock checkpoint

Status: **implemented, below floor** for Part A. Part B stops at its declared classification boundary; no new gameplay batching or skipped native events is enabled. No commit or push. Agent-verified at focused/Node scope, not human-reviewed. The coordinator owns combined candidate verification, full pre-commit suite and the rebuilt browser floor.

Rules: AR1, AR3, AR9, AR15, AD36, AD43, AD45; CLR2, CLR10, CLR12. Direction remains [the cast-lives card](../CAST_LIVES_CARD.md) and [P4 brief](P4_CLOCK_BRIEF.md). No new product authority or accepted decision.

## Ownership and extraction

AR15 reservation: P4 owns `src/main.js`, `src/clock_owner.js`, `tests/clock_owner.test.js` and this checkpoint until release below. D1 retains its world and constraint modules. No other shared paths edited. Build/probe/review artifacts are under `/tmp/`; no tracked bundle, private pack or user save was modified by P4.

`createClockOwner` now owns the existing native `update_timer` dispatch. Its clock/save/body/world/UI ports retain live getter/setter bindings for state, panels mounted later and failure flags. The same expansion publisher remains the durable owner, `domainRegistry.tick` remains the domain seam, and simulation people retain location authority. No save schema, RNG stream, timer or registry domain was added. Core-owner surface: `main.js` only; one factory registration statement and import; no new cycle edges. `main.js` drops from 10,090 to **10,056 lines**, a reduction of 34 after readable grouped wiring. The simulation kernel and native publication staging remain in their existing owners.

A module export `setClockSpanModeForTests('span'|'stepped')` lets fixtures request the existing explicit span or one-minute clipping through the same dispatch. Default `span` preserves pre-extraction behavior. There is no UI, window control or saved setting. This dial does not assert that span-end publication equals repeated native publications.

## CLR2 data probe and stop finding

| Gate input | Expected in brief | Observed | Gate |
| --- | --- | --- | --- |
| Per-minute work in `update_timer` during wait | Full native publication per minute | A 349-minute wait is already one dispatch and one `advanceChroniclePlan` call; enrolled fixture has 349 **internal simulation boundaries**, two publisher calls including cast settlement, 34 native-context requests | Premise corrected |
| End-equivalent accumulators | Needs, regeneration, timers can be merged | Calendar/effect arithmetic is already span-based. Native needs/body/reading/home work is coupled to publication and scheduler/event inputs; no additional grouping proven | Keep existing cadence |
| Clock callers | Natural, wait, sleep, reading, others | Three production call sites: `simulateTick()`; `progress_time()` for location travel; the world host's `advanceWaitMinute` port. Sleeping and long rest choose their request size inside the dispatch. Native reading/crafting progress also has separate tick consumers | Complete call inventory |

F1: The expensive loop is inside `expansion_engine.js:advanceSimulation`, not a loop over `persistExpansion` in `update_timer`. The named stable beside fixture made 349 `advanceSimulationBoundary` calls for one requested 349-minute span. Both original and extracted dispatch produced identical state and save bytes. Its diagnostic times were 36,273.94 ms before and 35,177.08 ms after; this is Node instrumentation, not a browser speed claim or a meaningful speedup. An earlier uninstrumented live-tree diagnostic took 22,603.39 ms; it did not assert successful enrollment and is not the fixture acceptance evidence.

F2: The measured beside fixture ends with one controller at a one-minute interval, zero event checks, zero decks and zero active jobs. This identifies the first concrete optimization target as that controller scan, rather than assuming random events were active in this fixture. In general, internal boundary work includes random event checks with attempts/misses/draw cursors, controller scans and actions, job completions, conditional ticks, expiries, storylet decks, life endings, work programs and world-specific reconciliations. Its exact boundary order determines outcomes. Cast wakes alone do not declare these inputs unchanged. Skipping these wakes or postponing their effects would change upstream behavior, triggering the brief's stop condition. The kernel, simulation and world files are outside P4's owned files; none was edited. No D1 patch was needed.

F3: A scratch snapshot containing D1's concurrent constraint changes could not enroll the beside fixture: `Invalid constraint identity or window. Your current save is kept.` No page error was recorded because the UI caught the rejection. P4 did not modify D1's files. Structural proof therefore freezes one source snapshot and replaces **only in temporary copies** D1's four dirty tracked world modules with their committed HEAD versions for both before/after candidates. This proves extraction against a stable compatible input, not the combined current checkout. The coordinator must recheck enrollment and the floor after D1 releases its files.

## MD6 differential results

Final dial run: `node /tmp/p4-dial.mjs`, PASS as a differential diagnostic, **not** a passing three-fixture batching equivalence gate. The stable scratch candidate has the final P4 clock logic and the same committed world modules on both sides. Both modes use the existing `openStepperBatch(false)` to coalesce display work and enable its existing planning-read phases; gameplay and durable publication remain active. This setting is confined to the temporary harness. Every span-mode result also matches the original pre-extraction fixture's full state and exact `create_save()` bytes. No mismatches were normalized away.

| Named fixture, 349 minutes | Original vs extracted state / save bytes | Span vs stepped state / save bytes | Span / stepped publications | Node span / stepped time |
| --- | --- | --- | --- | --- |
| Fresh native life | Equal / equal | **Different / different** | 1 / 349 | 187.40 / 3,139.32 ms |
| Beside life, actual local cast pack loaded | Equal / equal | Equal / equal | 2 / 351 | 24,450.11 / 51,132.18 ms |
| Active native reading, supplied manual and rendered inventory row | Equal / equal | Equal / equal | 1 / 349 | 188.34 / 2,972.68 ms |

F4: Fresh-life differences are `state.streams` and saved `absorb_local_life` fields `encounter`, `visitorMet`, `hubDay`; the save also differs under `expansion` because it contains the stream state. Local-life publication is therefore **not** a proven elapsed-time accumulator. Converting the normal minute driver to span-end publication would change actual encounter/visitor state. Preserve the pre-existing explicit-span and natural-tick behavior; do not introduce new batching over this owner. The other two passing fixtures do not override this counterexample. This meets the brief's stop condition rather than its Part B done check.

The initial uncoalesced beside stepped diagnostic exceeded its 240-second subprocess timeout and was terminated by that subprocess timer (`SIGTERM`); no partial result is treated as acceptance. The completed comparisons above retain durable writes and are not browser performance measurements. The trace also corrected a diagnostic-only save-diff helper: `create_save()` returns serialized JSON, so subsystem inspection needs to decode that string before enumerating keys. Exact byte comparisons were unaffected.

Artifacts: `/tmp/p4-structural-result.json`, `/tmp/p4-dial-batched-render-result.json`, `/tmp/p4-dial-batched-render.log`, and per-mode fixture files under the stable scratch root. No private fixture payload is copied to tracked documentation.

## System classification inventory (AD45)

These declarations describe existing owners/cadence. They do not authorize skipping a boundary.

| System | Classification and existing owner | P4 treatment / reason |
| --- | --- | --- |
| Authority operation, boot error, ended life, structured-pack readiness, writable/save gates | Interruption boundaries, native host | Same guards before any plan or native change |
| Optional pack settlement, accrued pay and completion notices | Existing span settlement after joined simulation | Same consumed time, patch, durable save, then pack publication; no new accumulator |
| Backlog pause, manual chronicle, actor session and waiting choice | Blocking boundaries | Same pause UI and zero advancement |
| Sleep speed and prepared long-rest request | Existing request policy | Same request size; rest observation can reject oversized spans |
| Leisure due time and adaptation due/expiry | Explicit clipping boundaries | Same clipping and due-before-advance settlement |
| Chronicle automatic response and frontier journey | Domain boundary plans | Same owner and ordering; no merged responses/journeys |
| Calendar arithmetic and travel-aware active-effect durations | Existing accumulators inside `advanceChroniclePlan` | Already consume elapsed minutes once; expiry-driven eligibility is still owned by the scheduler/publication path |
| Pending jobs, opportunities, encounter/life clocks | Kernel boundaries | Retained; completions, blocking decisions and endings can interrupt |
| Simulation jobs/checks/controllers/condition ticks/expiries, decks, pursuits, programs | Kernel boundaries, including authored one-minute wakes | Retained; predicates, costs, RNG and successor wakes may change each boundary |
| Container, lore, care, completion, causal, realm and other world clocks | Existing kernel boundary providers and reconciliations | Undeclared end-equivalence, retain existing stepping/boundary scheduler |
| Native reading observation, adaptation staging, P00 exposure/gear/home/residence, pacing, local life, tranche work, title recognition | Publication staging, called at the existing committed span boundary | Not newly batched; depends on prior native state, location, sequence and other staged changes |
| Native inventories, equipment, vitals, active effects, stock, availability, money, quests, location and acquisition logs | Durable publication and existing native writers | Retained; cannot defer solely from clock/cast state |
| Cast host tick and other domain ticks | Registry boundary consumer after publication | Same consumed value and order; cast host can make its own settlement publication |
| Day/night stat refresh, death/combat cleanup, customizations and optional-start reveal | Native publication/clock boundary | Same ordering; stat updates are gameplay inputs, not display-only work |
| Clock/publication panels, inventory/log/time displays | Existing display consumers | Same defer/render behavior; no broader render suppression introduced |
| Durable storage and `create_save()` | Existing publisher | Already once per clock plan, plus any domain settlement; no delayed-save transaction added |
| Native reading/crafting/activities/combat/effect progression in `simulateTick` | Outside `update_timer`, native tick consumers | Left stepped; an `update_timer` fixture does not prove a full natural tick journey |

Default for a successor packet (CLR12): reserve `expansion_engine.js` and `simulation.js` with their actual boundary providers. First measure the due-check/controller/deck population per minute. Optimize unchanged predicates or proven no-op boundary scans without skipping draw cursors, attempts, controller wake positions or ordered settlements. Reconcile publication-only differences before adopting a new span contract. Do not dispatch another outer-clock batching lane on the assumption that it saves 349 native publications.

## Evidence and checks

Baseline main SHA-256: `52337994bef2550458318e45054d87af49fc063d635714e4017d0ca610af6ed4`, retained at `/tmp/yairpg-p4-base/main.js`. Stable scratch source: `/tmp/yairpg-p4-proof-kb3qth`. Fixture scripts: `/tmp/p4-equivalence.mjs`, `/tmp/p4-worker.mjs`, `/tmp/p4-dial.mjs`. All use in-memory fixture storage and seeded randomness. No player profile was read.

The reading fixture explicitly supplies one native manual, renders its inventory row and starts reading through the existing window entry. It verifies an active reading state across the clock call, not completion of the separate native reading tick. Initial probe mistakes (enrollment rejection, then starting a book without an inventory row) are excluded from passing evidence.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/clock_owner.test.js tests/planning_read_frame.test.js tests/reading.test.js tests/wait_until.test.js` | PASS 24/24 | Grouped clock ports, paused choices, boundary clipping, sleep/rest requests, durable failure ordering and test dial; focused scope |
| `node --test tests/lotm_cast_week.test.js tests/lotm_be_seat.test.js` | PASS 29/29 | Existing world consumers; does not prove current UI enrollment |
| `node /tmp/p4-dial.mjs` (stable scratch source, final clock logic) | Extraction PASS 3/3 state and save-byte comparisons; stepped/span equality 2/3 | Fresh-life counterexample above; no general batching claim |
| `node --check src/main.js`; `node --check src/clock_owner.js` | PASS | Syntax only |
| `npm run check:arch` | PASS: main 10056/10115; 6 grandfathered main imports, 205 cyclic edges | No new cycles; shared checkout includes concurrent work |
| `npm run check:rules` | PASS: 27 register rows, 45 AD codes, 151 links; 16 receipts, zero problems | No rules/accepted-direction changes |
| `BUILD_OUT=/tmp/yairpg-p4-build-final npm run build` | PASS | Shared candidate build includes concurrent world changes; not exercised in Chrome |
| `node scripts/lane_review.mjs` with the four owned paths as grants and candidates | FAIL: one name-hit file, one top-level-await file, zero outside grants | Both are pre-existing whole-main findings, reproduced on frozen baseline with the same 118 private-name tokens |
| `GIT_DIR=…/.git node /tmp/p4-review.mjs`; `GIT_DIR=…/.git node /tmp/p4-review-added.mjs` | PASS for new module/test and exact added main lines: zero name hits/await/outside grants | Scoped payload proof; does not clear pre-existing whole-main findings |
| `git diff --check -- src/main.js src/clock_owner.js tests/clock_owner.test.js` | PASS | Only P4 paths |
| `node -e "require('./scripts/ui_helpers.cjs').launchChrome()…"` | FAIL at launch: SIGABRT, cleanup kill EPERM | No page opened; no retry or permission escalation. Browser work stopped as brief requires |

Browser build SHA-256: `34b15ea0a12baa5d0482d8e940cf80eed9b758d8897649218668241183b58c19`. P4 source identities: main `f76bf8be7cca97a69d0bc0a7326a8c718cb58b938df70624cf56959c2a7272d5`; owner `0dfb1ff6511964eef6f061fcff360f606dd6a8997c8ffdeab90e2ae71427db19`; test `0bfb76fd59df9dc3543f270ddb4f91755333ce599c04dbbffe00f9297d024a70`.

## Remaining gate

Part B throughput target and new accumulator batching are **not achieved**. No claim of a sub-three-second wait. Required combined gate: reconcile D1, full `npm test` once by the coordinator, rebuild and run `scripts/floor/run_floor.cjs` at 1920×1080 with receipt state/save parity and the 3,000 ms budget. Browser save/reload/Export/Import and natural-rate evidence remain open. Human review is optional (AD42).

## Lane release

P4 releases its four owned paths to the coordinator. All P4 test/probe/build commands have exited. No P4 worker or browser was left running. D1 paths and unrelated dirty work remain untouched. The source is uncommitted as instructed. Part A has Node structural equivalence; Part B is stopped with a measured counterexample and the named kernel/controller seam for follow-up.
