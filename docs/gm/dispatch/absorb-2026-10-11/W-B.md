# W-B furniture bonus projection

Worker `/root/furniture`; isolated checkout `absorb-2026-10-11-workers/b`,
branch `codex/absorb-2026-10-11-b`, base `c83bd819`. Exclusive paths:
`src/absorb_b/**`, `tests/absorb_b.test.js`, this note. Root owns integration.

Implemented-unverified until root rebuilds and exercises fresh-browser play.
Numbers below are original balance proposals inspired by Proto23 local
furniture and read-book bonuses. No source code, save domain or new inventory
was imported. Existing schema/ownership meanings remain compatible.

## Delivered callable module

`src/absorb_b/furniture.js` exports `furnitureProjection`,
`furnitureSkillMultiplier`, `furnitureRecovery`, `furniturePresentation`,
`furnitureBonusText`, `furnitureItemBonusText`.

| Existing owner | Proposed local benefit | Actual native consumer |
|---|---|---|
| Accessible native housing | +5% Sleeping XP, +5% rest/sleep recovery, existing chest access | sleeping ticks and native rest |
| Finished physically owned native books | +1% Literacy XP per distinct work, capped +10%; home only | native reading |
| Earned completed Shack drying rack | +2% Regeneration XP at Shack | `update_health` awards Regeneration XP on actual healing |
| Earned completed Shack drafting bench | +3% Literacy XP at Shack | native reading |
| Installed owned Proto23 bed | +8% ordinary rest recovery at cottage | ordinary native rest; selected four-minute bed job stays unchanged |
| Installed owned Proto23 hearth | +3% Regeneration XP at cottage | actual ordinary recovery |
| Installed owned Proto23 bookstand | +3% Literacy XP at cottage | native reading |
| Completed Proto23 home-kit adaptation plus held owned kit | +2% Crafting mastery XP in base frontier | native Village crafting |

Storage is already unlimited. UI reports shared chest access, never an
invented numeric capacity. There is no Cooking bonus because the cottage has
no native cooking station, and no fixture job XP because typed jobs currently
have no native XP award. A drying rack supports a dry, ventilated recovery
space; the bench supports reading plans. These modest fiction choices are
proposals, not accepted world rules.

Copies never stack. Borrowed carried books/kits do not count. Cottage book
collection counts only carried books, not the remote frontier chest. Home
collection can include the existing shared chest. Projection never mutates
input or installs an accumulated bonus on load.

## Minimal root integration

Import in `src/main.js`:

```js
import {furnitureProjection, furnitureSkillMultiplier, furnitureRecovery, furniturePresentation, furnitureItemBonusText} from './absorb_b/furniture.js';
```

Create a live read helper after native state is available. Reuse
`readInventoryOwner` already imported by main. Do not cache across a load,
location change, construction/installation settlement or inventory transfer.

```js
function readFurnitureInput() {
  return {state: expansionState, locationId: current_location?.id,
    housingAccessible: !!current_location?.housing?.isUnlocked(),
    nativeInventory: readInventoryOwner(character.getItems()),
    chestInventory: readInventoryOwner(player_storage.getItems()), bookStats: book_stats,
    context: expeditionContext()};
}
function readFurnitureBonuses() {return furnitureProjection(readFurnitureInput());}
```

`housingAccessible` must also mean the current location is legitimately
accessible; native location movement already supplies that check. The
expansion actor world must match `base.frontier`, so unrelated worlds cannot
borrow native bedding. Projection derives earned Shack facts through existing
`homeFurnishingFacts`; avoid hand-maintained boolean mirrors.

Immediately after the existing `lifeLearningMultiplier` line in
`add_xp_to_skill`, before `character.addXPToSkill`:

```js
if(!is_from_loading && use_bonus) xp_to_add *= furnitureSkillMultiplier(readFurnitureBonuses(), skill.skill_id);
```

Native crafting precomputes XP via `character.getSkillXPGain` and later calls
`add_xp_to_skill(use_bonus:false)`. At each of its three expressions (base
currently main lines 3671, 3826, 3940), multiply the existing
`character.getSkillXPGain(recipe_skill.skill_id)` by:

```js
furnitureSkillMultiplier(readFurnitureBonuses(), recipe_skill.skill_id)
```

Do not also multiply `use_bonus:false` at `add_xp_to_skill`, which would double
crafting and corrupt XP restored during load. Parent-skill XP continues through
native logic without a second bonus. Apply within the native crafting cap,
keeping its current cap policy.

Wrap each recovery calculation in `do_resting` and `do_sleeping` before its
existing rounding, or multiply the already calculated integer before applying
it, retaining native clamp-to-maximum and allowing fractional recovery:

```js
furnitureRecovery(readFurnitureBonuses(), existingRecoveryAmount)
```

The latter gives visibly useful small gains at low levels; rounding the 2-point
rest tick after +5% would erase the bonus. Sleeping skill XP is independently
handled by the `add_xp_to_skill` hook. Do not alter the typed bed job's disclosed
four stamina or its exact frozen definition/receipt validator.

For the public Here panel append:

```js
sections.push(...furniturePresentation(readFurnitureInput()).sections);
```

Add `furnitureItemBonusText(spec.id)` to existing Proto23 native item
specification descriptions and the Prepared survey kit description (once).
This makes shop/inventory descriptions show installed/earned terms; carried
furniture itself has no bonus. Here records show each owned fixture's exact
bonus and whether it is active locally. Root should remove contradictory
current descriptions such as "no global percentage stack" where they imply
passive bonuses are forbidden; preserve historical receipts as history.

## Existing saved fields and generated browser fixtures

These are owner paths to inspect in a generated save, not instructions to graft
flags into a save. Exact existing validators additionally require chronological
receipts, native domain stock, actual paid costs and reserved-item history.
The focused tests construct projection-only snapshots and do not claim to be
validated whole-game exports.

**Native baseline fixture:** fresh disposable browser save, accessible Shack,
`expansion.actors.player.worldId = 'base.frontier'`, native saved location Shack,
location availability unlocked. Put a real native book in
`inventories.person.player.inventory` or `inventories.storage.player.inventory`
through normal acquisition/storage; its BookData completion comes from native
saved `books[bookId].accumulated_time` reaching runtime `required_time`. Compare
Sleeping XP and depleted-health/stamina native recovery before/after arriving
at Shack. An unfinished owned book and a finished remembered but absent book
must not count. Supply `readInventoryOwner` snapshots to the module; do not
pass native saved `{count}` rows directly.

**Earned Shack fixture:** create a generated campaign using ordinary existing
`field.workshop.assembly`, audit enrollment and fit-out command flow. Required
ownership paths are:

- `state.schema=11`, `state.auditRemainder.schema=1`, `.definitionRevision=1`,
  `state.referenceGameplay.schema=1`;
- `actors.player.facts['audit_remainder.enrolled']=true`, completed
  `audit_remainder.enroll=1`; `facts['field.facility']=true`, completed
  `field.workshop.assembly=1`;
- `simulation.sites['field.assembly']={owner:'player',capacity:1,...}` and
  `worlds['base.frontier'].facts['project.field.workshop.assembly']=true`;
- completed `home_furnishings.survey=1`, actor fact
  `home_furnishings.right='field.assembly'`, actual survey knowledge receipt in
  `simulation.knowledge.player['home_furnishings.survey']` with definition's
  matching stage/value/basis, sequence cause and clock;
- for both fixture projects, world fact `project.<projectId>.started=true`;
  completed `home_furnishings.drying_rack.frame/finish=1`, matching world
  `project.home_furnishings.drying_rack.frame/finish=true`, and
  `home_furnishings.rackBuilt=true`. Bench has corresponding
  `drafting_bench.frame/finish` plus `home_furnishings.benchBuilt=true`.

Use the actual `home_furnishings.survey`, `.drying_rack.frame`,
`.drying_rack.finish` commands (3/4/3 minutes), with owned kit and logs/sap.
The bench's mature-record prerequisite must be earned via its existing route;
for immediate browser proof rack +2% Regeneration is enough. Starting points
can be built with `scripts/field_fixtures.mjs` `completeFieldProject(joinField())`
and existing audit enrollment. Do not fabricate the mature record. The rack
projection gate reuses all existing workshop/survey/phase checks.

**Proto23 fixture:** generated ordinary visitor journey: `proto23.chart`,
`proto23.enroll`, `proto23.arrival`, `proto23.cottage_agreement`, purchases
`proto23.buy_bed/buy_hearth/buy_bookstand`, then
`proto23.install_bed/install_hearth/install_bookstand` at the cottage. The
agreement and each installation are two-minute jobs. Inspect:
`proto23Village.schema=1`, player fact `proto23.cottageRight=true`, completed
`proto23.cottage_agreement=1`, cottage site capacity 1, settled player-owned
`simulation.claims['proto23.cottage_right']`. Installed flags are in
`worlds['reference.proto23.village'].facts['proto23.<fixture>Installed']`,
with completed `proto23.install_<fixture>=1` and matching settled player-owned
`simulation.claims['proto23.fixture.<fixture>']`. Carried purchased furniture
must first have no bonus; installation consumes its existing inventory item.
Save/reload/import and leave/reenter to verify only local activation changes.

**Home kit:** native bag exact key `{"id":"Prepared survey kit"}` has positive
integer count, and `actors.player.completed['proto23.home_kit']>0` from the
actual notebook-to-kit job. At Village craft after earning it. Transferring all
kits into the existing chest removes +2% Crafting mastery; bringing one back
restores it. Borrowed copies and extra owned copies cannot increase it.

## Evidence and next gate

Focused `node --test tests/absorb_b.test.js`: 5/5 passed. Covers housing,
owned/unfinished/capped books, installation claims, local scope, earned Shack
phase gating, kit custody, immutable repeated projection and JSON roundtrips.
Full `npm test`: 284/284 passed (161.539 seconds). It started before the final bonus-consumer refinement; the final module was subsequently rerun through the focused 5/5 suite. No unrelated source changed during that refinement. No build,
private-save access or browser run by this worker. Root's authoritative gate:
rebuild, fresh-origin native housing plus earned rack/Proto23 fixture journey,
then actual save/reload/import and native XP/recovery comparison.
