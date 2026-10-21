# DG-A2: D&D SRD derivation proof, 2026-10-19

**CHECKPOINT: doc only, one new file. Proposal, not an accepted decision. Nothing run except read-only `node -e` listings of the pack and `awk` line lookups. No code, data, test or other doc edited, nothing committed.**

Brief: [WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md](../../WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md) (DG1 to DG30). Interaction laws: [CRAFTING_ENGINE.md](../../CRAFTING_ENGINE.md) IX2, IX3, IX5, IX6, IX25 (Round 7), TQ2 and NX1 (Round 6). Router: [RULES_INDEX](../../RULES_INDEX.md) making row (MR1 to MR36, AD9, AD38) and combat row (CBR1 to CBR30, AD8, AD19 to AD28); these are proposal-side here, no combat or making code is touched.

Evidence labels: **SHOWN** (read in a file, locator given), **STATED** (a file says it about itself), **INFERRED** (my reading), **MEMORY** (recalled, unverified). Line numbers for `spells.json` are `src/data/srd521/spells.json` and were found with `awk` this session. Arithmetic is computed by hand, not run.

This work includes material from the System Reference Document 5.2.1 ("SRD 5.2.1") by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode. Only structured fields and my paraphrase are used here; no SRD prose is reproduced (DG30). Adaptations: field names and tags are mine.

## 1. Verdict

**Proved for mechanical tags, disproved for school meaning, partial for relations.** Default: derive tags only from structured fields that map one to one; treat everything else as INFERRED and gated on a reader (DG26, GR12).

- **F1 (SHOWN).** Mechanical tags derive with no invention: school, level, verbal/somatic/material, material cost and consumption, concentration, ritual, duration unit, damage types, applied conditions, save ability, area shape, range kind. Each is a field in the strict schema (`src/effect_dsl.js:5,157` school and level; `:43-54` components; `:104-105` concentration; `:98-99` damage; `:102-103` conditions; `:95` save; `:81` area).
- **F2 (SHOWN).** School does not predict effect. Evocation holds Fireball (damage), Light (no damage, `spells.json:349-350`) and Wall of Force (no damage, `:2329-2330` by hand count from record start 2230). Abjuration holds Counterspell, Shield and Cure Wounds (healing, `:827-828`). So a grammar row "school implies effect family" fails its golden set (DG11). School is a category tag and a law-family selector (DG3), never an effect source.
- **F3 (SHOWN).** The relation graph the pack can carry is thin: 3 resistance sources and 1 immunity, no vulnerabilities, no stated fire/cold opposition. Do not generate opposition rows from damage-type names (INFERRED only).
- **F4 (SHOWN).** The inert contract cannot carry derived output as it stands: `shape()` rejects any extra key (`effect_dsl.js:14-17`), and the id/edition checks bind every record to SRD canon (`:136-141`). Derived data and generated variants need a sidecar, see section 6.
- **F5 (SHOWN).** The pack is 20 spells, not the SRD list (`tests/effect_dsl.test.js:15-22` asserts 20 spells, 10 monsters, all 8 schools, levels 0 to 5). Coverage of the full list is an estimate, section 7.

## 2. Ten traced spells

Readers named per GR12 (no derivation without a consumer). Default reader names are proposals: **R-craft** (making and enchanting laws, IX2 families), **R-cast** (a casting-requirements check), **R-combat** (damage and condition resolver, CBR), **R-know** (knowledge and identification, DG14). Mechanical = a field maps directly. Interpretive = INFERRED.

| # | Spell (record, line) | Mechanical derivations (field, locator) | Interpretive (INFERRED) | Reader | Not specified by the data |
|---|---|---|---|---|---|
| 1 | Acid Splash (`srd521.spell.acid_splash`, rec 4) | school evocation `:119`; tier 0 `:118`; V+S `:109-110`, no material; damage type acid `:90`; save dex `:82-83`; area sphere 5 ft; duration instant; scaling by caster level (function.scale.basis) | "corrosive family" from acid; "ranged splash" from sphere | R-combat, R-craft (acid axis) | What acid does to objects or armor; nothing in the record |
| 2 | Light (rec 248) | school evocation `:350`; tier 0 `:349`; V yes `:329`, S **no** `:330`; material 1 free substitutable (light_material); duration hour; ends on recast | "illumination, no harm" from empty damage array | R-cast (S-less casting), R-craft (light axis) | Lighting, opacity, ownership: STATED unmodeled in the record |
| 3 | Cure Wounds (rec 696) | school abjuration `:828`; tier 1 `:827`; V+S `:818-819`; carrier touch; healing dice field; scaling by slot level | "healing is abjurative here"; MEMORY says 5.1 filed it as evocation, so school mapping is edition-bound (DG23) | R-combat (heal), R-craft (restore axis) | Undead or construct exclusions; the record is `supported`, so none are asserted |
| 4 | Detect Magic (rec 833) | school divination `:925`; tier 1 `:924`; concentration `:911`; ritual `:898`; V+S `:913-914`; emanation 30 ft self; 10 minutes | "perception family"; "school-reading" from doesWhat identify_spell_school | R-know (reveals school tags) | How magic is sensed, occlusion: STATED unmodeled |
| 5 | Hold Person (rec 930) | school enchantment `:1077`; tier 2 `:1076`; concentration `:1056`; V+S `:1058-1059`; 1 free substitutable material (straight_iron); save wis `:1032`; condition paralyzed on failed save `:1041`; repeat end of turn; target scaling | "control family" from condition; "humanoid only" is in the name and doesWhat paralyze_humanoids, not a creatureTypes entry | R-combat | Whether the type restriction is enforced by data: target.creatureTypes was not checked for this record |
| 6 | Silence (rec 1266) | school illusion `:1373`; tier 2 `:1372`; concentration `:1359`; ritual `:1332`; V+S `:1361-1362`; sphere 20 ft; condition deafened `:1341`, when entirely_inside | "sound suppression" from doesWhat | R-combat, R-cast (verbal gate) | Thunder immunity and verbal-casting block: STATED unmodeled |
| 7 | Counterspell (rec 1536) | school abjuration `:1627`; tier 3 `:1626`; **V no** `:1615`, S yes `:1616`; reaction timing; save con `:1599-1600` | "counter-magic" from doesWhat interrupt_cast | R-cast (a cast event to interrupt) | In-flight interruption: STATED needs a transaction boundary |
| 8 | Fireball (rec 1378) | school evocation `:1531`; tier 3 `:1530`; V+S `:1510-1511`; material 1 free (bat_guano_sulfur); damage fire 8d6 `:1491`; save dex half `:1483-1484`; sphere 20 ft; range 150 | "fire attunement"; "ignites objects" is descriptive (STATED) | R-combat, R-craft (heat axis) | Object ignition |
| 9 | Revivify (rec 1632) | school necromancy `:1728`; tier 3 `:1727`; V+S `:1707-1708`; material min 300 gp consumed, not substitutable `:1714-1715` | "restoration of the dead" from doesWhat; "costly consumable" is mechanical (cost and consumed flags) | R-cast (stock gate), R-know | Death timestamps, eligibility: STATED unmodeled |
| 10 | Stoneskin (rec 1973) | school transmutation `:2079`; tier 4 `:2078`; concentration `:2039`; V+S `:2041-2042`; material min 100 gp consumed `:2048-2049`; rules: resistance to bludgeoning, piercing, slashing | "physical ward" from the three resistances | R-combat (resistance), R-craft | Duration beyond the record; supported status, so no gap is declared |

Coverage: schools evocation, abjuration, divination, enchantment, illusion, necromancy, transmutation (7 of 8). Conjuration is covered by Mage Hand (rec 355) and Misty Step (rec 1082) in the full pack; it was left out of the table for size (SHOWN in listing, not traced line by line). Components: V-less (Counterspell), S-less (Light), costly consumed (Revivify, Stoneskin), concentration (Detect Magic, Hold Person, Silence, Stoneskin), ritual (Detect Magic, Silence).

**Mechanical versus interpretive, summary.** About 10 to 12 mechanical derivations per spell (section 7), 1 to 2 interpretive family tags per spell. Every interpretive tag in the table rests on `function.doesWhat` strings or on the spell name, which are the pack authors' paraphrase labels (STATED in `README.md`), not SRD fields. Default: treat `doesWhat` as an authoring hint (DG1 name morphology) and label any family tag built on it INFERRED.

## 3. Relation graph (DG5, IX3)

Edges found in the pack (all SHOWN unless marked):

| Edge | Source locator | Kind |
|---|---|---|
| bludgeoning, piercing, slashing: resisted by Stoneskin | `spells.json` rec 1973, rules array | damage type to dampener |
| all damage: resisted by Petrified; poison condition: immune | `conditions.json` petrified rules (`resistance:all`, `condition_immunity:poisoned`) | damage and condition to dampener |
| fire: immune for young_red_dragon | `monsters.json` rec young_red_dragon, `immunities` | damage to immunity |
| Paralyzed, Stunned, Unconscious grant Incapacitated; Unconscious also grants Prone | `conditions.json` rules `grant_condition` | condition to condition |
| thunder: immune inside Silence | Silence `function.doesWhat` grant_thunder_immunity | STATED but unmodeled (no rule row) |
| ongoing spells: ended by Dispel Magic; casting: interrupted by Counterspell; one condition: removed by Lesser Restoration | their `doesWhat` strings | STATED, unmodeled (`unmodeled` text on each record) |

Count by hand: 3 resistance types + 1 all-damage + 1 poison immunity + 1 fire immunity = 6 damage/condition rows; 4 grant rows; 3 spell-counter rows = **13 rows** from 20 spells, 15 conditions and 10 monsters.

What is missing: the monster shape has `immunities` (damage types only, `effect_dsl.js:124`) and no resistances or vulnerabilities; no condition has a "countered by" field; fire versus cold, acid versus anything and radiant versus necrotic opposition are **not in the data**. Default: do not mint them. If a world wants elemental opposition, it is an authored IX3 row with an INFERRED label and a reason, not a derivation. Dial: per world; reason: the SRD names no opposition, so any such row is design, not source.

## 4. Tier table and tier-gap rule (IX5, IX6)

Tier = spell level (SHOWN field, `effect_dsl.js:157`, integer 0 to 9). Records per tier in the pack, counted by hand from the listing: T0 4, T1 4, T2 4, T3 4, T4 2, T5 2, T6 to T9 0 (sum 20). Full-list counts per tier are MEMORY-grade unknowns (section 7).

Proposed default tier-gap law (INFERRED, a proposal for IX6; dial per world and family):

| Gap (higher minus lower) | Default result | Reason |
|---|---|---|
| 0 | Contest on equal footing | same rank |
| 1 | Adjacent tiers combine, output capped at the higher | IX6 adjacent rule |
| 2 to 3 | Higher dominates; lower is diluted | IX6 |
| 4 or more | Lower is inert unless a catalyst of tier t is present | IX6 |

SRD cross-check: Dispel Magic's record says per-effect spell level and an ability check are not typed (`unmodeled`, STATED, rec 1733). MEMORY: the printed rule ends a spell automatically when its level is at or below the slot used, and otherwise rolls a check against 10 plus the spell level. That is itself a tier-gap law (gap at least 0 succeeds, gap below 0 contests). So the default is consistent with the source's own law but is not derived from a field; the check numbers need a read of the SRD text, which I did not do. IX25 applies: tier needs strata or a per-tier fraction axis for batch mixing; spells are single items, so a plain ordinal is enough here.

## 5. Can effect_dsl carry it?

| Need | Carried today? | Evidence |
|---|---|---|
| school, level, V/S/M, cost, consumed, concentration, ritual, duration, damage, conditions, save, area, range | Yes | schema `effect_dsl.js:43-106,157` |
| resistance rule with damage type | Yes, on conditions and spells | `:65` rule op `resistance` |
| monster resistance and vulnerability | **No field** | monster shape `:117` lists `immunities` only |
| "countered by" or "removes" relations | **No** (strings in doesWhat, unmodeled) | `:109` doesWhat is free text |
| derived tags, grammar row id, GENERATED flag | **No**; extra keys rejected | `:14-17`, `:131` common field list |
| generated variant record | **No**; id must be `srd521.spell.*`, edition 5.2.1, SRD url and text hash | `:136-141` |
| a reader | **No**; header says inert, no evaluator | `:1` |

Default: a pure function `deriveSpellTags(record, grammar) -> sidecar row` outside `effect_dsl.js`, keyed by record id, so the SRD file stays untouched and SRD attribution travels with the source record. Dial: sidecar file per world. Reason: a schema bump would change a licensed-data contract for a proposal-grade need. Missing fields if the sidecar is accepted: monster resistances and vulnerabilities (new keys), a relation list, and a generated-record namespace with its own validator. This follows runtime-code seam rules (AR1 to AR16): a derivation module would be a domain registration, not a `main.js` change, and is not proposed for building here.

## 6. Canon-pinned versus generated variant (DG29, DG10, DG12)

| Aspect | Canon-pinned (`srd521.*`) | Generated variant (new id, e.g. a world's cold-fire ball) |
|---|---|---|
| Source | The SRD record is the pin; edition and hash fixed | Parent id and grammar row id recorded as provenance |
| Tags | Derived by the same reader, then checked against the golden set; mismatch means the grammar row is wrong, never the record | Derived by the same reader, flagged GENERATED (DG10) |
| Effect | Whatever the record states | Dials move strength, precision, duration only; a new effect needs an authored family (DG13, IX11) |
| Name collision | Never replaced (DG29) | Own namespace, never `srd521.*` |
| Exceptions | Pinned (DG12) | A variant that contradicts its grammar is a pin with an in-world reason and cost |

A fire-to-cold swap is a dial on the damage-type slot of a Fireball-shaped record; whether cold ought to also change the save or condition is a design choice with no SRD basis (INFERRED).

## 7. Cost to cover the full SRD list

- Record count: **unverified.** MEMORY: the SRD spell list is roughly 300 to 350 entries; I did not count it and the canonical text file is not in the repo (README names the supplied `dnd-srd-521.txt`; I did not look for it). Take N = 340 as a placeholder.
- Authored per-spell records: pack has 20, so 20/340 is about 6 percent covered (computed by hand). The remaining records come through `tools/import_srd521.mjs`, whose output needs semantic source review (README, STATED). Status today: 4 supported, 16 needs_ruling in the pack (hand count from the listing), so about 80 percent need rulings; expect similar. Derivation can run on `needs_ruling` records for mechanical tags (fields exist) but the `unmodeled` list marks what must stay unknown.
- Grammar rows (authored once): school 8, tier 10, components 3, cost/consumed 2, concentration 1, ritual 1, duration units 5, damage types 13, conditions 15, save abilities 6, area shapes 4, range kinds 3, carrier 7, plus relation rows about 15 = **about 93 rows** (hand sum: 8+10+3+2+1+1+5+13+15+6+4+3+7 = 78, plus 15).
- Derived values: about 12 per spell (hand estimate) times 340 = about 4,100 tag assignments, none authored by hand. Interpretive family tags (1 to 2 per spell) are the only part needing a labelled authoring pass, about 340 to 680 judgments, and each waits for a reader.

## 8. Golden cases and mismatch test (DG11)

Golden cases (each a shown record; a derived tag must match all):
1. Counterspell derives components S only (`:1615-1616`); Light derives V only (`:329-330`).
2. Revivify and Stoneskin derive "costly consumed material" (`:1714-1715`, `:2048-2049`); Hold Person and Fireball derive "free material".
3. Detect Magic and Silence derive ritual plus concentration (`:898,911`; `:1332,1359`).
4. Fireball derives damage fire, Cone of Cold derives damage cold, Acid Splash derives acid.
5. Stoneskin derives resistance to the three physical types only.
6. Hold Person derives condition paralyzed, which grants incapacitated (conditions rules).
7. Concentration implies a finite duration (`effect_dsl.js:105`, a schema invariant).

Mismatch tests (a failing row means the grammar row is wrong):
- **M1** "evocation implies damage" fails on Light and Wall of Force (F2).
- **M2** "abjuration implies protection only" fails on Cure Wounds (healing).
- **M3** "has damage implies save" fails on Fire Bolt (attack roll, rec 124, SHOWN in listing as `res=attack`) and Magic Missile (no resolution).
- **M4** "level orders damage" fails: Fireball L3 averages 28 (8 x 3.5) and Cone of Cold L5 averages 36 (8 x 4.5), by hand, but cantrip scaling and Magic Missile's dart count differ in shape.
- **M5** "spell name contains 'Hold' implies Hold condition" is untestable beyond one record; name morphology (DG1) needs the full list before any rule is offered.

A runnable form would be a test reading `spells.json` and asserting M1 to M4 expected-fail; not written, doc only.

## 9. Disposition

**ACT NOW (done):** this trace; verdict F1 to F5.

**ACCOUNT FOR NOW:** no school-to-effect row; family tags carry INFERRED and a reader; derived data sits in a sidecar, not in SRD records; no elemental opposition row without a design reason.

**LATER / DELEGATE:**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Count the real SRD list and tier histogram | Balanced | Small doc, needs the supplied text | Exact N and per-level counts replace section 7 estimates |
| Sidecar shape and monster resistance fields | Strong | Held for Weibao's go on schema and AR seam | Review of `effect_dsl.js` change impact |
| Golden-test file for M1 to M4 | Balanced | One test file | Tests pass on the 20-spell pack |
| Dispel Magic tier-gap check from the SRD text | Small | Read one spell | Section 4 MEMORY line confirmed or corrected |

## 10. What I did not check

- The canonical SRD text and full spell list; the spell count N is a placeholder.
- Line numbers outside the ten spells; Mage Hand, Misty Step, Shield, Fire Bolt, Magic Missile, Lesser Restoration, Dispel Magic, Banishment, Wall of Force lines beyond the listing and a few record starts.
- Hold Person `target.creatureTypes` contents, Silence rules array beyond the condition, Cure Wounds healing dice.
- That `deriveSpellTags` is implementable in the current module seams; no code was read in `rule_modules.js` beyond its export list, and no reader for these tags exists (GR12).
- Whether 5.1 filed Cure Wounds under evocation (MEMORY only).
- Combat and making rulebooks in full (CBR, MR); only router rows were read.
- Sealed secrets: none involved.
