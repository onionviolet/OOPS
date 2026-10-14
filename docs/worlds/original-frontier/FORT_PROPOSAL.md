# Optional mountain watchpost, FNA05

2026-10-14. Authorized by the absorb-all wave's COMMON.md and the explicit
fork-fort lane assignment. This is a reversible gameplay proposal, not a new
required campaign outcome or director-accepted fiction/balance. The campaign's
original opening, finite completion footprint and sole prestige remain intact.

## Entry and playable outcome

Physically reach the already-earned **Mountain camp** by inherited routes.
An optional, clearly labelled action gives the route folio once. Leave it alone
to continue the original game. Read it to start the separate expedition quest;
follow the marked route, clear the courtyard, recover materials, craft the
brace and unravel wool, pack the stair with actual goods, explore the dungeon,
and read the keeper's journal. Linen and iron recycling connect the recovered
materials to native stock. The return route stays open; combat zones can be
revisited for materials. Once-only folio/journal grants prevent save replay,
not repeated exploration or salvaging.

All IDs are frozen in `src/fork_fort_content.js` under `FORT`. Native enemy
and location IDs equal their fixed display names because existing bestiary
and action-reward joins use those names as registry keys. Changing those
names later requires a compatibility decision. Data registration
uses current native book, quest, action, enemy, recipe and location models.
No second inventory, campaign schema, global XP/drop/curve change, Cultivation
mechanic or world-opening shortcut is introduced. Books carry no stat/XP
multiplier. Fiction is original Frontier watchpost fiction, not source prose.

## Evidence scope and compatibility

Target viewport: **1366×768**, desktop/laptop. Visible result: named native
camp action, quest tasks, two combat locations and native salvage crafting.
Mobile optimization, the paused broader World1 campaign and human taste
acceptance are deferred. This branch is optional advanced geography under
CAMPAIGN.md, not a new finite required completion ID.

Old saves need no migration: missing IDs retain their locked/default native
state; reading the folio is required for enrollment. Progress uses native
availability bits, action accumulated progress, quest tasks, book reading,
location kill counts and inventory. Native loader restores unlocks without
regranting items. New-content saves require this build or a later compatible
build; loading them in older executables is unsupported. No schema was added
or validator weakened; existing unsupported envelope/schema rejection remains.

The lane report and checked browser results record the exact performed gates.
Generated checkpoints represent already-earned camp access and combat readiness;
they do not prove the untouched native journey to camp or natural early balance.

## Attribution

Connected chain adapted from SchokoKaramel/yet-another-idle-rpg commits
34df88733842b0f384a509f0aa15ec8b523f1081 and
37c93d9fe0b7a37c5600ca117950318997926a4b (MIT).
Upstream copyright (c) 2021 Miktaew and LICENSE retained; attribution is also
in the source module. Local salvage recipes are deterministic and use only
this branch's drops; inherited enemies and drop policy are unchanged.

## Verification, 2026-10-14

Four focused contract checks and the full 625-test suite pass on the final
source. The rebuilt 1366×768 route exercises native books, paid salvage
crafts, material consumption, combat drops and quest completion. A generated
pre-Fort save is compared while paused; a real partial-search save is reloaded
mid-chain. The journal is granted once across two actual dungeon clears; the
actual UTF-8 export is imported through the file input and reloaded with exact
completion, journal count and eight dungeon groups retained. The lane report
and `docs/gm/dispatch/absorb-all-2026-10-14/checks/fork-fort/` own the results.
Human fiction, natural difficulty and taste remain unaccepted. Mobile remains
deferred. No broader World1 completion is claimed.
