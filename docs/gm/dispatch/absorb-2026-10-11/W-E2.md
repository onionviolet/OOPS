# W-E2 optional equipment maintenance proposal

2026-10-11. Owner: durability worker, exclusive `src/absorb_e2/**`,
`tests/absorb_e2.test.js`, this receipt. Root owns all integration, UI, native
models, save publication and browser acceptance.

Implemented-unverified in browser. No shared source or bundle changed here.
Source: Proto23 audit sections 4/6 and R3 equipment reader; independent code.

## Behavior

Setting defaults off to preserve native pacing and canonical inventory keys.
When enabled, each newly equipped copy receives an immutable `e2_instance`
identity. Already equipped gear gets identity during the staged toggle.
Untouched equal-quality stacks remain native stacks; activation clones before
assigning identity so the remaining stack never shares the equipped instance.

Proposal numbers: 100 condition, 0.04 wear per landed hit (2,500 hits from full).
Player weapon wears when its attack lands; equipped armor and shield wear when
an enemy's hit lands. Evasion and full shield blocks currently skip wear.
Weapon attack scales from 100% to 10%; armor defense and shield strength scale
from 100% to 15%. Gear remains owned at zero. Accessories/tools carry identities
when activated but no wear or utility-stat penalty in this bounded slice.
Repair costs at most five native coins per item, proportional to missing
condition rounded up; a full item costs zero. Disabling restores full combat
performance while retaining damage for a later reenable. No timer or alternate
inventory, currency, save publisher or repair XP.

## Exact minimal root hooks

1. `src/items.js`: import `equipmentDurability as durability` from
   `./absorb_e2/durability.js`. Rename native `getItemFromKey` implementation to
   `getNativeItemFromKey`, then expose the original name with:

   ```js
   function getItemFromKey(key) {
       return durability.bindFromKey(key, getNativeItemFromKey(key));
   }
   ```

   This wraps all return branches and preserves the native components, quality,
   extra stamped-key fields and complete instance key. Native inventory,
   equipment publisher, merchant/storage and NPC decoders keep using the same
   single existing factory. Template definitions stay untouched.

2. `src/models/hero.js`: import singleton from `../absorb_e2/durability.js` and
   `getItemFromKey` from `../items.js`. In `equipItemFromInventory` replace
   `this.equipItem(items[item_key].item)` with:

   ```js
   this.equipItem(durability.prepareEquip(items[item_key].item, getItemFromKey));
   ```

   Native removal still removes the exact incoming key once. Main's equip
   action must preflight `assertNativeItemDisposition` on both the exact key
   and `canonicalDurabilityKey(item_key)` before calling Hero. Apply the same
   dual check to all later dispositions of an instance key. Strip only
   `e2_instance`, never component/quality/other custody stamps. Activation does
   this dual check before allocating identity. Do not rekey borrowed/reserved
   gear to escape native custody, and do not migrate custody records.

3. Root save path: write `save_data.equipment_durability = durability.serialize()`.
   Extend the existing native-patch whitelist to accept the same field.
   Before loading/decoding any native inventory, call
   `durability.load(save_data.equipment_durability)`. After the native equipment
   loader (which otherwise discards additive metadata), call
   `durability.restoreEquipment(character, save_data.character.equipment, getItemFromKey)`.
   Recompute native equipment bonuses and stats afterwards. This restores
   `inventory_key` from serialized equipped instances and explicitly hydrates
   known IDs/full missing condition across both loaded gear and inventory; old canonical gear goes
   through the existing native migration unchanged.

4. Root setting/UI: obtain a stage using
   `durability.stageToggle(character, checked, getItemFromKey, assertDisposition)`.
   Merge its `equipment` and `nativePatch` into the existing expansion plan;
   persist using the existing native equipment/native-patch publications.
   Call `stage.publish()` only after durable storage succeeds, then publish
   native equipment and recompute bonuses/stats. Root render can use
   `durability.enabled` and `durability.rows(character)` to show names, condition,
   cost and affordability. Disable repair on zero cost if desired.

5. Repair UI: `durability.stageRepair(character, key, assertDisposition)` returns
   `external.money`, `nativePatch.equipment_durability`, `quote` and `publish`.
   Merge external money and patch into the normal expansion plan. Persist once,
   then call `stage.publish()` and the existing native money/stats/display
   publication. A rejected storage write must never call publish. Both stages
   leave live coins, ledger, next ID and equipment untouched; retrying a failed
   toggle proposes the same identities. Direct `repair`, `setEnabled` and
   `activateEquipment` are lower-level APIs for fixtures; production UI uses
   staged calls.

Combat root hook (in `src/models/combat.js`): import the singleton, call
`durability.landedHit(fighter, target)` after the evasion/full-block early exits
and before native hit counters (around line 367 at base). On a true result,
recompute the player's existing equipment bonuses and stats. Calling after
evasion is essential. Damage values/getters for the current hit represent the
pre-wear equipment; the next hit uses updated attack/defense. No parallel timer
or hit counter. Enable/disable/repair also recompute stats and refresh combat
panels through the existing root route.

## Save shape and compatibility

```js
{
  equipment_durability: {
    schema: 1,
    enabled: false,
    nextId: 3,
    condition: {
      '{"components":{"head":"...","handle":"..."},"quality":100,"e2_instance":"e2.1"}': 60
    }
  }
}
```

Missing metadata defaults disabled/full. Missing condition on a valid existing
instance key defaults full. Keys never encode condition and never change on
wear/repair, avoiding key/quality collisions and broken native custody lookups.
Previously assigned identities and damage remain while disabled. IDs advance
from loaded metadata and explicit post-load hydration. Factory decoding is a
ledger read: staging new native equipment keys never allocates live condition
or IDs before storage succeeds. Condition clamps to 0..100;
unsupported schemas and invalid records reject instead of silently resetting
user damage. Equipped keys are retained in native item `inventory_key` fields;
inventory keys are retained by the single native decoder hook. Full untouched
stacks require no expansion or migration, and all saved gear stays owned.

## Evidence and root acceptance

Focused native/module tests: six passed. Actual native fixture exercises
InventoryComponent, Hero equip/unequip and native equipment publication; only
main/display presentation imports are stubbed. Two equal-quality copies retain
separate immutable keys, a remaining canonical copy stays unmodified, worn
unequip/re-equip retains condition, publication and serialization/import retain
condition, no coins move on failed staging and borrowed activation rejects.
Full suite `npm test`: 284/284 passed, exit 0, 107.3 seconds, at the
five-test snapshot. The subsequently added sixth armor/shield regression
passed in the six-test focused slice. A subsequent decoder correction moved
ID/condition hydration out of factory reads into explicit post-load/activation
paths; the latest six-test slice also passes the shared publisher preflight
failed-save regression. Full suite predates that correction. No broad retry, per root host-slot
coordination. Root final integrated full suite remains its acceptance gate.

Root fresh-origin browser fixtures still required:

- Old save with setting off: native keys/counts and combat output unchanged.
- Two equal-quality weapons: enable, wear one, swap, verify separate condition,
  repair one with actual coin debit and see combat penalty change.
- Set an equipped weapon/shield/armor to worn condition in a synthetic fixture;
  verify weapon attack, shield strength and armor defense getters and actual
  combat use. Zero keeps gear. Disable/re-enable retains damage.
- Save, reload and import the same fixture with one worn equipped item and a
  second worn item in inventory; preserve keys, counts, condition and balance.
- Reject a repair/toggle durable write and verify no visible state, coin or ID
  change; reject a borrowed/reserved canonical key after identity activation.

Playable balance/director acceptance stays open. Root shared build/browser/
save/import acceptance cannot be claimed from worker tests.

## Native armor follow-up, 2026-10-11

The initial integrated browser proof used a body-wide `Defense:` text match,
which can select an inventory tooltip instead of the hero's native stat.
Root is correcting its proof to read `#defense_slot`.

Added actual native component regression to the native integration fixture:
`{components:{internal:'Goat leather pants',external:'Steel chainmail greaves'},quality:100}`.
Its native `Armor.getDefense()` returns 13 fresh and 4.16 at condition 20.
Calling actual `Person.prototype.addAllEquipmentBonus` produces equipment
protection 13 and 4.16 respectively; repeated calls keep 4.16. Native component
`calculateStats` skips defense entries, so this armor does not have an unscaled
`getStats().defense.flat` contribution. No production module change was needed.

Focused tests pass 6/6 against both the worker native source and the current
root integrated native source (test's temporary esbuild fixture resolves from
the chosen checkout). Root integrated browser gate remains authoritative.
No broad test retry, per root coordination.
