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
| M1 cycle break + check | passed | this round commit | build, 1793 pass / 3 TODO, arch, rebuilt before/after route + full save equality |
| M2 registry + two domains | pending | | |
| M3 crafting consumer | pending | | |
| M4 second case | optional | | |

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
