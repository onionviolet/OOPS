# P1 baseline and budgets (measurement report, 2026-10-19)

Slice P1 of the [ideaboard scale plan](../IDEABOARD_SCALE_PLAN_2026-10-19.md#5-sequenced-build-order-proposal).
A measurement only: no `src/`, `dist/` or gameplay change. Nothing here is
human-accepted, and budgets in the last section are **proposals** (AD32).

Rules applied ([index](../RULES_INDEX.md)): AD36 (efficient verification: one
bounded matrix, medians and ranges, gaps named), PF1 and PF2 (benchmark harness,
budgets; [considerations](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md)),
AD34 / [UI rules](../UI_RULES.md) viewport targets (1920×1080 primary, 1366×768
floor; mobile deferred), AD22 and the scale plan's DA/E2 trigger (save size),
CX4 (tiered absent-world ticks), AR1 / AR15 (one writer per area; read-only here).

## Input identity

| Item | Value |
|---|---|
| Commit | `d394a229ab5ae449095891b6b765f2dc1e2ba42f` (`codex/gameplay-foundations` tip, fast-forwarded into this worktree; tree clean) |
| Build | `build.js` run in a temp copy of that tree (tracked `dist/` untouched), via `scripts/perf/lib.mjs` `prepareTree` + `build` |
| Bundle | `dist/bundle.js` 5,850,018 bytes, sha256 `249d152d115ff3581a5de05c0403980e15ad371e79b05259607f460a441cc8c4` (in-page version `v0.6-249d152d115f`) |
| Fixtures | committed `tests/fixtures/perf/{fresh,mid,crowded}.json` (synthetic, README there). Fresh = new hero after PLAY (0 enrolled actors). **mid** = clock 10, 4 actors, systems workshop open (an early-mid save; no larger natural save is committed). **crowded** = clock 22, 68 actors, 512 settled claims, every material in the inventory (the "heavy" save) |
| Origin | fresh Playwright context per run, fixture seeded once into `localStorage`, PLAY clicked, 4 s warm-up, then a 15 s idle window |
| Viewports | 1920×1080 and 1366×768, 3 runs per cell, medians quoted, ranges in brackets |
| Host | Apple arm64, 18 cores, Node 22.23.3, Chrome 155.0.8059.85 headless. **Not a quiet host**: 1-min load 4.9 at start, 14.7 at end (other sessions running). Treat browser numbers as upper-ish bounds; Node numbers are steadier |
| Method | Node: `advanceSimulation` one-minute tick, best/median of 15 after 3 warm-ups, plus 60-minute jumps per minute. Browser: CDP `Performance.getMetrics` deltas over the window, game minutes advanced read from the live save clock (the game runs 1 game minute per second here), then per-game-minute = busy% × window ÷ minutes. Render: 40 calls of `window.update_displayed_character_inventory()` (the PLAYTEST:77 method). Save: live `localStorage['save data']` length; `JSON.stringify` and `setItem` probes in page |
| Raw data | measurement scripts, raw JSON and the CPU profile are in the session notes folder (`side-session-notes/…/p1/`), not in the repo. The committed standing equivalent is `node scripts/perf/gate.mjs --base <commit>` (1366×768 only) |

## Results

### Per-tick cost (game minute)

| Fixture | Node engine step, 1 min (best / median) | Node, per minute over 60-min jumps | Browser all-in script ms per game minute, 1920×1080 | 1366×768 |
|---|---|---|---|---|
| fresh | 0.13 / 0.19 ms | 0 ms | 41 [41–45] | 39 [38–47] |
| mid | 2.56 / 2.85 ms | 2.47 ms | 149 [142–150] | 141 [139–141] |
| crowded | 5.37 / 5.65 ms | 3.88 ms | 348 [340–507] | 361 [342–538] |

Browser page load (CDP): task busy 13 / 24 / 53 % (1920) and 12 / 23 / 56 %
(1366) of the window for fresh / mid / crowded; script busy 4 / 15 / 35 % and
4 / 14 / 36 %. Long tasks per 15 s: 0 / 15 / 15 (max single task 0 / 236 / 359 ms
at 1920; 0 / 159 / 664 ms at 1366, crowded range 352–665). One long task per game
minute from mid upward. Storage writes: 60 per minute in every fixture (the
game saves every second).

### Save size and storage

| Fixture | Fixture file (UTF-8 bytes) | Live save after PLAY (chars; UTF-16 bytes) | `JSON.stringify` | `setItem` | Guard use (4 MiB UTF-16) |
|---|---|---|---|---|---|
| fresh | 47,654 | 59,755; 119,510 | 0.1–0.3 ms | 0.1 ms | 2.8 % |
| mid | 60,817 | 73,190; 146,380 | 0.2 ms | 0.1 ms | 3.5 % |
| crowded | 279,175 | 291,086; 582,172 | 0.6–1.2 ms | 0.3–0.6 ms | 13.9 %; 27.8 % with an equal backup |

Written volume at one save per second: 7.0 / 8.6 / 34.1 MB of UTF-16 per wall
minute (fresh / mid / crowded). Node parse of the save: 0.2 / 0.25 / 1.1 ms.

### List and render

| Fixture | Inventory render median (p95) | DOM elements, 1920 / 1366 | Listeners | JS heap, range over runs |
|---|---|---|---|---|
| fresh | 0.0–0.1 ms (0.1) | 6,030 / 6,031 | about 1,730–1,745 | 34–53 MB |
| mid | 0.0–0.1 ms (0.1) | 6,628 / 6,631 | about 1,750–1,783 | 37–59 MB |
| crowded | 1.4–1.5 ms (1.5–1.6); one 1920 run 3.9 (5.1) under load | 11,976 / 11,979 | about 1,750–1,810 | 41–125 MB |

Viewport made no measurable difference: DOM counts match within 3 elements and
the per-minute cost differences sit inside run noise. No page errors in any of
the 18 browser runs.

## Where the browser time goes

One 12 s CPU profile each of mid and crowded at 1366×768 (single run, minified
bundle mapped through its source map, so function attribution is indicative).

- The per-minute cost sits under the game tick (`simulation_clock` timer →
  `update_timer`/`simulateTick`, main.js ~8570–8695) and the publication render
  batch (`renderPublicationPanels` → `simulation_render.js`), not in
  `expansion_engine.js` (14 ms self time across the whole mid window).
- The hot path is the **facts aggregation** `buildSimulationFacts`
  ([simulation_effects.js:126](../../src/simulation_effects.js)): one spread merge over
  more than 30 per-domain fact providers (`worldCompletionFacts`,
  `auditRemainderFacts`, `managementFacts`, nested, paradise, tidemark and so on),
  reached from `previewCommand` while panels render. Under it, `worldCompletionFacts`
  alone is 1,383 ms of 12,159 in crowded. `checkVisibility` from `panel_reveal.js`
  adds 797 ms (crowded).
- Mid: 1,669 ms of 12,155 inside the clock tick (about 139 ms per game minute,
  matching the 141 ms from the matrix). Crowded: 3,879 ms (about 323 ms).

## Verdict on scale plan section 3

| Section 3 claim | Verdict | Evidence |
|---|---|---|
| Tick cost "about 30 ms per game minute fresh; 90–130 developed" | **Confirmed as the all-in browser number** (measured 39–45 / 141–149 / 340–360 ms per game minute); **misattributed** | Pure engine step is 0.13 / 2.6 / 5.4 ms, i.e. 1–3 % of the browser cost |
| Binding limit #4 "active-actor tick cost… whole-world simulation of absent worlds is not affordable" | **Revised.** The engine step for 68 actors is 5 ms per minute and grows far slower than the actor count (4 → 68 actors is 2×), so absent-world actor ticking is cheap on today's engine. The cost that grows is the **player-facing facts and panel pipeline per minute**, and it grows with state size and with the number of installed domain fact providers (40 → 140 → 350 ms) | Node vs browser tables; profile |
| CX4 tiering for absent worlds | **Still sound, but its first target moves.** Tier the facts/panel work (only evaluate visible panels and requested predicates) before tiering actors. The 128-actor Node case was not measured here, so "actors are cheap at 128" is **extrapolated, not measured** | This report |
| Offline catch-up "43 s to over 3 min per day away" | **Probably overstated for pure catch-up** (engine-only 60-minute jumps cost 0–4 ms per minute, so a day is about 0–6 s), **but not measured through the real away path**; if catch-up runs the browser tick path it is 1,440 × 140–350 ms = 3.4–8.4 min | Arithmetic from this report; separate P5 gate needed |
| Save size "Not binding" | **Confirmed, with a correction.** Live fresh save is 59.8 K chars, 2.2× the 27,509 B figure in PLAYTEST:77 (growth since 10-04), crowded 291 K chars (14 % of the guard, 28 % with a backup). Trigger of 1 MB real save not reached; the 4 MiB guard is not near | Save table |
| Storage write volume | **New finding.** The game rewrites the whole save every second: 34 MB per minute of UTF-16 writes on crowded at 0.3–0.6 ms each. Cheap in ms, but it is write amplification that scales linearly with save size | Save table |
| UI list rendering "not binding (14.9 ms p95)" | **Confirmed and improved**: 1.5 ms p95 crowded. DOM nodes now 6.0 K fresh, 12 K crowded (plan said 16–27 K) | Render table |
| Frame budget | **New.** From mid upward every game minute is one 140–660 ms main-thread task (15 long tasks per 15 s), above the PF2 target of no routine task over 50 ms | Long-task counts |
| Human acceptance and agent budget bind first | Not testable by measurement; unchanged | n/a |

Net: the plan's ordering (human acceptance, agent budget, then technical) holds,
but its stated binding technical limit should read **"per-minute facts and panel
cost, rising with installed domains and state size"**, not "actor tick cost".
This sharpens P5: its done-check "tier-3 tick under the P1 target" needs a
target on the browser per-minute cost, not the engine step.

## Gaps (AD36: labelled, not claimed)

- Host was loaded (load 5 → 15); crowded runs showed outliers (507 and 538 ms
  per minute). Rerun on a quiet host before ratcheting any budget.
- One CPU profile per fixture; attribution is indicative. No profile of fresh.
- Fixtures are synthetic. "Mid" is an early-mid save (clock 10). No real
  late-game or multi-world save exists to measure. The 32 / 128-actor synthetic
  saves from the hotspot audit were not re-run.
- Not measured: the real offline-away catch-up path, 1920×1080 paint/input p95,
  Export size, import time, startup (`scripts/perf/startup.mjs` covers it),
  mobile, long-session leak growth, active combat.
- `npm run build` was not run in this worktree (it writes tracked `dist/`); the
  same `build.js` ran in a temp copy.

## Proposed budgets (proposal, not accepted)

For Weibao's review, set at roughly max observed × 1.25 and then ratcheted by
the lane that improves them (per [perf README](../../scripts/perf/README.md)):

| Metric | Fresh | Mid | Crowded |
|---|---|---|---|
| Browser script ms per game minute | 60 | 190 | 450 |
| Longest routine task ms (PF2 target is 50) | 50 | 300 | 450 |
| Live save UTF-16 bytes | 150 KB | 190 KB | 750 KB |
| Node engine step ms per minute | 1 | 4 | 8 |

The facts-and-panel path is the first candidate for a performance lane
(evaluate only visible panels and requested predicates); that is a suggestion
for the P5 owner, not a task started here.
