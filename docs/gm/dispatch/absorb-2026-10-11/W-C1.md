# W-C1 utility accessories

Status: owned implementation ready; shared integration and browser/save gates pending.
Parent: root absorption wave. Exclusive writer: `src/absorb_c1/**`,
`tests/absorb_c1.test.js`, this receipt. Base `c83bd819`, checkout
`/Users/weiwei/code/absorb-2026-10-11-workers/c1`, branch
`codex/absorb-2026-10-11-c1`. No shared files or build outputs edited.

Source: Proto23 audit sections 4/6 and readers R2/R3/R4. Original names and
implementation; uses the utility-build idea, not source text/code. Numbers,
fiction, recipes and one-slot balance are proposals awaiting playable review.

## Behavior and acquisition

All four are ordinary native Amulet templates, obtained through unlocked
Crafting > items recipes at a native crafting station. Each uses the existing
amulet slot, displacing its previous item through native equip behavior. No
inventory/storage/custody ownership creates a passive bonus. No new slots,
quality rules, rewards, XP track or parallel inventory.

| ID/name | Materials | Equipped utility |
|---|---|---|
| Knotted chance charm | 2 Rat tail, 1 Piece of willow wood | +2 percentage points nonzero item-recipe success, capped at 100%; equipment quality unaffected |
| Forager pendant | 3 Rat fang, 3 Rat tail | +5% relative enemy item-drop chance, quantity unchanged |
| Market tally pendant | 1 Iron ingot, 1 Rat tail | 5% reduction of shop markup, no change to selling/base value |
| Travel hearth pendant | 2 Iron ingot, 2 Piece of willow wood | Tier 1 cooking at safe locations after native crafting unlock; higher station tiers retained |

Native Crafting level 1-8 recipe curve, success 65%-100%, one accessory per
successful craft. The usual native material consumption, XP and custody checks
remain required. These are fixed-quality utilities (`use_quality=false`), like
native utility amulets; no alteration of existing quality-bearing equipment.
Descriptions are the readable bonus text, already stored on native templates.
`accessoryBonusText(item)` also exposes that text for a summary if desired.

## Exact root integration seams

The module has **no imports**. It does not import main, trade, native items or
character; shared modules can import its helpers without adding a cycle.

1. `src/items.js`: import `registerAccessoryItems` from
   `./absorb_c1/accessories.js`; immediately before bottom `setup_ids();`, call
   `registerAccessoryItems({item_templates, Amulet});`. Keep existing native
   ID/availability setup and exported classes.
2. `src/crafting_recipes.js`: import `registerAccessoryRecipes` and
   `accessoryCraftChance`; after the final `const recipes = {...}` and before
   `Object.keys(recipes).forEach(...)`, call
   `registerAccessoryRecipes({recipes, ItemRecipe});`. In
   `Recipe.get_success_chance(station_tier=1)` (base lines 80-84), wrap its
   existing return expression in `accessoryCraftChance(...)`. That central
   consumer serves both crafting execution and tooltip/XP estimation.
3. `src/models/combat.js:438`: import `accessoryDropModifier`; change the
   passed drop chance modifier from `1/target_count**0.6667` to
   `accessoryDropModifier(1/target_count**0.6667)`. Preserve tag-skill
   coefficients in Enemy.get_droprate_modifier, drop count and kill rewards.
4. `src/components/trader_component.js:140`: import `accessoryTradeMargin`;
   wrap the existing computed margin return expression in
   `accessoryTradeMargin(...)`. This single margin source already serves
   displayed prices, quoted trade and final charged prices. Discount only the
   markup; selling remains native and price never falls below base due to
   this accessory.
5. `src/main.js` and `src/display.js`: import `accessoryCraftingTiers`.
   Resolve tiers with `accessoryCraftingTiers(location, undefined,
   global_flags.is_crafting_unlocked)` instead of reading crafting tiers
   directly. Main's `use_recipe` base line 3631 must reject missing category
   tier before any ingredient changes, not trust only an open old menu.
   Display's `open_crafting_window` base line 2767 should use the same tiers;
   tooltip station tier base line 3211 should use them too. Display's native
   crafting button base lines 2083-2089 should show when the resolved tiers
   have an available category, using `location.crafting?.use_text ||
   'Cook with travel hearth'`. Preserve all other global craft gating.

Host initialization: import `setAccessoryEquipmentReader` in main and install
one live reader after expansionState/character exist:

```js
setAccessoryEquipmentReader(() => {
    const equipment = character.getEquipment();
    const amulet = equipment.amulet;
    if (amulet) {
        try {assertNativeItemDisposition(expansionState, amulet.getInventoryKey());}
        catch {return {};}
    }
    return equipment;
});
```

This keeps borrowed/custody/escrow restrictions authoritative and reevaluates
ownership on every read. Do not capture an equipment snapshot or serialize
utility counters. Helpers accept explicit equipment for previews/tests; runtime
consumers should use the custody-filtered reader. After equip/unequip in a safe
zone, refresh location choices so the portable cooking button updates; refresh
crafting availability/tooltip when an already open menu loses an accessory.

Native fixture discovery: direct freshly-created InventoryComponent entries
can have `item.inventory_key` undefined until getInventoryKey() is called.
`use_recipe` base lines 3645 and 3711 currently read that property directly.
Use `entry.item.getInventoryKey()` for disposition assertions and material
consumption; this preserves native key identity without depending on prior UI
rendering. The isolated integration test explicitly exercises fresh entries.

## Save/default/compatibility

No new fields/schema. Native `character.inventory` keys carry accessory IDs;
`character.equipment.amulet` stores the native item instance as before. New
recipes register in existing `availabilities.recipe` and start unlocked.
Absent accessories on old saves derive neutral utility (chance +0, drops x1,
markup reduction 0, cooking tier 0). Native ID and name are identical, so native
non-component equipment loading by name remains compatible. Reconstruct from
native templates; ignore any serialized forged utility metadata.

API defaults: the injected reader returns `{}` before initialization. Native
crafting tiers are copied only from unlocked stations; portable cooking requires
`tags.safe_zone` and the craft unlock. Combat/unknown locations grant nothing.
Locked station types gain only portable cooking, not forging/etc. No recipe or
skill/material requirement is bypassed.

## Checks and remaining gate

- `node --check src/absorb_c1/accessories.js`: passed.
- `node --test tests/absorb_c1.test.js`: 6/6 passed. Includes real native Amulet,
  ItemRecipe, availability, inventory/material lookup and consumption, native
  equip/unequip, serialized equipment and inventory-key reconstruction; neutral
  old/default state, markup floor, cooking safety/unlock/locked station,
  stronger station preservation, live injected custody filtering, and no
  borrowed utility from another slot or arbitrary serialized metadata.
- Full `npm test`: **not passed**. Concurrent-host run finished with 258 tests,
  256 passed, 1 failed, 1 cancelled, duration 147104.544125 ms.
  `tests/alloy_equipment.test.js:118` hit its existing 60-second child-process
  timeout (`fixture/generate.mjs --equipped-clock`, killed SIGTERM);
  `tests/simulation.test.js` ended with a pending-promise cancellation. Root
  diagnosed concurrent-suite overload and requested stopping this process
  tree. A Ctrl-C was sent to session 37398; it returned exit 1 with the above
  completed failure output. No competing rerun started. Superseded by the clean serialized rerun below. Local log:
  `/tmp/absorb-c1-npm-test.log`.
- Production hooks, rebuilt bundle, fresh-origin browser and actual envelope
  save/reload/import remain **implemented-unverified** until root integrates
  and runs them. Native key/JSON checks are not a browser persistence receipt.

Fresh-browser fixture steps for root: rebuild, serve one fresh localhost origin,
activate native crafting unlock and add only recipe ingredients in test state.
Craft each via Crafting > items; confirm ingredients leave inventory and each
result is equippable in the amulet slot. Compare a native item recipe tooltip
with/without the chance charm at a nonmaximal Crafting level. Equip Forager
pendant and force the native drop roll to a value just above the unmodified
threshold; repeat unequipped to prove the modifier, not quantity, changed.
Equip Market tally pendant and compare one quoted shop purchase with the
charged amount; test selling stays native. Equip Travel hearth pendant in a
safe stationless location: the native cooking button/category appears, a
recipe consumes ingredients and produces food; unequip and confirm execution
is denied from a stale menu, then confirm combat location has no portable
station and a tier-3 kitchen retains tier 3. A failed custody disposition must
show neutral bonuses. Save a crafted/equipped accessory, reload and export /
import into a second fresh origin; compare ID, equipped utility and money /
material counts. Load one pre-wave fork save with no new recipe availability
fields and confirm no free accessory or utility is fabricated.

Serialized verification, 2026-10-11: root granted the exclusive full-suite
slot after B completed. Process/cwd inspection found no active native test or
fixture processes. `npm test` then passed **285/285**, 0 failed, 0 cancelled,
duration 24198.278459 ms; session 96535 completed exit 0. Evidence log:
`/tmp/absorb-c1-npm-test-serial.log`. This closes the worker full-suite gate
only; production integration and fresh-browser save/reload/import remain open.
