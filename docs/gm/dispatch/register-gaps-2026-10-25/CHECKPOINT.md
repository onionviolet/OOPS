# E2 checkpoint: register coverage and owner routing, 2026-10-25

Lane E2 is the sole follow-up of finished D5 for bounded MAW-X8/X9 coverage. Authority: G1 supervisor WAVE4_RULES expansion-backlog scope; COMMON and COMMON_W4 in primary. Applicable: AD32, AD36, AD37, AD41, M8; MAW-X8/X9; CBR, PIR, SR, UR; MIE and progression system-map owners. This lane adds a map and crosswalk only. Proposals stay proposals; no runtime work is reserved.

## Result

- Added [combat, people, sites and UI layout map](../../../systems/COMBAT_PEOPLE_SITES_UI.md): authoritative modules, degrees and consumers, source evidence labels, plug-in examples, source-tree identity and SHA-256s, and the MAW-X9 table for MIE-G1..G14 plus PROGRESSION_WORLD_STATE:G1..G14.
- Added one row and one narrow MAW-X8 link in [SYSTEMS_REGISTER](../../../SYSTEMS_REGISTER.md). The existing text about keeping the register current is retained.
- More-to-consider round E2.1:
  - **ACT NOW (done):** record that dirty-primary source observations do not prove browser play and bind code claims to source hashes and tree identity.
  - **ACCOUNT FOR NOW:** keep separate ownership seams visible: combat math versus encounter settlement; resident/companion/helper lifecycles; site-specific domains versus shared geography/knowledge; browser-local layout preferences versus game saves. Refresh the owner before any later implementation because primary work is concurrent.
  - **LATER / DELEGATE:** none added. The current MAW-X8/X9 done check is satisfied as documentation; this round selects no extra audit, runtime slice, or agent lane.

## Inputs, overlaps and integration

- Worktree/branch base and task branch HEAD at start: `3dfc49cf3422c0262d86810df47459f53f3a4a67`; branch `codex/register-gaps-2026-10-25`.
- Primary was read-only. `HEAD` and `master` were both `3dfc49cf3422c0262d86810df47459f53f3a4a67`; source modules were dirty/untracked in primary, and their hashes are in the new map. D5 owner docs are also dirty there, including `docs/SYSTEMS_REGISTER.md`, `docs/systems/MAKING_ITEMS_ECONOMY.md`, `docs/systems/PROGRESSION_WORLD_STATE.md`, and `docs/gm/MECHANIC_ABSORPTION_WORKFLOW.md`.
- Exact target-path check in primary: `docs/SYSTEMS_REGISTER.md` is modified there by concurrent D5/additive work. `docs/systems/COMBAT_PEOPLE_SITES_UI.md` and `docs/gm/dispatch/register-gaps-2026-10-25/CHECKPOINT.md` were absent there. Integrator must apply the register row/link as a hunk against the current primary file and preserve its current D5 wording. Do not copy the whole dirty owner document. New map file can be added as a new path if it remains absent.
- Map claims inspect source only. Dirty-primary source facts may be absent from this branch's master baseline; refresh inputs before any future code work. No grep, export listing, or source call establishes browser play.

## Checks and gates

| Check | Result | Input / gaps |
|---|---|---|
| Exact-path primary overlap | PASS, recorded above | Read-only comparison; primary SYSTEMS_REGISTER has concurrent edits. |
| `git diff --check` | PASS | After the current-master merge; no whitespace errors. |
| Local Markdown-target check | PASS | Three edited docs scanned; no missing relative targets. |
| `npm run check:rules` | PASS, 0 warnings | After merge; 22 register rows, 41 AD codes, 125 relative links. |
| Runtime, build, browser or human acceptance | Not run / not claimed | No gameplay change; map explicitly preserves this evidence boundary. |

## Final integration state

Current `master` merged into this branch: `Already up to date` at `3dfc49cf3422c0262d86810df47459f53f3a4a67`. Commit only the three lane-owned paths. Never merge to master or push.
