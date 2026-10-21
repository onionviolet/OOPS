# Gear stat readers and writers census (L1, 2026-10-20)

Read-only census for L1 of
[EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md](../EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md).
It reports what the code does, not what the design says it should do. Nothing was
run; every claim is from reading the source at the working-tree state of
2026-10-20 (branch `codex/gameplay-foundations`, after L2 commits `a59779004`,
`c3e52f3f3`, plus uncommitted edits by other sessions). Line numbers can drift
with those edits; re-grep before relying on one.

The three L2 dimensions are `damage_taken`, `min_damage_share` and
`crit_resistance` (`src/gear_dimensions.js`).

## Answer in one paragraph

There is **one summation path with per-source tracking** for every person
(hero, NPC): each source writes `stats.flat[source][stat]` or
`stats.multiplier[source][stat]`, and `#updateStats` computes
`full = (base + sum of all flats) x product of all multipliers`
(`src/models/person.js:606-619`). Equipment is one source (`equipment`).
Active effects, titles, books, stance, race, height, light, environment, skills,
milestones and level are the others. There is **no second summation path for
gear stats**. There are, however, **three consumer gaps**: four battle models
that re-implement the hit math ignore the new dimensions (GSR1, GSR2), and enemies
cannot use them (GSR3). Details below.

## Writers (where gear stats enter `stats.flat/multiplier`)

| # | Writer | File:line | Source category | Notes |
|---|---|---|---|---|
| W1 | Equipped items: `defense` from `getDefense()`, every other stat from `getStats()` | `src/models/person.js:279-313` (defense `:293-295`, stats `:296-306`) | `equipment` (reset and rebuilt at `:283-285`) | The only place item stats reach a person. Runs on every equip/unequip: `_equipItem` `:500-515`. |
| W2 | Hero extra: re-applies active effects after equipment | `src/models/hero.js:42-45` | `active_effects` | Only when a simulation effect reader is set (`:37-41`). |
| W3 | Active effects (status, care, book world, paradise, **structured equipment**, living gear) | `src/models/hero.js:125-154`; reader wiring `src/main.js:1060` | `active_effects` | Accepts any stat key, flat and multiplier. See GSR5, GSR6. |
| W4 | Titles | `src/models/hero.js:118-123` | `titles` | Flats and multipliers for any key. |
| W5 | Books | `src/models/hero.js:89-95` | `books` | Multipliers only, only keys in `base_stats`. |
| W6 | Stance | `src/models/hero.js:161-174` | `stance` | Multipliers only, only keys in `base_stats`, replaces rather than multiplies. `Person.addAllStanceBonus` is the base-class version at `src/models/person.js:333`. |
| W7 | Race, height | `src/models/person.js:210-270` | `race`, `height` | Any key. |
| W8 | Base values | `src/models/stat_haver.js:6-46` | `base_stats`, copied to `stats.full` at `:48` | New defaults at `:42-44`: `damage_taken` 1, `min_damage_share` 0.05, `crit_resistance` 0. Source categories declared at `:50-72`. |

## Item-side readers (what produces the numbers W1 consumes)

| # | Reader | File:line | Stat keys | Per-source? | New dimensions? |
|---|---|---|---|---|---|
| I1 | `Equippable.getStats(quality)` and `calculateStats` (armor, weapon, shield, tool, cape via inheritance) | `src/items.js:546-552`, `:555-698` | All keys in `component_stats` across `components`, or `component_stats`/`base_stats` for a single part (`:647`) | Returns `{stat:{flat,multiplier}}`; W1 files it under `equipment` | Yes. Reduction stats get `scaleReduction` (`:604-607`, `:673-675`); `crit_resistance` keeps 3 decimals (`:635-637`, `:682-683`). `defense`, `attack_power`, `block_strength` are skipped here on purpose (`:567-569`) and handled by their own getters. |
| I2 | `ItemComponent.getStats` | `src/items.js:391-393` | Raw `component_stats` | n/a | Passes them through unscaled; the parent item scales them. |
| I3 | `Artifact`, `Amulet`, `Ring` `getStats` | `src/items.js:756-758`, `:1086-1088`, `:1104-1106` | Raw `this.stats` | n/a | **Unscaled**: no quality, no rarity, no `scaleReduction`. A reduction stat authored on a ring is used as written. See GSR8. |
| I4 | `Armor.getDefense` / `calculateDefense` | `src/items.js:909-927` | Internal `defense_value` + external `defense_value`, times quality and rarity | Enters as `flat.equipment.defense` (`person.js:293-295`) | Not applicable. |
| I5 | `Cape.getDefense` | `src/items.js:1056-1068` | `base_defense` | same | Not applicable. Cape `getStats` is inherited (I1). |
| I6 | `Weapon.getAttack`, `Shield.getShieldStrength` reading component `attack_power`/`block_strength` | `src/items.js:812`, `:1015-1017` | Component `attack_power`, `block_strength` | Not through `getStats` | Not applicable. |
| I7 | Component filling (where the dimensions are authored) | `src/crafting_component_filling.js:837` (padding, `crit_resistance`), `:886` (shell, `damage_taken` and `min_damage_share`); `add_properties` `:616-632` | Adds into `component_stats` | n/a | Yes, only producer in `src/`. Interior parts get padding, exterior parts get shell (`:820-900`). |
| I8 | Wear (durability) wrapper | `src/absorb_e2/durability.js:55-62` | Wraps only `getAttack`, `getDefense`, `getShieldStrength` | n/a | **No.** `getStats` is not wrapped, so worn gear keeps full dimension values. See GSR4. |

## Person-side consumers (the reads that matter)

| # | Reader | File:line | Reads | Per-source? | New dimensions? |
|---|---|---|---|---|---|
| P1 | `#updateStats` | `src/models/person.js:561-640` | Every key of `stats.full`; sums all `stats.flat.*`, multiplies all `stats.multiplier.*` (`:606-613`); writes `full`, `total_flat`, `total_multiplier` (`:613-619`) | Yes, generic over categories and keys | Yes, automatically, because `full` is seeded from `base_stats` (`stat_haver.js:48-49`). No special case needed or present. Special formulas exist only for `block_chance`, `attack_points`, `evasion_points` (`:594-600`) and `attack_power` (`:631-640`). |
| P2 | `Person.takeDamage` | `src/models/person.js:465-497` | `full.defense`, `full.min_damage_share`, `full.damage_taken` | Reads `full` | **Yes.** `min_damage_share` as `floorShare`, `damage_taken` through `effectiveDamageTaken` (the 0.5 floor) (`:480-483`). |
| P3 | `mitigateCombatDamage` | `src/combat_math.js:33-36` | Arguments only | n/a | Takes `floorShare` and `taken`; defaults reproduce the old math. Callers must pass them. |
| P4 | Native `Combat` hit resolution | `src/models/combat.js:599` (crit), `:616` (damage) | `fighter.getFullStats().crit_rate`, `target.getFullStats().crit_resistance` | Reads `full` | **Yes** for `crit_resistance` via `effectiveCritChance` (cap 0.75); damage via P2. |
| P5 | `isWearingArmor` | `src/models/person.js:427-434` | `getDefense() !== 0` per armor slot | Not stats | Armor with only dimensions and zero defense would count as unarmored for the xp rule at `combat.js:571,577,631`. See GSR7. |
| P6 | Block strength | `src/models/person.js:89`, `src/models/combat.js:555` | `getStats().total_multiplier.block_strength` | Reads `total_multiplier` | Not applicable. |
| P7 | Hero attack power | `src/models/person.js:631-640` | `total_multiplier.attack_power`, weapon `getAttack()` | Reads `total_multiplier` | Not applicable. |
| P8 | `Enemy.takeDamage` | `src/enemies.js:138-163` | `full.defense` only | Reads `full` | **No.** Calls `mitigateCombatDamage` with defaults (`:153`). See GSR3. |
| P9 | NPC | `src/models/npc.js:8` (`extends Person`) | Inherits P1, P2 | Yes | Yes, for the combat in P4. NPC equipment publication: `src/native_equipment_transaction.js:29-34` writes slots then calls `_equipItem(null)` to rebuild (`person.js:500-505`). |

## Battle models (separate hit math)

All four import `rollCombatStrike` and `mitigateCombatDamage` from
`src/combat_math.js` and call them with defense only. `rollCombatStrike`
compares `attacker.crit_rate` against the draw with no target resistance
(`src/combat_math.js:64`).

| # | Reader | File:line | Where the fighter stats come from | New dimensions? |
|---|---|---|---|---|
| B1 | `commitNativeBattleStrike` | `src/native_battle.js:55` (strike), `:58` (`mitigateCombatDamage(strike.values, target.stats.defense \|\| 0)`) | `readNativeFighter`: `{...actor.getFullStats()}` of the real person (`:18-22`), so the three keys are **present in the snapshot** | **Ignored** (GSR1) |
| B2 | Party battle | `src/party_battle.js:91-92` | Fighter bindings from `readNativeFighter` snapshots (`:86` reads `attacker.stats`) | **Ignored** (GSR1) |
| B3 | Causal story combat | `src/causal_story_core.js:326-328`; validation `:318` | Real NPCs via `readNativeFighter` (`src/causal_story_native.js:212`), or synthetic bodies from `stats()` in `src/causal_story_actors.js:10-14` (no gear keys at all) | **Ignored** (GSR1) |
| B4 | Feature expansion battle | `src/feature_expansion_battle.js:316-319`, `:326` | `src/feature_expansion_battle_host.js:20-22`: for non-player fighters it overwrites `defense`, `attack_power`, `block_chance` from authored `body` data; player uses the real snapshot | **Ignored** (GSR1). `stats.defense` is also edited by guard bonuses at `:313`, a hand-written second defense path, but it adds to the same input of `mitigateCombatDamage`. |

## Display and other readers

| # | Reader | File:line | Reads | New dimensions? |
|---|---|---|---|---|
| D1 | `readPlayerAttributeInspector` | `src/display.js:4405-4540` | `getStats()`, `getFullStats()`, `getBaseStats()`; sources from `stats.flat`/`stats.multiplier` per category via `sourcesFor` (`:4417-4426`) and `playerAttributeSourceLabels` (`:~4396-4403`) | Yes. Rows come from `playerAttributeDefinitions` (`src/player_attribute_definitions.js:26-28`). Percent formatting `:4413`, `player_attribute_definitions.js:50`. Notes at `:4448` via `GEAR_DIMENSION_NOTES` (`player_attribute_definitions.js:52-57`). Floor display for `damage_taken` at `display.js:4477-4480`. |
| D2 | Item tooltip compare | `src/display.js:552-565` | `item.getStats(quality)` vs worn, any key | Yes, generic. Uses `stat_names` (`src/misc.js:37-39`). |
| D3 | Item tooltip body | `src/display.js:694-707`, `:662-663` | `item.getStats()` any key | Yes, but label is `capitalize_first_letter(key).replace("_"," ")` (`:700`, `:705`) which replaces only the first underscore: `min_damage_share` shows as "Min damage_share", and `stat_names` is not used here. Cosmetic. |
| D4 | Per-stat breakdown popup | `src/display.js:4544-4600` | `stats.flat`, `stats.multiplier` all categories | Only for stats that have a clickable slot (`stats_divs`, `:281`); the new dimensions have no sidebar slot. |
| D5 | Sidebar stat slots | `src/display.js:4214-4285` | `full_stats[key]` for keys in `stats_divs`; "Def" `:4280` | **No slots** for the new keys; Attributes inspector is the only display. |
| D6 | Combat readout and combat panel | `src/combat_readout.js:53`, `src/ui/combat_display.js:257`, `:323` | `fighter_stats.defense` | Defense only; no readout of the new dimensions in fights. |
| D7 | Loadout compare | `src/loadouts.js:144` | `totals(character, items)` attack and defense | Defense and attack only; set comparison does not mention the new dimensions. Body of `totals` not read (unverified). |
| D8 | Chronicle context | `src/main.js:2303-2310`, `src/chronicle.js:242` | `stats.defense`, stance `defense` key | Defense only. |
| D9 | Structured equipment projection | `src/structured_equipment_runtime.js:55-91` | Authored `baseDefense`, `coverage`, `movementPenalty` etc. | Emits only `defense` flat and `stamina_efficiency` multiplier (`:85-87`). See GSR5. |

## Findings

**GSR1. Four battle models drop all three dimensions.** `native_battle.js:58`,
`party_battle.js:92`, `causal_story_core.js:328` and
`feature_expansion_battle.js:319,326` call `mitigateCombatDamage` with only a
defense value, and `rollCombatStrike` (`combat_math.js:64`) never reads target
`crit_resistance`. Those battles (native duel, party, causal story, feature
expansion) use the real person's `getFullStats()` for the player and saved NPCs
(`native_battle.js:18-22`), so a hero in padded plate has the dimensions in the
snapshot but they do nothing there. Only `Combat` in `models/combat.js` plus
`Person.takeDamage` consumes them. Impact for L3: affix rolls of these stats
will look active in Attributes yet be inert in those fights. Fix is local: pass
`{floorShare, taken}` and the target resistance through the shared helpers.
Whether those battles are meant to share the gear model is a design call, not
settled by this audit.

**GSR2. The shared strike roller has no target-resistance input.**
`rollCombatStrike({attacker, target, ...})` already receives `target` stats
(`combat_math.js:51-52`) but line 64 uses `attacker.crit_rate` directly. This
is the single spot to fix crit resistance for B1-B4 at once.

**GSR3. Enemies cannot benefit from the dimensions.**
`Enemy.takeDamage` (`enemies.js:153`) ignores `min_damage_share` and
`damage_taken`, though the enemy's `full` stats inherit the defaults
(`stat_haver.js:42-44`) and the crit check in `combat.js:599` does read an
enemy's `crit_resistance` (default 0). Enemy templates (`enemies.js:248-759`)
author only `defense`. If L3 or a world wants armored enemies, they need either
authored values wired into `Enemy.takeDamage` or a shared mitigation helper.

**GSR4. Wear does not touch the dimensions.** `durability.js:55-62` scales
`getAttack`, `getDefense`, `getShieldStrength` by condition, and not
`getStats`. A 15%-condition breastplate keeps its full `damage_taken` and
`min_damage_share`. Also `calculateStats` caches in `this.stats`
(`items.js:547-551`), so condition would not flow through it anyway.
Design call; flagged so L3 does not assume wear applies.

**GSR5. Structured equipment is a second source of defense, not a second sum.**
`structured_equipment_runtime.js:85-87` emits `defense` (flat) and
`stamina_efficiency` (multiplier) as an active effect named "Worn equipment"
(`:87`), delivered through `setSimulationEffectReader` (`main.js:1060`) into the
`active_effects` category (`hero.js:125-154`). It sums with item defense in
`#updateStats` and shows under "Active effects", not "Equipment", in the
inspector. It never emits the new dimensions. Hero only: NPCs do not have the
reader (`hero.js:37-44`). Whether this stacks with, replaces or double-counts the
defense of a native equipped item for the same garment is not established here.

**GSR6. Other sources can write the dimensions with no gear involved.**
Active effects, titles and race/height accept any key (`hero.js:118-154`,
`person.js:210-270`); books and stance only multiply keys in `base_stats`, which
now includes the three (`hero.js:89-95`, `:161-174`). So a title or effect can
carry `damage_taken`, and it will sum with gear. No clamp except
`effectiveDamageTaken`'s floor in `takeDamage` (`person.js:482`) and the
crit-resistance cap in `combat.js:599`. A base-0 flat on `damage_taken` from a
non-gear source adds to base 1 (`person.js:606-614`), a flat `-0.1` equals a
10% reduction, while gear uses multipliers. Mixed styles will both work; the
inspector shows both.

**GSR7. `isWearingArmor` keys on `getDefense()` only.** `person.js:427-434`
ignores stats. An armor part authored with dimensions but zero defense counts as
"no armor" for the xp bonus `combat.js` applies (`target.isWearingArmor()` near
`:575`). Unlikely with current crafted parts (base defense from
`crafting_component_filling.js:~847, 893`), but possible for L3 affixes on
cloth or jewelry.

**GSR8. Jewelry and artifacts bypass rarity and `scaleReduction`.**
`Amulet`, `Ring`, `Artifact` return raw `this.stats` (`items.js:756-758,
1086-1088, 1104-1106`). A reduction stat there is neither quality-scaled nor
rarity-scaled, so a reduction authored at 0.5 stays at 0.5, bypassing the
design that rarity strengthens reductions (`gear_dimensions.js` `scaleReduction`).
`effectiveDamageTaken` still floors the total. L3 affixes on jewelry will need
either explicit scaling or acceptance of unscaled values.

**GSR9. No single per-source breakdown for reduction stats in tooltips.**
Tooltip rows (`display.js:694-707`) show `x0.92` style raw multipliers and the
label bug in D3. Cosmetic.

**GSR10. Inert-but-displayed stats (existing, not L2).** The inspector itself
labels `magic`, `armor_penetration`, `mana_efficiency`, `heat_tolerance` as
reference with no traced consumer (`display.js:4452-4457`). I confirmed
`armor_penetration` is only a base stat, an `Enemy`/`Person` field, and an
inspector row; no `grep` hit in the combat math. `heat_tolerance` is declared
"currently useless" at `stat_haver.js:38`. The three L2 dimensions are not inert
on the hero in `Combat` (P2, P4) but are inert in B1-B4 and for enemies.

## Silent-ignore checklist for any new gear dimension

A new stat key, once authored into `component_stats` or `stats`, is automatically
summed (P1) and displayed in tooltips (D2, D3) with no registration. It is
silently ignored unless a consumer is written at each of these:

1. `Person.takeDamage` or `mitigateCombatDamage` caller (`person.js:480`; B1-B4; `enemies.js:153`).
2. `rollCombatStrike` if it is an offense or crit dimension (`combat_math.js:51-67`).
3. `playerAttributeDefinitions` row, `PERCENT_ATTRIBUTES` and notes, or no row appears in Attributes (`player_attribute_definitions.js:9-50`).
4. `stat_names` for the label (`misc.js:37-39`), or the tooltip falls back to the raw key.
5. `stat_haver.js` base default, or `full` is `undefined`/`NaN` (`base_stats[stat] + stat_sum` on `undefined` gives `NaN`, `person.js:613`). Unverified by running; read from the formula.
6. Rarity and quality scaling branch in `calculateStats` (`items.js:600-640`, `:672-684`), or it gets the default `^0.33` multiplier and rounded 2-decimal flat handling that can round small values to 0 (the reason `crit_resistance` has its own 3-decimal branch).
7. Durability wrap (`durability.js:55-62`) if wear should affect it.

## Not verified or not read

- Nothing was executed: no tests, no game, no save loading. Behavior claims are from reading.
- I did not read `src/absorb_c1/accessories.js` past a stat/flat grep: it defines utility amulets with `stats: {}` (`:40`) and reads equipment through its own `equipmentReader` (`:58-98`) for craft luck, drops and trade margin. It does not write to `stats.flat/multiplier`. This is a non-stat gear effect path; the census does not evaluate it further.
- `src/alloy_equipment.js:5-7` `deriveBraceStats` is called at `src/items.js:4568` (the Amulet template `stats`, so it reaches `Amulet.getStats`, unscaled, see GSR8) and `src/crafting_recipes.js:191`. It emits only `agility` and `strength` flats, never the three dimensions. Traced after the first pass.
- `src/loadouts.js:89-98` `totals()` sums only `getAttack()` and `getDefense()` per item, confirmed: the loadout compare ignores every `getStats` dimension. Also not read: `src/active_effects.js` effect definitions (a `crit_rate` multiplier at `:453`), `src/combat_stances.js` beyond a stat grep, `src/absorb_p23/living_gear/*` (it feeds an `attack_power` multiplier effect only, `main.js:1056`), `src/audit_remainder_combat_fit_hooks.js` beyond its `defenseBonus` use, or `src/models/location.js:385` (enemy defense display).
- `Cape` has no `getStats` override in the lines read (`items.js:1027-1068`), so it uses I1; I did not read its constructor for `component_stats`.
- Whether any shipped saved NPC currently wears an item whose stats include the new dimensions is unknown; the NPC path (P9) is wired for it.
- Live routes (traced after the first pass): ordinary fights run `new Combat(...)` with the hero against enemies (`main.js:4697`), so they use P2/P4. The scripted native duel/party contests also build a `Combat` (`native_battle_host.js:35`, special combat) but route each strike through `commitNativeBattleStrike` or `commitPartyBattleAction` with `readNativeFighter` snapshots (`:46`), so B1/B2 damage is what applies there. Mara and Lio are `Enemy` objects (`:31`). So GSR1 affects the scripted contests, not ordinary fights. B3/B4 routes were not traced the same way.
- Packaged build (`dist/bundle.js`) was not read; this audit is source only.
