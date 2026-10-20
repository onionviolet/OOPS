# M1: vitals reader inventory (2026-10-20)

Owner: [dials palette Round 5](../../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md#round-5-per-world-meters-bars-2026-10-20)
(WDI46 to WDI60). Rules: AR3, AR12, AD38. Doc only; a read of `src/` as of this date.
Command: `grep -rn "vitals" src` excluding `src/world_packs`: 495 lines in about 60 files.

## Shape of the use

| Pattern | Count (lines) | What it means |
|---|---|---|
| `vitals: {...}` seeds in content | 154 | Pack and actor definitions write `health`, `max_health`, `stamina`, `max_stamina` literally |
| `vitals.health`, `vitals?.health` | 78 | Readers: eligibility, battle, story facts, UI |
| `vitals.stamina`, `vitals?.stamina` | 48 | Same, for stamina |
| `max_health`, `max_stamina` | 74 each | The ceiling is a sibling key, `max_<key>` |
| `vitals[...]` computed key | 24 | Already generic by key |

Nothing reads a mana vital: `vitals.*mana` has zero hits. The legacy native game has a mana bar in
`index.html` and `display.js:4494` (`['health','stamina','mana']`), but it is the native
character, not a `person.vitals` field.

## Where a new key is refused (the only hard gates)

| File:line | Gate | Consequence |
|---|---|---|
| `src/simulation_contracts.js:57` | A `vital` effect must have `key` in `[health, stamina]` | A new vital cannot be spent or gained by a command |
| `src/simulation_contracts.js:239` | Saved `person.vitals` keys must be `health, stamina, max_health, max_stamina` | A new vital would fail save validation; this is the persistence decision WDI55 names |
| `src/native_gameplay_adapter.js:52-62` | Native player vitals sync only stamina and health offsets | The player's native pool is projected only for those two |

The effect application at `src/simulation_effects.js:288-297` is already generic: it reads
`vitals[e.key]` and `vitals['max_'+e.key]`. So the engine is key-generic and the two allow-lists
above are the whole restriction.

## Findings

| Code | Finding | Consequence |
|---|---|---|
| M1-1 | Adding a vital means widening two allow-lists plus a save migration, not touching 495 readers | Cheap for a new pool; the cost is the compatibility decision, not code volume |
| M1-2 | "Mana as HP" needs an accessor for which vital the death and incapacity checks read. These checks read `vitals.health` directly (for example `agreed_duty_facts.js:47`, `action_legibility.js:226-238`) | Hold until a world needs it (WDI60). One named accessor then replaces about 78 direct reads, a larger change than a new bar |
| M1-3 | Energy policies (`energy_resources.js`) already model reserve, strain and limit with their own validation and saved record | Meters that fit pool or accumulator shapes should use this, not `vitals` (WDI46) |

## Decision for M3 (proposal)

Do not widen the vitals allow-lists for the first slice. LOTM spirituality and strain already live
in the energy record, so M3 renders them as meters with no new saved field and no migration. A first
true new vital (a mana pool, or HP remapping) is the point to decide the save migration.
