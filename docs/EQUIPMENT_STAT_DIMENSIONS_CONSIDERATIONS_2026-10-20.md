# Equipment stat dimensions: many stats at once, affixes and sockets

Considerations round, 2026-10-20. Palette, not a spec; everything here is a
proposal unless it cites an accepted line. Triggered by Weibao's instruction
(2026-10-20) after the Arcanum Discord notes on armor: gear need not pick one
armor model (flat, percent or weight cost); it can carry many different stat
dimensions at once, as the Minecraft Apotheosis mod does. Codes: ESD.

Applies: AD5 (both, depending on the world), AD38 (mechanisms, not allowed-outcome
lists), AD6-AD8 and UR40 (shown numbers and sources), GR1-GR17 (generator
contract), CBR (combat rules), MKR-IM2 and MKR-AB2 (typed sockets, proposed),
and the 2026-10-17 deferred old-save decision.

## What was read

| Source | Read | Not read |
|---|---|---|
| Fork stat pipeline (`src/items.js`, `src/crafting_component_filling.js`) | Quality and rarity scaling; component stats as `{flat, multiplier}` per stat; 2-decimal rounding when parts combine | Character-side summation and the Attributes view consumers beyond a key census |
| Apotheosis data (extracted under `docs/research/minecraft/private/extract/apotheosis/`, 26.1.2-9.1.0) | 5 rarity files (common to mythic), affix folders by gear class, one armor affix, one gem | Roll order in code, upgrade/salvage costs, loot tables, gateways |
| Arcanum Discord (private notes F17, F26-F28, P20-P22) | Armor design talk, paraphrased | Most of the 59 armor hits |

Key census of stats already in the fork (counts of mentions): dexterity,
intuition, agility, strength, max health, stamina efficiency, max stamina,
health and stamina regeneration (flat and percent), health loss, evasion points,
attack points, attack speed, crit rate and multiplier, defense, cold and heat
tolerance, max mana, magic, perception, unarmed power. So the fork already has
many dimensions; the open question is how gear can add to them in layers.

## Answer to "implement them all"

Yes, they can coexist. Flat reduction, percent reduction, weight and stamina
cost, agility cost and per-piece multipliers become separate dimensions on the
same gear, and which one dominates is a dial per world or per item with a
reason (AD5, AD38). Nothing here needs a choice between models. This round
only fixes the constraints that keep many dimensions legible and safe.

## Apotheosis, as data (paraphrase)

- Rarity is a data file with rules: how many stat affixes, a basic-effect
  affix, and chanced extras; higher rarity means more and larger rolls.
- An affix is a record: gear categories it can appear on, a type (attribute,
  mob effect, damage reduction, ability, enchantment), an operation (add a
  value, or add a fraction of base), a min-max value range per rarity, spawn
  weights, and an exclusive set so incompatible affixes do not stack.
- Gems are unique records with several bonuses, each limited to a gear class,
  and a quality ladder (cracked, chipped, flawed, normal, flawless, perfect).
- Everything is readable data, so content grows without code edits.

## Considerations

| Code | Item |
|---|---|
| ESD1 | **One modifier pipeline.** Flat, then percent, then multiplier, in a stated order; every value keeps its sources (item, part, material, affix, gem, skill) so the Attributes view explains it. The fork already stores `{flat, multiplier}` per stat; extend that rather than add a second path. |
| ESD2 | **Caps are adjectives.** Diminishing returns or a soft cap on stacked multipliers is a dial per world with a reason, not a fixed number. This answers the per-piece multiplier worry (a small bonus on every piece multiplies fast). |
| ESD3 | **Affix source defaults to mechanism.** Material, part, maker, damage taken, provenance (a blade quenched in something) give an affix a cause. Pure random rolls are a dial per world and use the seeded generator contract (GR1-GR17). Generated item affixes were never proposed before ([status](PROCEDURAL_GENERATION_STATUS_2026-10-13.md)), so this is new. |
| ESD4 | **Affix record, not code.** Gear class, type, operation, range, weight, exclusive set, in data with stable IDs; no logic in strings. |
| ESD5 | **What counts as armor is the slot,** not the presence of a defense stat; trinkets and weapons may carry defense without being armor. |
| ESD6 | **Costs make stats earn their place.** Weight, stamina efficiency and agility cost are dimensions too, reduced by a skill; a stat with no visible cost invites the "useless or mandatory" complaint players raise. |
| ESD7 | **Material interactions are mechanisms.** Crushing beats rigid armor, piercing fails against plate, and so on; counters come from physics in play, not a list of allowed outcomes. |
| ESD8 | **Sockets reuse the part interface registry** (MKR-IM2 and MKR-AB2) instead of a separate gem system; a gem is a part with a typed socket and a quality ladder. |
| ESD9 | **Preserve or reroll.** Upgrading known gear versus salvaging unfamiliar loot should both be real choices (Apotheosis scout question R1); decide which rolls survive an upgrade. |
| ESD10 | **Persistence.** Affixed and socketed gear is new saved state: store the affix IDs and rolled values (or the seed and inputs), derive totals on load. Old-save compatibility is currently deferred (2026-10-17), so a migration is not required, but say so in the task record. |
| ESD11 | **Legibility.** Item tooltip and the Attributes view show each affix, its source and what it does to which stat; a cheat or inspector view can list affixes and force one for tests, without leaking into saves. |
| ESD12 | **Exclusive sets and tags.** Mutually exclusive affixes, and tags (heat, shadow, nature) so world rules can read them. |
| ESD13 | **Idle fit.** Rolls resolve at craft or drop time, never per tick; totals are cached and recomputed when equipment changes. |
| ESD14 | **Tier ladders.** Rarity already exists with colors and a quality multiplier (trash to mythical). Map "number of affixes by rarity" onto it rather than adding a second rarity. |
| ESD15 | **Reference, not import.** Apotheosis supplies structure and vocabulary; stats, names and values are native, and the Minecraft data is not copied into the game. |

## Quality presentation scout, 2026-10-20 (proposal)

Other games communicate several different ideas that the current percent label
blends together:

- Dwarf Fortress and RimWorld show workmanship as named grades such as
  *well-crafted* or *excellent*. The grade is quick to scan; the item’s actual
  material and effects remain separate details.
- Path of Exile separates rarity (normal, magic, rare, unique) from explicit
  named modifiers. Last Epoch uses color to signal item/affix status and still
  lists the affixes themselves.
- Apotheosis uses rarity to shape the number and strength of affixes. The
  affixes carry the concrete effects; rarity is the summary signal.

**ESD16 (proposal): show workmanship, rarity, and effects as separate facts.**
Keep the underlying quality value for existing calculations and compatibility,
but show a short grade as the headline (for example, *Fine* or *Masterwork*),
show rarity as a separate tag when it has meaning, and list the rolled or
mechanism-derived affixes with their values and causes. A world may define what
counts as good for its materials, use, maker, and rules. Do not make a single
percentage the universal verdict. The exact display ladder and world-specific
meaning remain open; this is a presentation proposal, not an accepted decision.

References: [Dwarf Fortress item quality](https://dwarffortresswiki.org/index.php?title=Item_quality),
[RimWorld quality](https://rimworldwiki.com/wiki/Quality),
[Path of Exile item data](https://www.pathofexile.com/item-data),
[Last Epoch item colors](https://support.lastepoch.com/hc/en-us/articles/46363247127963-What-do-item-colors-mean),
[Apotheosis](https://www.curseforge.com/minecraft/mc-mods/apotheosis).

## Disposition

**ACT NOW (done in this round).** Record Weibao's 2026-10-20 instruction in
[USER_VISION](USER_VISION.md) as a new dated entry that updates the 2026-10-15
wording (Apotheosis as inspection reference only); add this doc to the router.

**ACCOUNT FOR NOW.** ESD1 (one pipeline with sources), ESD2 (caps as dials), ESD3
(mechanism before random), ESD5 (slot defines armor), ESD10 (persistence
decision), ESD15 (reference only).

**LATER / DELEGATE** (none authorized to start by this doc).

| Item | Level | Effort | Done check |
|---|---|---|---|
| L1. Census every stat consumer of gear stats and confirm one summation path with sources | Medium capability | Small | A list of readers, a note on any second path, linked from the task record |
| L2. First playable slice: 2-3 new dimensions (for example a weight cost, a flat damage reduction and a per-piece multiplier with a soft cap) on existing gear through the existing pipeline | Medium to high capability | Medium | Rebuilt browser check at laptop width: equip, see each dimension and its source in Attributes, compare before and after; focused tests plus `npm run build && npm test`, `check:arch`, `check:rules` |
| L3. Affix data format and 5-10 native affixes on one gear class, seeded rolls, exclusive sets | Medium to high | Medium | Save, reload and import keep the affixes; inspector lists them |
| L4. Sockets and gems through the part interface registry | High | Large | After L2 and L3 land and MKR-IM2 is accepted |
| L5. Read the Apotheosis roll order, upgrade and salvage rules in code | Medium | Small | Notes in the research folder, unread items resolved |

Proposed first playable slice: L2, with the target viewport laptop width,
visible outcome "gear shows several stat dimensions and their sources," and
mobile deferred.

## L2 slice record, 2026-10-20 (implemented; combat not exercised in a browser)

Target viewport laptop width (1440x900); mobile deferred. Visible outcome: gear shows
several stat dimensions with their source in the Attributes inspector.
Applied codes: ESD1, ESD2, ESD3, ESD5, ESD6, ESD13, ESD15; AR1-AR16 (no main.js growth,
display.js shrank by a data move); AD36 (focused checks, then required gates).

What changed. Three new native dimensions, all through the existing
`stats.flat/multiplier[source][stat]` path (so "Equipment" shows as the source):
`damage_taken` (multiplier after flat defense, floor x0.5 as a dial), `min_damage_share`
(multiplier on the 5% chip floor) and `crit_resistance` (fraction of an attacker's crit
chance removed, cap 75% as a dial). Hard outer armor parts (material strength, tier, part
size) carry the first two; soft inner parts (warmth, tier, part size) carry the third. Item
rarity strengthens reductions instead of undoing them. Weight already cost stamina
efficiency, agility and attack speed (ESD6 existed), so no separate burden stat was added.
Files: `src/gear_dimensions.js` (new, pure), `src/player_attribute_definitions.js` (new, data
moved out of display.js), `src/combat_math.js`, `src/models/person.js`,
`src/models/combat.js`, `src/models/stat_haver.js`, `src/crafting_component_filling.js`,
`src/items.js`, `src/display.js`, `src/misc.js`, tests `tests/gear_dimensions.test.js` and a
fixture update in `tests/p23-combat-options.test.js`.

Checks (evidence is for the inputs named):
- Focused: `node --test tests/gear_dimensions.test.js tests/p23-combat-options.test.js` 20/20,
  including a test that equips Steel chainmail armor on the native hero and compares the health
  lost to a hit bare versus worn (percent layer applied after flat defense), plus crit
  resistance and per-source totals.
- Full: `npm test` after the build and final edits: 2293 pass, 1 fail. The one failure was
  `traveler_lint_hint` hitting a 100 ms script-timeout under load; it passes alone (3/3) and
  the previous full run was 2293/2293. An earlier run had 4 failures from the combat test's
  hand-built sandbox missing the new dependency, fixed in that fixture.
- `npm run check:arch` passes (display.js 6737 vs baseline 6767); `npm run check:rules` passes.
- Browser (laptop width 1440x900, fresh origins): on the real rebuilt bundle a fresh game
  showed the three new rows and no console errors, with Critical resistance 3.3% from the
  cheap-leather start item. On a scratch dev-mode copy (dev console on, repo config untouched)
  the hero wore Steel chainmail armor and Attributes showed Damage taken x0.963 (Equipment),
  Minimum share of a hit 4.5% (x0.9) and Critical resistance 10.6%, each with its source row,
  beside Stamina efficiency x0.95 (the existing weight cost).
- Not exercised in a browser: damage taken in native Combat with the new gear (the dev
  `go_to` shortcut paused the simulation clock; the village duel and party/causal battles use
  their own simple models that read only flat defense, so they ignore the new dimensions), the
  "Default floor" Attributes row (no current gear reaches x0.5), and save, reload and import
  (no saved state added; totals derive from item components). These stay on the acceptance
  backlog; this record is its owner until a wave backlog takes it.
- Commit note: when committing, keep the mechanical `src/player_attribute_definitions.js`
  data move (structural) in its own commit before the dimensions (behavior).
- Not changed: enemies carry no new stats, so only the player's gear benefits; save
  format unchanged (stats derive from item components on load).

Historical open question, resolved in the 2026-10-20 follow-up: Weibao directed the shared
person/creature slice below. Party and village-duel reader models remain a separate follow-up.

## L3 slice record, 2026-10-20 (implemented; crafting commit unit-tested only)

Target viewport laptop width (1440x900); mobile deferred. Visible outcome: armor carries affixes
and Attributes shows one source row per affix. Applied codes: ESD3, ESD4, ESD10, ESD12-ESD14;
GR1-GR17 (random injected, rolls at craft commit only); AR1-AR16 (main.js 10310 baseline to
10304, display.js 6737 vs 6767); CBR (battle models untouched); AD5, AD36, AD38.

What changed. `src/gear_affixes.js` (new, pure): affix records (stable ID, gear class, stat,
operation flat or percent, base range, weight, exclusive set, tags, optional mechanism cause),
8 native armor affixes (reinforced, padded, hardened, cushioned, nimble, lightweight, vital,
insulated) and three exclusive sets (mitigation, mobility, climate). Defaults and dials with
reasons are in the file header: `AFFIX_COUNT_BY_RARITY` (none below uncommon, up to 5 at mythical),
`RARITY_RANGE_SCALE` (ranges widen up the existing `getItemRarity` ladder, so no second ladder),
`WORLD_AFFIX_DIALS` (random rolls on or off per world; only the base world is listed, main passes
no world yet). Source order: mechanism first (padded follows the internal part tier, hardened the
external part tier; not capped by rarity), then random rolls fill up to the rarity count. Reduction
affixes store the reduction fraction, so a higher roll or rarity always means less damage taken.
Pipeline: new `affixes` category in `stats.flat/multiplier` (stat_haver.js), refilled on every
`addAllEquipmentBonus`, so totals include affixes and Attributes shows "Affix Padded (item, from
its parts)" rows through `affixSourceRows` (re-exported by `player_attribute_definitions.js`). Affixes do not
pass through the item rarity block in `calculateStats` (the ranges already encode rarity).

Persistence (ESD10). Armor with components saves `affixes: [{id, v, s}]` in its inventory key
and on the equipped item; `normalizeAffixes` makes it canonical (sorted by id, 3 decimals, one
per exclusive set, clamped to the widest range, unknown IDs dropped without throwing), so a key
built after load equals the saved key and different rolls never share a stack. Totals derive on
load. Rolls resolve in `affixedCraftEntries` at the crafting commit (one `gameRandom(STREAMS.craft)`
draw sequence per crafted piece); previews, `getResult`, loading and tooltips never roll.
Old-save compatibility: deferred by the 2026-10-17 decision; saves without `affixes` load as
plain armor, no migration was written. Scope: armor made from components only (clothing and
weapons, shields, trinkets carry none yet).

Checks (evidence is for the inputs named):
- Focused: `node --test tests/gear_affixes.test.js tests/gear_dimensions.test.js` 13/13 (affixes:
  determinism, rarity count and dial, exclusive sets over 200 seeds, range monotonic in rarity,
  mechanism, canonical normalize, craft grouping, and a real-armor key round trip with pipeline
  totals, cleared category on re-equip).
- Full: `npm run build && npm test` 2288 pass, 0 fail; `npm run check:arch` and `npm run check:rules` pass.
- Browser (1440x900 emulation, scratch copy of the rebuilt bundle with dev mode on, fresh origin):
  injected a save with an affixed and a plain copy of the same armor: they load as two stacks
  (this caught the inventory load path dropping affixes, fixed in main.js), equipping the
  affixed one shows Damage taken "Equipment x0.935" plus "Affix Padded (Steel plate armor, from
  its parts) x0.955"; saving writes the affixes on the equipped item; reload restores the same rows.
- Follow-up play gate (1440x900, fresh scratch origin): used the native crafting UI to make the
  leather interior and steel chainmail exterior, combined a legendary 212% chestplate, inspected
  its Attributes and affix sources, saved, reloaded, exported, then imported it. The same item key,
  four affixes and displayed attributes survived all steps. No user save was used.
- Still open: item tooltip and inventory names do not list affixes yet (ESD11 gap: Attributes only),
  drops and trader stock do not roll affixes, and four battle models still ignore dimensions.


## L1 record, 2026-10-20: toughness (GDP15/GDP16)

Viewport target 1920x1080 desktop; mobile deferred. Rules: AD5, AD38, AD36, AR1-AR16.

- Material data: `toughness` is an optional property beside strength in
  `src/crafting_component_filling.js` material_properties. Absent, it derives as
  `130 - 0.6 * strength` clamped 20..120 (strength 60 gives 94, 100 gives 70, 200 gives 20), so
  rigid strong metals default lower and soft fibrous materials higher. Dial and reason: stiffness
  trades against shatter resistance; any material may override it with an in-world reason. First
  override: "cheap iron" 45 (cast iron, hard but brittle) against steel and iron at the derived 70.
- Math (`src/gear_dimensions.js`): `materialToughness` returns value and source (authored or
  derived); `wearScale` divides wear by the mean of hardness (strength/100) and toughness/100,
  relative to a 100-strength, 70-toughness reference (scale 1), clamped 0.5..2. Defaults, not absolutes.
- Consumer: `wearItem` in `src/absorb_e2/durability.js` multiplies `wearPerHit` by the instance's
  `getWearScale()` (items.js `Equippable.getWearProfile`, the mean over its filled components).
  `wearItem` is reached in play from `durability.landedHit` (`src/models/combat.js:591`) for the
  hero's weapon and worn shield/armor on a landed hit in non-special combat. Tool `wearUse` is
  unchanged. Gear without material-filled components (hand-authored clothing such as Cheap leather
  pants, native items) has no profile and wears at scale 1; that gap is open.
- View: Attributes has a "Gear toughness" row (mean over worn component gear), with one source row
  per part "<item>: <material> <slot> (authored | derived from strength)" and the wear-per-hit scale per item.
- Save format: no change. Toughness derives from component templates; nothing is stored or migrated.
- Checks: focused `node --test tests/gear_dimensions.test.js tests/absorb_e2.test.js` (the new
  regression runs real `wearItem` on Weapon instances; the absorb_e2 native-weapon test now expects
  the item's own scale instead of a flat 40 loss). Then `npm run build && npm test` (2281 tests),
  `npm run check:arch` and `npm run check:rules` passed after that test update (the one failing
  absorb_e2 expectation was fixed and re-run green on its file).
- Browser (rebuilt bundle, scratch copy with dev console on, repo config untouched, fresh origin,
  1920x1080, durability on): Iron sword and Cheap iron sword share a 100-strength blade and the same
  handle. Attributes showed Gear toughness 82 (wear x1.049, iron head derived) against 69.5 (wear
  x1.137, cheap iron head authored 45, wooden handle derived 94), each with source rows.
- Not exercised: a real landed-hit fight comparing condition loss in the bundle (the Infested field
  was locked and `simulate_combat` is a special combat that skips wear), so the per-hit difference is
  proven by the regression only; save, reload and import (nothing stored); enemy and party models.
  Backlog owner: this record.

## Sources

[Apotheosis author page](https://www.curseforge.com/minecraft/mc-mods/apotheosis),
[source](https://github.com/Shadows-of-Fire/Apotheosis),
[modpack scout R1](research/MINECRAFT_MODPACK_SCOUT_2026-10-14-report.md),
private Arcanum notes (gitignored) at
`docs/research/discord-arcanum/private/ARCANUM_DISCORD_NOTES_2026-10-20.md`.

## Shared person and creature slice, 2026-10-20

Weibao directed a small playable slice with one capable crafter and one enemy using the same gear
pipeline, with world rules defining what good gear means. Applied codes: ESD1, ESD3, ESD11, ESD14,
ESD16 (proposal), GDP38, CBR, AR1-AR16, AD5, AD36, AD38.

- `src/equipment_stats.js` is the shared equipment-to-stats aggregation used by `Person` and
  `Enemy`. The direwolf reconstructs an armor instance from a stable item key with the same leather
  vest, steel chainmail vest and four affixes observed on the crafted chestplate. Enemy combat now
  reads `damage_taken` and `min_damage_share` through the common damage mitigation function.
- New regression: `tests/equipment_stats.test.js` checks equipment defense, dimensions, affixes,
  and skill bonuses stay in their existing sources. `npm run build && npm test`: 2298/2298 passed
  on the clean rerun. The earlier run had one timeout in the unrelated alloy equipment fixture;
  its focused rerun passed 5/5. `npm run check:arch`, `npm run check:rules`, and the focused
  equipment/affix/dimension tests (15/15) passed.
- Browser gameplay evidence from the combat lane (1440x900, rebuilt bundle, fresh origin): in
  ordinary Combat the same steel chainmail reduced one observed hit from 33.8 damage to 11.4, with
  `damage_taken ×0.963` and `min_damage_share ×0.9` on the wearer. This fixture verified the player
  wearer path. The Forest den stays locked in a fresh start, so this session did not visually enter
  a direwolf encounter or observe its armor in a live browser. The enemy gear instance and reader
  path are implemented and covered by the shared aggregation test, but enemy browser acceptance
  remains open.
- Save format: no change from this shared-wearer implementation. Enemy gear is rebuilt from its
  template key per encounter; crafted player affixes retain the existing save representation.

The current quality display proposal is ESD16 above: workmanship grade, rarity, and concrete
effects are separate signals. It is not an accepted global display decision. Each world may define
its own standards and what a person or creature values in an item.
