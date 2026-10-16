# Modular seams checkpoint

Requested 2026-10-16 by Weibao: "make a codex run to fix accordingly and create
rules accordingly". Rules: [architecture rules](../../../ARCHITECTURE_RULES.md).
Brief: [BRIEF.md](BRIEF.md).

## Writer and reservation (AR15)

- Writer: one Codex run, `runs/m.log`, PID in `runs/m.pid`.
- Worktree: `/Users/weiwei/.codex/worktrees/modular-seams/yet-another-idle-rpg`,
  branch `codex/modular-seams`.
- Reserved on that branch: `src/main.js`, `src/display.js`, `src/save_files.js`,
  `src/domain_registry.js`, `scripts/check_architecture.mjs`. Other lanes may
  keep editing these on `codex/gameplay-foundations`; this run merges them in at
  each round start. Merging back needs reconciliation with any uncommitted
  continuation work still in the shared checkout.

## Status

| Round | Status | Commit | Gate |
| --- | --- | --- | --- |
| M1 cycle break + check | passed | 9e089696 | build, 1793 pass / 3 TODO, arch, rebuilt before/after route + full save equality |
| M2 registry + two domains | passed | 4498c8e6 | build, 1795 pass / 3 TODO, arch, two-domain rebuilt comparison + old save |
| M3 crafting consumer | STOPPED, implemented-unverified | stopped candidate commit | browser failed twice; final full gate open |
| M4 second case | not started | | M3 did not pass |

The live checkpoint is the copy in the worktree; this shared copy records the
dispatch. Fold the worktree copy back when the branch merges.

## M1 checkpoint

See [M1 report](M1_REPORT.md). Core line counts: main 10121 (−139), display 6655
(−9), save_files 256 (unchanged). Original baselines: 10260 / 6664 / 256.
Graph baseline: 8 main imports, 298 cyclic edges. Reservation remains active.
No remaining M1 playable gate; human taste is outside this structural round.
M2 is next. Commit identity is recorded at M2 start or in branch history.

## Reconciliation notes

Only this worktree has been changed. M1 overlaps continuation's main state,
imports, assignment sites and display imports. M2 will also touch save_files.
Preserve continuation's behavior during coordinator merge; do not copy its
uncommitted sources into this branch. No push or upstream merge authorized.

## Rule feedback

AR5's baseline exception is necessary for existing whole-graph cycles. The check
rejects new cycles and main imports while requiring the exemption set to shrink.
The named assessment file is missing from this branch; standing rules are present.

## M2 checkpoint

See [M2 report](M2_REPORT.md). Start-of-round merge: already up to date. Core
counts 10100 / 6655 / 256; net this round −21 / 0 / 0. Baseline remains 8 main
imports and 298 cyclic edges. Existing transaction and writer authority retained.
Both domains exercised on both rebuilds, complete save equality excluding saved_at;
old saves keep both absent slices and inventory unchanged. Reservation active.

M3 target: expanded center crafting home, 1366×768, harvest to useful native
consumable with full persistence. Mobile, UI redesign and broader product modes
stay deferred. docs/UI_RULES.md is absent on this branch. Use explicit dispatch
surface requirements plus existing PANEL_KIT.md and center controller; record
this missing authority as a documentation gap, not permission to invent rules.

## M3 stop checkpoint

See [M3 report](M3_REPORT.md) and [stop evidence](evidence/M3_STOP.json).
Required start merge ae9be1700 brought current branch/rule documentation only.
Browser B1 failed on a detached launcher. After the source fix and rebuild, B2
opened through Other known panels but Gather remained disabled in the paused
fresh-load scenario. Stop rule applied; no further gameplay fixes/retries or M4.
No harvest/craft/use/persistence or old-save crafting journey passed in browser.

Source checks: crafting runtime 4 pass; final UI contract 2 pass. Last full suite
1794 pass, 1 UI-contract failure, 3 TODO; focused source fix does not prove the
full suite. Build passed before final style-to-class edit; latest source remains
unrebuilt. Last arch check passed with the same graph baseline. Every M3 runtime
change is implemented-unverified. GR12 stays open; canonical crafting engine
owner still correctly lists the integration gate as not complete.

Core counts: 10108 / 6655 / 257. M3 added 8 / 0 / 1 lines. Passing M1–M2 net
reductions: main160, display9, save_files0. Final candidate net: main−152,
display−9, save_files+1. M2 breakdown correction: 52 removed / 31 added, net−21.

Reservation released at this stopped checkpoint. No worker or preview server is
needed to keep running. Resume only from the stopped candidate and reports,
merge current foundations at the next round start, rebuild, recover native
readiness/open rendering, then run the complete M3 gate. Human acceptance remains
separate. The kept journey script's later assertions have not been reached.

## Additional rule feedback and reconciliation

AR1: one registration import plus five adapter lines and two generic native-use
hooks in main exceed the literal target. Missing native item-use/transaction
ports are the demonstrated seam gap. Proposed exception only, no rule change.
UI_RULES.md is also missing; PANEL_KIT and dispatch requirements used, with UI
contract test catching styling/host violations. M3's item decoding and active-
effect restoration changes also need reconciliation with later work. The
upstream merge changed PROJECT/USER_VISION; this lane made no authored edits to
those files. No personal saves, shared uncommitted sources, push or merge back.
