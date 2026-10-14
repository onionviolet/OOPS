# Air absorption: minigame-management

## Outcome

The Air task expanded MG01–MG10 into one connected optional Village market-courtyard loop and delivered 84 simulation commands. Current HEAD already contains that work, adapted to newer runtime code, in commit `0810bdf9e9df5605dcbc4228396f9fba69bc3aa7` (R15 G6). That integration fixed four reproduced blockers and added 17 tests. I found no remaining runtime hunk to port, so this absorption branch contains no source edits.

The governing owners remain [the minigame design](../../../../minigames-2026-10-11/DESIGN.md), [original acceptance backlog](../../../../minigames-2026-10-11/ACCEPTANCE_BACKLOG.md), and [R15 G6 report](../../../../foundation-adoption-next-2026-10-13/rounds/r15/g6/REPORT.md). R15 G6 reports natural desktop browser completion for all ten families, cancellation/refusal branches, Save/reload, Export/literal-file Import on a fresh profile, replay resistance, failed-write behavior, and old-save compatibility. Those claims are from the committed report and evidence, not a new browser run in this absorption worktree.

## Unique hunk classification

| Air UNIQUE path(s) | Classification | Evidence / disposition |
|---|---|---|
| `src/management/foundation.js`, `facts.js`, `capital_rooms.js` | Already landed, subsequently repaired | Courtyard item registration, unset courtyard facts, and MG01 settlement are integrated and repaired by `0810bdf9`; see R15 G6 F1–F3 and its source tests. |
| `src/main.js`, `src/expansion_engine.js`, `src/simulation.js`, `src/simulation_effects.js`, `src/simulation_ui.js` | Already landed, adapted to newer code | R15 G6 records conflict resolution against current code while retaining the candidate's courtyard entries. Commit `0810bdf9` includes the integrated runtime hunks; simulation repeat-work vitals fix is R15 G6 F4. Later HEAD contains additional gameplay work. No snapshot file was copied over current source. |
| `index.html` | Already landed / build-generated difference | Current UI includes the minigame entry point. Rebuild updated bundle/style version references; generated changes were reverted after verification because no source change was needed for this absorption. |
| `PROJECT.md` | Superseded in part by later project history; relevant task direction already present | Current owner retains the 2026-10-11 minigame assignment and newer R15 integration history. Air snapshot predates those updates; no document replacement was appropriate. |
| `docs/GAME_MASTER_PROMPT.md`, `docs/IDEA_INDEX.md`, `docs/LIFE_SIM_NORTH_STAR.md` | Superseded/current-owner documents | Snapshot versions are historical inputs. Current files have later authority and additions; no minigame-specific runtime gap was identified in their unique diffs. |
| `docs/gm/dispatch/minigames-2026-10-11/CHECKPOINT.md` | Already reconciled by current checkpoint | Air-only addition records R15 integration and points to the current R15 G6 report. Current checkpoint already contains this update. |
| `dist/bundle.js`, `dist/bundle.js.map` | Ignored/generated candidate artifacts; not ported | They are stale Air build outputs. Current source was rebuilt in this worktree; generated outputs were restored to avoid adding unrelated build churn. |

All other inventory entries are `same-as-HEAD`. The inventory contains no ignored Air-only private minigame research or packs, so the private-files-to-restore list is empty.

## Checks

- Initial tree: clean, branch `absorb/air-minigame-management`, HEAD `219270e4d20ab0b3fbf92166f43bb5335629d19e`.
- `npm ci`: passed; installed the lockfile's three packages in this isolated worktree.
- `npm run build`: passed. Ink checked build had zero diagnostics; bundle and map built successfully.
- `npm test`: first attempt could not load missing `esbuild`/`inkjs`; after `npm ci`, a full-suite rerun was started and is still running amid several concurrent full repository suites in the shared environment. Final result will be appended when it exits.
- Browser/gameplay: no new browser run. The relevant rebuilt desktop browser, persistence and compatibility evidence is in R15 G6, commit `0810bdf9`.
- No persistence format changed in this absorption, so no migration was needed.

## Remaining gates and merge risks

R15 G6 leaves director acceptance of the proposed host, fiction, names, prices and pacing open. Its report also lists unrun browser cases for most failed-publication points, leaving mid-job/contact loss, edited-import validation, and keyboard focus. Shared save behavior after a failed write remains reload-required. These are acceptance gaps, not missing Air source hunks.

This branch has no source delta to merge. Against `a5-native-audit`, `micro-p1-xp`, `systems-cheats-completion`, and `structured-packs`, the minigame work is already part of the shared current HEAD; expect only ordinary source overlap in shared runtime files if branches were based earlier. Do not reapply the Air candidate wholesale over those branches. The other absorb branch `minigame-management` is this branch itself; its task report is the present file.

## Private files to restore

None identified in the `minigame-management` inventory section.
