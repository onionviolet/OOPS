# Browser testing and engine performance audit, 2026-10-14

Audit of automated Chrome checks and idle engine cost, followed on Weibao's
same-day direction ("lets just work on foundational engine stuff that would
make runs use less cpu, run faster") by three engine fixes on branch
`claude/engine-perf` (worktree `.claude/worktrees/engine-perf`). The fixes are
uncommitted. Raw results and reusable tools live in
[the dispatch folder](../gm/dispatch/engine-perf-2026-10-14/).

Builds on the [runtime hotspot audit](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md)
(ER1, source-read and Node timings under load 695) and the
[engine considerations](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md)
PF1-PF8. This pass adds browser CPU profiles, call counts and before/after
measurements.

## Verification states

| State | Result |
| --- | --- |
| Source edit | 3 files, +42/-6 lines, worktree only |
| Engine tests | Full `node --test` 1435 tests: 1432 pass, 0 fail, 3 todo; base commit identical |
| Browser evidence | Rebuilt bundle, fresh origin, 1366×768 headless Chrome 155: idle profile A/B ×3, renderer metrics A/B, `systems_workshop_browser.cjs` 10/10 cases both builds, scratch backlog check identical visible state both builds |
| Native gameplay | Systems workshop native route only. Village check could not start (see T6) |
| Persistence | Save format unchanged. Workshop check covers save/reload/import on the after build |
| Human acceptance | None. Committed: no. Deployed: no |

## Measurement setup

- Host: Apple M5 Pro, 18 cores, 64 GB, macOS. Chrome 155 headless via
  Playwright 1.62.1 from the Codex runtime path.
- Before and after builds come from the same commit `7f8b8567`, each built with
  esbuild into its own directory and served on its own private port
  (18978/18979). Fresh `newContext` per run.
- Workload: fresh game, PLAY, then idle. This is the cheapest state, so any
  per-tick cost here is overhead that every check and every player pays.
- Load caveat: the first runs saw load average 230-430 from concurrent Codex
  lanes. The final A/B ran at load 6-30. Contended numbers are labeled.

## What the automated browsers cost (A1, A4)

- **T1 MEASURED.** 10-minute sample at 5 s intervals: automated (Playwright)
  Chrome averaged **424% CPU (about 4.2 cores), peak 912%**, with about 15
  renderers. Personal Chrome had 50 renderers and averaged 22%. Renderer count
  does not predict cost; what the pages do does.
  [Samples](../gm/dispatch/engine-perf-2026-10-14/results/chrome-samples-10min.log).
- **T2 MEASURED.** One idle fresh game page kept **12-14% of a core** busy before
  the fixes (quiet host), 27-41% under contention. Each automated check page
  pays this for its whole runtime, on top of its own work.
- **T3 MEASURED.** Phase cost on a quiet host: launch 0.23 s, new page 0.14 s,
  load 0.28 s, PLAY to first save 1.9 s, screenshot 0.05-0.07 s, browser close
  0.15 s. Under load 400 the same phases took 3.0 s, 2.1 s, 1.4 s, 3.5 s and
  **14.9 s to close**. Launch and teardown are cheap; contention, not
  fresh-browser isolation, makes them slow. Browser reuse is not worth its
  isolation risk.
- **T4 MEASURED.** esbuild bundle takes 0.8 s, Ink check 3.7 s wall. The rebuilt
  bundle was byte-identical to tracked `dist/bundle.js`. Repeated builds are not a
  bottleneck.

## Harness findings (A1, A2, A5)

- **T5 MEASURED, correction needed.** `absorb-all/FINAL_GATE.sh` leaks its
  servers. `serve()` adds to `PIDS` inside `group(){ ( ... ) & }` subshells, so
  the `EXIT` trap's array never sees them. Eight `http.server` processes on
  18701-18706, 18840 and 18901 (cwd `yair-absorb-all-20261014/integration`)
  were still running, reparented to launchd, 55 minutes later. `serve()` also
  runs `lsof -ti:$port | xargs kill`, which kills any other run's server on the
  same fixed port. Fix: write PIDs to a file per group or use `kill 0` on the
  process group, and allocate free ports instead of killing occupants.
  Accept when no gate-started server outlives the gate and two concurrent
  gates both pass.
- **T6 MEASURED.** Browser executable choice is inconsistent. Some scripts pin
  system Chrome (`systems_workshop_browser.cjs`). Others use Playwright's
  bundled Chromium, which is not installed (`village_browser.cjs` fails at launch
  on both builds). One shared launcher in `scripts/ui_helpers.cjs` with a
  `finally` close would fix both this and T8.
- **T7 MEASURED.** The dominant wait idiom costs CPU. 83 `waitForFunction`
  calls in `scripts/`, none set `polling`, so they run every animation frame,
  and most of them `JSON.parse` the full save. With the predicate active,
  renderer script time rose 0.53 → 0.81 s per 15 s (+50%) at the default rAF
  polling, against 0.50 s at `polling:250`. 33 fixed `waitForTimeout` sleeps
  (mostly 1.1-1.2 s, up to 6.5 s) add wall time.
- **T8 READ.** 10 of 31 `*_browser.cjs` scripts have no `finally`, so a thrown
  assertion can leave Chrome running until Node exits.
- **T9 MEASURED.** Concurrent full suites. At 18:19, four `node --test` full
  suites ran at once, two with no concurrency cap (default
  `availableParallelism-1` = 17 workers). Every lane prompt requires a full
  `npm test`. The suite takes 52 s with 4 workers on a quiet host. A shared
  queue (one full suite at a time, focused slices per lane) would cut peak load.
  HYPOTHESIS on the size of the win.
- **T10 READ.** `scripts/engine_profile.cjs` and `scripts/scheduler_profile.mjs`
  default to seed saves under `/tmp` and an old Codex visualization path. Both
  are missing, so neither runs as-is. They need committed synthetic fixtures (PF1).
- **T11 READ.** Fresh origins already come from `browser.newContext()`. A new
  port per run is not needed for storage freshness, only to avoid two servers
  sharing one port.

## Engine findings (A3)

CPU profile of an idle fresh game, mapped back through the source map
([before](../gm/dispatch/engine-perf-2026-10-14/results/profile-before1.txt)):
about 90% of JS time runs under the per-minute timer, and 81% inside
`persistExpansion` (`src/main.js`). Precise-coverage call counts show the
publication pass rebuilding the same contexts again and again.

| Code | Hotspot (before) | Evidence |
| --- | --- | --- |
| E1 | `retiredKey` in `src/save_compatibility.js` throws and catches a `JSON.parse` error on every plain key of every save walk | 21-23% of idle JS time. Confirms ER1-F2 |
| E2 | Backlog panel render runs a full staged `prepare` + `enrollSimulation` for every action, every tick, even while the panel is hidden | 30% of idle JS time |
| E3 | Context fan-out: per tick `worldCompletionFacts` ×98, `expeditionContext` ×89, `simulationNativeContexts` ×72, `campaignContext` ×30, `featureWaveContext` ×20, for one `persistExpansion` | Coverage call counts over 10 ticks |
| E4 | Full save envelope written about once per second (1.7 MB of UTF-16 per 15 s) while the expansion clock stays 0 | `setItem` counter. Unchanged by these fixes |
| E5 | About 70 layouts and 170 style recalcs per second while idle; DOM swings 11k-27k nodes under load | CDP metrics. Matches ER1-F5 (250 ms workspace poll) |

### Fixes applied (uncommitted, worktree)

1. **E1.** `retiredKey` parses only keys whose first non-whitespace character is
   `{`. Results are cached in a bounded `Map` (cleared at 50k keys). The
   behavior is exact: a non-object JSON value has no `id`, so it could never
   match a retired id.
2. **E2.** A hidden backlog panel skips its per-action previews. The render that
   reveals the panel computes them before anything is visible. Focus fallback
   for a hidden panel is unchanged.
3. **E3.** A read frame around the publication render batch in
   `persistExpansion`. Inside it, `expeditionContext`, `simulationNativeContexts`,
   `campaignContext` and `featureWaveContext` build once. Every caller still gets
   its own copy of the top level and `facts`. The frame drops reuse the moment
   `expansionState` changes, and outside the batch nothing is cached. A grep found
   no `src/` consumer writing into a context's `gameplay`, `vitals`,
   `equipment`, `external` or `facts`.

### Result (quiet host, same commit, fresh origin)

| Idle fresh game, per 15 s | Before | After |
| --- | --- | --- |
| Renderer main-thread busy | 12.0-13.6% | 7.3-8.4% |
| Script time | 1315-1493 ms | 531-557 ms |
| Profiled JS-busy (two pairs) | 2237 / 1561 ms | 611 / 545 ms |
| Long tasks over 50 ms | 14 | 0 |
| Layouts / storage writes | ~1035 / 15 | ~1095 / 15 (unchanged) |
| Page errors | 0 | 0 |

Under load 230 the first fix pair alone cut JS-busy 4104 → 2835 ms.
Systems workshop native check: 10/10 both builds, 88 s → 84 s wall (one run
each, within noise).

## Ranked next improvements

| Rank | Change | Benefit | Correctness risk | Effort | Acceptance check |
| --- | --- | --- | --- | --- | --- |
| 1 | **Merge E1-E3** after review | MEASURED about 60% less idle script time, long tasks 14 → 0 | Low. Exact key logic; frame scoped to read-only renders | Done; merge only | Full suite + workshop check on the merged tree; `tools/baseline.cjs` idle script time at most 0.6× base |
| 2 | **Shared launcher and wait helper** (T6, T7, T8): system Chrome, `finally` close, `waitForSave(pred)` with `polling:250` reading one parsed save | MEASURED −35% page script time during waits; no leaked browsers | Low (test-only) | Small, then migrate scripts as lanes touch them | Village check launches; injected throw leaves no Chrome child |
| 3 | **Gate hygiene** (T5, T9): PID tracking per group, free-port allocation, one full-suite slot at a time | Removes orphan servers and cross-run kills. Load reduction is HYPOTHESIS | Low | Small | No gate server outlives its gate; two gates in parallel pass |
| 4 | **Skip unchanged durable writes** (E4): no full envelope write when the serialized plan equals the last durable write | HYPOTHESIS: most of the remaining per-tick validate/stringify/`setItem` | Medium. Needs ER1-F1's recovery decision (crash-loss window) | Medium | Idle `storageWrites` near 0 with unchanged clock; reload after kill restores the same state |
| 5 | **Layout churn** (E5): workspace update only on layout/eligibility change (ER1-F5) | HYPOTHESIS: most of 70 layouts/s idle | Low-medium (focus, scroll) | Small-medium | Idle layouts/s down ≥5×; panel focus and scroll survive ticks |

Also useful, lower priority: extend the read frame to `backlogContext` and the
250 ms poll batch; virtualize or key the visible backlog previews (still
expensive once the panel is open); committed synthetic fixtures for the
profile scripts (T10, PF1); a URL-flag perf overlay (PF3) built from
`tools/baseline.cjs` metrics.

## More to consider: deeper pass, 2026-10-14 evening

Requested follow-up ("further and deeper improvements?"). Same builds and
ports, quiet host (load 6-8). Fixture: the developed save from the workshop
check (clock 81, 4 people, 97 KB), loaded into a fresh origin.

### New measurements

- **M1 MEASURED. A developed save costs about 3× a fresh one, and the first
  fixes barely touch it.** Idle JS-busy was 10.2 s per 27 s (about 37% of a
  core) before and 8.7 s after (−14%). The cost moves from saving to previews.
  Per tick: **300 `previewSimulationCommand`** and **about 450
  `simulationFacts`** calls for one `persistExpansion`. `simulationFacts` is
  74% of JS time and `previewSimulationCommand` 64% (inclusive). Callers are
  `refinementPresentation`, `featureWavePresentation`, nested and Tidemark
  previews, known routes and the systems workshop. Each panel dry-runs every
  command each tick to set button state, and `simulationFacts` (which takes
  no command id) is rebuilt for every one.
  [Profiles](../gm/dispatch/engine-perf-2026-10-14/results/).
- **M2 MEASURED. Determinism holds.** Starting from the developed save, after
  exactly 20 game minutes (expansion clock 81 → 101) the durable save matches
  byte for byte between builds, minus `saved_at` and `total_playtime`. Stream
  cursors and RNG state are included. No page errors.
  (`tools/det.cjs <url> <save.json> <out.json> <minutes>`.)
- **M3 MEASURED. Merge path.** The `src` patch applies cleanly onto
  `absorb-all/integration` (`git apply --check -3`). That branch adds an
  overlapping seam: `src/simulation_render.js` (sim-stepper lane, `1806ec91`,
  `67c7f15c`) memoizes `retiredKey` and coalesces renders only inside dev-stepping
  batches. It complements, and does not replace, the always-on fast path
  and read frame.

### ACCOUNT FOR NOW

- **AF1. Merge order.** Merge integration first (merge-before-dispatch), then
  rebase `claude/engine-perf`. Put the fast path inside integration's
  `classifyRetiredKey` and keep one cache owner, not two.
- **AF2. One frame seam.** `withReadFrame` (`main.js`) and
  `begin/endSimulationRenderBatch` (`simulation_render.js`) both mean "one pass
  over an unchanged world". Converge them in `simulation_render.js` before a
  third copy appears. The publication frame and dev-stepping batch would then
  share builder reuse and render coalescing.
- **AF3. Accept on developed saves.** Fresh-game numbers flatter any change.
  Performance acceptance needs a developed fixture and `det.cjs`
  byte-identity, besides the fresh baseline.

### LATER / DELEGATE, ranked by measured share

| Rank | Idea | Evidence / status | Risk | Done check |
| --- | --- | --- | --- | --- |
| D1 | **Preview fan-out.** (a) Within a frame, reuse `simulationFacts` per (state, actor, target, context version). Callers build fresh `{...context}` objects, so key on a frame-issued context version, not identity. (b) Skip previews for panels that are hidden or inside closed `<details>`, generalizing the backlog fix. (c) Recompute previews only when `state.sequence`, clock or a native version counter changes | MEASURED 64-74% of developed idle. Gain HYPOTHESIS: well over half | Medium: facts must stay pure; closed summaries must not show stale counts | Developed-save idle JS-busy ≤ 0.4× after-build; `det.cjs` identical; workshop 10/10 |
| D2 | **Adopt the sim-stepper dev tick in browser checks** instead of waiting one wall second per game minute | READ: exists on integration. Checks spend most wall time waiting on game minutes at about 0.4 cores each. Gain HYPOTHESIS: large wall-time and CPU-time cut per check | Low for checks that claim mechanics. Natural-pace evidence stays a separate label | Same check, same assertions, wall time ≤ 0.3× |
| D3 | Skip unchanged durable writes (E4) | Needs ER1-F1 recovery decision | Medium | As rank 4 above |
| D4 | **Background-tab cost.** The minute timer runs through a Worker (`w.onmessage`), so browsers do not throttle it. A backgrounded play tab on a developed save keeps paying about 37% of a core. Pause-and-catch-up (RT8, PF7) or a render-skip while `document.hidden` (simulation continues, DOM work stops) | READ + M1 inference | Low for render-skip; catch-up needs RT8's exact-remainder rule | Hidden-tab JS-busy ≤ 0.2× visible; reveal shows the current state |
| D5 | **Long-session scaling** with the dev stepper: profile at clock 10k/100k (claims, causes, receipts, logs) plus offline catch-up wall time and yielding (ER1-F9) | Not measured | n/a | Table of tick ms vs clock; no long task during catch-up |
| D6 | **Standing perf gate**: committed synthetic fresh/mid/crowded saves (T10, PF1), `baseline.cjs` + `det.cjs` with budgets (PF2), URL-flag overlay (PF3) | Tools exist here; fixtures do not | Low | One command prints budget pass/fail per fixture |

Angles that did not change the decision: renderer count and Chrome flags (T1),
browser reuse (T3), build speed (T4), `retiredKey` cache bound (50k string
keys).

## Leave-alone list

- Fewer renderers, `--single-process` or disabled site isolation: T1 shows
  count is not the cost.
- Browser reuse across checks: launch costs 0.23 s; isolation is worth more.
- Headed vs headless: all automated runs are already headless.

## Reusable tools

In [tools/](../gm/dispatch/engine-perf-2026-10-14/tools/), all read-only:

- `baseline.cjs <url> <out.json> [sec]`: phase timings, CDP renderer metrics per window, storage write counter, rAF vs 250 ms polling.
- `profile.cjs` + `mapprof.cjs`: idle CPU profile mapped to `src/` file and function.
- `calls.cjs`: precise-coverage call counts per source function.
- `backlog_check.cjs`: visible backlog state through the native elder greeting.
- `sample.sh`: personal vs automated Chrome CPU and renderer sampler.

## AF1 + AF2 result, 2026-10-14 night

Branch `claude/engine-perf-core-5a93e1`, rebased onto `absorb-all/integration`
`6e5f190f`. Interleaved A/B against that tip's build, host load 22-29, so read
the ratios, not the absolute times. [Raw results](../gm/dispatch/engine-perf-2026-10-14/results/)
(`af12-*`).

- **AF1 done.** The fast path now lives in `classifyRetiredKey`; the always-on
  `Map` is gone and integration's batch memo is the only cache. MEASURED on the
  developed fixture (3734 keys, 19 start with `{`): one save walk costs 19.7 ms
  without the fast path, 0.67 ms with it and no cache, 0.77 ms with the `Map`,
  0.69 ms with the batch memo. The fast path is the whole win; a second cache
  adds nothing.
- **AF2 done.** `simulation_render.js` owns the frame: `withSimulationFrame(key, run)`
  and `framedSimulationRead(key, name, build, copy)`. `persistExpansion` opens
  one per publication, and `endSimulationRenderBatch(expansionState)` flushes the
  dev-stepping batch's coalesced renders inside one, so both paths share builder
  reuse. Rules unchanged: one build per pass, a copy per caller, reuse ends when
  the key (expansion state identity) changes; nested frames restore the outer one.
  The frame wraps renders only, never ticks, because gameplay mutates
  non-expansion state (body, activity) between reads of the same expansion state.
- **Checks.** Full suite 1706 tests, 1703 pass, 0 fail, 3 todo (tip: 1702 /
  1699 / 0 / 3; +4 frame tests). Systems workshop browser 10/10 on both builds.
  `det.cjs` 20 game minutes from the workshop's `natural-final-save.json`
  (clock 66 → 86): durable save byte-identical to the tip build, two reps.
- **Idle JS-busy, tip → branch.** Fresh, per 15 s: 2.09 / 1.67 s → 0.62 / 0.58 s
  (about −68%). Developed, per 20 game minutes (about 30 s): 14.6 / 16.2 s →
  12.2 / 12.9 s (about −20%). `simulationFacts` is now 74.5% of developed
  JS-busy, so D1 (preview fan-out) is next and can build on `framedSimulationRead`.

## D1 result, 2026-10-14 night

Branch `claude/engine-perf-d1` (commit `5855d076`) on `claude/engine-perf-core-5a93e1`
`951792ba`. Interleaved A/B against `951792ba`'s build, fixture: the AF1+AF2
developed save (workshop `natural-final-save.json`, clock 66). Host load 10-25
for the developed A/B, spikes to 95-335 during later checks.
[Raw results](../gm/dispatch/engine-perf-2026-10-14/results/) (`d1-*`).

- **D1a done.** `simulationFacts` inside a publication frame goes through
  `framedSimulationFacts` (`src/simulation_render.js`). Reuse needs the frame's
  own state (identity), the same `sequence`, `clock` and registry, the same
  actor and target, and a context that matches field by field two levels deep
  against a snapshot taken at build time. Context identity is never the key.
  Each caller gets a shallow copy; no fact value is an object (checked on the
  fixture), so that copy is complete. Plan copies inside previews have other
  identities and always build. MEASURED purity: an instrumented build rebuilt
  on every hit and compared JSON, 3707 hits, 198 misses, 0 mismatches.
- **D1b done.** `src/panel_reveal.js`: a panel whose container is not rendered,
  or whose `<details>` body is closed, skips its previews and re-renders in the
  MutationObserver microtask after the DOM change that reveals it (before
  paint). Applied to Known routes (container), the feature panel (container),
  the systems workshop (closed panel and its closed "later" group) and the
  backlog panel (closed or container, on top of its hidden skip). Summaries are
  static text; the feature panel and Known routes still compute while closed but
  shown, because their own `hidden` depends on the full presentation.
- **D1c not done.** (a)+(b) met the target without it.
- **Calls per idle tick, base → head.** `simulationFacts` 447 builds → 241
  calls with 36 builds. `previewSimulationCommand` 300 → 192. Nested previews
  132 → 66, Tidemark 42 → 21, `refinementPresentation` 2 → 1.
- **Developed idle JS-busy per 20 game minutes, base → head.** Rep 1: 10.64 →
  3.78 s (0.36×). Rep 2: 9.11 → 3.29 s (0.36×). (a) alone measured 0.53×.
- **Fresh idle JS-busy per 15 s, base → head.** 0.55 → 0.39 s; 0.84 → 0.55 s
  (head rep 2 under load 95). Not worse.
- **det.** 20 game minutes from the fixture (minute 1986 → 2006, clock 86):
  durable save byte-identical to base, two reps.
- **Checks.** Full suite 1710 tests, 1707 pass, 0 fail, 3 todo (base 1706 /
  1703 / 0 / 3; +4 tests: framed facts reuse and rebuild rules, real facts
  equality and isolation, observer reveal). Harness-branch systems workshop
  browser check 10/10 on head (dev-stepped; its summary clicks exercise the
  reveal path), village check passes. Perf gate (`claude/engine-perf-gate-853189`,
  `--base 951792ba`): PASS on fresh, mid and crowded, det identical on all
  three; load 206 during the run, so its browser numbers are flagged unreliable.
- **Acceptance backlog.** Container reveal through the workspace (a Known
  routes module discovered or moved out of a hidden dock) is unit-tested only,
  not exercised in a browser. The remaining developed cost is the feature
  panel's closed-but-shown presentation and dry-run facts on plan copies
  (`applySimulationEffects`). D4 and D3 can start on these files now.

## D4 result, 2026-10-14 night

Branch `claude/wave-a-loop-53c42e` on `claude/engine-perf-wave` `7504a1e4`.
Interleaved A/B against `7504a1e4`'s build on the developed fixture (workshop
`natural-final-save.json`, clock 66). Host load 226-422 during the A/B, so read
ratios, not absolute times. [Raw results](../gm/dispatch/engine-perf-2026-10-14/results/) (`d4-*`).

- **Seam.** `deferWhileHidden(key, refresh)` in `src/simulation_render.js`. While
  `document.hidden`, a display refresh is remembered (latest per key) instead of
  run. The `visibilitychange` that reveals the document runs each one once, in
  that task, before the first visible frame paints.
- **What waits while hidden** (`src/main.js`): the publication render batch
  (`renderPublicationPanels`, still inside one frame), the publication's own
  display refreshes (time, vitals, inventory, storage stamps, item log, world
  identity), the per-tick panel list, the clock panels `update_timer` repeats
  after each joined-clock publication, the panels after each durable save, the
  export reward button, effect and temperature displays, and the 250 ms, 500 ms
  and 1 s display polls in `main.js`.
- **What still runs:** ticks, simulation, staging, durable saves, log messages,
  title announcements, `refreshCustomization` (gameplay reads its
  `data-effects` attribute), and the structured pack panel's 250 ms poll
  (it dispatches repeated work, so it is gameplay).
- **Headless caveat.** Headless Chrome never reports a background tab as
  hidden, so the checks override `document.hidden`/`visibilityState` in an init
  script and fire a real `visibilitychange`. A real hidden tab also stops rAF,
  so it can only cost less.
- **Hidden vs visible, head build, per 20 s window:**

  | Rep | Visible task busy | Hidden task busy | Ratio per wall second | Ratio per tick | Long tasks visible → hidden |
  | --- | --- | --- | --- | --- | --- |
  | 1 | 25.2% | 6.7% | 0.27× | 0.22× | 17 → 4 (max 62 ms) |
  | 2 | 29.5% | 4.9% | 0.17× | 0.14× | 17 → 0 |

  The hidden page runs about 25% more ticks per window (63 vs 51 durable
  writes per minute), because visible long tasks delay the next tick; per tick
  is the fairer engine ratio. Base build hidden: 26.0% and 23.7% (no change).
  **Target ≤ 0.2× met in rep 2 only.** The rest is gameplay staging: context
  builds in `persistExpansion` and `advanceChroniclePlan` (about 45% of hidden
  JS-busy) plus two polls outside this lane's files (below).
- **Reveal.** 30 deterministic ticks (`advanceTicks(30,{render:true})`) on an
  always-visible page and on a hidden page, then reveal: `#main_content` text
  stale before the reveal, identical line for line to the visible page right
  after it, saves identical. Rendered stepping cost 8.1 s visible vs 1.2 s hidden.
- **det.** 20 game minutes natural ticks, base visible vs head hidden (minute
  1986 → 2006, clock 86): byte-identical.
- **Checks.** Full suite 1724 tests, 1721 pass, 0 fail, 3 todo (+3 hidden-seam
  tests). Systems workshop browser 10/10 (dev-stepped, 38 s). Perf gate
  `--base 7504a1e4`: PASS on fresh, mid and crowded, det identical on all three
  (load 115-265, browser numbers flagged unreliable).
- **Patch proposals, not this lane's files.** `src/workspace_views.js` runs its
  250 ms render (`updateWorkspace`) while hidden: about 7% of hidden JS-busy.
  `src/structured_pack_ui.js` reads the full structured projection every 250 ms
  even with no repetition pending: about 10%. Both could skip while
  `documentHidden()` and re-render on reveal (`deferWhileHidden`), the pack
  panel only when no repetition is active.
- **Acceptance backlog.** A real background tab in headed Chrome (rAF and timer
  throttling on top of the skip) was not exercised.

## D3 result, 2026-10-14 night

Commit after D4 `35dbab0d` on the same branch. A/B against `35dbab0d`'s build,
developed fixture, load 27-37. [Raw results](../gm/dispatch/engine-perf-2026-10-14/results/) (`d3-*`).

- **Compatibility decision (ER1-F1 recovery window).** A durable write is skipped
  only when the new save equals the bytes this tab last stored under that key,
  except `saved_at` and `total_playtime`, and the key still holds exactly those
  bytes. A crash can lose at most those two counters, never game state.
  `saved_at` is a display date string and no code derives offline time from
  it, so stale counters cannot grant time. Save format unchanged; no migration.
- **Mechanism.** `createDurableSaveWriter` and `serializeDurableSave` in
  `src/save_files.js`. One `JSON.stringify` with marker counters gives both the
  stored bytes (markers replaced, byte-identical to a plain stringify) and the
  counter-free body the skip compares. `lifeSaveStorage.setItem` uses it on the
  plain localStorage path; every publication step after the write (life record,
  village career, panels, `onDurable`) still runs, so atomic publication is
  unchanged.
- **Always written:** any other difference, explicit save (`saveProgress`),
  export (`save_to_file`), and a flush of skipped counters on `pagehide`,
  `beforeunload` and `visibilitychange` to hidden. The flush never writes when
  the tab cannot save (ownership lost, import probe, failed save, storage full)
  or when anything else wrote the key since, so an import before reload is
  never overwritten. A failed write throws as before and leaves no skip or
  flush state. The native-authority path writes as before and resets the writer.
  Web Lock ownership and import/reload code are untouched.
- **Measured effect: about zero in play.** Every durable write on the fresh,
  mid, crowded and developed fixtures carries real state: calendar minute,
  expansion clock, Breathing XP and controller due times change each minute.
  Even the 60 s autosave is real: the tick's durable write happens mid-tick and
  the tick then adds Breathing XP, so the autosave carries that XP. Head and base
  both wrote 121 times for 120 stepped ticks; natural idle writes per minute
  were equal in the A/B (51-57 both builds). The skip fires only while the
  clock is paused (manual chronicle, waiting choice, backlog pause, ended life),
  where the autosave repeats unchanged state once a minute. **"Idle writes near
  0 on an unchanged fresh game" is not met:** a fresh game is not unchanged.
  E4's premise ("expansion clock stays 0") predates the joined clock. The real
  write cost lever is ER1-F1's per-tick durable transaction, which stays a
  separate recovery decision.
- **Persistence checks, fresh origin, 1366x768** (`d3check.mjs`, head and base):
  stored bytes equal live state minus counters; kill (stored bytes at that
  moment, no flush, loaded in a new origin) restores identical state; two
  explicit saves write twice; export through `#save_to_file_button` then import
  through `#saved_file_input` restores identical state; no page errors. The
  workshop check's SYS-R08 also covers save/reload and literal-file import.
- **Other checks.** det 20 game minutes visible (minute 1986 → 2006, clock 86):
  byte-identical to D4. Full suite 1730 tests, 1727 pass, 0 fail, 3 todo (+6
  writer tests). Systems workshop browser 10/10 (dev-stepped, 28 s). Idle A/B at
  load 13-20: task busy 12.8/13.1% (D4) vs 13.0/13.1% (D3), 57 writes per minute
  both. Perf gate `--base 35dbab0d`: det identical on fresh, mid and crowded;
  FAIL on `storageKBPerMin` for mid (7943 vs ceiling 7700) and crowded (29507 vs
  25500) only. KB per write is unchanged from the D4 gate (141.8 and 567 KB); the
  quieter host (load 25-78 vs 115-265) ticked more often (56 vs 52 and 52 vs 44
  writes per minute). That is a budget set on a loaded host, not a regression;
  the gate lane owns `budgets.json`.
- **Caught on the way.** The first wiring captured `localStorage` at module load;
  the alloy equipment fixture swaps the global storage after import, so its test
  failed. The writer now takes a storage getter, as the direct calls did.
