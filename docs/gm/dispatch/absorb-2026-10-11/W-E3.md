# W-E3: optional elemental preparation

Original O9 proposal, awaiting integrated browser evidence and Weibao's balance
acceptance. Worker checkout `absorb-2026-10-11-workers/e3`, branch
`codex/absorb-2026-10-11-e3`, base `c83bd819`. Only this packet,
`src/absorb_e3/**` and `tests/absorb_e3.test.js` are worker-owned.

## Behavior and limits

Matching worn protection adds 4% of an enemy's base attack as native defense
per hit, capped at 12% for each affinity. This does not mean a 12% final
damage reduction. Native armor, shields, critical hits, multi-hit attacks and
minimum damage retain their existing owner. Strong armor can already reach
the damage floor, where the added defense has no effect.

The initial original proposal uses earth for a few ordinary impact encounters,
air for ordinary flying encounters, and water for native aquatic-tag attacks.
Other attacks remain physical. These overlays are invented preparation rules,
not inherited canon or claims that animals cast spells. There is no offensive
element, new reward, skill, inventory, custody, equipment slot or damage engine.
Existing metal/shell gear, waterproof gear and light pelt capes offer the
corresponding protection. Piece and component IDs come from live native
equipment; explicit `affinity:air`, `affinity:earth`, `affinity:water` tags are
also supported on an actually worn item. Quality/stat calculations stay native.

Setting `options.elemental_affinities` defaults **off**, preserving inherited
combat pacing for old saves and new games. Opt-in makes preparation matter.
Only Boolean `true` enables it. Missing, malformed or older values normalize
to false. No item or enemy instance fields need saving, migration or replacement.

## Integration contract for root

Import the following from `src/absorb_e3/elemental_affinities.js`:

- `getElementalDefenseModifier` in `src/models/combat.js`.
- `normalizeElementalOption`, `ELEMENTAL_SETTING_DESCRIPTION` and
  `describeElementalPreparation` in the options/native UI owner.

Combat already imports `game_options` and has `base_damage`. Insert immediately
before the existing `target.takeDamage` call, after block/evasion/crit handling:

```js
if (!this.is_special_combat && target.tags.main_character) {
    defense_modifier += getElementalDefenseModifier({
        enabled: game_options.elemental_affinities,
        attacker: fighter,
        equipment: target.getEquipment(),
        baseDamage: base_damage,
    });
}
```

This intentionally applies to ordinary player defense only, leaving special
combat and enemy armor untouched. Do not hook it again inside Person or Enemy.
The native damage engine remains `mitigateCombatDamage` through takeDamage.

Add `elemental_affinities: false` to `game_options`, a reachable checkbox with
`ELEMENTAL_SETTING_DESCRIPTION`, and this load normalization:

```js
game_options.elemental_affinities = normalizeElementalOption(
    save_data.options?.elemental_affinities
);
```

The existing options object serialization can save this additive Boolean.
The checkbox handler should use `normalizeElementalOption(checkbox.checked)`.
Re-render preparation after toggle, equipment change and combat display refresh.

For native equipment/combat presentation:

```js
const view = describeElementalPreparation({
    enabled: game_options.elemental_affinities,
    equipment: character.getEquipment(),
    encounteredEnemies: encounteredEnemies,
});
```

Render `view.text` and each `view.rows[].text` with `textContent`.
`encounteredEnemies` must contain only current visible combat opponents or
already-known bestiary entries, never the enemy registry. Empty input produces
no enemy rows. Current equipped preparation totals are always safe to show.
The module never reads a registry, save, world-secret owner, hidden intent or
enemy drops; it does not expose unencountered identities. Row names come solely
from the supplied encounters. All numbers and affinity assignments are proposals.

## Evidence and acceptance backlog

Focused `node --test tests/absorb_e3.test.js`: **5/5 passing**. Tests exercise
real native item templates and save-key reconstruction, a matching equipment
swap through native armor mitigation, mismatched attacks, default-off damage,
minimum-damage floors, invalid settings, ownership/slot exclusion, capped
protection and encounter-scoped text. The native template test replaces only
main startup/presentation while loading actual items and enemies.

Full `npm test`: E3's five tests passed within the run, but the existing
`alloy_equipment.test.js` test “equipped native brace with an open road offer
keeps ticking, travelling and reloading” failed at 60,415 ms, matching its
60,000 ms `execFile` timeout. Full pass is not claimed. Several other full
suites were running concurrently; resource contention is possible, not proven.
The suite completed before root's stop request could be applied: **283/284
passed, one failed**, duration 171,245 ms. The attempted TERM found parent test
PID `47867` and its former `simulation.test.js` child PID `48143` already gone.
No worker-owned orphan fixture was found. The log is `/tmp/absorb-e3-test.log`.
Root owns any serialized retry after the competing workers finish.

Serialized worker retry, 2026-10-11: `npm test` completed successfully with
**284/284 passing**, zero failures, duration 8,140 ms. The previously timed-out
native equipped-clock fixture passed. Log: `/tmp/absorb-e3-rerun.log`.
This verifies the isolated worker source/test suite; integrated browser and
save/reload/import acceptance gates remain open.
No shared-engine edits, generated bundle or browser origin was worker-owned.
Integrated gameplay and persistence therefore remain **implemented-unverified**.

Root browser gate after rebuilding, on a fresh origin with generated saves:

1. Show the reachable setting off and normal native damage; enable it and
   verify a currently encountered fitting opponent shows a preparation row.
2. Swap an actually owned fitting protection piece on/off. Exercise a landed
   attack with comparable native stats and see the defense/damage consequence.
   A nonmatching encounter and special fight must retain inherited behavior.
3. Verify only equipped items count, custody kit grants no preparation,
   protection caps at 12%, and unseen opponents do not appear in the view.
4. Save enabled, reload and export/import to retain true and the same derived
   gear protection; import an old/generated save without the setting to get off.

Resume: root owns hooks, options persistence, visible UI, combined build and
browser/save/import journey. Worker finished local module/test scope; the
integration gate and human acceptance remain open.
