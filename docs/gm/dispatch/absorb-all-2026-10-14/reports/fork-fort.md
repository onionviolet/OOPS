# fork-fort: FNA05 optional mountain watchpost

2026-10-14. **PASS at the assigned technical gates; proposal awaiting Weibao's play/taste.**
Branch `absorb-all/fork-fort`, base `0216ccde`.
Commits: `7140597c` (content and focused tests), `892beb4f` (owners and browser evidence).
No merge or push performed. COMMON.md assigns those actions to the coordinator.
Only this report was written in the main checkout. Implementation worktree:
`/Users/weiwei/code/yair-absorb-all-20261014/fork-fort`.

## F1. Absorption and fit

The explicit lane assignment supplies bounded runtime authorization for FNA05.
The [Frontier campaign owner](../../../../worlds/original-frontier/CAMPAIGN.md)
keeps the opening, finite required footprint and original prestige. This optional
advanced mountain branch neither resumes the broader paused World1 campaign nor
adds a required completion ID. The proposal's owner is
`docs/worlds/original-frontier/FORT_PROPOSAL.md` in the lane worktree, linked from
CAMPAIGN.md. No accepted fiction/balance decision was added to PROJECT.md.

| Source item | Decision | Landing / exclusion |
| --- | --- | --- |
| FNA05 book lead, Schoko 34df887 | Adapt as opt-in proposal | `registerFortItems` and `registerFortLocations` in `src/fork_fort_content.js`: the physically reached, already-earned Mountain camp offers a folio once. Reading starts the quest and exposes scouting. Existing shop stock and opening stay intact. |
| Native quest and earned Fort access, 34df887 | Adapt current native models | Five native quest tasks; a paid-in-time search opens a separate approach and courtyard. Does not grant Mountain camp, native cave/road access, a permit or another realm. |
| Fort skeleton materials, 34df887 / 37c93d9 | Reauthor local definitions | Three skeleton enemies; distinct bone, wool, linen and shackle drops. Four groups per clear form a bounded proposal. Only these new enemies have the authored guaranteed drops; inherited drop functions and enemies are unchanged. |
| Bone/cloth/iron recipes | Adapt connected salvage uses | Crafted stair brace, wool and linen recovery, iron recycling. Real brace and wool are consumed to open the dungeon. New native recipe IDs and ordinary native stock; no second inventory. |
| Dungeon and journal, 37c93d9 | Reauthor payoff | Native dungeon first-clear journal reward; reading finishes the quest. Repeat combat remains available. Journal has no Cultivation or XP/stat multipliers. Fiction is original Frontier watchpost fiction. |
| Generic Cultivation, XP, loot and progression packs | Exclude | No generic skill/XP/drop/curve changes, unused source skills, extra prestige or borrowed assets. |

MIT sources: [34df88733842b0f384a509f0aa15ec8b523f1081](https://github.com/SchokoKaramel/yet-another-idle-rpg/commit/34df88733842b0f384a509f0aa15ec8b523f1081),
[37c93d9fe0b7a37c5600ca117950318997926a4b](https://github.com/SchokoKaramel/yet-another-idle-rpg/commit/37c93d9fe0b7a37c5600ca117950318997926a4b).
Repository and full commit attribution are in the source module. LICENSE retains
Copyright (c) 2021 Miktaew and the MIT notice. No raw source prose or new assets
were imported.

## D1. Stable IDs and compatibility

All IDs are frozen in exported `FORT`. Native location IDs are `Fort approach`,
`Fort courtyard`, `Fort dungeon`; enemy IDs equal their fixed displayed names.
That matches existing native bestiary and action-reward lookups. Quest, action
and recipe IDs use `frontier.fort.*`; book/material IDs use `Frontier fort ...`.
Do not rename saved IDs/display names without a compatibility decision.

No new schema or custom persistence payload. Missing IDs in old saves retain
locked/default native definitions with no enrollment, progress or item grant.
Native serialization may add dormant definition entries on the next save, as
it does for other additive content. Actual progress uses existing availability
bits, quest tasks, action accumulated progress, book reading, inventory and
location kill counts. Existing envelope/schema validation was not weakened.
New-content saves require this or a later compatible build; import into older
executables lacking these IDs is unsupported. Old saves require no migration.
Once-only discovery/journal receipts prevent reward replay; repeat exploration,
combat and material recovery are unrestricted.

## F2. Performed checks

Target: **1366×768 desktop/laptop**. Visible outcome: named opt-in camp action,
native quest, combat, salvage crafts and completed journal route. Mobile deferred.
Test origin: `http://127.0.0.1:18704/`, served by the assigned Python HTTP server.
Fresh disposable Playwright contexts; no user saves or signed-in browser state.
Chromium used installed Chrome because the bundled headless executable is absent.

| Check | Exact final result |
| --- | --- |
| `npm run build` | PASS; final source rebuilt, Ink artifact check passed |
| `node --test tests/fork_fort.test.js` | 4 tests, 4 pass, 0 fail |
| `npm test` | 625 tests, 625 pass, 0 fail; 77,775.741625 ms. No pre-existing failures in the final run. |
| Full `checks/fork-fort/browser.cjs` | Exit 0, **12/12 groups PASS**, native timers, zero runtime page errors |
| Targeted `checks/fork-fort/restore.cjs` | Exit 0, 3/3 restore groups PASS against the route's actual exported file |
| Source/evidence diff whitespace checks | PASS; generated bundle whitespace is excluded from source checks |
| Served bytes | Downloaded candidate bundle SHA-256 equals the local rebuilt bundle |
| Visual inspection | Camp action and completed route PNGs inspected at 1366×768 |

Tested bundle SHA-256:
`b4f66dba2e48f8a5ec46da6ba8f35810e44e376746c409b0230ac6038fbec55c`.
`dist/bundle.js`, `dist/bundle.js.map` and the generated index version remain
local build changes and were not committed. The assigned server serves the
rebuilt candidate; coordinator must rebuild integration.

The complete browser run asserts: original Village opening has no Fort action
or active quest; a generated pre-Fort save preserves purse, player levels,
inventory, location and opening quest while paused; folio grant once;
mid-search progress/quest/book reload exact; insufficient materials leave the
dungeon locked; native courtyard drops and recipe unlocks; actual brace/wool/
linen crafts; exact one-brace/two-wool consumption; native dungeon drops and
iron recycling; journal reading finishes the quest; a **second actual full
clear** reaches eight dungeon groups without another journal; literal-file
import and completed reload retain completion, one journal and eight groups.
The starting fixture supplies previously earned camp access and combat/crafting
readiness. No new-chain progress, material, recipe unlock, reward or clear is
seeded. Actions/travel/reading invoke the public native browser commands;
crafting uses real recipe-row and **Craft 1** clicks.

Evidence in the lane worktree:
`docs/gm/dispatch/absorb-all-2026-10-14/checks/fork-fort/results.json`,
`restore-results.json`, `camp.png`, `complete.png`, `browser.cjs`, `restore.cjs`.
Generated partial and exported saves are local and git-ignored. Full final run
log: `/tmp/fork-fort-browser-complete.log`; final build/test logs:
`/tmp/fork-fort-build-verified.log`, `/tmp/fork-fort-focused-final.log`,
`/tmp/fork-fort-tests-verified.log`.

Earlier failed attempts are superseded, not counted as passes: incorrect
fixture equipment/XP mirrors were corrected; one untrained generated fixture
died before any courtyard clear; distinct machine/display IDs caused native
bestiary and reward joins to fail, fixed in the new definitions and guarded by
focused tests. Harness assumptions about locked-vs-finished bits, HackTimer
acceleration, the **Craft 1** label, live Breathing XP during compatibility
comparison, and async import completion were corrected. The final whole harness
rerun passes. The missing optional `private_packs/manifest.json` returns the
existing 404 on isolated origins; it creates no runtime page error or Fort gap.

## R1. Integration risks and remaining acceptance

Roster is `runs/SESSIONS.md`, not the absent root-level SESSIONS.md.
`fork-resurvey`, `upstream-dev`, `air-workshop` and `p23-life-loops` may overlap
native item/enemy/recipe/location/quest registries or their registration order.
Preserve each lane's registration call; Fort has one pure definition module and
two-line joins in five registries. No main.js, save codec, skill registry,
shared display or stylesheet edits here. `p23-ui-polish` and `p23-reveal-chain`
may alter crafting/action presentation, so rerun the native browser route after
integration. `p23-reaudit` and `air-reaudit` are docs-only; preserve their reports
and findings. The Frontier campaign append can conflict with other world-owner
edits; retain both proposals without turning either into mandatory progression.

Implemented-unverified gameplay within the assigned generated-route gate: none.
The untouched natural journey to Mountain camp, untrained/natural difficulty,
mobile, and broader World1 completion were not verified by this slice. Integration
in the coordinator's branch remains separate from this lane's source/browser proof.

**A1. The remaining lane acceptance gate is Weibao's play/taste**, including
fiction, difficulty, travel/read times and salvage values. Start by physically
reaching the earned Mountain camp, choose the labelled optional route notes,
then follow the native quest. This is a proposal, not director acceptance.
