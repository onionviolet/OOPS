# P2 checkpoint: wake queue and measured remaining cost

Status: **implemented, below floor**. Queue engine ready; integration patch tested in a scratch source copy, not applied to the shared checkout. Browser timing and natural-rate gates are open. Agent-verified at focused/Node-fixture scope, not human-reviewed. No commit or push.

Rules: AR1-AR16 (especially AR3, AR9, AR10, AR15), AD36, AD43, AD45; CLR2, CLR3, CLR10, CLR12; LSD138, LSD139, LSD141, LSD143, LSD147. UI patch follows [player UI rules](../../../../../.claude/rules/player-ui.md), UR43/74: desktop 1920×1080 target, visible outcome is a countdown that updates without replacing the focused wait button. Mobile optimization is deferred. No product direction changed.

## Ownership and publication

Owned shared files: `src/wake_queue.js`, `tests/wake_queue.test.js`, this checkpoint and `P2_INTEGRATION.patch`. All are public, name-free code/tests/receipts. No other shared files were edited. No save schema or saved wake times were added. The integration patch contains changes for `src/book_world_lotm_cast_host.js`, `src/book_world_lotm_host.js`, `src/book_world_lotm_ui.js` and two regression tests in `tests/lotm_cast_week.test.js`. Those edits exist only in `/tmp/yairpg-p2-source` and the patch. B1 retains its shared-file ownership; coordinator must reconcile its latest changes before applying.

Source seam: cast domain host via its existing tick/projection registrations. The existing expansion/game clock drives time; `simulation.people[id].location` remains physical location authority. The queue caches derived projection work, never authoritative location or clock state. Core-owner files touched: zero; registration lines: zero; new cycle edges: zero in the candidate architecture check.

## Data probe and Part A

| Input | Expected | Observed | Gate |
| --- | --- | --- | --- |
| Fresh beside natural game-minute real time in headless Chrome | about 0.7 s | unavailable: Chrome aborted before a page opened | OPEN |
| 349-minute wait in headless Chrome | existing about 13 s; target below 3 s | unavailable: same launch failure | OPEN |
| Current private pack population | inspect loaded input, not extrapolate | 36 people, 77 schedule rows, 60 day bindings, 84 beat bindings; once, daily and irregular recurrence | Counts only; 270-person pack not loaded |
| Diagnostic Node fixture wait | 349 game minutes | 349 minutes in 46,639.54 ms | Diagnostic only; fails the 3 s budget in this environment |

Browser attempt: `node -e "require('./scripts/ui_helpers.cjs').launchChrome().then(async b=>{console.log('Chrome launch PASS');await b.close()}).catch(e=>{console.error(e.message);process.exitCode=1})"` failed at launch: `SIGABRT`, cleanup `kill EPERM`. No page, viewport, browser rate or screenshot was measured. No alternate Chrome launch or permission escalation was attempted. Use the existing floor runner from a browser-capable coordinator session; this lane's environment is not a passing browser gate.

Fallback: the existing full-game Node DOM harness, fresh seed/default native life, visible panel enrollment, one `update_timer(1)`, wrappers using `performance.now()` and a nested stack to subtract marked child time. Both samples use the same frozen source baseline apart from P2 candidate changes and the same pack. This is diagnostic CPU attribution, **not Chrome performance or natural time**. One sample before/after is not a stable benchmark. Initial coarse sample: 1,941.15 ms. Detailed before: 2,217.97 ms; detailed candidate: 1,826.88 ms. Independent uninstrumented candidate minute in the final route: 1,818.96 ms.

The table gives exclusive time (unmarked descendants stay charged to the nearest marked owner), so rows can be summed. Inclusive panel publication: 1,375.77 ms before, 1,240.03 ms after. Inclusive cast host tick: 129.96 ms before, 0.29 ms after. Inclusive cast sync: 0.66 ms before, 0.04 ms after. Full native contexts and cross-domain facts dominate, not cast schedules.

| Mark | Before calls | Before self ms | Share of minute | Candidate calls | Candidate self ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| `book_world_lotm_actions.js:lotmFacts` | 996 | 195.51 | 8.81% | 521 | 119.66 |
| `main.js:simulationNativeContexts` | 18 | 813.18 | 36.66% | 16 | 598.68 |
| `simulation_effects.js:simulationFacts` | 673 | 1024.10 | 46.17% | 673 | 944.67 |
| `main.js:campaignContext` | 15 | 2.06 | 0.09% | 14 | 1.57 |
| `main.js:create_save` | 1 | 3.60 | 0.16% | 1 | 2.74 |
| `main.js:renderPublishedDisplays` | 1 | 1.41 | 0.06% | 1 | 0.64 |
| `simulation.js:previewSimulationCommand` | 507 | 9.65 | 0.44% | 507 | 7.76 |
| `cast_schedule.js:whereabouts` | 75 | 0.70 | 0.03% | 7 | 0.17 |
| `book_world_lotm_cast_host.js:syncLotmCast` | 2 | 0.08 | 0.00% | 1 | 0.04 |
| `book_world_lotm_host.js:view` | 1 | 1.73 | 0.08% | 1 | 1.88 |
| `book_world_lotm_ui.js:render` | 1 | 0.38 | 0.02% | 1 | 0.08 |
| `main.js:renderPublicationPanels` | 1 | 51.36 | 2.32% | 1 | 45.75 |
| `main.js:persistExpansion` | 1 | 32.11 | 1.45% | 1 | 27.21 |
| `book_world_lotm_cast_host.js:planLotmCastBeats` | 1 | 0.23 | 0.01% | 1 | 0.19 |
| `book_world_lotm_host.js:tick` | 1 | 0.73 | 0.03% | 1 | 0.10 |
| `main.js:renderClockPanels` | 1 | 3.09 | 0.14% | 1 | 3.36 |
| `main.js:update_timer` | 1 | 77.99 | 3.52% | 1 | 72.34 |

Native NPC work, journal rendering and durable storage writes were not individually instrumented. They remain within the enclosing context, clock, publication and persistence rows; `create_save` is serialization only, not a storage-write measurement. A Chrome CPU profile is still needed to split those requested categories. A queued reader flushed after teardown in the instrumented harness (`document is not defined`); it is recorded as a diagnostic-run gap, not dismissed as a clean browser result. The final uninstrumented route settles before close and records its own errors separately.

## Part B and C

`createWakeQueue()` exposes `register(id, at)`, `cancel(id)`, `size`, `nextWake(now)` and draining `due(now)`. Times are nonnegative safe integer game minutes supplied by the caller. An overdue next wake is `now`; empty is `null`. Indexed heap replacement/removal leaves one pending wake per id. Due order is time then actor id by code-unit order, independent of registration order and locale. A due batch is drained before caller callbacks reschedule. No RNG, timer, domain registration, persistence or world names.

Patch changes:

- Actor projection wakes are derived from schedule starts/ends. Once and daily numeric-minute rows skip work between boundaries. Irregular rows remain unplaced as before; other recurrence/time-band forms fall back to minute evaluation. A rewind, changed epoch or pack load rebuilds derived entries. Every sync still reconciles bodies against the projection, including a body moved outside the scheduler; day-window facts remain current.
- Idle cast ticks skip the expensive context and full-plan copy when neither a location/day-window correction nor a pending beat needs publication. Beat settlement still uses its existing owner and times.
- The measured context builder shares `lotmFacts` within one synchronous call for identical gameplay/native-stock input references. Each output owns its facts object. Different inventory or stock frames remain separate; no cache survives the call.
- Wait labels update on the existing button. Countdown-only label/duration fields are omitted from the structural signature; target times, eligibility, reasons, other view fields and selection still trigger full redraw. The host requotes when clicked. This addresses CO2 at Node DOM scope; desktop actionability is unverified. Projection computation still runs each refresh.

Part A does **not** justify claiming this queue solves CO3: shared facts still run 673 times and preview commands 507 times in one diagnostic minute. Skipping those on the cast actor queue could hide inventory, body, availability or other-world changes. Stop boundary: retain the native clock/transaction/fact semantics rather than suppress these consumers based on cast-only wakes. Proposed next refactor: give repeated context/fact reads an explicit unchanged-input planning frame or dependency-scoped cache, and batch display-only work over a synchronous wait without skipping event settlement; prove equal native outcomes and save bytes before adopting it. No such native refactor is included here.

## Checks and evidence

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/wake_queue.test.js` (shared checkout) | PASS 5/5 | Leaf mechanism only |
| `node --test tests/lotm_cast_week.test.js tests/lotm_be_seat.test.js tests/wake_queue.test.js` (scratch candidate) | PASS 29/29 | Includes new boundary/rewind/reload/body-repair and distinct inventory/native-stock regressions; no full suite |
| `node /tmp/p2-equivalence.mjs` | PASS: 181 boundary/adjacent-minute states match original sync; rewind, epoch change, externally moved body and shared-context equivalence | Private local pack; scratch script, not a shipped test; executed before removing the scratch baseline module |
| `python3 /tmp/p2-instrument-more.py`; `node /tmp/p2-profile.mjs`; `node /tmp/p2-profile-after.mjs` | Diagnostic marks above | Wrappers removed before final build; Node DOM, one sample per detailed input |
| `node /tmp/p2-game-probe.mjs` | See final route receipt below | Full-game Node DOM fixture, not browser or natural pacing |
| `BUILD_OUT=/tmp/yairpg-p2 npm run build` (scratch source) | PASS | Browser bundle built, not exercised in Chrome |
| `npm run check:arch` (shared and scratch candidate) | PASS: main 10089/10115, display 6730/6767, save_files 310/310; 6 grandfathered main imports, 205 cyclic edges | No growth; candidate includes integration patch |
| `node --check` for all three patched runtime files | PASS | Syntax only |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P2_INTEGRATION.patch` | PASS against current shared inputs at check time | Not applied; coordinator must recheck after B1 finishes |
| `node scripts/lane_review.mjs` with each of the four owned paths as both `--grant` and candidate path | PASS: 2 source/test paths, 118 private-name tokens, 0 name hits, 0 top-level awaits, 0 outside grants | Review scoped to owned paths |

Final browser-build SHA-256: `bd7379321b24ef99c7f64c60502130f7e185293878f146b252c5654ad1fb98ed`. The Node harness builds and executes its own bundle, separately identified below. `BUILD_OUT` asset links and private pack links are live, not a portable frozen release. Private pack SHA-256: `f4baca3963e4fd9128933c8540fad738a8781cd6637db4431724a2b60da1eeba`.

Scratch inputs/evidence: `/tmp/yairpg-p2-source`, pristine three-file inputs in `/tmp/yairpg-p2-base`, `/tmp/p2-profile-before.json`, `/tmp/p2-profile-after.json`, `/tmp/p2-game-result.json`, `/tmp/p2-equivalence.log`, `/tmp/p2-focused-final.log`, `/tmp/p2-build-final.log`, `/tmp/p2-arch-candidate.log`. These are local recovery artifacts. No player profile/save was read or changed.

Patch-payload publication review: imported `review({root:"/tmp/yairpg-p2-source", grants:paths, paths})` from `scripts/lane_review.mjs`, with the four patched candidate paths and read-only `GIT_DIR`/`GIT_WORK_TREE` environment settings: PASS, 4 files, 118 private-name tokens, zero name hits, zero top-level awaits, zero outside grants. The first scratch-root review could not find `.git`; providing read-only repository metadata resolved it without initializing or changing a repository. `git apply --check --whitespace=error` and owned-file whitespace/syntax checks pass.

Final route receipt: 349 game minutes in 46639.54 ms; countdown control identity and focus retained; zero recorded page errors; native save/reload and export/import preserve expansion state. Executed headless harness bundle SHA-256: `b013c0fb2266a5d9b8fe6e2e1ec05a6ef09797daebfcf5d35a3ea012341d3d84`. The separately built browser bundle was not exercised. Instrumented teardown warnings above do not occur in this settled final route.

## Remaining gates and known limits (AD45)

The queue leaf is engine ready. Integrated runtime remains below AD43: browser launch failed, no fresh-origin 1920×1080 rebuild journey, no natural-rate proof, no browser save/reload/Export/literal Import, no 270-person pack measurement, and no under-3-second wait. The Node DOM fixture and JSON envelopes do not close those gates. Human review is optional.

Natural play and sleep keep their existing clock driver. Cast projection uses queued boundaries, but `update_timer`, full-domain contexts/facts, native body/work consumers, saves and general panel projections remain on their existing cadence. The wait driver still uses G1 beat boundaries; the queue is not yet the shared time-jump driver for needs or all worlds. Register need thresholds when their owner can derive them, rather than inventing a second need timer. At the second be-seat world (LSD141), lift the cast-host scheduling adapter into a shared consumer of this leaf; keep world data in packs. These limits must remain visible during integration.

Coordinator: review/apply the patch after B1 releases its files, rerun the focused checks against the combined candidate, rebuild, then run the existing fresh-origin floor journey at 1920×1080 with a 3,000 ms wait budget and unchanged natural game-time rate. The coordinator owns the full `npm test` pre-commit gate. P2 does not authorize a commit or push.

P2 ownership released to the coordinator for review/integration. All P2 test/probe commands have exited; no worker or browser was left running.
