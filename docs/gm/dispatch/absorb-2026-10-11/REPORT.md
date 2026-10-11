# Absorption wave report, 2026-10-11

Parts A-E are integrated and browser checked. Phase 2 used seven isolated
worker branches; one root integrator reviewed and joined them in order.
Gameplay and numbers are proposals awaiting Weibao's playable acceptance.

[Play the current local build](http://127.0.0.1:18514/).
The preview starts a normal hero with all four pacing settings off. Generated
strong heroes, materials, access and deterministic chance were used only in
disposable test contexts, never in the player's save.

## What changed and where to see it

| Part | Play path | Verified result |
|---|---|---|
| A | Continue native progression to Forest lake, Motherwood and Primeval forest. | Seven v0.6 development commits merged, including Days 2-7 locations/enemies/items/recipes/fixes. Fork extensions and the existing Adventurer's guild ID retained. Motherwood action and Primeval encounter exercised; complete natural progression remains open. |
| B | Unlock Shack, then open Furniture and home comforts; sleep or read there. Existing workshop/Proto23 fixture routes supply their own earned bonuses. | Native housing gives +5% Sleeping XP/recovery. Owned finished books and earned fixtures/kits derive local benefits without reload stacking. Storage remains the existing unlimited chest. Housing proof passed; later fixture branches are implemented-unverified. |
| C | Native Crafting: four utility amulets. Village/Shack: Local life. | Crafting luck, relative drops, markup reduction or portable tier1 safe-place cooking use one native amulet slot. All four crafted, luck and portable cooking exercised. Idle search has capped rising chance and finite finds; native food-poison exposure trains resistance; a Village runner and daily noon bread service retain receipts. |
| D | Village's Waypost supply clerk: earned notes after a field clear or a ten-coin copy. Read four minutes, visit Fort yard, smelt salvage, repair the cellar hatch, clear the cellar. Return stock to the funded board. | Actual two yard clears, native smelting, repair, cellar clear and one quest ledger passed. Two board hand-ins paid exactly16 native coins from the finite clerk purse, without Village career credit. Learned item sources and disclosed clear milestones use real knowledge. |
| E | Settings: Hunger, Weather, Equipment durability and Elemental preparation. Center panels show current effects/repair. | All four default off independently. Repeated native food, weather expiry/rain, sleep drain, separate gear copies/wear/repair, actual elemental damage and save roundtrips passed. |

## Defaults and compatibility

D1. All four pacing settings default **off**, preserving the inherited food,
weather, equipment and combat pace for old saves. Players can enable them
independently. Numbers are deliberately modest proposals, not accepted balance.

D2. Hunger uses the played native calendar, lasts eight played hours from full
to empty, and scales ordinary native earned XP from80% to100%. Meals restore
fullness even when their buff is already active. Weather is a saved seasonal
cycle layered onto native temperature/rain; shelter removes optional weather
penalties. Both pause outside home-world play and while disabled; no offline
drain was introduced. Explicit staged simulation rewards keep authored amounts.

D3. Durability activates identities only for equipped copies. Equal-quality
untouched stacks retain native keys. Landed hits wear weapons/armor/shields by
0.04; gear stays owned, with diminishing native power and repair at most5 native
coins. Exact and canonical custody checks prevent rekeying borrowed goods.
Optional elemental preparation adds4% of base attack as defense per matching
worn piece, capped12%, in ordinary native combat; it preserves native damage,
shield, critical and minimum-damage handling.

Forward compatibility is additive: `absorb_local_life`, `fort_supply`,
`pacing_e1` and `equipment_durability` each use schema1; missing fields default
without invented player history, while unsupported schemas reject. Elements use
one boolean in existing options. Furniture derives from existing ownership,
and accessories use native inventory/equipment/recipe fields. A save generated
by the actual pre-merge bundle retained native inventory, money, XP, career,
pack state, expansion schema and location in the final build; all new pacing
options defaulted off. Downgrade play is unverified.

Necessary integration repairs: first-clear rewards no longer misattribute a
quest event after moving the player; hit/critical-taken counters avoid invalid
values from enemy tags; v0.6 loading preserves gear-copy IDs; native menu redraws
reattach new panels; Repair refreshes after combat; repeated active-quest starts
are idempotent so completed-book replay passes strict import preflight.

## Checks and evidence

F1. Final `npm test`: **330/330 passed**, with no skipped/cancelled tests.
Worker full-suite contention caused early subprocess timeouts; serialized
worker retries and integrated root suites passed. Those early failures remain
recorded in each worker note, not counted as passes.

F2. `npm run build` passed. The source map's **407 native source files** match
current source. Current bundle fingerprint: `v0.6-e8681b6bce6c`.
[Final build receipt](evidence/final-build.json).

F3. Every integrated part had a rebuilt disposable-browser gate with actual
save/reload/file import. The [combined fresh-origin journey](evidence/combined-browser.json)
touched A-E in one journey context with all four optional settings together,
then retained claims, funds, gear identities/condition, frozen pacing and options
through reload and file import. The [actual pre-merge-save check](evidence/A-real-old-fork.json)
passed. An injected repair-storage failure attempted a write and left money
and condition unchanged. Private saves and the unrelated root PNG were untouched.

## Remaining review and mod-fork ideas

R1. [Acceptance backlog](ACCEPTANCE_BACKLOG.md) marks every unexercised branch
implemented-unverified. Natural low-level pacing, long-duration balance,
other-world/carrier cases, narrow screens/keyboard and director acceptance stay
open. Local tests and generated access do not establish those outcomes or a
production deployment.

O1-O3. For the audited Xeus24 mod, the strongest follow-ups are a worn title,
broader live readiness in the existing Notebook, and three rotating backups.
Renown needs modest proposed rewards and playtesting of compound growth. These
remain [proposals](MOD_FORK_CONSIDERATIONS.md), not another authorized runtime
wave. This wave used independently authored fitting balance-baseline,
readiness and local-reference ideas; no unlicensed Xeus24 code/text was copied.

Delivery: final source/report commit is ready for the authorized push to
`origin/codex/gameplay-foundations`. No master push or deployment is requested.
