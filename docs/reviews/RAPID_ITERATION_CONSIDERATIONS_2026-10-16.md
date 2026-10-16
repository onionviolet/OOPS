# Rapid iteration considerations, 2026-10-16

Weibao: "Also consider redesigning the engine to be able to rapidly intereate and
test thigns and more faster?" Asked after the
[modularity assessment](MODULARITY_AND_REWRITE_ASSESSMENT_2026-10-16.md) and the
[architecture rules](../ARCHITECTURE_RULES.md). Findings and proposals below are
Claude's recommendations, not accepted decisions. Nothing here changes runtime code.

## Short answer

No engine rewrite. Compiling isn't slow; getting the game into a given state and
checking it is. Most of the fix already exists on unmerged branches. Land that
work, add named scenarios through the new domain registry, run most checks
headless, and cut per-tick engine cost.

## Findings

| Code | Verified observation | Source |
| --- | --- | --- |
| F1 | `node build.js` takes about 0.25 s (esbuild 122 ms, 5.5 MB bundle). `npm test` runs 1,802 tests in about 30 s. | Timed on `codex/modular-seams` worktree, 2026-10-16 |
| F2 | The slow, fragile step is reaching a state and proving it in a browser. The modular seams M3 round stopped after two browser failures: a launcher removed by redraw, then Gather disabled "in the paused fresh-load scenario", cause not established. FA13 R8 overran its 100-minute play budget. About 40 one-off `*_browser.cjs` scripts each set up their own state. | [M3 report](../gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md) (on the lane branch), PROJECT.md FA13 line, `scripts/` listing |
| F3 | A headless full-game runner already exists, unmerged: the real bundle boots in Node with an in-process DOM, seeded randomness and frozen time; save/export/import run the real paths. The village route gave canonically identical saves to Chrome, in 5–8 s headless versus 20–24 s in Chrome. The same lineage has simfuzz invariants, replay, a perf gate, `test_queue.mjs` and `startup.mjs`. None of it is on HEAD. | `claude/wave-c-headless-0f7b1d` HEADLESS_LANE.md; [branch triage](../gm/BRANCH_TRIAGE_2026-10-16.md) engine-perf section (needs-owner A2) |
| F4 | The engine tick is the speed limit, not the harness: about 30 ms CPU per game minute on a fresh save and 90–130 ms on developed saves. About 98% is in the engine's own tick: `update_timer` → `persistExpansion`, context builders (`featureWaveContext`, `campaignContext`, `worldCompletionFacts`), `structuredClone` and autosave `setItem`. Measured on a busy host; ratios provisional. | Same HEADLESS_LANE.md |
| F5 | Standing rule docs are untracked in the shared checkout: `docs/UI_RULES.md`, `docs/SITE_AND_EXPLORATION_RULES.md`, `docs/MOCKUP_SYSTEM.md` and the modularity assessment itself. The shared checkout has 1,067 untracked and 1,161 dirty entries. Isolated worktree agents cannot see these rules; the M3 run reported UI_RULES "absent on this branch". | `git ls-files` / `git status`, 2026-10-16 |
| F6 | No shared scenario system: nothing builds "Village, herbs in pack, Gather ready, 1366×768" on demand for tests, browser checks and Weibao's own play-checks. | Source inspection |

## Proposals

| Code | Proposal | Payoff | Cost and risk |
| --- | --- | --- | --- |
| O1 | **Commit the standing rule docs** (F5) through their owners so every worktree sees them. | Isolated agents follow current rules; fewer reworks | Minutes. Their owners commit; do not sweep others' untracked work |
| O2 | **Land the engine-perf lineage** (F3): headless runner, simfuzz, replay, perf gate. Rerun its gates on the integration tip first (none recorded there). | Already built; journeys in seconds without Chrome | Triage A2 owner decision; `main.js` conflicts; do it before `codex/modular-seams` merges |
| O3 | **Named scenarios through the registry.** Each domain can contribute setup steps built from real commands, not hand-edited JSON. `scenario('village-herbs-ready')` yields a save usable by unit tests, the headless runner and a dev-build-only `?scenario=` URL. Old fixtures become scenarios over time | Kills the M3 failure class; one place to fix setup; Weibao can jump to a state to play-check | Small module plus per-domain steps; must stay out of the live build |
| O4 | **Three gate tiers.** T0 unit/pure domain (seconds), T1 headless journey (seconds to a minute), T2 Chrome at 1366×768 with screenshots, run once at the end. Agents iterate on T0/T1; AGENTS.md's rebuilt-browser rule stays as T2 | Faster loops; fewer 100-minute play budgets | Requires headless parity to stay proven (keep the Chrome parity check in the suite) |
| O5 | **One journey harness** with plain `do`/`expect` steps that runs on T1 and T2 unchanged. New checks use it; the 40 one-off scripts migrate when touched | Checks become reusable and readable | Moderate; don't mass-migrate |
| O6 | **Cut per-tick engine cost** (F4): persist on change or at the autosave interval instead of each tick, memoize per-tick context builders, avoid `structuredClone` of unchanged state, and let registry domains advance many minutes in one step where their rules allow | Faster tests and fuzzing, and faster offline catch-up for players, which an idle game needs anyway | Behavior-preserving work under AR9 with before/after save equality; save-timing semantics need care |
| O7 | **Dev loop:** `esbuild --watch` plus reload that saves and restores state, and a dev-only panel (jump to scenario, advance N minutes, grant item, reveal projection) | Weibao and agents see changes in about a second | Small; dev build only |
| O8 | **Seed sweeps for tuning:** run N seeds × 24 game hours headless and report economy, XP and crafting curves | Balance iteration without manual play | Needs O2 and O6 first |

## Recommended order

1. O1, then O2 (owner decision on triage A2).
2. O3 and O4 together, with crafting as the first scenario. Resume modular seams
   M3 on top: its blocker is exactly the setup problem O3 solves.
3. O6 under AR9.
4. O5, O7 and O8 as they pay off.

Each step fits the [architecture rules](../ARCHITECTURE_RULES.md): scenarios and
harness steps register through the domain registry, and no second timer or save
writer is added for testing.

## Limits

Build and test timings come from one run on one host. Headless speed and tick
costs come from the 2026-10-14 lane report on a busy host and are provisional.
The engine-perf branches were not rebuilt or rerun for this note.
