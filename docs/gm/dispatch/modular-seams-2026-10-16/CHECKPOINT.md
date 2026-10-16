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
| M1 cycle break + check | dispatched | | |
| M2 registry + two domains | pending | | |
| M3 crafting consumer | pending | | |
| M4 second case | optional | | |

The live checkpoint is the copy in the worktree; this shared copy records the
dispatch. Fold the worktree copy back when the branch merges.
