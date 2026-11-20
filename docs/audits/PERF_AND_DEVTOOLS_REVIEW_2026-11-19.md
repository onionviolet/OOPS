# Performance and development tools review, 2026-11-19

Weibao asked for overall performance and development tool improvements. This
review measures HEAD (`96b0b8d04`), compares it with the
[architecture and save review](ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md)
of November 15, and ranks next steps. Findings and options are proposals, not
accepted decisions. Agent-measured, not human-reviewed. No source changed.

## Short answer

The crowded idle main thread is saturated at HEAD: task busy rose from about
73% on November 15 to 100% on a quiet host, with JS time flat, so the new cost
is style and layout (F10). Idle CPU goes to display work, not to the game or
the save. On the crowded fixture, `renderPublicationPanels` under each commit takes 16% of the
profile. The save itself takes about 3%. Visibility checks are back to 10%
because new panels added their own (F1, F2). The best dev-tool gain is headless
stepping. A game day costs about 96 CPU seconds in a lead life, so a week
step overruns the MCP's 300 s timeout. Span mode exists but `game_step` does not
use it (F6). Before starting anything new, land the perf work already sitting
uncommitted (A1).

**Round 2 outcome (same day):** the saturation was one self-feeding loop in
`src/ui/feel_finish.js`, found by bisection and fixed. Fresh idle task busy is
70% → 23-25%, crowded 101% → 68-71%. `game_step` now finishes week steps.
Both sit on branch `claude/perf-devtools-1119`, not yet merged. See round 2
below.

## Method and receipts

- `node scripts/perf/save_probe.mjs --rev HEAD --fixtures fresh,crowded --profile`:
  unminified temp build with the CPU profiler attached, host load about 15 on
  18 cores. Profiling inflates busy percentages, so the profile is used for
  shares, not for absolute busy figures. Summary:
  [evidence/perf-devtools-2026-11-19/profile_probe.json](evidence/perf-devtools-2026-11-19/profile_probe.json).
- An unprofiled crowded comparison, HEAD against `e44e565f6` (the November 15
  probe commit), alternating twice. See the comparison section.
- Test timings: the reporter's per-run files under
  `$TMPDIR/yairpg-test-durations/`, eight recent full runs.
- Headless stepping: [HEADLESS_STEP_SPEED_2026-11-18](../tools/HEADLESS_STEP_SPEED_2026-11-18.md).
- Nothing in `dist/` or `index.html` was left changed. A plain `npm run build`
  in the primary checkout rewrote them to match other lanes' uncommitted CSS,
  and they were restored to HEAD at once (F8).

## Findings

| Code | Finding | Evidence |
| --- | --- | --- |
| F1 | **Display work under each commit is the largest idle cost.** In the crowded profile, `persistExpansion` is 22% inclusive. Of that, `renderPublicationPanels` (through `withFactsFrame` and `withSimulationFrame`) is 16.1%, native contexts 2.2%, and envelope validation plus write about 2%. `create_save` is 0.2%. A manual save costs 39 ms crowded and 12.6 ms fresh, at 60 durable writes a minute. Save storage is not the bottleneck. | profile JSON; `src/main.js:2011` |
| F2 | **`checkVisibility` is 10% self time again** (crowded). It is called 33 times across 24 files. The November 15 display gate cut it to 0.3% for two panels, but `src/display_gate.js` and its adopters are still uncommitted, and newer panels (`ready_hub`, `pinned_band`, `status_line`, `inspector`, `stock_view_ui` and others) each check for themselves. | `git grep checkVisibility HEAD -- src` |
| F3 | **UI pollers keep growing**: 50 `setInterval` calls in 34 files, up from 40 in 32 four days ago. AR23 (proposal, "display work follows change") is not yet a rule, so nothing stops a new panel from adding its own clock. | grep |
| F4 | **The crowded DOM has 115k nodes** at idle, compared with 48k to 80k on November 15. Hidden panels stay mounted, and every style pass walks them. | probe `domNodes` |
| F5 | **Facts for every world build on each render**: world-completion bridge and normalized facts, simulation native contexts, simulation facts and command projection total about 9% self time. That cost grows with each world added (F13 of the Nov 15 review, unchanged). | profile top self |
| F6 | **Headless stepping is the dev-tool bottleneck.** After the Nov 18 work Tingen runs at about 15 game minutes per CPU second, so one game day costs about 96 s and seven days about 11 min. `OP_TIMEOUT_MS` is 300 s. Five of the last fourteen `game_mcp_limits` rows are step timeouts or step failures. `advanceGame` takes `span: true` (about 3x, labelled not RT8-equivalent, and not usable in the Village), but `game_step` does not pass it, at HEAD or in the in-flight MCP edit, which raises the day cap to 400 without making the step faster. | `scripts/headless/advance.mjs:25`, `scripts/mcp/game_mcp.mjs:23`, limits log |
| F7 | **Host contention outweighs any single slow test.** Total suite file time across eight recent full runs ranged from 1,857 s (load 11) to 9,363 s (load 95) for the same 1,111 to 1,119 files. 33 files over 20 s account for 68% of the quiet run, and the 15 `cast_*` files alone for 29%. Each boots the game, so the boot pack compile (S6, about 7% of a 120-minute step run) is paid per file. | duration files |
| F8 | **Tool hygiene gaps.** 23 git worktrees exist, many detached under `/private/tmp`. `game_mcp_limits.jsonl` has 78 rows and no status field, so none can be marked fixed. The `frontier-hunt-ready` fixture recipe fails on a fresh HEAD worktree (Nov 15 note, still unowned). `npm run build` writes tracked `dist/` and `index.html` in the shared checkout. | `git worktree list`, limits log, save checkpoint |
| F9 | **Bundle and storage are fine for now.** 11 MB minified (18 MB unminified, 4.3 MB gzip), one entry. Crowded save 317 KB raw, 634 KB in localStorage, 36 KB gzip. Parse cost matters for boot on older machines (O7 of the Nov 15 review), but nothing measured today ranks it above F1 to F6. | probe `size`, `bundle` |

## Comparison with November 15 (unprofiled, crowded)

`node scripts/perf/save_probe.mjs --rev <rev> --fixtures crowded --saves 5`,
minified builds, alternating `e44e565f6`, HEAD, `e44e565f6`, HEAD, host load
3.3 to 4.5 (quiet). Receipts:
[evidence/perf-devtools-2026-11-19/](evidence/perf-devtools-2026-11-19/).

| Run | Script busy | Task busy | Long tasks / 15 s | Worst | Layouts/s | DOM nodes | Heap MB | Manual save |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nov 15, 1 | 41.5% | 75.1% | 27 | 377 ms | 12.5 | 48k | 87 | 61 ms |
| HEAD, 1 | 40.8% | 100.2% | 38 | 396 ms | 23.5 | 132k | 209 | 37 ms |
| Nov 15, 2 | 40.8% | 70.7% | 20 | 396 ms | 11.3 | 104k | 164 | 36 ms |
| HEAD, 2 | 41.9% | 100.6% | 57 | 416 ms | 23.4 | 112k | 174 | 37 ms |

**F10 · A style and layout regression since November 15.** Script time is
flat, but the crowded main thread went from about 73% to saturated (100%),
layouts per second doubled, and long tasks rose by roughly half to double.
The added cost is native style and layout work, which the JS profile reports
as `(program)` (33%). DOM node counts swing too much between runs to name as
the cause (48k to 132k on the same revision). Likely suspects, not yet
bisected: new board-level `:has()` rules (138 lines in `styles/` now, 105
rules when slice 3 measured them) and the new UI-cohesion panels (ready hub,
pinned band, status line, inspector). F1's 16% is a share of JS time and sits
inside a thread that now has no idle left.

## Work already in flight (owned by other lanes; not touched here)

| Item | Where | State |
| --- | --- | --- |
| O21 slice 1, display gate (`src/display_gate.js`, known routes, tempo fight) | [save architecture checkpoint](../gm/dispatch/save-architecture-2026-11-15/CHECKPOINT.md#o21-first-slice-display-gate-2026-11-15) | uncommitted in the primary checkout, measured -4.7 points task busy |
| JS-UI slice 3, frame-coalesced shell refresh and reveal checks | [JS-UI checkpoint](../gm/dispatch/js-ui-performance-2026-11-06/CHECKPOINT.md#slice-3-frame-coalesced-shell-refresh-and-reveal-checks-2026-11-07-claude) | implemented, below floor, uncommitted |
| `game_step` days up to 400, compact receipts | `scripts/mcp/` working-tree diff | another lane's live edit |
| Save probe and perf lib tweaks | `scripts/perf/lib.mjs`, `save_probe.mjs` | working-tree diff |

## Options

| Code | Option | Gain | Cost |
| --- | --- | --- | --- |
| O24 | **Extend the display gate to `renderPublicationPanels`**: publication panels render on commit only when on screen or when their key changed. This is O21 aimed at today's biggest consumer. | Up to most of F1's 16% | One structural change in `main.js` (AR1 growth stays zero by moving the gate to the panel owners) |
| O25 | **One visibility source**: a single `IntersectionObserver` (or the gate's state) answers "on screen?" for every panel, and the 24 files stop calling `checkVisibility`. | Most of F2's 10% | 24 small edits, one per owner file; same-DOM equivalence check |
| O26 | **Span steps in the MCP**: `game_step` takes `span` (default on for multi-day steps outside the Village, receipt labels it), and a long step reports progress per chunk so the 300 s timeout applies per chunk, not per call. | Week steps become about 4 min instead of timing out; same for slow tests that step | Small; span stays a labelled non-RT8 mode |
| O27 | **Pack compile cache at boot (S6)**: key `compileStructuredPack` output by pack hash, in memory per process and on disk for the headless runner. | About 7% of every headless boot; every slow test file boots | Cache invalidation by content hash; the test must prove identical registries |
| O28 | **Lint the display rule**: `check:arch` counts `setInterval` and `checkVisibility` in `src` and ratchets them like the main.js growth baseline, so F3 stops growing while O21 lands. The unusual option: it costs nothing at runtime and turns AR23 into a measured line without a big migration. | Stops new pollers | Needs Weibao's yes on AR23 |
| O30 | **Bisect F10 with the probe**: run the unprofiled crowded probe across the merge commits between `e44e565f6` and HEAD and find the first with task busy over 90%, then check its CSS and panel additions. Add a crowded task-busy ceiling to the push gate so the next regression shows up when it lands rather than four days later. | Names the regression's cause; prevents a repeat | About 2 min a probe run, roughly 6 to 8 runs |
| O29 | **Tool hygiene round**: add a `status` field to MCP limit rows and mark the fixed ones, retire finished worktrees with the reconcile-project worktree inventory, fix the `frontier-hunt-ready` recipe, and add `npm run build -- --out <dir>` for shared-checkout checks. | Fewer false blockers, less stale state | Small, one sitting |

Kept for later, unchanged from Nov 15: O22 facts per active world (F5), O23
unmount hidden panels (F4), O7 lazy world packs (F9), O5 gzip exports, the
`:has()` selector rewrite from JS-UI slice 3 (style recalculation).

## Recommended order

| Code | Action | Why first |
| --- | --- | --- |
| A1 | Land the in-flight perf work (display gate, slice 3, MCP step edit) through their owners | Merge before dispatch; measured gains already exist |
| A2 | O30 bisect the style regression and add a crowded task-busy ceiling to the push gate | The thread is saturated; this is cheap and names the cause (F10) |
| A3 | O26 span steps plus per-chunk timeout in the MCP | Smallest change with the largest dev-tool payoff (F6) |
| A4 | O24 then O25, display gate on publication panels and one visibility source | Largest measured JS idle cost (F1, F2) |
| A5 | O27 pack compile cache, then the O29 hygiene round (O28 if Weibao accepts AR23) | Speeds every booted test, stops regressions (F3, F7, F8) |

## Limits

- Busy percentages from the profiled run are inflated by instrumentation; use
  the comparison table for absolute idle figures.
- One host (M5 Pro, 64 GiB) under shared agent load. Physical older 8 GB
  hardware remains unqualified, as the JS-UI checkpoint states.
- Function-to-file mapping for three minified-name hot spots (`place`,
  `render`, `refresh` at the top of the self-time list) was not completed; the
  temp build was removed after the run.

## Round 2: bisection, fixes and what is left (2026-11-19)

Weibao: "Work on both at the same time then next steps until completetion".
All changes are on branch `claude/perf-devtools-1119` (worktree
`.claude/worktrees/perf-devtools-1119`, base `f6979dc7c`). Agent-verified, not
human-reviewed, not merged, not pushed.

### F10 cause and fix

Bisection over the 213 first-parent commits from `e44e565f6` to HEAD
(unprofiled crowded probe, threshold 90% task busy, host load 3 to 6) landed on
`3edf6f72a` (2026-11-16, fight numbers and classic save buttons): last good
`b66a13469` 64.9%, first bad 100.8%, confirmed 66.4% and 100.4%. That commit
added an `<output>` beside each classic range option and set its text in
`syncClassic` on every sweep. The sweep's own `MutationObserver` watches
`childList`, so the text write queued the next sweep, every animation frame,
on every save, for as long as the page was open. Fix `9d32e9929`: write only on
change, with a regression test that a repeat sync makes no write.

Alternating probe, fix against parent, two pairs each, minified builds, load
about 5, 0 page errors:

| Fixture | Parent task busy | Fixed task busy | Parent layouts/s | Fixed layouts/s | Parent long tasks / 15 s | Fixed |
| --- | --- | --- | --- | --- | --- | --- |
| fresh | 70.4%, 69.8% | 25.1%, 23.0% | 68 | 12 | 15 | 15 |
| crowded | 101.2%, 100.7% | 71.0%, 67.6% | 22 | 11 | 59, 73 | 22 |

After the fix the crowded profile shows 37.5% idle time and `checkVisibility`
at 0.4% (it was 10%, because each wasted sweep also woke the reveal checks).

### What landed on the branch

| Commit | Change | Checks |
| --- | --- | --- |
| `9d32e9929` | F10 fix in `src/ui/feel_finish.js` | `tests/feel_finish.test.js` 5/5; probe table above |
| `333fff394` | O26: `game_step` takes `mode: "exact" \| "span"` (receipt says which); `advanceGame` reports each game day through `onSlice`, and the MCP restarts its timeout on each report, so the 300 s limit bounds one day, not a call | `tests/headless/advance_equivalence.test.js`: one call, 60-minute chunks, day by day and 600-minute progress slices give the same save. `game_mcp_check.mjs --faster-time-only`: span receipt, bad mode refused, and a 4-day step of 35.8 s finishing under a 20 s timeout |
| `5638a29a2` | Perf tree copies `scripts/gen_capability_runs.mjs` (the build now runs it; probes at HEAD failed without it). Same line as another lane's uncommitted edit | probes run |
| `f30af14f5` | O30: the push gate runs the crowded idle probe on visible pushes and fails when two runs both exceed `budgets.json` crowded `taskBusyPct` (78) | `tests/test_plan.test.js` 6/6 |
| `bf3bfd9df` | A1: O21 slice 1 (display gate on known routes and the tempo fight) landed from the save-architecture lane's uncommitted, browser-verified files, unchanged | display gate, known routes, feel finish 11/11; `check:arch` pass |
| `4fbcbb6e3` | MCP check BLD3 was stale: opening the Connection panel now presses its open button itself, so the check accepts an open view | the check passes BLD3 |

### Suite and gates on the branch

- `npm test` (full, worktree, 12 files at once): 8,057 tests, 8,031 pass, 0 fail,
  17 skipped, 9 cancelled. The 9 are the `cast_*` integration files, each timed
  out at 300 s during a stretch when host load averaged about 42 to 44.
  Rerun alone: `cast_card_integration` 15 s on both the branch and clean HEAD;
  all nine at concurrency 3: 55 of 55 pass, 0 cancelled, 155 s.
- `check:arch` pass (main.js growth 0), `check:rules` pass, `check:docs` no
  finding in this review.
- Rebuilt browser proof: the save probe builds each revision in a temp tree,
  opens it in headless Chrome on a fresh origin and records 0 page errors on
  fresh and crowded for the fixed commit. No persistence change, so no
  save, reload, export or import round was required beyond the existing suite.

### Not done, and why

- **O24/O25 gating every publication panel.** After the fix,
  `renderPublicationPanels` is 8.2% in total, spread over about 50 panels at
  0.1% to 0.7% each. The largest is known routes at 2.4%, and that one is
  already gated: its key is the command sequence, which changes on every
  commit, so the gate opens each time. A per-panel migration buys little. The
  lever is building facts only for the active world (O22), which needs its own
  design round.
- **O27 pack compile cache.** About 0.6 s CPU per headless boot. It pays
  with an on-disk cache keyed by pack hash that proves identical registries;
  left for a step-speed round.
- **MCP check, second stale route.** After BLD3 the full check stops at
  `#systems_workshop_panel > summary` (`display:none`), which the place-panel
  work moved. That route belongs to the play-surface lane's in-flight UI and
  is left to it.
- **JS-UI slice 3** (frame-coalesced shell refresh) is not in HEAD or the
  primary tree. The shell render (`proto23_shell.js`, 6.4%) and the component
  refresh (`ui_components.js`, 5.1%) are now the largest JS self-time.
- **Hygiene.** `BUILD_OUT=<dir> node build.js` already builds outside the
  checkout (F8 corrected: document it, no new flag). The MCP limits ledger
  status field and worktree retirement were not done: the ledger has other
  lanes' uncommitted rows, and the worktrees belong to other sessions.

### Merge state

Merged into `master` as `7f32e5850` (Weibao: "Merge file by file"), built with
`git merge-tree` and `commit-tree` so the shared working tree was not checked
out. Other lanes' uncommitted edits stay uncommitted on top:

- `src/display_gate.js`, its test, `known_routes_ui.js`, `tempo_fight_domain.js`,
  `tests/known_routes_ui.test.js` and `scripts/perf/lib.mjs` were identical to
  the branch, so they are now clean.
- `src/main.js` keeps the other lane's hunks; only the known-routes key line
  moved into HEAD (HEAD stays 10,115 lines).
- `scripts/mcp/game_mcp.mjs`, `game_worker.mjs` and `game_mcp_check.mjs` were
  3-way merged by hand: the other lane's uncommitted receipt view and 400-day
  cap sit on top of the committed span mode and per-day timeout.
- Checks on the merged checkout: `BUILD_OUT` build passes with tracked `dist/`
  untouched; feel finish, display gate, known routes and test plan 17/17;
  `check:arch` pass at HEAD; `game_mcp_check.mjs --faster-time-only` and
  `--step-receipt-only` both pass on the combined tree.
- Backups of every touched dirty file, their diff and the index are under
  this session's scratchpad (`merge-backup/`), which may be cleared.

The branch and its worktree are retired. Not pushed.
