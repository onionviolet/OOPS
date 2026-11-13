# Weaponcraft, runes and inscription: considerations, 2026-10-14

> **Owner of weaponcraft, runes, inscription and maker arts (2026-10-30).** The three companion palettes were merged in [Round 4](#round-4-the-three-companion-palettes-merged-here-2026-10-30) at the end of this file; use its alias table to read any WFI-, REV- or MKR- code, and link here, not to the old files.

Claude (root), 2026-10-14. A palette, not a spec, and nothing here is
selected for a build. Weibao asked: "Weaponcrafting, runestuff, other stuff
and more? ... Cheats that would show stuff like these and more? ... Subtle
stuff too? Overarching stuff? Implementation implciations and more?
Abstaction thats needed?"

Standing rules apply throughout: considerations, not specs. True properties
work whether known or not, reload never rerolls, there are no fixed "once"
limits (per-world adjectives instead), sealed secrets are referred to by ID
only, and it's desktop first.

Codex lanes are in [the weaponcraft-runes dispatch](gm/dispatch/weaponcraft-runes-2026-10-14/runs/SESSIONS.md):
- R1: by world, with sources.
- R2: game references.
- R3: engine fit and the abstraction.

Rows marked MEMORY are unchecked recall that R1 and R2 verify.

## What already exists (link, don't repeat)

| Owner | Covers |
| --- | --- |
| [Procedural crafting palette](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) | Consumables, crafting feel, maker identity, items over time, world laws, crafting cheats CT1-CT6, automation, economy |
| [Materials and alchemy audit](PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) | Five-record contract (material, batch, process, product, knowledge) |
| [P6 creation systems](gm/dispatch/procgen-2026-10-13/p6/REPORT.md) | Smithing, coatings, patterns, constructs, rituals, documents |
| [Progression and assembly](worlds/PROGRESSION_AND_ASSEMBLY.md) | Nested modules, definition/specimen/installed position, tiers, operating budgets, refit |
| [Cheat UI references](gm/dispatch/ui-at-scale-2026-10-14/CHEAT_UI_REFERENCES.md) | Surface kinds V1-V13, CU1-CU10 |

**Code state** (checked by filename and grep on 2026-10-14):
- `src/alloy_equipment.js` has one authored alloy profile (Springsteel), a
  brace that derives stats from it, and one technique formula hook.
- The artifact workshop, crafting detail and visibility, and native craft
  transactions exist.
- No dedicated module for weapons built from parts, or for runes,
  inscriptions, seals or formations, was found. R3 confirms the details.

This doc adds weapons as built things, inscription as a family, cheats that
reveal them, subtle details, the overarching model, and the abstractions an
engine would need.

## WC. Weapons as built things

**WC1. Parts.** A weapon is a small tree of parts:
- a sword is blade, guard, grip and pommel;
- a spear is head, socket, haft and butt;
- a bow is limbs, riser and string;
- a gun is action, barrel, stock and sights.

Each part has its own material and condition, and the whole derives its
stats. This follows the definition, specimen and installed-position model in
Progression and assembly.

**WC2. Shape choices.** Length, curve, edge geometry and balance point are
choices with tradeoffs: reach versus speed, cut versus thrust, durability
versus sharpness. At low appraisal they read as feel ("blade-heavy"); at
high appraisal, as numbers.

**WC3. Process.** Forge, fold, pattern-weld, quench, temper, grind, polish,
cast or carve. Each step has a quality driven by skill, tools, heat, timing
and luck. A flawed quench leaves a hidden weak point that is true whether
known or not.

**WC4. Quality layers.** Material truth, process precision, maker skill and
current condition stay separate, so "a perfect craft from bad steel" and
"good steel, badly tempered" read differently (CT2 in the crafting palette).

**WC5. Fit to the wielder.** Grip size, weight and reach suit a body. A
nonhuman body might take claw caps, tail blades, a mouth grip, or nothing
(see the nonhuman docs). A weapon made for you fits better than a looted
one.

**WC6. Fighting style fit.** Weapons suit styles and techniques. A technique
can require a weapon class or part ("needs a curved edge"), which ties to
skill mechanisms and means.

**WC7. Maintenance.** Sharpen, oil, rewrap, rust, chip and crack. Condition
drifts with use and time and is an idle-friendly upkeep job. Neglect is
visible in prose before numbers.

**WC8. Repair, reforge and rebuild.** You can replace a part, reforge a blade
into something else, or salvage materials. History can carry over
(Theseus questions live in the deep concepts doc).

**WC9. Growth.** Some worlds grow weapons rather than forge them: feeding
materials (upgrade stones), bonding over time, absorbing kills or souls, or
evolving through tiers. This is a per-world law, not a universal rule.

**WC10. Weapon identity.** Name, maker's mark, owners, notable deeds and
kills. Bounded history makes a weapon a character. Some can have will,
voice or spirit (a voice-channel surface, V4).

**WC11. Other made things on the same model.** The same part, process and
condition model covers:
- armor and shields;
- focus implements (staves, wands, catalysts);
- ammunition, traps and tools;
- jewelry and charms;
- instruments;
- prosthetics.

## RN. Runes and inscription as one family

Runes, sigils, seals, talismans, glyphs, enchantments, wards, tattoos,
formations and circles share a structure. They differ by medium, scale and
world law.

**RN1. Alphabet.** The atoms: glyphs, strokes, elements or words. Some worlds
have a fixed canon set. Others generate per-save meanings, like unidentified
potions, seeded so reload never rerolls.

**RN2. Grammar.** How atoms combine: order, adjacency, nesting, circles,
lines, balance and opposition. Grammar is where depth lives. A small grammar
with emergent combinations beats a long list of fixed recipes.

**RN3. Medium.** Steel, paper, cloth, skin, bone, ground, air, water, a soul or
a contract. The medium sets capacity, durability and who can carry it.

**RN4. Ink and power.** Blood, mana ink, qi, cursed energy, sacrifice,
sunlight, or a stored charge. Power source and medium together decide
duration.

**RN5. Capacity.** Surface area and material tolerance limit how much fits.
Overfilling cracks the medium or causes backlash. Capacity is a dial per
world.

**RN6. Trigger.** Touch, word, condition, time, damage taken, an enemy
entering, or the bearer's death. Triggers make inscription a policy system
(the UI palette's IN7 and MO3).

**RN7. Duration and decay.** Permanent, charged, or fading, with refresh as an
upkeep job.

**RN8. Interference.** Two inscriptions on one medium can amplify, cancel or
corrupt each other. Explain it with the stacking trace (CU7).

**RN9. Failure.** Misfire, backlash, a wrong effect, an attracted enemy, a
cursed result. Failures teach grammar, and they're logged as knowledge.

**RN10. Learning.** Copy a seen inscription, decipher with study, experiment
safely, learn from a mentor, or buy from a system shop. Partial knowledge
gives partial results. A wrong guess can work by accident and be recorded
as false knowledge.

**RN11. Reading others' work.** Reading an inscription is an appraisal act,
graded by means. You can recognize a seal type without knowing its trigger.
Authorship can leave a signature.

**RN12. Scales.** A rune on a blade, a tattoo on a body, a seal on a scroll, a
ward on a door, a formation on a mountain, a contract on a soul. One model,
many scales (the UI palette's NV4).

**RN13. Secrecy.** Some glyph meanings can be sealed per run. Players
discover them through play, never through UI leaks such as names in
pickers, hover text or screen-reader labels (AX11).

## WW. By world (MEMORY; R1 verifies)

| Code | World | Weapons | Inscription-like system |
| --- | --- | --- | --- |
| WW1 | Naruto | Kunai, shuriken, chakra-conductive blades | Fuinjutsu seals on paper or skin; storage, barrier and summoning seals |
| WW2 | Jujutsu Kaisen | Cursed tools with innate effects | Binding vows as contracts; barriers and curtains as area inscriptions |
| WW3 | Bleach | Zanpakuto grown from the soul and bonded, not forged | Kido incantations; seals and barriers |
| WW4 | Harry Potter | Wands from wood and core, with allegiance | Charms on objects, protective enchantments, runes as a school subject |
| WW5 | Skyrim | Smithing with tiers and tempering | Enchanting from soul gems; disenchanting to learn effects |
| WW6 | Elden Ring | Upgrade stones, infusions | Ashes of war as swappable weapon skills |
| WW7 | D&D | Magic items with attunement | Glyph of warding, symbols, scribed scrolls |
| WW8 | Fallout | Weapon mods by part | Little inscription; tech modding instead |
| WW9 | Fullmetal Alchemist | Transmuted weapons | Transmutation circles; the circle is the grammar |
| WW10 | Frieren | Mage staffs as foci | Spell analysis, barriers, formula-like magic |
| WW11 | Mother of Learning | Constructs and golems | Shaping skills and spell formulae; magic as a learnable structure |
| WW12 | Shadow Slave | Memories as summoned gear, upgradable | Runes as status and enchantment descriptors |
| WW13 | Reverend Insanity | Gu refined and combined | Gu recipes as composition; killer moves as combinations |
| WW14 | Lord of the Mysteries | Mystical items with side effects | Rituals, symbols and honorific names as triggers |
| WW15 | Xianxia generally | Refined treasures, nurtured in the body | Talismans, formations and arrays across scales |

## CR. Cheats that show these things

Each row names its surface kind from U2's V1 to V13 and follows appraisal
grades. Sealed truths stay on their own route.

| Code | Cheat | What it shows or does | Surface |
| --- | --- | --- | --- |
| CR1 | Blueprint sight | Any item's part tree, materials and process, at grade | V6 perception-lens |
| CR2 | Rune reader | Translates seen inscriptions; higher grades show triggers and the author | V6 perception-lens |
| CR3 | Forge sense | Live heat and temper state while working, for perfect timing | V13 ui-layer on the bench |
| CR4 | Flaw finder | Stress points and weak points in items and enemy gear (also useful in combat) | V6 perception-lens |
| CR5 | Item status window | LitRPG item cards with rarity, stats and durability as numbers | V1 system-window tab |
| CR6 | Weapon voice | A sentient weapon comments, warns and grows | V4 voice-channel |
| CR7 | Craft simulator | Preview a craft's outcome range before spending, like CH6 for crafts | V5 records-view |
| CR8 | Glyph completion | Suggests the missing atom in a partial inscription | V13 ui-layer in the rune editor |
| CR9 | Copy once seen | Memorize an inscription or technique after seeing it; capacity is a per-world adjective | V5 records-view |
| CR10 | Psychometry | Read an item's past owners and deeds | V6 perception-lens |
| CR11 | Evolution path | See what an item could become and what that needs | V5 records-view (tree) |
| CR12 | Disenchant to learn | Destroy an inscribed item to learn its atoms | V3 item-interface |
| CR13 | Blueprint shop | Buy designs from outside the world; local compatibility still applies (CT4) | V7 exchange-view |
| CR14 | Auto-smith | Perfect repetition while idle; it can't exceed the known recipe | V2 body-modifier or a policy |
| CR15 | Material sense | Feel true material properties by touch | V2 body-modifier |

## SU. Subtle details

| Code | Detail |
| --- | --- |
| SU1 | Heat described by real temper colors (straw, bronze, purple, blue) rather than a bar, with numbers at a higher grade. |
| SU2 | Hammer rhythm in text VFX: a beat that tightens as skill grows. |
| SU3 | Maker's marks, so you can recognize your own work in a shop years later. |
| SU4 | Earned nicknames: a blade gets called something by NPCs after a deed. |
| SU5 | Wear in prose: "the grip has worn to your hand." |
| SU6 | Partially known glyphs render half-legible (`▒`) until learned. |
| SU7 | A charged rune glows faintly in its description, and the glow fades as charge drains. |
| SU8 | Inscription mistakes stay visible as a scratched-out stroke, and become part of the item's history. |
| SU9 | Low-appraisal feel words ("tip-heavy," "lively," "dead in the hand") before numbers. |
| SU10 | A smith NPC reacts to your work by quality, maker and style. |
| SU11 | You can choose to keep your first blade, and it gets its own place in the collection log. |
| SU12 | A weapon remembers its last fight in one line ("still nicked from the wolf"). |
| SU13 | A rune's author signature shows as a small flourish once you can read it. |
| SU14 | Cold weather makes oiled blades stiff, and damp rusts them, through the place and time systems. |

## OV. Overarching model

One structure runs underneath weapons, runes, potions, gear, formations,
tattoos and contracts:

> **A made thing is parts on a substrate, joined by rules, with true
> properties and observed properties.**

- **Weapons:** parts on a frame.
- **Runes:** atoms on a medium.
- **Formations:** runes on a place.
- **Tattoos:** runes on a body.
- **Enchantments:** runes on an item.
- **Seals:** runes on paper or a container.
- **Potions:** ingredients in a process.
- **Contracts:** terms on a soul.

Treating these as one model means one composition engine, one property
resolver, one knowledge filter and one set of UI views. Worlds then
customize through laws rather than new code.

**OV1. Every world declares its laws for making:** what can be inscribed,
what powers it, conservation rules, and import compatibility.

**OV2. Composition beats catalogs:** a small grammar that the player explores
gives more depth than a long recipe list. Recipe lists stay as discovered
shortcuts.

**OV3. Idle fit:** once you understand a design, repeat it automatically. The
player does discovery by hand and production idly.

**OV4. Knowledge is part of the item:** what you know about an item lives
beside what it is, with grade, source and age (CU9).

## AB. Abstractions an engine would need

These are proposals for R3 to check against the code.

| Code | Abstraction | Holds | Reuses or extends |
| --- | --- | --- | --- |
| AB1 | Template, instance and part tree | Definition; specimen with parts in installed positions | Progression and assembly model |
| AB2 | Material profile | Property vector per material, with grade | Generalize `alloy_profile` in `alloy_equipment.js` |
| AB3 | Process record | Steps, quality per step, time, tools, maker | Materials audit's process record |
| AB4 | Effect record and one resolver | `{source, scope, trigger, op, value, order}`; one resolver produces values plus a trace | Feeds IN1 breakdowns and CU7 stacking trace |
| AB5 | Surface and slot capacity | Substrate, area, tolerance, occupied slots | New; shared by weapons (sockets) and inscriptions |
| AB6 | Glyph grammar | Atoms, composition rules, per-save seeded meanings | New; deterministic, seeded from the save |
| AB7 | Knowledge layer | Observed properties per entity with grade, source and age | Means and appraisal; MP3 and CU9 |
| AB8 | Triggers | Event hooks: on hit, on time, on condition, on death | Existing event meaning and duplicate-delivery rules (W3 IG4) |
| AB9 | Condition over time | Durability, charge and decay, plus maintenance jobs | Idle jobs and timestamps (LP2) |
| AB10 | Instance history | Bounded log of owners, deeds and names | Records and journal |
| AB11 | World law adapter | Per-world making laws, conservation, imports | World cards and the declarative world UI card |
| AB12 | Views | Bench in the contextual slot, item detail with part tree, rune composer, breakdown, compare | UI palette ZN2, IN1, IN5, IG1 |

**Implementation implications**

| Code | Implication |
| --- | --- |
| IM1 | **Save size.** Instances with part trees and history grow saves. Keep compact IDs, bound history, store derived stats only as cache, and use versioned migration. |
| IM2 | **Determinism.** Generated glyph meanings and weak points come from the save seed and instance ID, so reload never rerolls. |
| IM3 | **Resolver performance.** Resolve effects on change, not every tick, and cache per instance. Re-resolve on equip, condition change or trigger. |
| IM4 | **Leak safety.** The knowledge filter (AB7) runs before any label, tooltip, search entry or screen-reader text, so glyph meanings never leak (AX11). |
| IM5 | **Balance.** Composition can explode. Use capacity (AB5), interference (RN8), material tolerance and per-world adjectives instead of hard caps, and check generated combinations with a balance script. |
| IM6 | **Authoring.** Parts, materials and glyphs are data cards with a validator. A content generator gets the same seed tests as procedural potions. |
| IM7 | **Migration of existing items.** Current items become single-part instances with an empty inscription surface, so nothing breaks. |
| IM8 | **One transaction.** Crafting and inscribing reuse `native_craft_transaction.js`-style begin, commit and rollback, so failure can't duplicate materials. |
| IM9 | **Tests.** Seeded property tests, a resolver trace test, save and reload of instances, and import of an old save with migrated items. |

**Smallest proof slice (proposal):**
- In the Village, build one knife from three parts using the existing
  Springsteel profile, plus one inscription slot with a two-atom rune.
- Show it through the bench, item detail and a breakdown with a trace.
- Appraisal shows "≈" at low grade.
- Acceptance: rebuild, fresh-origin desktop play at 1366×768, then save,
  reload and import (per AGENTS.md).

R3 will refine this against source.

## Suggested order, if Weibao picks any

1. **OV plus AB1, AB2 and AB4: the shared model, material profile and one
   resolver with a trace.** Everything else depends on them.
2. **WC1 to WC4: part-built weapons with quality layers.** It's the most
   concrete, and it extends existing alloy code.
3. **RN1 to RN6 plus AB5 and AB6: inscription with a small grammar,
   capacity and triggers.**
4. **CR1, CR2 and CR7: blueprint sight, rune reader and craft simulator.**
   These are the cheats that make the system visible.
5. **SU1, SU6 and SU9: temper colors, half-legible glyphs and feel words.**
   Cheap, and they carry the flavor.

Nothing here is selected for a build.

## Round 2: consolidation and what's still new (2026-10-14)

Weibao: "more to consider? other stuff and more? Cheats that would show stuff
like these and more? MOre to consider save and extend accordingly Send out
codex as usesful? Subtle stuff too? Overarching stuff? Implementation
implciations and more? Abstaction thats needed? Merging, commiting or
pushing?"

### What was wrong first

The first weaponcraft message reached three sessions. Each wrote a palette:
- this doc (primary, per IDEA_INDEX);
- [Weaponcrafting, runes and inscription](WEAPONCRAFTING_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md),
  which already carries a duplicate notice pointing here;
- [Weaponcraft, runes and maker arts](WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md),
  with lanes W1 to W7 in [maker-arts dispatch](gm/dispatch/maker-arts-2026-10-14/SESSIONS.md).

This doc also missed two existing owners that the maker-arts doc cites:
[P6 SMITHING](gm/dispatch/procgen-2026-10-13/p6/SMITHING.md) (alloy as
composition, parts, ordered melt, shape, cool and fit, slice S3-A) and
[P6 PATTERNS](gm/dispatch/procgen-2026-10-13/p6/PATTERNS.md) (runes,
formations and talismans as a typed channel graph on a carrier with an
energy payer, slice S6-A).

**Correction:**
- **AB1 and AB5 defer to P6.** The part tree (AB1) and surface capacity (AB5)
  belong to P6's assembly graph (L2).
- **AB6 is a surface on P6's graph.** The rune grammar (AB6) is a readable
  surface over P6's pattern graph (L3), not a separate grammar engine.
- **Item identity follows commit `2874c613`.** That commit names P2 records
  as the item identity authority.

My lanes R1 and R3 were stopped as duplicates of W1 (by world) and W4
(implementation against live code); both can be resumed from
[SESSIONS](gm/dispatch/weaponcraft-runes-2026-10-14/runs/SESSIONS.md). R2
(game references, especially rune and decipher games) keeps running.

**Later peer input (2026-10-14).** The Procedural crafting and Procedural
story sessions agreed that P2's live product and knowledge records are the
item identity and knowledge authority: `src/mixture_state.js`,
`mixture_native.js` and `active_effects.js` on `codex/gameplay-foundations`
at `4e13f97f`. Abstractions here are adapters onto those records, not a
parallel model. Reveal lenses extend the crafting palette's CT codes rather
than redefining appraisal.

A fourth companion doc,
[Weaponcrafting, runes and reveal](WEAPONCRAFTING_RUNES_AND_REVEAL_CONSIDERATIONS_2026-10-14.md)
(commit `4995282a`), adds three things:
- reveal-lens rules RV (scope, depth, cost, error, writing to known context);
- made things writing receipts on the story spine;
- XA and IM notes.

Its WR lanes were stopped, and WR1 is resumable.

### Crosswalk: one name per idea

Read across a row, and use the primary code going forward. "M" is maker
arts, "I" is the Weaponcrafting doc and "P" is this doc.

| Idea | P (this doc) | M (maker arts) | I (inscription) | Owner of the record |
| --- | --- | --- | --- | --- |
| Weapons as part graphs | WC1 | WC1 | WF1 | P6 SMITHING L2 |
| Geometry as the stat | WC2 | WC2 | | P6 SMITHING |
| Heat treatment and process | WC3 | WC3, WC4 | WF3, WF4 | P6 SMITHING, audit process record |
| Material ceiling, skill closeness | WC4 | | WF2 | Five-record contract |
| Fit to wielder and technique | WC5, WC6 | WC5, WC6 | WF5 | Derived profile (derived-snapshots) |
| Wear and maintenance | WC7 | WC8 | WP1 | Progression and assembly condition |
| Reforge and history | WC8, WC10 | WC10 | WP2-WP4, WP7 | Story BI1 receipt log |
| Growth and bonded weapons | WC9 | OM9 | WP5 | Companions bond record |
| Armor | WC11 | AR1-AR6 | WF12 | P6 L2 |
| Rune atoms and grammar | RN1, RN2 | RN1, RN2 | RU1, RU2 | P6 PATTERNS L3 |
| Carrier capacity | RN3, RN5 | RN3 | RU4 | P6 PATTERNS |
| Triggers and logic | RN6 | RN4 | | P6 PATTERNS (execution trace) |
| Decay and upkeep | RN7 | RN5 | RU10 | Condition vector |
| Learning and deciphering | RN10 | RN11 | RU3, RU8 | Knowledge store |
| Per-save generated scripts | RN1, RN13 | RN12 | | Sealed by ID |
| Formations at scale | RN12 | RN7 | RU12 | P6 PATTERNS site law |
| Item status window | CR5 | RC1 | CS1 | Knowledge store plus CH1 |
| Blueprint sight | CR1 | RC2 | | Knowledge store |
| Rune reader | CR2 | RC5 | CS4 | Knowledge store |
| Flaw finder | CR4 | RC3, RC4 | | Knowledge store |
| Craft simulator or forge preview | CR7 | RC7, RC8 | CS3 | Pure preview, no draw |
| Copy once seen or structural copy | CR9 | RC13 | CS8 | Per-cheat conservation adjective |
| Psychometry | CR10 | RC6, RC16 | CS6 | Receipt log |
| Evolution path | CR11 | RC7 | CS9 | Knowledge plus forecast |
| One made-thing model | OV | OV1, OV2 | OV1 | P6 L1-L3 plus five records |
| Knowledge separate from truth | OV4, AB7 | OV4, AB6 | OV2, AB7 | **Needs one owner** (all three say so) |

Unique rows worth keeping from the others:
- **Maker arts:** proof and testing (WC11), weapon law and custom (WC12),
  monster-part weapons (WC14), armor coverage maps (AR1 to AR6), deep words
  (RN9), runes as binding (RN10), rune resource loops (RN14), fidelity tiers
  F0 to F5 for reveal cheats, the uses-left counter (RC10), the fit meter
  (RC11), array sight (RC12), the masterwork omen (RC15), text generated
  from properties (IM10), and "every stat has a consumer" (OV3).
- **Inscription doc:** commissions (WF8), heirlooms (WP6), theft traced by
  mark (WP8), runes revealing intent (RU13), a base smith's sense versus the
  cheat (CS12), and the bounded rune interpreter (IM6).

### WX. What none of the three covered

**WX1. Carrying makers across worlds.** A Skyrim-enchanted blade in the JJK
world:
- Does the enchantment still run (local physics law)?
- Can locals read it (foreign script)?
- Does it look like a cheat to them?

Each world's law adapter (AB11) answers per operator: runs, runs weakened,
dormant, or transformed. Foreign scripts start at fidelity F0 for locals.

**WX2. Cross-world fusion.** Combining two worlds' making laws (rune-carved
chakra steel, a cursed-tool wand) is a deliberate, costly experiment with
its own failure table. It's late-game and multiverse scale.

**WX3. Multi-maker items.** A smith, a runesmith and a jeweler each own
their parts and get credit in the receipt log. Quality can be capped by the
weakest maker.

**WX4. Design ownership.** Trade secrets, sect-only techniques, guild
licenses, stolen designs and forgeries of designs, not just of marks. A
design is a knowledge record with an owner and a leak risk.

**WX5. Masterpiece projects across seasons.** A legendary weapon as a
months-long idle project with milestones (find the ore, train the skill,
wait for the eclipse to quench). It shows as a goal chain (GP2) and a
progress clock (MI68).

**WX6. Guild ranks and exams.** Apprentice to journeyman to master, by a
judged masterpiece, with exams reading real item properties. This is a
social consumer for OV3.

**WX7. Items that refuse.** A weapon that won't serve a wielder who violates
its maker's intent, works badly for thieves, or bonds to someone else. It's a
world adjective and reads the bond relation (AB9 in maker arts).

**WX8. Testing grounds.** Proving Ground dummies, test cuts and a combat
simulator that reads the derived profile, so a design can be compared
honestly before commissioning (WC11 in maker arts, made into a place).

**WX9. Design strings.** Export and import a design as a short text code for
your own records. It carries knowledge only, never the item, so it can't
duplicate anything.

### CR2. More cheats (CR16 onward)

| Code | Cheat | Shows or does | Surface |
| --- | --- | --- | --- |
| CR16 | Rune compiler | Write intent in plain words; the cheat proposes a rune graph at your knowledge level. Wrong intent still compiles wrongly | V13 ui-layer in the composer |
| CR17 | Pocket forge time | Forge inside dilated time; the outside clock moves slowly | V2 body-modifier |
| CR18 | Master's echo | A dead master's process plays back as guidance (extends maker arts RC16) | V4 voice-channel |
| CR19 | Material atlas | Where a known material exists in reachable worlds, at report age | V5 records-view |
| CR20 | Item rewind | Return an item to a past recorded state; history keeps both | V3 item-interface |
| CR21 | True naming | Naming an item grants it a property tied to the name's meaning | V3 item-interface |
| CR22 | Foreign script sense | Read any world's script at F1 on sight (WX1) | V6 perception-lens |

### SU2. More subtle details (SU15 onward)

| Code | Detail |
| --- | --- |
| SU15 | Each maker has a rune handwriting; experts recognize a hand the way they recognize a mark. |
| SU16 | A left-handed smith's marks and edge bevels are mirrored. |
| SU17 | A well-tempered blade's ring is written as onomatopoeia, and a flawed one rings dull (text VFX). |
| SU18 | Rain makes fresh rune ink run if it isn't sealed. |
| SU19 | A good sheath clicks home. A scabbard wears pale where the hand rests. |
| SU20 | Forge songs: work chants per tradition, which keep rhythm and appear in the log. |
| SU21 | A foreign-world weapon draws stares and questions in a world where it looks wrong (WX1). |

### AB2. Abstraction stance after consolidation

- **One maker pipeline, no weapon, armor or rune engines.** All three docs
  agree. Records belong to P6 L1 to L3 and the five-record contract.
- **The open gap is one owner for the knowledge and fidelity store.** All
  three palettes, plus the companions and cheat docs, need it. Naming that
  owner is the single most useful next decision. It isn't made here.
- **Derived profiles belong to the derived-snapshots dispatch.**
- **Cross-world behavior (WX1) is a column in the world law adapter,** not new
  code per pair of worlds.

### Next step for the duplicates (proposal)

Once lanes W1 to W7 and R2 report, fold their findings here. Then turn the
other two palettes into pointers to this doc, as the inscription doc already
offers. Nothing is selected for a build.

## Round 3: fold of lanes W1 to W7 and R1 to R3 (2026-10-14)

This is a fold only, with no new lanes, and everything stays a proposal.
The returns were committed in `fd176f27`. The crafting palette already
cross-references these lanes in `eefa68a3`, including the code map between
crafting AB1 to AB7 and W4's AB1 to AB12; see
[the crafting palette's fold table](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md).
This round doesn't redo that map. It records only what changes in this doc.

### Corrections to this doc

- **Code state was wrong.** W4 F1 shows live weapons already have template
  parts, weapon-type selection and computed attack (`src/items.js:939-1008`,
  `src/crafting_recipes.js:255-289`). My "no module for weapons built from
  parts" meant no generated part-instance truth, not no parts at all.
  Part-built weapons (WC1) extend that path; they don't need a new engine.
- **P2 is live in main** (W4 F2: `src/mixture_state.js`, P1 streams). Older
  wording that calls it unmerged is stale. Source presence still isn't
  rebuilt acceptance.
- **The WW table (MEMORY) is replaced by W1's sourced table.** See
  [Maker arts by world](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md), which
  covers 25 world folders and 17 full-book folders with an evidence ledger.
  Of 11 memory rows, four were confirmed and seven corrected:
  - D&D attunement applies to selected items only.
  - Elden Ring Ashes of War need compatible armaments.
  - Fallout mod rules are Fallout 4-specific.
  - Bleach zanpakuto blanks are manufactured before the soul develops them,
    so WW3's "grown, not forged" is too simple.
  - Fate copying is exceptional.
  - FMA energy disagreements stay attributed both ways.
  - Legendary Mechanic blueprints come from combining knowledge and talents,
    not fusing finished blueprints. My CR13-adjacent "blueprint fusion"
    stays an original idea.
- **Wear has two owners today** (W4 F3). An optional E2 durability wraps
  per landed hit. IM5's per-job batching would be a new compatibility
  decision, not current behavior, and wear needs exactly one selected owner.

### What each lane adds here

| Lane | Adds | Maps to this doc |
| --- | --- | --- |
| W1 by world | Sourced laws, maker, cost, product and starts per world, with era and role fit | Replaces WW1-WW15 |
| W2 rune language | Word classes, contextual senses, carrier capacity vectors, gates and latches, reading and counters, hijacking, deep words, binding clauses, ruin hypothesis loops, sealed meaning IDs, copy lineage, three worked ASCII glyph programs with execution traces | Deepens RN1-RN13 and CR16; the worked programs are the first concrete rune composer content (UI CF3) |
| W3 reveal cheats | RC1-RC16 plus 12 more cards with status-text samples; fidelity ladders reconciled (root F0-F5, companion RF0-RF6); a 28-card leak list (feelings, glow, counts, sorting and buyer prices can all leak) | Deepens CR1-CR22. RC13 is the only physical-copy exception, and information-copy cards never duplicate identity, souls or bonds |
| W4 implementation | AB1-AB12 with file:line evidence, identity contract ID1-ID5, ordered slices PS1-PS5 | Replaces this doc's AB and IM rows as the evidence-backed set. My AB1-AB12 are superseded where they differ |
| W5 micro craft | 80 sourced text cues (SB13-SB92) across ten crafts | Extends SU1-SU21 |
| W6 other arts | OM1-OM16 deepened, 12 more arts (pottery, rope, dyes, masonry, calibration, assistive fittings, maps, restoration and more), 16 game references, worked joins | Extends WC11 |
| W7 item lifetimes | LT1-LT12, a three-generation knife biography, carryover matrix (W7's CR1-CR8 are carryover rows, not cheats) | Extends WC8-WC10 and WX3. Keeps physical instance, biography, claims, custody and identity separate |
| R1 | Stopped; W1 is its replacement | None |
| R2 game references | Ranked top 10 (Tinkers' Construct, Ars Nouveau, Noita, Atelier Ryza and more), GX1-GX10 | GX2 (program, carrier and executor kept separate) and GX3 (three kinds of failure) sharpen RN; GX7 (a notebook of claims, not truth) matches OV4; GX8 (a learned procedure unlocks repetition) matches OV3 |
| R3 | Stopped; W4 is its replacement | None |

### Contradictions to keep visible

- **R2 GX5 and GX6 versus silent rules changes.** Paid items made under
  older rules need pinning or migration, never a silent reroll. This is the
  same rule as the materials audit's R6, and it applies to IM7 here.
- **Build order differs, and both orders stay reachable.** W4 starts with
  braces, repair, a blade pair, appraisal and a work lamp (PS1-PS5). The
  crafting palette's CR6 starts with the registry adapter, then
  poison and antidote, then the notebook. My earlier "three-part knife" slice
  is superseded by W4 PS1 and PS3.
- **W4 F5: the scheduler's 512-boundary cap protects causal work, not browser
  responsiveness.** IM3's resolver budget is an unmeasured candidate gate.

### Top picks after the fold

1. **W4 PS1, two Springsteel braces on the P2 registry.** It's the shared
   first step for equipment and matches the crafting palette's top pick.
2. **W3 RC1 appraisal as the first lens,** with W3's leak list as its
   acceptance checklist.
3. **W4 PS3, a generated blade pair** that changes attack or recovery in real
   native combat.
4. **W4 PS5, P6's work lamp, using W2's typed ports and bounded trace.** It's
   the first rune that does something useful, without a universal rune
   language.
5. **W7's identity separation (JR1-JR5) adopted before any history log,** so
   reforging and heirs work.

The duplicate palettes stay as they are; they're owned elsewhere. This doc
remains primary, and the maker-arts doc keeps its W-lane links.

## Round 4: the three companion palettes merged here (2026-10-30)

Weibao wants one owner per cross-cutting topic: merge rather than create, and every other place links to the owner. Round 3 ended with "The duplicate palettes stay as they are"; that is superseded. This file is the owner of weaponcraft, runes, inscription, maker arts and their reveal cheats. Everything below is an agent proposal (AD32); no code or build order is selected.

**Why this file and not a representation doc.** It already carries the Round 2 crosswalk and the Round 3 fold, IDEA_INDEX lists it first, and most live links point at it. [CRAFTING](representations/CRAFTING.md) is the craft-glance UI slice (CF1) and [RITUALS_AND_MAKING](representations/RITUALS_AND_MAKING.md) draws rite circles and brew tracks, so both are screen representations, and about 92 KB of palette text does not fit a section of either. They link back here for the design palette; this file links to them for the screens.

**Donors.** Each donor keeps a stub that names this owner and the git revision `d415ef656`, where its full text can be read.

| Donor (former file) | Prefix in this file | Codes | Same idea as a canonical row (alias table) | Moved here as written |
|---|---|---|---|---|
| [WEAPONCRAFTING_RUNES_AND_INSCRIPTION](WEAPONCRAFTING_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) | `WF`, `WP`, `RU`, `CS` stay bare; `WFI-` for OM, WW, SB, OV, AB, IM | 103 | 59 | 44 |
| [WEAPONCRAFTING_RUNES_AND_REVEAL](WEAPONCRAFTING_RUNES_AND_REVEAL_CONSIDERATIONS_2026-10-14.md) | `REV-` for WC, RN, OV, IM; `RV` and `XA` stay bare | 48 | 37 | 11 |
| [WEAPONCRAFT_RUNES_AND_MAKER_ARTS](WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md) | `MKR-` for WC, AR, RN, OM, SB, OV, IM, AB; `WQ` and `RC` stay bare | 124 | 49 | 75 |

Bare WC, RN, CR, SU, OV, AB, IM, WW and WX codes are this file's own, from the earlier rounds. The 2026-10-19 rename is in [reserved prefixes](RULES_INDEX.md#reserved-prefixes-2026-10-19).

**Correction to the Round 2 crosswalk.** Its "M" and "I" columns were written before the rename, so "M WC1" now means MKR-WC1 and would read as this file's WC1. Use the alias table below instead: it is keyed by the donor's current code and has the reveal companion (R) the Round 2 table lacked. Where Round 2 and the alias table differ, the alias table is the current reading. A few Round 2 pairings were loose (for example RU10, erasing and overwriting, is a distinct idea and is kept below, not folded into RN7).

**Authority and open owner.** The Round 2 and Round 3 positions stand: P6 owns the assembly and pattern graphs, the P2 records are the item identity authority, and one owner for the knowledge and fidelity store is still the open decision (AB2 above). The merge does not decide it.

**Other owners the donors cite** (kept so the links survive; the Round 1 owner table above has the rest): [E4 tags and rules](emergent/E4_TAGS_AND_RULES.md), [E4B materials](emergent/E4B_MATERIALS_AND_NOITA.md), [means and appraisal](MEANS_AND_APPRAISAL.md), [cheat library](CHEAT_LIBRARY.md), [cheats by world](CHEATS_BY_WORLD.md), [part 22 features as cheats](worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md), [part 39 overarching principles](worlds/world-depth-2026-10-13/39_OVERARCHING_PRINCIPLES.md), [technology and progression](TECHNOLOGY_AND_PROGRESSION.md) (CT1-CT5, CD1-CD12), [P6 report](gm/dispatch/procgen-2026-10-13/p6/REPORT.md), [CR2 world crafting laws](gm/dispatch/procgen-2026-10-13/cr2/REPORT.md), [maker arts by world](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md).

**Zero-loss check (script, 2026-10-30).** All 275 table codes in the three donors were extracted from `d415ef656` and each appears in this file, 145 in the alias table and 130 as moved rows. Uncoded donor ideas moved as text blocks: the lens rules, the identity authority note, the fidelity tiers, the reference-game list, the two code-state notes and the three earlier build orders. Donor owner tables are reduced to the link list above (the links, not the prose). Nothing outside those was dropped; the alias table keeps each aliased row's title only, so extra wording on an aliased row is read from the donor revision.

### Round 4 alias table: one name per idea

Read a donor code across to its canonical (bare) code. Targets named MKR-, WFI- or REV- point at a kept row in the moved sections below. Each donor row had a title and extra wording; the title is shown here and the full donor text is at `d415ef656` (see the stubs). A target code is the working name from now on.

**WFI codes** (Weaponcrafting, runes and inscription (parallel session))

| Donor code | Idea (donor title) | Same idea as |
|---|---|---|
| WF1 | Weapons are assemblies | WC1 |
| WF2 | Material decides limits, skill decides how close you get | WC4 |
| WF3 | Process steps matter | WC3 |
| WF4 | Heat treatment as the classic choice | WC3 |
| WF5 | Fit to the wielder | WC5 |
| WF7 | Signature marks | SU3, WC10 |
| WF10 | Non-metal weapons | WC11 |
| WF11 | Ammunition and consumable weapons | WC11, MKR-WC7 |
| WF12 | Armor follows the same model | WC11, MKR-AR1 to MKR-AR6 |
| WP1 | Wear and maintenance | WC7 |
| WP2 | Repair vs reforge | WC8 |
| WP3 | History log | WC10 |
| WP4 | Naming | WC10, SU4 |
| WP5 | Bond growth | WC9 |
| WP7 | Breaking | WC8, MKR-WC10 |
| RU1 | A rune is a small program on a carrier | RN1 to RN4 |
| RU2 | Grammar | RN2 |
| RU3 | Runes are knowledge first | RN10 |
| RU4 | Carrier limits | RN3, RN5 |
| RU6 | Power source and upkeep | RN4, RN7 |
| RU7 | Misfire and backlash | RN9 |
| RU8 | Deciphering found runes | RN10 |
| RU11 | Runes on bodies | RN12, MKR-RN6 |
| RU12 | Runes in places | RN12 |
| RU13 | Reading runes reveals intent | RN11 |
| WFI-OM4 | Wands and foci | MKR-OM2 |
| WFI-OM6 | Jewelry and trinkets | MKR-OM1 |
| WFI-OM7 | Traps and devices | MKR-OM5 |
| WFI-OM8 | Fusion of finished items | MKR-OM15 |
| CS1 | Item status window | CR5 |
| CS2 | Material sight | CR15 |
| CS3 | Forge preview | CR7 |
| CS4 | Rune reading | CR2 |
| CS6 | Weapon voice | CR10 |
| CS8 | Copy inscription | CR9 |
| CS9 | Upgrade path display | CR11 |
| WFI-SB2 | Burns and calluses on a smith's hands (MC13) | MKR-SB3 |
| WFI-OV1 | One making model for all things | OV |
| WFI-OV2 | Truth vs knowledge | OV4 |
| WFI-OV3 | Ceilings from materials, closeness from skill | WC4 |
| WFI-OV4 | History is part of an item | AB10, WC10 |
| WFI-OV5 | World laws plug in | OV1 |
| WFI-OV6 | Everything idles by batch and routine | OV3 |
| WFI-AB1 | Material | AB2 |
| WFI-AB2 | Part | AB1 |
| WFI-AB3 | Assembly | AB1 |
| WFI-AB4 | Process record | AB3 |
| WFI-AB5 | Inscription | AB6 |
| WFI-AB6 | Effect | AB4 |
| WFI-AB7 | Knowledge entry | AB7 |
| WFI-AB8 | Item history | AB10 |
| WFI-AB9 | World making law | AB11 |
| WFI-AB10 | Stat derivation | AB4, MKR-IM3 |
| WFI-IM1 | Vanilla compatibility | IM7 |
| WFI-IM3 | Save size | IM1 |
| WFI-IM4 | Pure resolvers | IM2 |
| WFI-IM5 | Knowledge filter in UI | IM4 |
| WFI-IM7 | Content scale | IM6 |
| WFI-IM8 | Browser proof | IM9 and the AGENTS.md verification section |

**REV codes** (Weaponcrafting, runes and reveal)

| Donor code | Idea (donor title) | Same idea as |
|---|---|---|
| REV-WC1 | Weapons from parts | WC1 |
| REV-WC2 | Technique changes the result | WC3 |
| REV-WC3 | Weapons that grow with their owner | WC9, MKR-AB9 |
| REV-WC6 | Named weapons and lineage | WC10, SU4 |
| REV-WC8 | Maintenance as gameplay | WC7 |
| REV-WC9 | Commissions and smith reputations | WF8, MKR-WC13 |
| REV-WC10 | Testing and trials | MKR-WC11 |
| REV-RN1 | A symbol grammar per world | RN1, RN2 |
| REV-RN2 | Surface capacity | RN3, RN5 |
| REV-RN3 | Resonance and conflict | RN8 |
| REV-RN4 | Activation and fuel | RN4, RN6 |
| REV-RN5 | Places as surfaces | RN12 |
| REV-RN6 | Inscription skill and errors | RU5, RN9 |
| REV-RN7 | Reading foreign runes | RN10, MKR-RN11 |
| REV-RN8 | Rune drift and decay | RN7 |
| REV-RN9 | Runes on bodies | RN12, RU11 |
| RV1 | Appraisal and identify | CR5 |
| RV2 | Structural analysis and tracing | CR1, CR9 |
| RV3 | Status window item view | CR5 |
| RV5 | Rune readers | CR2 |
| RV7 | Smith's sense | CS12, RC4 |
| RV8 | Provenance sight | CR10 |
| REV-OV4 | Small honest tells | SU7, MKR-SB9 |
| REV-OV5 | Repair keeps identity | WC8, WP2 |
| REV-OV6 | Per-world weapon culture | MKR-WC12 |
| XA1 | Item identity | AB1, MKR-AB12 |
| XA2 | Composition graph | AB1 |
| XA3 | Inscription layer | AB6 |
| XA4 | Bond | MKR-AB9 |
| XA5 | Effect algebra | AB4 |
| XA6 | Lens | AB7 |
| XA7 | Process | AB3 |
| XA8 | World law adapter | AB11 |
| REV-IM1 | Hidden properties need a knowledge store from day one | IM4, MKR-IM6 |
| REV-IM2 | Derived stats are computed, not saved | IM1, MKR-IM3 |
| REV-IM4 | Seeded outcomes per process step | IM2 |
| REV-IM7 | Desktop item view | AB12 |

**MKR codes** (Weaponcraft, runes and maker arts)

| Donor code | Idea (donor title) | Same idea as |
|---|---|---|
| MKR-WC1 | Weapons as part graphs | WC1 |
| MKR-WC2 | Geometry is the stat | WC2 |
| MKR-WC3 | Heat treatment tradeoffs | WC3 |
| MKR-WC4 | Layers and folding | WC3 |
| MKR-WC5 | Fit to the wielder | WC5 |
| MKR-WC6 | Weapon meets technique | WC6 |
| MKR-WC8 | Edges wear and lives shorten | WC7 |
| MKR-WC10 | Reforging the broken | WC8 |
| MKR-RN1 | Runes as a language | RN1, RN2 |
| MKR-RN2 | One glyph, many meanings | RN2 |
| MKR-RN3 | Carrier capacity | RN3, RN5 |
| MKR-RN5 | Erosion and upkeep | RN7 |
| MKR-RN6 | Body inscriptions | RN12, RU11 |
| MKR-RN11 | Learning from ruins | RN10 |
| MKR-RN12 | Generated scripts per world | RN1, RN13 |
| MKR-OM9 | Awakened weapons | WC9 |
| RC1 | Item window | CR5 |
| RC2 | Blueprint eye | CR1 |
| RC3 | Breaking point sight | CR4 |
| RC4 | Smith's ear | CS12 |
| RC5 | Rune reader | CR2 |
| RC6 | Psychometry | CR10 |
| RC7 | Potential sight | CR11 |
| RC9 | Weapon voice | CR6 |
| RC13 | Structural grasp and copy | CR9 |
| MKR-SB1 | Temper colors (straw, bronze, purple, blue) and steel's glow appear as text cues before any number | SU1 |
| MKR-SB2 | Item descriptions change with condition: a new nick, a rewrapped grip, a darker edge | SU5, SU12 |
| MKR-SB7 | Rumor names your weapon something you never called it. Names diverge by town | SU4 <!-- slip-ok: moved verbatim from the donor palette at d415ef656 --> |
| MKR-OV1 | One maker pipeline | OV |
| MKR-OV2 | An item is five things | OV |
| MKR-OV4 | Knowledge is not truth | OV4 |
| MKR-OV5 | World laws are adapters | OV1 |
| MKR-OV6 | Conservation by default | OV1 |
| MKR-OV7 | Idle by default, precision when active | OV3 |
| MKR-IM1 | Item instance envelope | IM1 |
| MKR-IM6 | Knowledge store per item | IM4 |
| MKR-IM7 | Legacy items wrap, not migrate | IM7 |
| MKR-IM8 | Determinism | IM2 |
| MKR-IM12 | Tests | IM9 |
| MKR-AB1 | Process operator | AB3 |
| MKR-AB2 | Assembly graph (L2) | AB1 |
| MKR-AB3 | Pattern graph (L3) | AB6 |
| MKR-AB4 | Material record (L1) | AB2 |
| MKR-AB5 | Condition vector and wear law | AB9 |
| MKR-AB6 | Knowledge and fidelity store | AB7 |
| MKR-AB7 | Derived profile adapter | MKR-IM3 |
| MKR-AB8 | Receipt log / biography | AB10 |
| MKR-AB10 | World law adapter | AB11 |
| MKR-AB12 | Entity reference scheme | AB1 |

### Round 4 moved rows: distinct ideas, text as written

Rows with no canonical equivalent, moved verbatim with their donor codes. Table columns differ by donor section, so each group keeps its own header.

**WFI: 1. Forging and making weapons (WF)**

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| WF6 | **Style schools** | Smithing traditions (regional, sect, guild) each favor certain shapes and processes and teach techniques. | Teachers and places matter (crafting doc MK). |
| WF8 | **Commissions** | NPCs order weapons to spec; delivered work builds renown (QP, MDQ10). | Crafting connects to the quest board. |
| WF9 | **Failures teach** | A cracked blade still yields knowledge of the material (knowledge record). | Failure moves you forward. |

**WFI: 2. A weapon's life (WP)**

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| WP6 | **Heirloom weapons** | Passed down with history; heirs get the item, not the skill (LR3, LR4). | Ties to succession. |
| WP8 | **Theft and recovery** | Stolen named weapons can be traced by their mark or history (QT3). | Items carry stories across owners. |

**WFI: 3. Runes and inscription (RU)**

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| RU5 | **Precision** | Hand steadiness, tools and time decide how clean a line is; sloppy lines weaken or twist the effect. | Skill without dice. |
| RU9 | **Composition discovery** | New combinations can be found by experiment; some are dangerous, some are lost lore. | Player creativity with limits. |
| RU10 | **Erasing and overwriting** | Runes can be scraped, burned out or overwritten, sometimes leaving residue. | Items change over time. |
| RU14 | **Runes as language and culture** | Each culture's script carries history; runes can be words as well as power (PROCEDURAL_STORY B5). | Lore depth. |

**WFI: 4. Other making near these (OM)**

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| WFI-OM1 | **Enchanting** | Adding an effect to an item through a ritual, rune or infusion, with slots and conflicts. | Common fantasy craft. |
| WFI-OM2 | **Socketing and gems** | Gems or cores set into fittings add properties; removal may destroy one or the other. | Modular upgrades. |
| WFI-OM3 | **Golems, constructs and puppets** | Body (materials) plus control program (runes) plus power. | Same abstractions combined. |
| WFI-OM5 | **Talismans and charms** | Single-use inscribed paper or objects; batchable. | Idle production. |

**WFI: 5. Cheats that show these things (CS)**

| Code | Cheat | What it shows | Limits |
|---|---|---|---|
| CS5 | **Recipe or pattern sense** | Outlines of designs never seen: a shape, a fold pattern, a circle layout. | Outline only; execution still needs skill (crafting doc CT4). <!-- slip-ok: moved verbatim from the donor palette at d415ef656 --> |
| CS7 | **Perfect line** | Removes precision error when inscribing (crafting doc CT2 for runes). | A wrong design is still wrong. |
| CS10 | **System smithy** | An outside shop or forge that crafts with system rules (Solo Leveling style). | Imported goods still face local laws (crafting doc CT4). |
| CS11 | **Absorb a weapon's skill** | Learn a technique from a weapon's history (Shadow Slave style memories, Tensura absorption). | World-specific; follows carry rules (LR4). |
| CS12 | **Smith's sense (base, not cheat)** | Tap a blade and hear its temper; a common trained skill in smithing cultures. | Shows the line between skill and cheat. |

**WFI: 6. Per world (WW)**

| Code | World | Making law worth modeling |
|---|---|---|
| WFI-WW1 | Harry Potter | Wandlore (core, wood, wand chooses the wizard); Ancient Runes as a school subject; goblin metalwork. |
| WFI-WW2 | D&D | Magic item crafting by budget and time; scrolls, glyphs and symbols by spell; intelligent items. |
| WFI-WW3 | Mother of Learning | Shaping, ward schemes, golem and enchanted item crafting with mana. |
| WFI-WW4 | LOTM / CoI | Mystical items carry Beyonder characteristics and negative effects; symbols and rituals matter. |
| WFI-WW5 | Shadow Slave | Memories (items) the Spell describes in runes; runes as the Spell's readable text. |
| WFI-WW6 | JJK | Cursed tools, technique-imbued objects, binding vows on items. |
| WFI-WW7 | Bleach | Zanpakuto are souls, not crafted; Kido incantations; Quincy tools. |
| WFI-WW8 | Naruto | Ninja tools, sealing jutsu (fuinjutsu) as inscription, storage scrolls, explosive tags. |
| WFI-WW9 | FMA | Transmutation circles; equivalent exchange on materials; automail engineering. |
| WFI-WW10 | Fate | Mystic codes, Noble Phantasms as legends, not crafted; runes as a magecraft line. |
| WFI-WW11 | HxH | Nen imbued into objects; conditions and vows strengthen them. |
| WFI-WW12 | One Piece | Graded named swords, seastone, Den Den Mushi and dial technology. |
| WFI-WW13 | Chainsaw Man | Devil contracts rather than crafting; few made items matter. |
| WFI-WW14 | A Soldier's Life, TTKS | From private packs; codex lane checks. |
| WFI-WW15 | Original worlds | One small original making law per world (crafting doc WL8). |

**WFI: 7. Subtle stuff (SB)**

| Code | Detail | Why it matters |
|---|---|---|
| WFI-SB1 | The smithy is hot and loud; neighbors complain at night. | Place texture and social cost. |
| WFI-SB3 | A new blade's first nick is mentioned once. | History begins. |
| WFI-SB4 | Rune ink smells of iron or herbs by medium. | Sense detail per tradition. |
| WFI-SB5 | A misread rune in an old ruin, corrected later in the notebook. | Knowledge with revision. |
| WFI-SB6 | A famous maker's mark faked on cheap work at the market. | Forgery as world texture. |
| WFI-SB7 | A weapon hums near the runes of its own tradition. | Hint of hidden links without stats. |
| WFI-SB8 | Apprentices sweep, sort scrap and fail before they forge. | Training feels real. |
| WFI-SB9 | A customer comes back to complain or to thank. | Work has afterlives (MDQ9). |
| WFI-SB10 | Scrap and offcuts pile up and can be sold or reused. | Material conservation felt. |

**WFI: 10. Implementation implications (IM)**

| Code | Consideration | Implication |
|---|---|---|
| WFI-IM2 | **Item identity** | History and names need a stable per-item id; vanilla stacks items by template and quality. Unique items must stop stacking. Migration: only new crafted or named items get ids. <!-- slip-ok: moved verbatim from the donor palette at d415ef656 --> |
| WFI-IM6 | **Rune evaluation safety** | Inscription programs are data evaluated by a bounded interpreter: no loops without limits, capped symbol counts, validated grammar. |

**REV: WC. Weaponcrafting**

| Code | Idea | Notes |
|---|---|---|
| REV-WC4 | **Weapons shaped by the wielder.** Recalled: Demon Slayer nichirin blades change color with the user; HP wands choose the wizard; Nen users shape conjured weapons by their type and vows. | The owner is an input to the item, not just a holder. |
| REV-WC5 | **Weapons with souls or wills.** Sentient blades, cursed tools (JJK, recalled), demon swords, spirit-bound relics: preferences, refusals, hunger, bargains. | Items as story actors (story P3 round 3). |
| REV-WC7 | **Canon-reserved weapons.** Noble Phantasms, legendary swords and unique artifacts are found, earned, repaired or copied only through a world's own route, never minted randomly. | P9 reserved-item rule. <!-- slip-ok: moved verbatim from the donor palette at d415ef656 --> |

**REV: RV. Cheats that reveal**

| Code | Lens | Source patterns (recalled) |
|---|---|---|
| RV4 | **Eyes.** Sight of auras, flows, weak points, lines of death or lies. | Six Eyes (JJK), Gyo (HxH), Sharingan (Naruto), Mystic Eyes of Death Perception (Fate), Spirit Vision (LOTM) |
| RV6 | **Analysis advisors.** An inner voice that explains properties and suggests recipes. | Great Sage (Slime), system assistants |

**REV: OV. Overarching and subtle**

| Code | Idea | Notes |
|---|---|---|
| REV-OV1 | **Everything made is a story object.** First blood, naming, breaking and reforging write receipts that story generators read. | The spine's receipt log is the bridge. |
| REV-OV2 | **The same rule set for NPC makers.** NPC smiths and rune masters use the player's rules, so their products are coherent and comparable. | CR4 makes the same point for crafting. |
| REV-OV3 | **Economies react to good gear.** Well-armed villages change bandit behavior; a famous rune ward raises land value. | Story J economy, I conflict. |

**REV: IM. Implementation implications**

| Code | Implication |
|---|---|
| REV-IM3 | **Inscription validation is a parser.** A rune composition is checked like code: grammar, capacity, connections, conflicts. That makes the lint tooling (P15, P40) reusable for content and for player-made runes. |
| REV-IM5 | **Registry entries, not main.js edits.** New part types, symbols, lenses and bond rules register in their own files (story BJ3). |
| REV-IM6 | **Canon-reserved IDs are checked at generation time,** not just in docs. |

**MKR: WC. Weaponcraft**

| Code | Idea | Notes |
|---|---|---|
| MKR-WC7 | **Ranged makers.** Bowyer (draw weight, limb wood, string), fletcher (spine, fletching, head), crossbows, firearms and ammunition where a world allows. | CO9 ammunition stacks already carry coatings. |
| MKR-WC9 | **Weapons are tools too.** Machete clears brush, axe fells trees, spear fishes, knife cooks. | Life-sim fit: gear has consumers outside combat. |
| MKR-WC11 | **Proof and testing.** Test cuts, proof marks on armor, ring tests, bend tests. Testing is an observation route that reveals properties at a cost (a test can damage). | Honest knowledge without a cheat. |
| MKR-WC12 | **Weapon law and custom.** Carry permits, peace-bonding, sword hunts, sect rules, duel etiquette. A fine blade in the wrong town is trouble. | World adjective, not a ban. |
| MKR-WC13 | **Commissions for others.** Arm a companion, an apprentice, a village militia. NPC users' results change your reputation. | Links MK6 commissions and [companions](COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md). |
| MKR-WC14 | **Monster-part weapons.** Fangs, horns, carapace, venom sacs. Harvest quality depends on how the creature died and how it was carved. | P8 creature resources own the harvest. |

**MKR: AR. Armor and protection**

| Code | Idea | Notes |
|---|---|---|
| MKR-AR1 | **Coverage map and layers.** Padding under mail under plate; gaps at joints; what covers what. Hits resolve against the layer at that spot. | Reads a body map the nonhuman docs already need. |
| MKR-AR2 | **Weight, heat and stamina.** Armor costs breath on long marches and in hot climates; desert worlds punish plate. | A real cost, not a speed stat. |
| MKR-AR3 | **Fitting and refits.** A growing child, a pregnancy, a body change or a transformation needs refitting. | Ties age phases and transformation docs. |
| MKR-AR4 | **Damage meets material.** Cut, pierce, crush, heat, curse, soul. Each material answers each differently. | One response table per material family. |
| MKR-AR5 | **Shields as spent defense.** Shields split and get replaced; a shield wall is a group object. | Consumable defense fits idle supply loops. |
| MKR-AR6 | **Clothes as armor where magic allows.** Enchanted robes, protective charms in cloth, fashion vs function, social signals of rank. | HP K5 protective clothing is a sourced example (P6 PATTERNS). |

**MKR: RN. Runes, inscriptions and patterns**

| Code | Idea | Notes |
|---|---|---|
| MKR-RN4 | **Triggers and logic.** Conditions (touched, spoken, blood, moonlight, intent, proximity) and gates (and, not, delay, counter) make runes a programming toy. | Noita wands and Factorio circuits feel. Execution trace required, as P6 says. |
| MKR-RN7 | **Formations at scale.** Sect barriers, city wards, anchor stones. A lost node weakens the whole; sieges hunt nodes. | Situated network; site law. |
| MKR-RN8 | **Reading and breaking others' work.** Decipher, counter-rune, smudge, hijack, reroute. | Defense and heist content from the same graph. |
| MKR-RN9 | **Deep words.** Knowing a rune's older or truer meaning strengthens it (true names, words of power). | A knowledge ladder with a real consumer. |
| MKR-RN10 | **Runes as binding.** Seals on spirits, written contracts, oaths in stone. Breaking one has the consequences it says. | Links pacts and contracts work. |
| MKR-RN13 | **Copying hazards.** A miscopied rune runs as what was written. Forgeries, student errors and drift lineages follow. | KN1 and KN4 for patterns. |
| MKR-RN14 | **Rune crafting as a resource loop.** Make blank runes from essence at an altar (RuneScape-style runecrafting) and spend them on spells. | A second, simpler mode for worlds that want it. |

**MKR: OM. Other maker arts**

| Code | Art | What makes it distinct |
|---|---|---|
| MKR-OM1 | **Gems and jewelry** | Cut quality and facets channel or store power; gems as batteries, foci or soul containers. |
| MKR-OM2 | **Wands, staffs and foci** | Core plus wood plus maker; allegiance and fit (HP wandlore is a public franchise rule). |
| MKR-OM3 | **Leather and hide** | Tanning, curing, monster hide traits; quality from harvest and process. |
| MKR-OM4 | **Glass and lenses** | Bottles, then lenses, then telescopes, microscopes and scrying glass. Links containers and research. |
| MKR-OM5 | **Clockwork and traps** | Springs, gears, triggers; traps as placed devices with real triggers (shares MKR-RN4 logic). |
| MKR-OM6 | **Gunsmithing and mods** | Receiver plus mods (Fallout workbench shape); tech tiers. |
| MKR-OM7 | **Soul and memory crafting** | Shards, memories, soul-forged gear (Shadow Slave K10 keeps forging and weaving distinct). |
| MKR-OM8 | **Cursed tools** | Binding a curse or a vow into an object (JJK cursed tools). Costs land on maker or user. |
| MKR-OM10 | **Living crafts** | Grafting, bred bows, fungal armor, symbiote blades, bio-engineered tools. Shares genetics records. |
| MKR-OM11 | **Woodwork and home** | Furniture, tools, boats, a home that shows your work. Life-sim payoff. |
| MKR-OM12 | **Paper, ink and binding** | Scroll and talisman media, manuals, ledgers. Feeds RN carriers and KN books. |
| MKR-OM13 | **Masks and disguises** | Crafted identity: masks, makeup, forged papers. Links identity laws. |
| MKR-OM14 | **Instruments** | Tone from wood and build; enchanted music where a world allows. P6 M5 owns it. |
| MKR-OM15 | **Tech blueprints and fusion** | Learn blueprints, combine two into a new one (Legendary Mechanic shape, MEMORY). |
| MKR-OM16 | **Gu and living artifacts** | Refining and combining living artifacts (Reverend Insanity Gu, MEMORY, to verify). |

**MKR: WQ. World laws for weapons and runes**

| Code | World | Law worth modeling | Evidence |
|---|---|---|---|
| WQ1 | Skyrim | Smithing tiers by material, tempering, enchanting with soul gems, disenchant to learn | MEMORY |
| WQ2 | Elden Ring | Smithing stone upgrades, affinities and Ashes of War on weapons, weapon scaling by stat | MEMORY |
| WQ3 | Fallout | Weapon and armor mods at workbenches, scrapping for parts, power armor frames | MEMORY |
| WQ4 | D&D 2024 | Magic item attunement with a slot limit (a world adjective), crafting by tools, time and budget | MEMORY |
| WQ5 | Fate | Mystery grows with age; mystic codes; tracing and projection as structural grasp | MEMORY |
| WQ6 | Jujutsu Kaisen | Cursed tools, binding vows that trade a restriction for power | MEMORY |
| WQ7 | Naruto | Sealing and storage seals, explosive tags, chakra-conductive metal | MEMORY |
| WQ8 | Bleach | Zanpakuto born from the soul, name learned through inner dialogue, shikai and bankai stages | MEMORY |
| WQ9 | Fullmetal Alchemist | Transmuting weapons from surroundings, equivalent exchange, circle-free transmutation as a rare trait | MEMORY |
| WQ10 | Harry Potter | Wandlore, goblin-made silver that takes in what strengthens it, protective clothing charms | P6 cites K5; rest MEMORY |
| WQ11 | Mother of Learning | Prepared steel and golem parts, ward and formula geometry stabilizing mana | SHOWN in P6 K6-K8 |
| WQ12 | Shadow Slave | Forging and Memory weaving are distinct; shard roles and semantic fit limit enchantments | SHOWN in P6 K10 |
| WQ13 | Lord of the Mysteries | Sealed artifacts with negative effects; Beyonder characteristics in items | MEMORY |
| WQ14 | Original worlds | One small new law each: blades that only cut what their maker hated, runes that read the reader | INFERRED <!-- slip-ok: moved verbatim from the donor palette at d415ef656 --> |

**MKR: RC. Cheats that would show this**

| Code | Cheat | Shows | Notes |
|---|---|---|---|
| RC8 | **Blueprint fusion** | Preview of combining two known designs | MKR-OM15 shape; preview is pure and spends nothing. |
| RC10 | **Uses-left counter** | Exact durability or charge remaining | Small, beloved, idle friendly. |
| RC11 | **Fit meter** | Wielder-weapon and technique-weapon match | Answers MKR-WC5/MKR-WC6 at a glance. |
| RC12 | **Array sight** | Formation lines, nodes and traps in the world | MKR-RN7/MKR-RN8 scouting. |
| RC14 | **Buyer sense** | What each buyer would pay and why | EC economy view. |
| RC15 | **Masterwork omen** | That the next job's committed draw is exceptional | Safe because reload never rerolls; it is foresight, not a reroll. <!-- slip-ok: moved verbatim from the donor palette at d415ef656 --> |
| RC16 | **Forge memory** | Replays the moment an item was made, showing each choice | A learning cheat: study a master's process. |

**MKR: SB. Subtle stuff**

| Code | Detail | Why it matters |
|---|---|---|
| MKR-SB3 | The smith's body records the work: burns, calluses, a bad shoulder, sharper eyes in low light. | Craft shapes the maker (RS2 exposure). |
| MKR-SB4 | Humidity, cold and altitude shift forging and quench results a little. | RX1/RX2 site and time laws at small scale. |
| MKR-SB5 | Guards eye a fine blade; thieves note it; experts name its maker. | Gear has a social footprint; pairs with MKR-SB7 rumor names. |
| MKR-SB6 | Shop jargon is learnable knowledge; using the right word with a smith earns trust. | Language as a skill with a social consumer. |
| MKR-SB8 | Hand familiarity: switching weapons costs comfort for a while. | Reuses the field-familiarity work in absorb-all P23. |
| MKR-SB9 | Rune ink glows faintly near related magic; a careful player notices. | A free F0 reveal for attentive play. |
| MKR-SB10 | An apprentice's first piece is weak and kept anyway. | Sentiment as a real record with a relationship consumer. |
| MKR-SB11 | Carried weight shows up as travel fatigue, not as a hidden cap. | Body realism without a menu wall. |
| MKR-SB12 | A seal or rune half-remembered from childhood resurfaces in a ruin. | Continuity hook across age phases. |

**MKR: OV. Overarching rules**

| Code | Rule |
|---|---|
| MKR-OV3 | **Every stat has a consumer.** No geometry, rune or trait ships without a rule that reads it (P6 "no empty controls"). |
| MKR-OV8 | **Makers live in the social web.** Reputation, commissions, rivals, law and gifts read real item properties. |

**MKR: IM. Implementation implications**

| Code | Implication | Notes |
|---|---|---|
| MKR-IM2 | **Part interface registry.** Socket types, fit tolerance, swap rules. Authored once per family. | Small, shared by weapons, armor, tools, devices. |
| MKR-IM3 | **Derived profile as a pure function.** (item, wielder, technique, world law) → combat or work profile, cached as a snapshot and invalidated by receipts. | The derived-snapshots dispatch is the natural owner. Never derive on each render. <!-- slip-ok: moved verbatim from the donor palette at d415ef656 --> |
| MKR-IM4 | **Pattern validator and executor.** Validate ports and topology before spend; evaluate triggers at tick boundaries; one energy ledger per reservoir. | Budget the trigger checks per tick for idle. |
| MKR-IM5 | **Wear from use receipts, batched.** Condition updates per job or per fight, never per swing during offline catch-up. | Keeps offline cost bounded. <!-- slip-ok: moved verbatim from the donor palette at d415ef656 --> |
| MKR-IM9 | **Combat must read the profile.** Today weapons are authored items; combat needs one adapter that reads derived reach, cut, thrust and durability. | Verify the current combat path before any weapon slice (lane W4). |
| MKR-IM10 | **Text from properties.** Item names and descriptions generate from properties and condition through a grammar pack, so MKR-SB1/MKR-SB2 come for free. | Shares story grammar packs. |
| MKR-IM11 | **Scale.** Thousands of items across worlds: index by owner and location, page lists, lazy-derive. | Pairs with [UI at scale](UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md). |

**MKR: AB. Abstractions needed**

| Code | Abstraction | Shared by | Status |
|---|---|---|---|
| MKR-AB9 | **Bond or attunement relation** between actor and item | Weapons, wands, zanpakuto, familiars | Shares the companions bond record |
| MKR-AB11 | **Station with state** (forge, altar, workbench, array site) | All arts | RX4 station quirks |

### Round 4 moved text blocks

**REV: reveal-lens rules** (from the reveal companion, text as written)

**Subtle lens rules.** Lenses have scope (what kinds of properties), depth (how
much), cost (stamina, mana, sanity), range, and error rate. Some lie or simplify.
Hidden properties stay hidden until a lens or an experiment reveals them, and what
was revealed is recorded as knowledge (story S-4), so it survives reload without
re-rolling. Sealed world secrets are only revealed by their authored discovery
route; a lens can be that route only when the secret's file says so.

**REV: item identity authority** (2026-10-14, agreed with the crafting and potions session; the Round 2 note above restates it)

**Authority (2026-10-14, agreed with the Procedural crafting and potions session):**
P2's live product and knowledge records (`src/mixture_state.js`,
`src/mixture_native.js`, `src/active_effects.js`) are the item identity and
knowledge authority. XA entries are adapters onto them, not a parallel model.
Reveal lenses (XA6, RV) extend the crafting palette's CT codes and CR2.

**MKR: fidelity tiers for reveal cheats**

Fidelity tiers, illustrative: **F0** a feeling ("this blade is wrong") → **F1**
category and name → **F2** numbers → **F3** hidden properties → **F4** history
and makers → **F5** what it could become.

**MKR: reference points** (the maker-arts author's recall, not verified)

Reference points (my knowledge, not verified this session): Tinkers' Construct
(part-built tools), Monster Hunter (monster-part weapons), Kingdom Come:
Deliverance (sharpening, forging), Noita (wand programming), Heaven's Vault
(inferring a script), RuneScape (runecrafting), Elden Ring (Ashes of War),
Skyrim (smithing and enchanting), Fallout 4 (mods), Dwarf Fortress (material
response, named artifacts).

**Code-state claims as of 2026-10-14** (history; Round 3 corrected the part and wear claims, check the code before relying on any)

- Inscription companion: **Code today (shown).** Vanilla weapons are assembled from components: blade or head plus handle, each with a `component_type` (`src/items.js:26-40`, `:397-398`). Quality maps to rarity with an extra multiplier on top (`src/items.js:13-24`). Armor has interior components by slot (`:127-138`). `src/crafting_recipes.js` (2,118 lines) holds recipes; `src/alloy_equipment.js` derives a brace's stats from an authored alloy profile. There is no rune, inscription, enchantment or weapon-history system.

- Maker-arts palette: Code state, checked 2026-10-14: `src/crafting_recipes.js` picks authored result IDs and assembles template parts; `src/alloy_equipment.js` derives one brace's stats. Weapons appear in `src/items.js` and `src/enemies.js` as authored items. No rune grammar, part graph or weapon geometry exists in source. Nothing below is implemented.

**Earlier build orders and smallest slices** (superseded by the Round 3 top picks; kept so their codes still read)

Inscription companion:

1. **Guard and pommel parts** added to vanilla's head plus handle assembly, each with material and quality (WF1, WFI-AB2-WFI-AB3).
2. **A maker's mark and five-line history** on newly crafted weapons (WF7, WP3, WFI-AB8), with stable ids only for new items (WFI-IM2). <!-- slip-ok: moved verbatim from the donor palette at d415ef656 -->
3. **One rune on one carrier**: a single learned symbol that sharpens or warms a blade, with precision from skill (RU1-RU5, WFI-AB5).
4. **A base smith's sense** (CS12) and one cheat version (CS1 item status window) to show the line between skill and cheat.

Codex lanes `docs/gm/dispatch/making-runes-2026-10-14/` C1 and C2 were stopped as duplicates of the primary doc's lanes.

Reveal companion:

Proposal only. Decide XA1 (item identity with knowledge state) and XA6 (lens)
first, because they shape every item UI and every reveal cheat. Then a first
playable slice: REV-WC1 weapon from two parts with one technique choice, one RV1
appraisal lens revealing one hidden trait, and REV-WC6 a name earned from a recorded
deed. Runes (XA3) follow once the item model holds.

Maker-arts palette:

Proposal only.

1. Merge P2 mixing and the P1 streams first; both are prerequisites here.
2. Unify MKR-AB1 process operator and MKR-AB6 knowledge store, since every art and
   every reveal cheat leans on them.
3. Build P6 S3-A (two braces) and extend it with MKR-WC2 geometry and MKR-WC3 heat
   treatment, plus MKR-IM9's combat adapter, to get the first real weapon.
4. RC1 item window and RC10 uses-left counter as the first reveal cheats.
5. P6 S6-A work lamp, then MKR-RN1 rune language and MKR-RN4 triggers on the same graph.


## Content reconciliation B479: full merged palette, aliases and actual means

All1081 pre-fold lines were read in complete1–150,151–300,301–450,451–600,601–750,751–900,901–1081 slices. This includes WC/RN/WW/CR/SU/OV/AB/IM/WX, all four rounds, the full145-row alias table,130 moved rows, moved prose, fidelity tiers and superseded build orders. The current145+130=275 row check and59+37+49/44+11+75 donor arithmetic pass in the task's weaponcraft-alias-check-b479.json; this verifies code-row accounting, not full donor-wording equivalence. No merged-title or prior B56 section receives proxy full-review credit.

**Read the later consolidation.** Round3 corrects the early no-parts/no-live-P2 claims and separates optional wear from the native path. Round4 supersedes the earlier decision to leave donors independent: this is the palette owner, donor stubs preserve d415ef656, and renamed WFI/REV/MKR aliases outrank Round2's loose columns. Archived donor rows101–105 were checked for the ambiguous CS6/CS8 semantics: CS6 hears history or will as psychometry, information about the past; its title does not establish an autonomous talking weapon. CS8 reproduces an inscription on a new carrier, distinct from mere memorization and whole-item/identity duplication. Keep these actual means alongside the canonical CR routes; other aliased extra wording remains in the archived donor and was not all reread here.

**Keep mechanisms and ownership distinct.** Definition/specimen/installed part, material truth, workmanship, geometry, current condition, actor/tool/style fit, actual process and history are independent useful questions. The P6 assembly/pattern and P2 product/knowledge pointers are historical incumbent seams, not a new universal item database or proof every equipped object is a mixture. Reuse the actual touched owner and AD51's first useful shared seam. One maker pipeline is a reuse proposal; different spell, pact, formation, living object or soul laws can need distinct handlers. An open knowledge-store decision in this old palette does not require another competing knowledge owner before useful work. Real craft/work/combat readers decide which data matters; decorative prose and sentimental keepsakes need not invent a stat effect.

**Local dials are not universal restrictions.** Parts, capacities, interference, strength ceilings, weakest-maker caps, obligatory upkeep, weapon discomfort, rune decay, slots, shared budgets and failure costs describe possible mechanisms. A fitting world can have superior/simple numerical gear, infinite capacity, perfect retention, free help, strong independent effects or irreversible harm without a forced counter or balance tax. Information-only design strings differ from an actually supported fabrication/copy faculty. A physical copy can have its own identity; memory, skill, title, owner claim, custody, bond, soul and consent do not all transfer just because a name or pattern does. Inherited gear need not confer skill by itself, while a real teaching/transmission/legacy mechanism can transfer more. Fixed no-loop/symbol budgets protect the selected executor; they do not ban source-supported recursion or unusual results.

**Read and reveal by actual means.** Feelings, counts, glowing hints, search/sort, price, headers, tooltips and accessibility channels can disclose hidden truth. Scope, precision, age, source and uncertainty follow the chosen reader, not a universal low-fidelity ceiling on foreign scripts or divination. A correct result under a mistaken theory preserves observed outcome separately from false explanation. Forecast/rewind/psychometry, copied program and actual sentient advice have different causal contracts. Pure preview does not spend stock or consume a committed draw; a paid fictional appraisal can have its declared cost. Fixed thresholds and proposed F0–F5/RF ladders are not universal world law. Source-qualified knowledge and sealed reveal routes stay with their owners; no raw secret is published here.

**Evidence and current scope.** WW/WQ MEMORY claims remain recall, while Round3's sourced corrections qualify D&D/Fallout/Bleach/Fate/FMA/blueprint simplifications; preserved donor recall does not undo them. Formula names, world-folder/full-book-folder counts, graphs and declared source locators are not primary qualification or implemented powers. B478's making-donor receipt already reports selected rune grammar/ledger consumers beyond the old no-rune snapshots, but lacks a pinned browser build; no current code was inspected here. The three-part knife, braces, blade pair, lamp, ports, registry and maintenance orders remain historical proposals, not a new mandatory queue. Current [PROJECT](../PROJECT.md), [making rules](MAKING_RULES.md), [architecture rules](ARCHITECTURE_RULES.md), [UI rules](UI_RULES.md), AD36/AD43 and AD42 optional review govern actual extension. Current desktop sizes/text checks supersede old1366-first gates. A512-boundary causal cap is not a frame-time guarantee; batching wear or migrating/wrapping old items needs explicit semantic compatibility, not the phrase nothing breaks. No original book/game source, private item, current runtime, test/build/browser, personal save, process, acquisition, deletion, commit or push was newly performed.


## Content reconciliation B548: sourced making and retained blueprint idea

[Maker-arts source catalogue](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md) has now been fully content-reviewed in B548. The earlier Corrections section already folds its source distinctions. In the imported alias table, MKR-OM15 and RC8 finished-design combination remain useful original proposals; the cited Legendary Mechanic source instead combines knowledge/talents into a blueprint. Do not treat those retained donor labels as verified franchise manufacture or delete the creative idea. WQ MEMORY/inherited-source rows keep their later W1 evidence corrections: local attunement/armament/profile rules, manufactured blank versus soul release, formula versus supplied spell, continuity/energy conflicts and weaving-anchor uncertainty. This is documentation reconciliation under AD32, not a new crafting implementation or source reread.

## Round 5. What an enchantment changes, 2026-11-12

**ACT NOW.** The [Tingen receipt](CRAFTING_ENGINE.md#tingen-staged-silver-and-worn-protection-2026-11-12) supplies a concrete distinction for XD7. Klein inscribes both faces and spends Spirituality to finish the same silver. The worn piece changes an ordinary mishap check and wanes from its binding date. Minecraft's enchanting table and enchanted-book anvil are ways to acquire named item upgrades. Its effects include always-on modifiers, conditional effects, changed actions and maintenance, such as Protection, Smite, Riptide and Mending respectively. Take the readable named effect and the multiple acquisition routes as reference ideas. Let the world's source decide how it is made and what it does. [Minecraft creator guide](https://learn.microsoft.com/en-us/minecraft/creator/documents/introtoenchantments) · [Official effect list](https://help.minecraft.net/hc/en-us/articles/360058730912)

**ACCOUNT FOR NOW.** ENF1–ENF7 are proposals under AD38, AD51, RN3–RN9 and ESD1–ESD7. The examples and values are original design dials. Pair each acquisition method with a consumer that can distinguish its result.

| Code | Effect | What changes in play |
| --- | --- | --- |
| ENF1 | Passive gear bonus | A strengthened edge adds power on a landed cut. An inscribed liner reduces the remaining damage from a hit that reaches its coverage. Flat armor, outgoing penetration, general damage taken, typed resistance, critical resistance and block stay distinct in the existing [combat math](../src/combat_math.js) and [gear palette](EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md). |
| ENF2 | Resistance, avoidance and prevention | A fire lining reduces burn damage while a shock-dispersing insert reduces stagger. A poison seal can reduce delivery into the body, slow buildup, or shorten a poison already present, depending on its mechanism. Tingen's charm changes whether the mishap occurs. A ward intercepts an incoming effect. These readers settle different consequences. |
| ENF3 | Charged reactions and active abilities | A shield discharges on the first qualifying blow and absorbs up to its remaining charge. A weapon releases a pulse when invoked or when its strike lands, depending on its trigger. A ring can spend power to cast a light on demand. [Stored workings](../src/stored_working.js) already model trigger, target, reach, charge and upkeep. |
| ENF4 | Tool and travel affordances | A pick preserves a fragile sample so it can be planted or studied. A different pick extracts extra fragments from the same seam within its material budget. Boots grip on wet stone or lighten a landing. The action's yield, route, time or consequence carries the benefit. |
| ENF5 | Maintenance and temporary treatments | A hard coating wears instead of the edge for a while. A mending pattern repairs condition from a real fuel account. A replacement grip can restore ordinary use while the original etched blade retains its own binding. Breaking the etched blade may break the working where its pattern crosses the fracture. |
| ENF6 | Inherent, installed, attuned and bound | A material can supply a trait by itself. A socketed charm can travel with the insert when moved. An inscription can stay on the actual blade through a handoff. A personal pact can require the new bearer to attune, or let the old bearer call a loaned item back under its terms. Custody, eligibility and the carrier's remaining power are distinct saved facts. |
| ENF7 | Conversion and tradeoffs | An unusual shield routes blocked force into a reservoir that powers the next shove. It has a finite receiving capacity and excess force reaches the bearer. Credit the reservoir once from the actual intercepted force. A reflected hit is a new consequence attributed to the shield, with its own response rules. |

**Damage example.** An illustrative 20-point physical hit meets 6 flat armor, leaving 14. A matching 25% reduction takes it to 10.5. A charged shield that intercepts 8 at the outer layer instead passes 12 into armor and spends 8 charge. If the same armor and reduction then apply, 4.5 reaches the body. Fire resistance uses the fire portion or the attack's declared type mix, according to the local combat resolver. If the blow also causes stagger, bleeding or poison delivery, each consequence reads the defense that can affect it. The native pipeline already orders flat and percent mitigation and applies the type modifier. The headless [contest strike](../src/contest_resolvers.js) currently reads flat armor and guard. Its future typed-resistance case must explicitly connect a worn source to an existing resolver. Charge is spent at settlement, and a combat preview can report each source without paying it.

**Acquisition choices.** A world can offer named recipes or books for predictable work, experimentation on a medium, gems and modular parts for reversible refits, found affixes for discovery, and attunement or commissioned work for rare bindings. Tingen starts from the authored inscription. A Minecraft-like workshop could expose a short list of common named patterns and let unfamiliar effects be appraised later. More ranks can mean stronger mitigation, broader coverage, lower charge cost or longer useful life, depending on what the technique actually improves. Show the changed property before binding when the maker knows it. On transfer and restore, retain the real item's identity, condition, remaining charge and age where those facts apply.

**LATER / DELEGATE.**

| Priority | Level and effort | Done check |
| --- | --- | --- |
| ENF8. One typed defensive lining | Balanced, medium | Same saved draw against plain and inscribed copies with identical base armor. Matching fire damage changes, an ordinary cut follows the base armor, a mixed hit shows where the effect applies, and unequipping removes the bonus. The headless receipt names the actual worn source and outcome after restore. |
| ENF9. A charged carrier or a repair that moves the working | Balanced, medium | When a selected source supports it, exercise the same carrier before and after handoff or part replacement. Check one charge debit on a qualifying release, replay after JSON restore, and a failed use tied to its missing charge, missing pattern or bearer condition. |
| ENF10. A noncombat enchantment with a new use | Balanced, small to medium | Compare the same source material with ordinary and preservation tools. The resulting intact sample reaches an existing planting, appraisal or research action and survives a restore. |

## Round 6. Fitted fire lining, 2026-11-12

**ACT NOW · ENF8.** The previous round had native typed combat and a headless contest with flat armor. The [workshop pack](../src/world_packs/fire_resistant_lining.js) now fits one exact liner to a breastplate, and the [contest strike](../src/contest_resolvers.js) calls the existing [typed damage reader](../src/damage_types.js) after flat armor and guard. Typed resistance scales vitality removal. It leaves other published consequences to their own readers. The plate retains its identity and references the installed liner. The cost owner debits one loose stock unit. The wear action points the torso slot at the plate the wearer actually holds, and each new bout reads that slot and the installed part.

| Same seeded strike | Plain plate | Fitted plate | Unequipped after restore |
| --- | ---: | ---: | ---: |
| Cut | 25 | 25 | 31 |
| Fire | 25 | 15 | 31 |
| Half cut, half fire | 25 | 20 | 31 |

The trial uses authored values for an original workshop fixture: 6 flat armor, 40% reduction of the post-armor fire share, and three minutes to fit an already enchanted liner. Starting from the same plate and seed makes its flat armor and the raw roll common to both sides. JSON restore mid-fitting matches uninterrupted settlement. Restore after fitting preserves the result, restore after unequipping preserves the bare result, and re-equipping the same plate restores its benefit. Misfit and provider loss leave the unit unspent, and overlapping fittings spend it once.

**ACCOUNT FOR NOW · ENF11.** Keep the chassis, the fitted part, the worn slot and the effect reader distinct. The plate has the same base protection with either loadout. The exact liner supplies the fire multiplier when fitted and worn. This lets a future repair restore the chassis without refreshing a worn lining. A compatible replacement can change which damage the plate resists. Item inspection can trace the bonus from the plate to its installed part. This contest snapshots the worn profile when the bout starts. Changing equipment during a bout would need a timed equipment action and a current-loadout read at settlement. The fixture implements fitting and wearing. Creation of the enchantment itself remains a separate making case.

**LATER / DELEGATE.**

| Priority | Level and effort | Done check |
| --- | --- | --- |
| ENF12. Refit and recover a component | Balanced, medium | Replace the exact liner, restore the save, and show the same plate's resistance follow the replacement. Return the old component or its salvage once, at the condition the work leaves it in. |
| ENF13. Compare a charged defense | Balanced, medium | With the same mixed hit, compare a passive liner with a stored working that spends charge to intercept part of the blow. Keep the charge delta and the body's damage through restore. |
| ENF14. Distinguish wearer protection from exposure | Balanced, medium | Use the same fitted part on a fire hit and on sustained heat. Add a heat exposure reader when the part's material supports it, and track what reaches the body over time. |

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11, MR29–MR33, ESD1/ESD7 and KW5/KW10/KW15. Base `4d4505223bae7c097a3a1c833f195ea53f8d0e26` plus live shared inputs. One new pack and focused test, one existing strike reader extended, no new save schema or game registration. The [headless fixture](../tests/fire_resistant_lining.test.js) ran through actual contest vitality settlement. Agent-verified under PC95. Game tie-in and full suite remain separate gates.

- `node --test tests/{fire_resistant_lining,contest,contest_consumers,damage_types,craft_assembly,engine_host,lotm_amulet_inscription,paradise_dragon_flash}.test.js` passed 54/54.
- `check:arch`, `check:coverage` and `check:rules` exited 0. Rules reported the existing exam-clock, private-pack glob and shared PROJECT direction-sync warnings.
- Isolated `BUILD_OUT=<temporary directory> npm run build` passed with the existing duplicate-key warning in `travel_legs.js`. Bundle SHA-256 `2f29f55f9dca6a59a200db3d53b2d95932411e52efd1b536132c27d906ab0707`.
- Scoped whitespace and local links passed. `check:docs` reports the unrelated W18 seam note at line 29.

## Round 7. Item enchantment capability coverage, 2026-11-12

Weibao asked for comprehensive capability coverage first, with each world free to use the subset that fits it. The scope here is the item system and ENF1–ENF14. Canon bindings keep their own requirements. Original workshop rows exercise shared capabilities under PC95.

| Capability family | Existing owner and integration target | Distinguishing evidence |
| --- | --- | --- |
| ENF15. Acquire and create | Rune grammar, material and fabrication laws, working kernel, stock and cost owner. Named recipes, experiment, discovered affixes, material traits, copy, paid service and practice are different inputs. | The maker binds an actual blank, pays for work, and a consumer reads the resulting effect. Failure retains the correct input state. |
| ENF16. Fit, custody and recovery | Substrate identities and custody, fabrication fit and salvage, item condition. Include install, swap, unequip, lend, transfer, attune, repair, detach, break and reclaim. | The same chassis changes behavior with its installed part. The returned part keeps its condition and cannot be recovered twice. |
| ENF17. Passive and conditional effects | Equipment and combat profiles, typed combat, mishap, exposure, status, harvest and travel owners. Include flat and percent changes, typed harm, avoidance, secondary consequences, action availability and output quality. | The changed action or harm is settled by its actual reader. Compare with the same input and seed. |
| ENF18. Active, reactive and maintained effects | Stored working, kernel effects, guard layers and cost owner. Include use, hit/contact/condition/time triggers, keys, reach, decay, recharge, renew, damage absorption, conversion, reflection and failure. | Actual payload or intercepted harm changes and a finite account is charged once. Restore before and after firing. |
| ENF19. Composition, knowledge and provenance | Rune grammar and pattern combinations, knowledge, working receipts, item lineage. Include slots and capacity where local law uses them, stacking and interference, appraise, forecast, repair history and transfer terms. | Compare two compositions or readers. Keep physical facts, what the bearer knows, and what is disclosed distinct. |

**ACT NOW.** The first implementation pass connects all five families to existing owners. Coverage below distinguishes the exercised paths from features that still need a connection or a source-specific rule.

| Family | Headless evidence in this pass | Remaining item-level connection |
| --- | --- | --- |
| ENF15 | A named recipe and an experimental rune sequence run through the same grammar. Three marks produce 40 fire resistance and 20 insulation for three ink. An incompatible pair spends two ink and leaves a blank. | Copy a known design onto a fresh carrier with its source lineage. Exercise discovery and paid specialist services. |
| ENF16 | A timed refit installs a distinct liner, returns the original at condition 50, and preserves the plate's identity. Thread repairs the old part to 75. Salvage credits scrap once. A transferred plate keeps its liner. Detaching it restores the bare plate's profile. | Bind removal and transfer terms to loans, cross-world routes and actual breaking events. Add condition loss from real use. |
| ENF17 | A fitted liner changes matching combat damage and the dose from sustained heat. The enchanted harvest edge runs the native harvest planner and settles one exact pelt, from quality 70 in four minutes to 85 in two. | Connect live status delivery, movement and environmental tick owners. The heat fixture receives a dose, and the harvest fixture supplies an enchanted edge and an authored specimen draw. |
| ENF18 | A worn ward catches four of twelve incoming damage on its matching channel. Stored charge exhausts, paid recharge restores use, and attunement changes what happens after transfer. Eight intercepted points enter a finite carrier account. Spending five removes five vitality from a reachable target and leaves three in the account. | Run this ward inside a timed contest, and connect genuine reflection, timed maintenance and carrier break events. Existing stored-working fixtures independently exercise contact, event, time, threshold, decay, renewal, reach and break behavior. |
| ENF19 | Rune composition executes before inscription, fit checks the actual interfaces, and the saved working and harvest keys retain the observed result. The installed part and wearer remain distinct. | Add appraisals whose observations control disclosure, previews for item operations, and interactions among multiple installed or inscribed effects. |

**ACCOUNT FOR NOW.** All three workshop adapters opt in through their host config. No global item recipe or enchantment list is assumed. Match the local carrier, input, activation, and effect to an actual reader. The fixture uses original tuning values, a bespoke workshop torso slot, an authored heat dose, and a ward-hit entry point separate from the timed contest. The shared owners still hold the time, cost, stored charge, typed harm calculation and identity-bearing stock. These capabilities are available headlessly. Game tie-in follows PC95.

**LATER / DELEGATE.**

| Priority | Level and effort | Done check |
| --- | --- | --- |
| ENF20. Timed gear and secondary consequences | Balanced, medium | Same mixed hit before and after timed unequip, including a saved in-flight strike. Show the armor, ward, heat and status effects use their respective readers. |
| ENF21. Copy, appraisal and multiple effects | Balanced, medium | Copy an actual inscription, retain the source, and appraise with two observers. Confirm two compatible effects and one interfering pair change a settled action. |
| ENF22. Item use across custody and other actions | Balanced, medium | Run one loan or return with exact item custody, plus one travel or status affordance. Verify condition, charge, output and authorization through restore. |

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11, MR29–MR33, KW5/KW10/KW15, RN3–RN9 and ESD1/ESD7. Base `4d4505223` plus shared live inputs. The three workshop adapters and two focused fixtures require zero game registration or new save schema. Agent-verified at fixture scope.

- `node --test tests/{fire_resistant_lining,enchanted_harvest_tool,contest,contest_consumers,damage_types,craft_assembly,engine_host,lotm_amulet_inscription,paradise_dragon_flash,rune_grammar,harvest,stored_working,stored_working_engine}.test.js` passed 103/103.
- Architecture, coverage, and rules checks exited 0. Existing warnings cover the exam clock, private-pack glob and the shared PROJECT direction sync. Isolated build passed with the existing duplicate-key warning in `travel_legs.js` and bundle SHA-256 `b8747bec85dd7a23b3baae6da45ebcbb9d66e0c40123da5ecf6132e53c9ce127`. The full suite is the committer gate.

### ENF21. Physical copying and observer appraisal

A timed copy rereads the exact loose source inscription, pays ink and writes the same marks on another blank. The receipt records the original carrier. The source keeps its own condition, stock and inscription. The copied two-mark pattern reduces the same fire strike from 25 to 15 and leaves the heat dose at 20. The earlier three-mark pattern reduced both. The unknown pair still spends ink without binding. Appraisal uses the existing knowledge pack and exposes the copied liner's nominal resistance to the observer who inspected it. A second observer has no appraisal record. Restore preserves both distinctions. This reuses the local rune grammar and knowledge owner independently, with no external code ported. The previous reference intake already pins the relevant staged-craft and modular-part references.

The executable copy and appraisal slice uses a loose source, direct local inspection and a known rune grammar. Reopen transfer of authorizations and hidden qualities when a source case needs them. Reopen multiple fitted sources when a loadout must combine them at one actual consumer. ENF20 needs the contest owner's current-loadout read at release, and ENF22 needs the real travel or status owner. Shared working and contest files were read for boundaries during this continuation.

Focused lane and related tests passed 104/104. Build SHA-256 `a8ddc45637ac8f34553a9e23cad0bd61e7766da1391484fcebd70651f351e0b0`. Architecture, coverage and rules exited 0 with the pre-existing shared warnings. Scoped whitespace passed.

### ENF22. Borrowed armor on a heated crossing

The workshop now lends the actual breastplate with its fitted part. Custody moves to the borrower and the plate keeps a lender reference. The borrower can wear the gear and return it, while fitting, detaching, gifting, and relending require the owner's custody. Returning clears the borrower’s worn slot and the loan marker. The test restores between lending, crossing and return.

The travel consumer uses an open substrate link and advances the engine by its travel time. The destination supplies authored heat per minute and any abrasion for that approach. The four-minute kiln walk settles 20 vitality loss without the lining and 16 with it. The body and carried items reach the destination together. A closed link refuses admission. In the abrasive variant, the first crossing wears the liner from 100 to 50 condition. After restore, the return crossing costs 18 vitality and the combat fire multiplier changes from 0.6 to 0.8. The route applies its exposure and abrasion at arrival. Finer exposure timing reopens when a route needs changing hazards along the way or the timing of protection changes matters.

Reference scout for the worn-gear-to-travel seam: Luanti's 3d Armor at `a4f311cbcf8125b4b83ba884d1d0d12f018021da` lets worn pieces modify movement and environmental protection. OOPS independently uses a worn profile and an actual world-link crossing. 3d Armor source is LGPL v2.1, copyright 2013–2023 Stuart Jones, with separate media notices. [Armor API examples](https://github.com/minetest-mods/3d_armor/blob/a4f311cbcf8125b4b83ba884d1d0d12f018021da/3d_armor/README.md) · [Pinned license](https://github.com/minetest-mods/3d_armor/blob/a4f311cbcf8125b4b83ba884d1d0d12f018021da/LICENSE.md)

The loan is a local custody agreement for one breastplate. Enforcement across worlds, duration, and compensation reopen with a concrete loan needing the binding and boundary owners. ENF20 still needs the contest owner's read at release. No shared working, contest or travel file was edited in this continuation.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and MR29–MR33. The 16-file focused run passed 134/134, including the workshop, fabrication, process, contest, binding, substrate and stored-working tests. Architecture, coverage and rules exited 0 with existing shared warnings. Isolated build SHA-256 `a8ddc45637ac8f34553a9e23cad0bd61e7766da1391484fcebd70651f351e0b0`. Scoped whitespace passed. The full suite remains the committer gate.

### ENF18. Reflection shares one intercepted packet with conversion

The [ward adapter](../src/world_packs/gear_ward.js) now supports a local reflection percentage. In the focused comparison a seven-point fire packet loses four to the ward, and the wearer takes three. Two intercepted points remove vitality from a reachable attacker, and two enter the carrier's stored-force account. The existing stored working spends one four-charge pulse. After restoring and moving the attacker out of reach, the next interception reflects zero and sends four to the carrier. The fixture uses direct vitality settlement for the reflected consequence. Reopen reflected damage through the combat owner's response rules when the shared release seam can apply equipment and consequences on both sides. The physical part and paid process continuation also has a [fabrication receipt](CRAFTING_ENGINE.md#paid-steel-process-through-provider-loss-and-assembly).

### ENF21 and ENF22. Layered parts and exposure barriers

A breastplate can now accept a liner and an insert. Each checks its own physical interface, spends its own loose stock unit and keeps its own identity and condition. This workshop's layers multiply the fraction of matching harm that reaches the wearer. A 40% lining and an insert delivering 20% at half condition leave 48% of the fire portion. With the original seed, the restored two-part plate takes 25 cut, 12 fire and 18 mixed. Detaching the insert restores the single-lining result of 25, 15 and 20, returns the insert at 50 condition and keeps the liner installed. Both parts follow the same plate through a loan and crossing. The pinned Luanti reference in ENF22 illustrates multiple worn sources. The fit, exact part identity and multiplicative rule here are OOPS implementations.

The workshop can also supply an exposure barrier to the existing affliction reader. With the same failed save, cellar spores open an inhaled poison track without the seal. An intact worn seal prevents that exposure. After restore, removing the plate or tearing the seal admits the same track. This is the contact-to-affliction admission boundary, before a body owner takes custody of an admitted track. The fixture's seal requires full condition because a tear opens a path for the cloud. Persistent affliction scheduling reopens when the shared living-body owner supplies a track slot and clock. The two-slot fit is workshop data. Timed contest settlement still needs the contest owner's live loadout read. No shared runtime file was edited in this continuation.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11, MR29–MR33. The 17-file focused run passed 147/147, including the workshop, affliction, process, assembly, contest, binding and stored-working tests. Build SHA-256 `ae27651a2613d9e1d89e0fbf55810aa316e67258d986a08ed8626e79527ab25e`. Architecture, coverage and rules passed with existing shared warnings. Scoped whitespace passed. The full suite remains the committer gate.

**Pointer, 2026-11-12 · enchanted gear at tie-in.** AE1–AE5 in the [carry-out](PROCEDURAL_CARRY_OUT.md#round-2-kinds-of-fight-spell-fights-world-sense-the-gu-panel-and-enchanted-gear-2026-11-12) list what ENF1–ENF22 still need to matter in a played fight: the contest's loadout read at release (ENF20), the game's equipment slots, opponents with typed attacks, one neutrally named layer reader, and each world's own carriers. Proposals; this palette stays the owner.

### ENF15. Commissioned inscription

The named-pattern route now includes a [paid specialist commission](CRAFTING_ENGINE.md#specialist-commission-on-a-customer-owned-liner). Save and restore preserve the named maker, customer and blank. Settlement consumes maker ink, transfers the customer's fee once and writes the usable pattern to that exact part. The commissioned liner changes both the fire hit and the separate heat consumer. Discovery by loot and selection among service offers remain distinct acquisition paths.

### ENF16 and ENF18. Repair a broken ward carrier and renew its inscription

Breaking a worn shield now sends a forced activation to the existing stored-working owner, which records the ward's quiet break. A paid working repairs the exact carrier with one rivet in three minutes. Repair clears the physical break. The separate renewal spends three ink, restores charge and schedules the next pulse from the current clock. The test crosses a JSON save while repair is pending and restores again after renewal. Two competing repairs spend one rivet, and an attempt to renew while the carrier is broken spends no ink. The same seven-point fire packet deals three while the ward works, seven after the break and after physical repair, and three after renewal. This is a workshop break event. Automatic damage to the carrier during contest settlement still needs the contest owner to publish the break and pass the resulting ward state to the next strike.

The two-part recovery uses the project's existing repair and stored-working mechanisms. The pinned Tinkers’ Construct material-repair example in the crafting owner informed the use of a physical repair input. This workshop independently implements a rivet repair and keeps inscription renewal under the existing stored-working owner.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11, MR29–MR33 and KW5/KW10/KW15. The 17-file focused suite passed 149/149, including the [workshop test](../tests/fire_resistant_lining.test.js). Architecture, coverage and rules passed with existing shared warnings. Isolated build SHA-256 `eeffc9f90316b98d84d5210c4d5de8310eb41579d005c23f552e6f5102f2c26c`. The full suite remains the committer gate.

### ENF18. A weapon inscription answers a landed blow

The workshop weapon uses the stored-working event reader to answer the contest's saved blow. The adapter checks the bearer, exact equipped weapon, journal cursor, contact place and target. One charge releases five additional damage into that target through the existing effect host on the next world pulse. Restoring between the blow and pulse produces the same saved world as advancing directly. Another combatant's strike, a blow from before binding, and removal before the pulse leave the charge intact. Re-equipping also advances the contact boundary, so the earlier blow stays spent as an opportunity. Restoring again cannot fire the same event twice.

The headless bout uses body holder IDs as entrants and binds one strike inscription per weapon. The pulse is a separate response after the landed blow. The original effect calibration comes from the workshop case, and the trigger reuses the stored-working event contract. Timed release inside a contest and reflection using the target's combat defenses still need the contest owner's release interface. A far contest's aggregated record needs a per-hit source when a world wants this enchantment to answer each strike there.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW5/KW10/KW15. The 18-file focused run passed 150/150, including the [strike inscription test](../tests/strike_enchantment.test.js). Architecture, coverage and rules passed with existing shared warnings. Isolated build SHA-256 `a8e3ae0f7c400ce49dc51137a788586cced8c887cd022e986d1bf3a338cf895e`. The full suite remains the committer gate.

### ENF16 and ENF18. Repair a blade and renew its strike mark

**ACT NOW.** A break silences the inscription through the stored-working owner. A three-minute job spends one repair supply to restore the blade. A separate paid renewal restores the mark and sets its event cursor to the current journal position. A queued blow from before the break stays quiet. After JSON restore, the first new landed blow fires the restored mark for five damage and spends one charge. Competing repairs spend one supply, and transfer during repair interrupts the original bearer’s job.

**ACCOUNT FOR NOW.** The workshop can trigger a break through its explicit blade action or through the wear rule below. The test uses two ink for renewal.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 310/310. Architecture, coverage and rules passed. Isolated game build SHA-256 `87fef91ec1e81d34bf6bd7e138eefc77fe06e636021c5bcf1153704bd174e95b`. The headless workshop restored the blade repair, renewal and landed-blow pulse. The docs check flags five claims in other documents.

### ENF5 and ENF18. A landed blow can fracture an inscribed blade

**ACT NOW.** An opt-in workshop pack reads the existing near-contest blow event. A matching physical blow wears the exact equipped blade. A blade that reaches zero condition breaks before the next stored-working pulse. In a bout restored before the same blow, a blade at twenty-one condition survives the twenty-point wear and deals five extra damage on its pulse. A blade at twenty condition breaks, retains both charges and goes quiet. Repair returns the blade to full condition and paid renewal restores the mark for later blows.

**ACCOUNT FOR NOW.** The workshop authors wear per blade. A blade may also use the reference load below. This reaction uses near-contest events with body IDs as entrants. Far contests need a per-hit event or an authored aggregate wear rule. The wear applies after the physical hit and before the separate inscription pulse.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW10. Twenty related files passed 311/311. Architecture, coverage and rules passed. Isolated game build SHA-256 `7f86d2ce2a77b052e4dfefea90e9ca7a54c32e8701f08d5819c7dde3a8f4017f`. The headless test restored before the physical blow, before the stored pulse and during blade repair. The docs check flags five claims in other documents.

### ENF5 and ENF18. Service a worn blade before it fractures

**ACT NOW.** A three-minute service uses one repair supply to bring the exact worn blade back to full condition. In the restored comparison the same landed blow fractures the untreated blade at twenty condition. The serviced blade finishes at eighty and its original inscription spends its remaining charge for five extra damage. Competing service jobs spend one supply, and transferring the blade interrupts service.

**ACCOUNT FOR NOW.** The general-supply job uses a full service on an unbroken blade. Fracture follows the separate repair and renewal route.

**Verification.** PC95, AD36/AD38/AD51, FBC6, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 317/317. Architecture, coverage and rules passed. Isolated game build SHA-256 `20e09ade8b3f1abc519f29f19df922ec51c6e4146acb8b5f66116c0fce3bd69d`. The headless workshop restored the service and compared the next landed blow. The docs check flags five claims in other documents.

### ENF5 and ENF16. Service a blade with an identified material lot

**ACT NOW.** A blade can specify a service material. The three-minute job binds an identified lot and spends one unit. Its authored repair yield determines the condition restored. In the restored comparison, a soft iron lot brings the blade from ten condition to fifteen, and a tempered iron lot brings it to thirty-five. The same twenty-point wear fractures the first blade. The second survives and its existing inscription deals five extra damage. A mismatched lot or one moved out of reach leaves the stock intact. Competing jobs spend the single selected unit once.

**ACCOUNT FOR NOW.** This workshop uses a material match and a condition gain per unit. Generic supplies service blades with no specified material. The comparison above authors its two lots directly. A separate [fabrication comparison](CRAFTING_ENGINE.md#forge-a-blade-service-lot-from-recovered-iron) makes the service lots from recovered iron and uses them on the same blade.

**Verification.** PC95, AD36/AD38/AD51, FBC6 and KW5/KW10/KW15. Twenty related files passed 318/318. Architecture, coverage and rules passed. Isolated game build SHA-256 `19ac1a52b6566f676c5808c17eed3b2835f826e9d8388b769fc292b57917eeb8`. The headless workshop restored the paid service and the following strike pulse. The docs check flags five claims in other documents.

### ENF5 and ENF18. Scale blade wear by the landed blow

**ACT NOW.** A blade can declare a reference load for its wear rate. The fabrication wear law scales condition loss by the landed vitality-removal amount relative to that load. The headless workshop restores two matched bouts with the same blade at twenty condition and a twenty-point reference load. A lighter cut leaves the blade sound and its inscription fires. A heavier cut exhausts the blade and its pulse stays quiet.

**ACCOUNT FOR NOW.** The workshop uses the contest's reported damage as a proxy for the load carried by the blade. Blades without a reference load use their fixed wear rate. Modeling impact against a surface that absorbs all damage requires the contest to report the physical contact load independently of landed damage.

**Verification.** PC95, AD36/AD38/AD51, FBC6, AR3/AR6 and KW10. Twenty related files passed 311/311. Architecture, coverage and rules passed. Isolated game build SHA-256 `311e9098b81715dd688d0a70abf3641ca43bacfad1678e857ddf9291dd1c4a55`. The headless comparison restored each contest before the blow and each inscription before its pulse. The docs check flags five claims in other documents.

### ENF18. Exempt a marked target from a strike inscription

**ACT NOW.** A strike inscription can name target marks that bypass its pulse. The stored-working owner checks the actual target at release. In the restored test, adding the truce mark after the physical blow leaves the target's vitality and the inscription's charge intact. Marking the wielder leaves the pulse free to fire. Removing the target's mark after a bypass leaves the old blow quiet. A fresh blow can spend the preserved charge.

**ACCOUNT FOR NOW.** This workshop checks the target's current mark at the next world pulse. Typed pulse defense still needs the stored-working host to route vitality effects through the pre-damage impact handler and carry the updated ward records and receipts forward.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW10. Twenty related files passed 312/312. Architecture, coverage and rules passed. Isolated game build SHA-256 `f4ca8017c8d3a91d451a72dd3e2fe786ba37ad8f1b21d1684bc7a47fa91002b7`. The headless test restored the pending pulse and confirmed that the retained charge fired on a fresh blow. The docs check flags five claims in other documents.

### ENF6 and ENF22. Retune a transferred strike inscription

**ACT NOW.** A personal strike mark answers the attuned bearer. A gift moves the exact blade and its remaining charge. The new bearer can retune the inscription in three minutes for one measure of ink. Settlement checks custody, blade condition and the prior attunement. A competing retune spends no ink, and giving the blade away before settlement interrupts the job. After JSON restore, the blow immediately before retuning stays quiet. A fresh blow spends the retained charge and deals five extra damage.

**ACCOUNT FOR NOW.** The workshop pack registers the retuning event so the inscription can distinguish blows before and after the job, even in the same minute. This recipe uses a personal mark. Ordinary strike inscriptions keep their existing bearer-independent trigger.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 313/313. Architecture, coverage and rules passed. Isolated game build SHA-256 `cc1c3a0f2e990c91fb47b9340f3df5c6e0b7b60240b17c76b69a323dd0e9ec29`. The headless workshop restored the weapon transfer, retune and next pulse. The docs check flags five claims in other documents.

### ENF18. Hold a strike pulse until it has enough charge

**ACT NOW.** A strike inscription can require a full pulse. In the restored comparison, both marks spend three charge to deal nine damage on the first pulse. On the next blow the repeating mark spends its last charge for three damage. The full-pulse mark goes dormant and keeps the charge. Paying for two more charge lets a fresh blow deal nine damage. The earlier blow stays quiet after recharge.

**ACCOUNT FOR NOW.** The binding uses the existing stored-working modes. The repeating mode remains the default for older and new marks. The full-pulse mode fits a pattern that needs enough charge to complete its effect.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW10. Twenty related files passed 314/314. Architecture, coverage and rules passed. Isolated game build SHA-256 `e0ecbf792bcbf0872cbc45138af774c45dcbfa168696f99b907b216856e24006`. The headless workshop restored both pulse modes and paid recharge. The docs check flags five claims in other documents.

### ENF18 and ENF22. Feed a strike inscription from the blade

**ACT NOW.** A fuel-fed inscription draws from the blade's physical stock account. A three-minute loading job moves fuel from the bearer to that account and checks custody, stock and room at settlement. In the restored test an empty blade stays quiet. Loading four fuel units, transferring the blade and landing a fresh blow spends those four units for eight extra damage. The following blow has no fuel for a pulse. Competing loading jobs cannot spend the same fuel, and a handoff before loading completes leaves it with the giver.

**ACCOUNT FOR NOW.** The test uses two fuel units for each of two pulse units and requires the full pulse. The fuel-fed pattern can be [laid again on a repaired blade](#enf15-and-enf18-re-ink-the-pattern-on-a-repaired-fuel-fed-blade).

### ENF15 and ENF18. Re-ink the pattern on a repaired fuel-fed blade

**ACT NOW.** A broken fuel-fed inscription can carry an authored re-inking price. After repairing the original blade, the bearer can pay to lay the same pattern again. The new stored record links to the broken record and starts at the current blow cursor. In the restored test, two units of ink restore the original pattern with all four fuel units still on the blade. An earlier blow stays quiet. A fresh blow spends those units for eight additional damage. The action refuses a still-broken blade, a short payment or an already working inscription.

**ACCOUNT FOR NOW.** Re-inking is immediate and preserves the old record for provenance. Renewing the existing record still requires stored-working maintenance for draw-only patterns. Timed re-inking needs a settlement operation that can publish a new stored record and pay its price together.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW10. Twenty related files passed 316/316. Architecture, coverage and rules passed. Isolated game build SHA-256 `20e09ade8b3f1abc519f29f19df922ec51c6e4146acb8b5f66116c0fce3bd69d`. The headless workshop restored before and after repair and re-inking. The docs check flags five claims in other documents.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 315/315. Architecture, coverage and rules passed. Isolated game build SHA-256 `20e09ade8b3f1abc519f29f19df922ec51c6e4146acb8b5f66116c0fce3bd69d`. The headless workshop restored the loading job, handoff and pulse. The docs check flags five claims in other documents.

### ENF15. Quote an inscription by the result requested

The [commission by protection](CRAFTING_ENGINE.md#commission-by-requested-protection) selects between two patterns using the exact liner, the customer's requested effects and the fee limit. The quoted result changes with condition. A save and restore before settlement preserves the terms, and the finished patterns have distinct effects on actual sustained heat.

### ENF16. Salvage supplies a new fitting

The [recovered cloth receipt](CRAFTING_ENGINE.md#recovered-cloth-becomes-a-replacement-lining) closes the local loop from worn part through salvage, paid fabrication, inscription, refit and two damage consumers. Restoring pending work preserves the shared scrap count and the exact identity of the finished replacement.

### ENF16. A replacement can inherit recovered cloth

An [identified cloth lot](CRAFTING_ENGINE.md#identified-salvage-lot-through-refit) now survives salvage and feeds a paid replacement with physical provenance. The cloth's dense weave changes the result's condition, which changes the existing fire-damage reader after refit and restore.

### ENF16 and ENF22. Repair follows the fitted part through return

The [fitted repair receipt](CRAFTING_ENGINE.md#repair-the-fitted-lining-on-a-borrowed-plate) verifies a timed, paid repair on an installed enchanted part. A return before settlement interrupts the job. A return after settlement delivers the improved part to the lender and changes both of the existing damage readers after restore.

### ENF18 and ENF22. A strike inscription moves with its weapon

A co-located handoff changes the exact weapon's custodian and clears the former bearer's worn slot. The stored inscription and charge stay on the weapon. Equipping starts a new contact boundary. In the headless test, the former bearer lands a blow, saves and gives the weapon away before the stored-working pulse. The old blow spends no charge. The recipient equips the weapon, lands a new blow and spends one charge for five additional damage. After restoring, only the new custodian can spend two ink to recharge it. A subsequent saved blow releases the recharged effect once.

This uses the same carrier and stored-working maintenance path as the earlier ward. The workshop handoff is immediate and co-located. Cross-world transfer reopens when the boundary owner can carry the exact item and the associated stored record in the same transaction. Same-strike settlement still needs the contest release interface described in ENF20.

**Verification.** The 18-file focused run passed 155/155, including the [strike inscription tests](../tests/strike_enchantment.test.js). Architecture, coverage and rules passed with existing shared warnings. Isolated build SHA-256 `23c041631e96030136f8d32658caa4574a5de402de98a242105eb721fe96fef8`. PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW5/KW10/KW15.

### ENF20. Timed removal during an in-flight strike

The [workshop contest adapter](../src/world_packs/workshop_contest.js) advances the world to the next contest boundary and reads the defender's worn breastplate before handing control to the native contest. The timed removal settles against the exact plate and its current wearer. The paired headless bout starts the same mixed strike while the lined plate is worn and saves with the strike and removal both pending. At minute six the world action settles first. The strike deals 31 damage after removal and 20 when the plate stays worn. Restore reproduces the uninterrupted contest and engine state. The lining stays fitted to the plate.

This adapter uses an authored conversion from contest ticks to world minutes and gives workshop actions precedence at the same minute. It supplies the profile of one designated defender. General equipment integration reopens when the main contest host supplies a common clock and the active loadout of each entrant. Same-strike ward interception, reflection and secondary consequences still need a settlement path where they can affect the strike before harm lands and enter the contest's outcome accounting.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW5/KW10/KW15. On `f0430dde2` plus shared live inputs, the 18-file focused run passed 156/156. Architecture, coverage, rules and docs passed with existing shared warnings. Isolated build SHA-256 `39fc39cb010a1aa3bf36c895700c9d8c979369f0defcf4f91dc7fc27aef405d6`. The timed comparison ran headlessly through the workshop adapter. Main-game registration and browser play are open.

### ENF15. Recover an already-inscribed part

A timed recovery can claim an existing, unowned lining at the recoverer's current place. The [headless journey](../tests/fire_resistant_lining.test.js) reaches a found liner along the heated path and restores while two people are trying to claim it. The first settlement takes custody of the original liner. The other interrupts. Recovery consumes no ink and preserves the item's condition and marks. A separate appraisal tells the new owner that it has 40 percent fire resistance. The other actor gains no appraisal. The wearer carries the original part back across the path and fits it. The same cut, fire and mixed strikes then deal 25, 15 and 20 damage.

The fixture supplies a placed, authored find. Generated affixes and encounter-specific loot allocation reopen when those sources can produce identity-bearing workshop parts. Recovering one loose part uses the existing working, custody and appraisal paths without a new save shape.

**ENF20 handoff to the contest owner.** The shared release profile port under development can read live armor. The ward case also needs a pre-landing settlement port. It must receive the typed packets and actor/target bodies, permit one saved ward charge to change the remaining harm, and let contest accounting see reflected harm before checking interruption and outcomes. The control is the lined mixed blow for 20. A fire-contact ward with a four-point pulse should leave 16, spend four charge once and split the four intercepted points between reflection and conversion in the existing 50 percent fixture. A cut, a missed blow or a ward unequipped before release should spend zero. Replay from the saved in-flight strike should reproduce the receipts and both bodies. An item-local resolver alone has no way to return the changed world and stored record to contest settlement.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11, MR29–MR33 and KW5/KW10/KW15. On `f0430dde2` plus shared live inputs, the 18-file focused run passed 157/157. Architecture and rules passed with existing warnings. Isolated build SHA-256 `84e03734e14021aa6dca1cf7ec7063fa592bcdcd7075017eb23d6ada21ae02ac`. The shared coverage check reports a Hogwarts `portkey` enchant working with an unavailable role. Agent-verified in the named headless fixture.

### ENF15. Seeded finds change which protection a recovered part gives

The workshop can place a generated find. The engine draw uses the source, site and rune grammar revision. The same grammar used for paid inscription supplies the actual fire and heat properties. The holder is committed before recovery. Reversing the order of placement produces the same two parts, and trying to place a source again after restore or after its part is salvaged does not create another item.

The headless journey recovers two distinct linings. One reduces a fire strike from 25 to 15 and leaves a heat dose at 20. Refitting the same plate with the other leaves the strike at 25 and reduces the heat dose from 20 to 16. The fitted parts and their effects survive restore. The pool is an authored workshop dial of three compatible patterns. The existing [gear affix owner](../src/gear_affixes.js) handles legacy inventory rolls and stat modifiers. This fixture uses the engine draw and rune grammar because its patterns must also support physical copying and the heat reader. Encounter rewards, randomized strengths and broader affix tables reopen when an engine encounter or a second carrier supplies a concrete consumer for them.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and GR1/GR11. On `f0430dde2` plus shared live inputs, the 20-file focused run passed 192/192. Architecture, coverage and rules passed with existing shared warnings. Isolated build SHA-256 `06d8344834cb2e97743533b8ce803ab6bc1e50bf8b9e3a42ea0b85d4329b4eef`. Agent-verified in the headless workshop. No shared runtime owner changed in this pass.

### ENF18 and ENF22. A charged weapon crosses a route and fires at its destination

The existing heated path moves the bearer and the exact equipped weapon through the substrate. The stored inscription retains its carrier and two charges across the crossing and restore. A fresh contest blow at the destination produces five extra damage on the next pulse and spends one charge. The saved pulse matches uninterrupted settlement.

The delayed pulse now checks the departure events in the same chain as the blow. If either actor leaves and returns before the pulse, the old blow spends no charge and deals no extra damage. This treats the workshop inscription as a contact effect that needs continuity until its next pulse. A different inscription could have reach or attach a delayed effect directly to the target. The crossing uses two places within one engine world. Transfers between separate world records still need the boundary owner to carry the item and its stored working together. The shared contest currently exposes a live profile read. Ward interception still needs the pre-landing settlement interface described above.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11, KW5/KW10/KW15 and ESD1. On `f0430dde2` plus shared live inputs, the 20-file focused run passed 193/193. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `06d8344834cb2e97743533b8ce803ab6bc1e50bf8b9e3a42ea0b85d4329b4eef`. Agent-verified in the [headless strike fixture](../tests/strike_enchantment.test.js). The implementation uses the existing departure events and stored record format.

### ENF20 and ENF22. Heat follows protection during a crossing

The workshop can step a heated link one minute at a time and save the crossing record alongside the engine world. Each step advances the world first, then samples the current route heat and worn insulation. Rounding uses cumulative exposure, so dividing a mild dose across several minutes preserves the lining's effect. On arrival the same movement code carries the armor and its fitted parts.

In the four-minute kiln fixture the lined plate keeps damage at 16 while worn. A timed removal that settles before the third exposure raises the total to 18. Raising the heat for the last two minutes takes it to 28. Closing the route halfway leaves the wearer at the origin with the eight damage already taken. Restoring at the midpoint reproduces the uninterrupted result. The route uses the destination's live heat as a single source for each interval and applies abrasion at arrival. Independent hazards by route position reopen when the world graph supplies those segments. The crossing record stays with the caller under the existing engine save contract.

**Verification.** PC95, PC52, AD36/AD38/AD51 and AR3/AR6/AR11. The 20-file focused run passed 194/194 on `f0430dde2` plus live shared inputs. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `06d8344834cb2e97743533b8ce803ab6bc1e50bf8b9e3a42ea0b85d4329b4eef`. Agent-verified in the [headless workshop fixture](../tests/fire_resistant_lining.test.js).

### ENF17 and ENF22. A worn seal blocks a persistent arrival hazard

An opt-in workshop pack answers the substrate arrival event at a place with airborne spores. It reads the exact fitted gear after movement, admits exposure through the existing affliction law and keeps the admitted track on the body. The world clock schedules subsequent saves. In this workshop a failed sickness check spends five stamina.

On the same crossing and saved draw, an intact seal keeps the wearer at 30 stamina. A torn seal allows three bouts of sickness, leaving 25 stamina on arrival and 15 after the remaining checks. A save after arrival and a single jump to the last check match uninterrupted settlement at each deadline. The local hazard checks arrival once and keeps one active spore track per body. Sustained airborne contact and cumulative doses reopen with a world that tracks lingering exposure. The shared contest still exposes a profile read and needs the pre-landing ward interface recorded under ENF20.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and PFA1/PFA2. The 20-file focused run passed 195/195. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `1c18e6ad84e8d1b085b104a40e31b7d10641890f9d7d27843a5eb299bf1e70b6`. Agent-verified in the headless workshop.

### ENF15 and ENF19. Failed trials teach a usable pattern

The workshop can compose a lining from the maker's observed rune pairs in saved inscription receipts. Two paid experiments each fail because one pair interferes. Each still records the pair that worked, and the blank stays available. After restore, the same maker can join the observed fire and heat pairs at their shared rune and inscribe the blank. A second actor has no trial observations. The combined result costs three ink after six spent on experiments. Fitted to the breastplate, it brings the original fire strike from 25 to 15 and sustained heat from 20 to 16.

This route uses the workshop's symmetric pairs and two-effect composition. It reads the maker's own direct trials. Teaching and transferable trial notes reopen when a world publishes those observations through the knowledge owner. Ordered runes reopen with a grammar where reversing a pair changes the result.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11, MR29–MR33 and KW9/KW10. The 20-file focused run passed 196/196. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `4574fca2c7b0a341d1e83ecc5d107a10da6551061ee2c53fecae8a5bfe21ac30`. Agent-verified in the headless workshop.

### ENF15 and ENF19. A maker can teach an observed rune pair

Two makers in the same place can share a pair from a direct trial through the knowledge owner. The student's saved record retains the teacher's identity and supplies the marks to the existing composition action. The test teaches a fire pair from a failed experiment, restores the lesson, and pays two ink to inscribe a distinct student-owned blank. After fitting and transfer, the same fire hit falls from 25 to 15. Without an observed pair or a co-located student, the teaching action refuses.

The workshop lesson is immediate, uses one effect at a time and requires direct experience from the teacher. Written notes, teaching from received lessons and priced instruction reopen with a world that uses a text carrier, apprenticeship or a service agreement. The shared contest still has a live profile reader, with pre-landing ward settlement pending under ENF20.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11, KW9/KW10 and GKM249. The 21-file focused run passed 209/209. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `b27e664210fd767bc09cff282f48f7fc52152100c994a56b65a266d4bc351f24`. Agent-verified in the headless workshop.

### ENF15 and ENF19. An observed pair travels on a written page

A maker can spend one ink and three minutes to write an observed pair on an existing blank page. The knowledge owner stores the observation on that page. Handing the blank away before the work finishes interrupts writing and preserves the ink. Handing over the finished page transfers custody. A separate timed read gives the recipient a lesson sourced to that page. A save during reading reproduces uninterrupted settlement. The reader then spends two ink to inscribe their own lining, which cuts the same fire hit from 25 to 15 after fitting and transfer.

The local page carries one directly observed pair and requires custody at settlement. Multiple lessons per volume, damaged writing and written copies reopen when the text carrier has a reader for those differences. Paid in-person instruction remains a separate service case.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11, KW9/KW10/KW15 and GKM249. The 21-file focused run passed 210/210. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `27f194f6678a2da41070ce5c6e01206105e85d8a2529f847d64e3428cdf1035f`. Agent-verified in the headless workshop.

### ENF15 and ENF19. Paid rune instruction

A three-minute lesson transfers two workshop coins and teaches one directly observed pair through the knowledge owner. Settlement checks that both makers are together and that their purses can complete the exchange. In the headless test, leaving before settlement preserves the student's two coins and grants no knowledge. When two lessons compete for the same fee after restore, one teaches and pays the tutor, and the other interrupts. The student uses the learned pair to fit a lining that takes the same fire hit from 25 damage to 15.

The price and duration are authored workshop defaults. Multi-session instruction, escrow and delegated payment reopen with a service agreement that uses those terms. Ward interception before contest damage still needs the shared ENF20 settlement port.

**Verification.** PC95, AD36/AD38/AD51, KW9/KW10/KW15 and GKM249. The 21-file focused run passed 211/211. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `ef59905e8b37f4f97f0de51903ef9d67b0bd39305b060a934445c743dcfa53d0`. Agent-verified in the headless workshop.

### ENF18 and ENF22. A ward keeps aging after handoff

The ward handoff transfers custody of the exact carrier and clears the giver's worn slot. The stored inscription retains its charge, decay clock and attunement. The new owner can wear it, pay for maintenance and attune a personal binding. The handoff requires both people to be in the same place.

In the headless test, a transferred ward catches four points of a seven-point fire packet at minute five. One minute later decay leaves too little charge to trigger. The new owner spends one ink to restore a pulse. After save and restore that pulse catches four points again, and the former owner cannot pay to recharge the transferred item. This check uses the ward's typed impact consumer. Same-strike interception and reflection in a timed contest still require the shared ENF20 settlement interface.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW10. The 21-file focused run passed 213/213. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `ed321056c74d6a29eb0fbdaba501b06336fe3b63f412d2e11c6c2730551dff9e`. Agent-verified in the headless workshop.

### ENF7 and ENF18. A full force reservoir lets damage through

The ward can set a receiving capacity on its carrier. The available space and reachable reflection target determine how much of the matching packet it can intercept. A successful catch spends one configured pulse. A full reservoir with no way to take the whole catch spends no charge when it cannot intercept any force. Existing wards use the maximum of their substrate quantity when the carrier has no smaller declared capacity.

In the headless test, one free space and a 50 percent reflection setting stop two points of a 12-point mixed hit. One point fills the reservoir and one reflects. The next hit deals all 12 and spends no charge. Releasing two stored points opens enough room to stop four on the next hit and hold damage to eight. A reflection target with one vitality limits the redirected share, and the excess reaches the wearer when there is no room for it. Save and restore reproduce the resulting charge, force and vitality. The fixture settles reflection directly. Its interaction with the attacker's combat defenses remains with ENF20.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW10. The 21-file focused run passed 214/214. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `ed321056c74d6a29eb0fbdaba501b06336fe3b63f412d2e11c6c2730551dff9e`. Agent-verified in the headless workshop.

### ENF7 and ENF20. Reflected fire meets the attacker's lining

The workshop ward sends reflected force through the typed damage reader with the attacker's current worn resistance. The damage ledger names the reflecting carrier. The ward credits the reservoir from the portion it kept. The portion diverted into reflection stays committed even when the attacker's lining resists it.

The headless comparison redirects four points of fire. An unlined attacker takes four and a lined attacker takes two. Both runs leave seven damage on the ward's wearer, four points in the reservoir and one pulse spent. Save and restore reproduce the settlement. Reflection uses typed resistance in this workshop impact path. Contest interruption, defeat credit and a second reactive defense reopen when the shared contest can settle a reflected packet with its own response rules.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW10. The 21-file focused run passed 215/215. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `ed321056c74d6a29eb0fbdaba501b06336fe3b63f412d2e11c6c2730551dff9e`. Agent-verified in the headless workshop.

### ENF7 and ENF20. A second ward catches reflected fire

The workshop impact path now sends the reflected packet through the recipient's typed resistance and then through the ward they currently wear. In the paired run, four redirected fire points become two after the recipient's lining. The recipient's ward catches one, credits it to its own reservoir and spends one pulse. The last point lands on the recipient. The first ward keeps four points from the original hit and its wearer takes seven. Restore reproduces both charge accounts, reservoirs and damage.

This workshop allows one reflection per impact. A return ward can absorb or convert the packet. Worlds that support repeated bounces can reopen this with a shared impact chain that owns order and termination. Timed contest interruption and defeat credit still need the ENF20 settlement port.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW10. The 22-file focused run passed 215/215. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `ed321056c74d6a29eb0fbdaba501b06336fe3b63f412d2e11c6c2730551dff9e`. Agent-verified in the headless workshop.

### ENF15 and ENF18. Paid preparation enables a ward binding

The workshop can fit one unit of ward wire to a carrier in a three-minute working. Settlement checks the exact carrier's custody and condition. Moving it away interrupts without spending wire. When two preparations compete for the same carrier, one completes and the other leaves the remaining wire intact. Binding consumes the saved preparation and places the inscription on that carrier.

In the headless test, restoring during preparation reproduces uninterrupted settlement. The bound and worn carrier stops four points of a seven-point fire packet and spends one pulse. Preparation and binding are separate workshop actions, so the paid preparation can be saved before the maker binds the ward. Automatic binding at the final fabrication step reopens when the engine host can publish a stored working as a kernel effect. The shared contest still exposes a live profile reader and needs the ENF20 settlement interface for ward interception.

**Verification.** PC95, AD36/AD38/AD51, MR29–MR33 and KW5/KW10/KW15. The 22-file focused run passed 216/216. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `5102f3ffb9c1f69d29f6972df9201a462b292b02dba1cd3b02bc28ca54726688`. Agent-verified in the headless workshop.

### ENF3 and ENF17. A charged ring lights an appraisal bench

A held ring can spend one stored charge on a spoken invocation. The effect host adds light to the bearer's current worksite account. In the headless test the dark bench refuses appraisal. The ring raises the site's light from zero to two, so the same observer can read the lining and learn its 40 percent nominal fire resistance. Restoring before invocation and before appraisal preserves charge and knowledge. A second invocation with an empty ring adds no light.

This workshop models the glow as a lasting increment on a site that opts into its light account. Timed fade or a glow that travels on the ring reopen when the site reads separate, expiring light sources. The ward preparation path still awaits an engine effect that can create a stored working at settlement.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW10. The 22-file focused run passed 217/217. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `5e86de925cb9e4d7eb949b24eea831228360fa89a1f6be8b83a2a576089df9b4`. Agent-verified in the headless workshop.

### ENF3 and ENF17. A timed glow lights the bench until it expires

A ring can bind a sustained glow with a duration. Invocation spends one charge and places a light field on the current site. The appraisal reader adds active glow fields to the site's ambient light. The engine expires the field at its deadline. In the headless test, the maker can read the lining before the three-minute glow expires, keeps that knowledge afterward and needs more light for a fresh appraisal. Save and restore reproduce expiration, preserve unrelated ambient light and allow a second invocation after the first fades.

This workshop allows one active field per ring. The field stays where the ring cast it. A glow that moves with its bearer or refreshes in place needs a carrier-following or duration-refresh rule. Existing rings without a duration keep their lasting light effect.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW10. The 23-file focused run passed 227/227. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `5e86de925cb9e4d7eb949b24eea831228360fa89a1f6be8b83a2a576089df9b4`. Agent-verified in the headless workshop.

### ENF3 and ENF22. A timed glow follows its ring

A portable light binding scopes the existing sustained field to the ring. Appraisal reads the ring's current place, and the world clock expires the field at its original deadline. In the headless crossing, the same ring spends one charge at departure, lights the destination after four minutes and makes an appraisal possible there. The origin goes dark when the ring leaves. Saving before the crossing reproduces uninterrupted travel, and restoring at the destination preserves the remaining two minutes.

The portable glow uses places with a workshop light account and the existing custody-aware crossing. Transfers between separate engine worlds reopen when a boundary can carry the ring, its stored working and its expiring field together.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW10. The 23-file focused run passed 228/228. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `48cfd1f264e71008d38814ab19bbde597a5d9af56ff8662daed997b97fece6d0`. Agent-verified in the headless workshop.

### ENF5 and ENF17. A sacrificial coating protects the harvesting edge

A two-minute working spends one coating unit on a held edge. Losing custody before settlement leaves the stock intact. A successful harvest spends the coating before it can wear the blade. The next uncoated harvest wears the edge normally. The headless comparison restores during coating and harvesting. On the next specimen, the protected edge yields quality 85 and the previously uncoated edge yields quality 80 through the existing harvest planner.

The workshop uses a one-use coating and 25 condition wear per uncoated harvest. Tools with no condition account retain their original behavior. Coatings that wear by degrees reopen when a task can supply different loads per use. Automatic repair can use the same condition account when a working supplies a fuel and timing rule.

**Verification.** PC95, AD36/AD38/AD51, MR29–MR33 and KW5/KW10/KW15. The 23-file focused run passed 229/229. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `20d40a268a9cf2410a651bcb0894a4a864847363451929dc92fb82f96e3de643`. Agent-verified in the headless workshop.

### ENF5 and ENF18. Mending pulses spend fuel from the blade

A maker can start a sequence of mending pulses on a blade they hold. Every two minutes the working rechecks custody and condition. Each needed pulse spends one unit of the blade's fuel and restores up to 25 condition. A pulse at full condition spends nothing. Losing custody or running out of fuel interrupts the sequence and retains the earlier repairs.

In the headless fixture the blade starts at 50 condition. The first pulse raises it to 75, and the second restores it to 100. The repaired blade produces a quality 85 pelt through the existing harvest planner. A save after the first payment reproduces the uninterrupted result. This workshop uses a manually started sequence of up to four pulses. A permanently bound self-mending pattern that reacts to wear reopens with an event that identifies the worn part and the fuel it may draw.

**Verification.** PC95, AD36/AD38/AD51, MR29–MR33 and KW5/KW10/KW15. The 23-file focused run passed 230/230. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `b6f864da714bf9a5af1692752493121f99a8db0aedcb46d296da719394aca853`. Agent-verified in the headless workshop.

### ENF5 and ENF18. A blade mends itself when harvesting wears it

The harvest working publishes a wear event after reducing condition on the exact blade. An opt-in workshop reactor answers for a blade with a bound mending pattern. It spends one unit from the blade's fuel account and restores up to 25 condition. Coating that takes all the wear leaves the fuel unspent. An empty account leaves the wear in place.

Restoring before the first harvest reproduces the same single payment and repair. The next harvest yields a quality 85 pelt with the preserved edge and quality 80 with the worn control. The binding currently answers harvest wear. Other kinds of damage reopen when their consumers can publish a compatible wear event with the affected part.

**Verification.** PC95, AD36/AD38/AD51, MR29–MR33 and KW10/KW15. The 22-file focused run passed 221/221. Adding the shared effect-host tests exposed a Hogwarts count mismatch of 82 acts versus the expected 81. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `b6f864da714bf9a5af1692752493121f99a8db0aedcb46d296da719394aca853`. Agent-verified in the headless workshop.

### ENF17, ENF18 and ENF20. A spell meets the equipment worn at contact

The workshop uses the existing engine impact port after spell contact checks succeed. For an authored direct damage type it applies worn resistance, then spends any qualifying ward pulse on the remaining packet. The spell and stored working share the same engine clock and save.

The headless fixture releases a ten-point fire spell and equips the ward during flight. At impact the bare target takes ten, the lined target takes six, and the target with lining and ward takes two. The ward spends four charge once. A slashing spell and a spell intercepted by a contact screen spend no ward charge. Restore during flight matches uninterrupted settlement, and restore at the settled minute does not repeat the hit.

This proof reads instant vitality damage with a declared type. Multi-packet spells need packet data from their source. The later area spell proof uses the effect host's admitted recipients. Timed contests still need their own landing interface for interruption and defeat attribution.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6/AR11 and KW10. The 24-file focused run passed 281/281 before adding the bare and settled-minute assertions, which passed in the focused spell fixture. Architecture, coverage and rules passed with existing warnings. Isolated build SHA-256 `cee3406f1943918ae05ad9944e3b1c15708a5359a0fdd95e738af90a2c1a31d5`. Agent-verified in the headless workshop.

### ENF4, ENF5 and ENF16. A mining inscription follows the fitted head

The gathering pick also has an independent [ore preservation inscription](CRAFTING_ENGINE.md#preserve-fragile-ore-from-extraction-to-forged-gear). It prevents authored extraction damage to fragile ore, preserving the material grade that determines the resulting ward mount's strength.

Spend one ink to inscribe the smelted head before fitting it. With the same starting vein and draw, the plain assembled pick extracts two fragments and the inscribed one extracts four. A broken grip prevents digging. Recovering the intact head and fitting a new grip restores the four-fragment yield after save and restore.

The workshop's cut pattern crosses the metal seat. A cracked seat and recasting remove the pattern, so the replacement head yields two fragments until it is inscribed again. The iron keeps its source lineage through the repair.

**Verification.** PC95, AD36/AD38/AD51, FBC4–FBC7 and KW5/KW10/KW15. Eight related files passed 101/101 against shared HEAD `f0430dde2` plus working changes. Architecture, rules and coverage passed. Isolated build SHA-256 `1115814ff2f9cf35073411524966548241124fc54f68361e27d280e23088233f`. The shared docs check flags the Gu abilities acceptance claim at line 1528. Agent-verified in the headless workshop.

### ENF5, ENF15 and ENF19. Reconstruct a recast head from its tracing

While the original head is sound, a maker can spend ink and time to trace its cuts onto a sheet. After the head cracks and is recast, the maker brings that sheet and spends fresh ink to reconstruct the cuts. The workshop checks the original billet against the recovered iron in the recast billet's lineage. A tracing from other iron or a sheet moved away during work leaves the ink unspent.

The refitted head yields four fragments after restore, compared with two after an ordinary recast. The sheet stays readable after use. This local restoration job matches the immediate recast to its source. A workshop restoring several generations from the same sheet would need to match an older ancestor through successive recasts.

**Verification.** PC95, AD36/AD38/AD51, FBC4–FBC7 and KW5/KW10/KW15. Eight related files passed 102/102 against shared HEAD `f0430dde2` plus working changes. Architecture, rules and coverage passed. Isolated build SHA-256 `6ff7599ba3de6e9c5c1c9cca5fea68a736bd85a152ed40e3a3c06a600d87971b`. The shared docs check flags the Gu abilities acceptance claim at line 1528. Agent-verified in the headless workshop.

### ENF4, ENF17 and ENF22. A mining enchantment opens a rock passage sooner

Clearing spends the actual rubble in front of a closed passage. With four units of rubble, the same three-minute job removes two with a plain pick or all four with an inscribed head. The restored, refitted head also clears the whole blockage in one job. The last removal opens the existing place link.

A separate crossing uses the link's two-minute travel time and moves the miner and their pick together. Save and restore during clearing and travel agree with uninterrupted settlement. Closing the link before arrival interrupts the crossing and leaves both at the entrance. A miner can also bring a basket to [recover the cleared stone for fabrication](CRAFTING_ENGINE.md#dress-stone-recovered-from-a-cleared-passage).

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Eight related files passed 103/103. Architecture, rules and coverage passed. Isolated build SHA-256 `48efe0b34a3f2d86cfed5981cfcdc8e91164eb9bbef79a19612a7ed4e15ff74b`. The shared docs check flags the Gu abilities acceptance claim at line 1528. Agent-verified in the headless workshop.

### ENF6, ENF16 and ENF22. Lend and return a fitted mining pick

A three-minute handoff changes custody of the exact fitted pick. Both bearers must meet at settlement. A loan records the original lender, who can receive the pick back. The borrower's ordinary use follows custody, and the loan bars gifting, returning to someone else and stripping the installed parts. A gift changes custody without creating a return obligation and the new holder can lend it onward.

After restoring during the loan, the borrower mines four fragments with the original head. The lender's concurrent use and the borrower's attempt to strip the pick interrupt. After the saved return the lender clears the passage in one job with the same head.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Eight related files passed 106/106. Architecture, rules and coverage passed. Isolated build SHA-256 `f826bad685c2b2e00ffaf5657a53eca7650da73a509d219959d2a931ee85ef60`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF6 and ENF22. Recall a pick under an agreed loan term

A lender can include a recall term when handing over a fitted pick. The local recall costs one ink and takes one minute plus the open passage's travel time. The workshop allows a path up to ten travel minutes. Settlement checks the same loan, custody, endpoints and open route before returning the actual item.

Closing the route during the recall preserves the ink and the borrower's custody. A loan without the term and a call by another person both interrupt. Two calls against the same saved loan spend one ink total and return one item. The returned pick keeps its lineage and mines four fragments after restore. This workshop uses local rock passages. Recall across worlds still needs a crossing that transports the item identity and its loan record.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Eight related files passed 107/107. Architecture, rules and coverage passed. Isolated build SHA-256 `9e4cff87f570f25bc3ee9003b7260bf56ccf671f930de609b6c643c8c688b21c`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF6, ENF17 and ENF22. Attune a fitted head to its new bearer

The maker can inscribe a head that answers to its bearer. It mines four fragments for the attuned maker and two after a handoff. The new owner can spend one ink in a three-minute job to retune the original head. A borrower keeps ordinary use and cannot retune it under the workshop's loan terms. Two saved attempts spend one ink, and the new bearer mines four fragments after restore. A sound recovered head keeps its bearer setting. A tracing preserves the choice to attune and the reconstruction sets the bearer to the maker performing that work.

WER1/WER9. Cross-world passage remains open. The native doorway reads inventory and equipment stacks and refuses borrowed cargo. The workshop pick lives as a substrate holder with an installed billet, attunement and loan record. A physical crossing needs an adapter that moves that exact holder through a named route whose cargo policy admits its custody terms. The native doorway and cargo tests pass independently.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Ten related files passed 154/154. Architecture, rules and coverage passed. Isolated build SHA-256 `dbda017bf0a9c77d1fdc32954924ecaf7ce511c9e30b9751050cb3a0b40bca3c`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF2, ENF17 and ENF20. A ward keeps a blunt hit below the balance threshold

The workshop body has a local balance threshold. It loses three stamina when the blunt force left at contact reaches that threshold and the body survives. A matching contact ward absorbs four from a seven-point blunt impact, leaving three against a threshold of five. The mixed blow still deals eight damage, including its five slashing points, and costs no stamina. An exhausted ward lets the full blunt force through. A pure cut leaves the ward's charge untouched.

The engine impact port also runs this check for a saved blunt spell. Equipping during flight changes the contact from seven vitality and three stamina lost to three vitality and zero stamina lost. Restore at the settled minute reproduces the result without a second hit. This proof changes saved stamina. Interrupting an action in a timed contest still needs its settlement interface to pass the actual landed impact to the contest's interruption rule.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6/AR11. Nine related files passed 122/122. Architecture, rules and coverage passed. Isolated build SHA-256 `2cc69a6346482db01a1f2444aec73b2a08124382e7830a8c7a3d4ac99e52e8b3`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF2, ENF15 and ENF18. A charged charm helps clear established spores

One measure of salts inscribes and charges a blank charm. After exposure, the worn charm spends its pulse on the next due affliction check. The existing affliction law rolls that check with the treatment bonus. On the matched spore exposure, both bodies lose five stamina on entry. The treated body clears the track at the next check with 25 stamina, while removing the charm before the check leaves its charge intact and the wearer at 20 stamina with another check due.

A three-minute recharge spends one measure of salts. Competing saved jobs refill the same charm once. A second exposure uses the restored pulse on its next check. The current treatment is authored for cellar spores. Additional poisons reopen with separate treatment affinities and evidence from their own check schedules.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Ten related files passed 132/132. Architecture, rules and coverage passed. Isolated build SHA-256 `69e689c58da0a5c67fadf630179be37abd71d86531132fceec48977ecc851fe6`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF19 and ENF21. Fitted inscriptions can interfere

An ordered ember–mirror pair produces a fire field opposed to the workshop's usual ember–weave field. Each fitted part supplies its actual strength at its current condition. Opposed fields cancel their equal portion and the excess still protects. Aligned parts keep the usual successive reduction.

On the same fire hit, one 40-percent part takes 15 damage, two aligned parts take 9, and equal opposed parts take 25. The ordinary cut takes 25 in all three cases. Removing one opposed part after restore returns fire damage to 15 and recovers the exact part. This rule uses the workshop's two fitted positions. A layout with more positions needs a rule for how fields overlap across them.

ENF20 remains open for ward interception before contest damage and interruption. The shared contest exposes a live profile read, and its meeting handler still applies damage and credits the hit in one pass. A settlement interface must let the owner transform a typed impact and account for its ward cost before that pass. This slice left shared contest files with their current owners.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6/AR11. Eleven related files passed 146/146, including the existing timed contest checks. Architecture, rules and coverage passed. Isolated build SHA-256 `c269947202358ddc81775aa9d45556739a2902521a24f6ad980980f91da1b385`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF19 and ENF21. Appraise both parts before forecasting a fit

Local inspection records fire strength and field direction for the observer. The fitting forecast checks the proposed slot and parts, then uses the observer's saved appraisals and the parts' visible condition. It leaves the fitting stock available. Without both appraisals the forecast gives no protection value, including after handing the same plate and insert to another observer. The recipient can inspect them independently.

The saved forecast predicts 36 percent of incoming fire passes two aligned parts and 100 percent passes two equal opposing parts. The actual fit and matched hit reproduce both results. Older strength-only appraisals can still be read, and a fresh inspection supplies field direction. Forecasts for charges and timed interactions reopen when they have a corresponding observation record and a live timing reader.

**Verification.** PC95, AD36/AD38/AD51, ENF19 and ENF21. Twelve related files passed 159/159, including knowledge, contest and workshop tests. Architecture, rules and coverage passed. Isolated build SHA-256 `31d9f0c9bb725870cfc763637b9bfe2cff98c8d765b06be402622e07428eb5f3`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF18 and ENF19. Appraise a ward before its charge fades

Inspecting a nearby ward records the observed charge, decay and matching impact channel for that observer. The forecast uses the stored-working charge law. It predicts pulse affordability at a selected contact minute if the ward continues from the last observation. Other observers need their own appraisal, and an appraisal spends no charge.

The saved appraisal predicts four charge at minute five and three at minute six, against a pulse cost of four. The same seven-point spell deals three damage at the earlier contact and seven at the later one after restore. Recharging changes the live ward, and a new inspection updates the observer's forecast. The forecast covers decay and matching channel. Future custody, wear, attunement, intervening uses and reservoir capacity are checked at contact.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6/AR11. Thirteen related files passed 177/177. Architecture, rules and coverage passed. Isolated build SHA-256 `bdbc6f524ec9762d0bfdb0ba559fc480680ced2f03629e201574a2d208899ee3`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF6, ENF9 and ENF16. Move a charged insert between mounts

A fitted ward insert owns its stored working and pulse account. The shield or bracer supplies the matching recess. Installing and detaching take three minutes and recheck both parts and custody. A mismatched recess leaves the insert loose. A broken mount or a detached insert gives no interception and spends no pulse.

The shield catches four points of a seven-point hit. After detaching, handing over and refitting the same insert into another bearer's bracer, the saved ward catches four points again and exhausts its original charge. This fixture uses a transferable binding.

**Verification.** PC95, AD36/AD38/AD51, FBC4 and KW5/KW10/KW15. Thirteen related files passed 178/178. Architecture, rules and coverage passed. Isolated build SHA-256 `96e97d78a1d0c92de25daf1c78b5d83ef14dd808d8eac65b3518d498210c20dc`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF6, ENF9 and ENF22. Hand over a mounted ward intact

A three-minute local gift transfers the mount and its exact insert together and clears the giver's worn slot. Settlement rechecks both bearers and both attachment links. A recipient leaving or the insert coming loose interrupts the gift and leaves custody with the giver.

The restored gift preserves the insert's ward, remaining four charge and attunement. The recipient takes all seven points before retuning. After attuning the same insert, the ward spends its remaining pulse and reduces the hit to three.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Thirteen related files passed 179/179. Architecture, rules and coverage passed. Isolated build SHA-256 `20b29466788dfc2f1b0c42cead3934892e2bf45d1760ec2746910ee98bc63a11`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF6, ENF9 and ENF22. Lend and return the mounted ward

A local loan records the lender on the mount and insert. The borrower can wear the assembly and spend its pulse, and the loan protects the assembly from gifting, detachment or changing its binding. The return hands back both holders, clears the borrower's worn slot and ends the recorded loan. Existing saved gifts retain gift behavior.

The borrower and lender each catch four points of the same seven-point hit, using the two pulses on the original insert. Save and restore preserve the remaining pulse across return. Competing return jobs transfer custody once. Cross-world passage still needs a carrier for both holders that honors the recorded loan.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Thirteen related files passed 180/180. Architecture, rules and coverage passed. Isolated build SHA-256 `6e2b3050f2d5d3294a7f8f76a3c709b840e1ac7464fe1951122768ccf84020d0`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF5, ENF9 and ENF16. Repair a mount around its charged insert

The borrower can spend a rivet and three minutes to repair a damaged mount with the same insert fitted. Settlement rechecks custody and both attachment links. A return that settles first leaves the rivet unspent. A completed repair leaves the insert's binding and the loan intact.

The broken mount lets all seven points through. After the saved repair and return, the same insert spends its remaining pulse and lets three points through. This fixture supplies a broken mount directly. Damage to the mount during an actual bout reopens when the contest or equipment wear owner can target the mount independently of the insert.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Thirteen related files passed 181/181. Architecture, rules and coverage passed. Isolated build SHA-256 `2f9f2dd7384d9c1554b1e549b194219cb685101f5f86bb4e63954020b9f9be38`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF5 and ENF18. Intercepted force can break the ward mount

A mount with a measured strength loses one point per point the fitted ward intercepts. A glancing two-point hit leaves two strength on a four-point mount. A mismatched cut spends neither strength nor charge. In the saved spell test, a seven-point impact reaches the mounted ward, the ward catches four, and the mount breaks as the wearer takes the remaining three. The insert stays armed with its other pulse.

The borrower repairs the mount with a rivet and returns it. The same insert catches the next matching hit using its remaining pulse. The workshop treats the mount as the part taking the intercepted load. Material-specific failure shapes and contest-time interception still need their respective material and impact readers.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Thirteen related files passed 181/181, including restore during spell flight and during the repair. Architecture, rules and coverage passed. Isolated build SHA-256 `2f9f2dd7384d9c1554b1e549b194219cb685101f5f86bb4e63954020b9f9be38`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF5 and ENF18. Service a ward mount before it breaks

A rivet restores a partially strained mount to its measured strength while the same insert stays fitted. One glancing two-point hit leaves two strength on a four-point mount. A second identical hit breaks the unserviced mount. After service it leaves two strength and the mount intact. A sound mount and a duplicate service job leave the rivet unspent. Save and restore preserve the service deadline and the insert's remaining charge.

The shared contest still reads live profiles and applies its own meeting damage. Timed contest ward interception remains open until that owner can admit typed packets and settle the ward before damage, interruption and defeat.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Thirteen related files passed 183/183. Architecture, rules and coverage passed. Isolated build SHA-256 `d984fc9c4c7f57538706f3c586e96df885637ec97a0bebbf8de8bce2a5881e39`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF6 and ENF22. Carry a borrowed ward through a local passage

The existing passage job can carry the worn mount and its insert together. It checks both attachment links and custody on arrival. The workshop counts two extra load units for the assembly. Removing it during the crossing or overloading the passage leaves the party and equipment at the entrance.

After restoring the crossing, both parts arrive with the borrower, retain the original lender and continue decaying on the original clock. The ward intercepts four of a seven-point hit at the destination and keeps two charge. The current route is local. A cross-world route still needs its own admitted carrier and custody policy.

**Verification.** PC95, AD36/AD38/AD51 and KW5/KW10/KW15. Thirteen related files passed 184/184. Architecture, rules and coverage passed. Isolated build SHA-256 `d984fc9c4c7f57538706f3c586e96df885637ec97a0bebbf8de8bce2a5881e39`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF6 and ENF22. Carry a loaned ward through a named realm doorway

The headless workshop binds two authored world endpoints to a physical doorway on one engine host. The realm planner admits the exact mount and insert as equipped cargo. A lender can authorize the named doorway on both parts when making the loan. The crossing checks cargo and route admission at departure and arrival. A missing loan permission refuses departure. Closing the doorway or acquiring extra cargo in flight interrupts the job and leaves the borrower and ward at the origin.

After restore, the same body and both holders reach the other endpoint. The ward uses its original decay clock, absorbs four of a seven-point hit and keeps two charge. The borrower can cross back and return both parts to the lender. This fixture uses a prepaid, fixed-duration route and one common clock. Independent realm saves, world clocks, and cargo beyond the ward need a host that can bind those owners together.

**Verification.** PC95, AD36/AD38/AD51, KW5/KW10/KW15, WER1 and WER9. Seventeen related files passed 265/265, including the realm planner, cargo and native doorway suites. Architecture, rules and coverage passed. Isolated build SHA-256 `046b81b795bc95ae4a6ab33534e589cc65ab8cc6af47e4b4b6b280700ca33b47`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF22. Pay a ward doorway toll on arrival

The realm planner combines the doorway toll and boundary fee into a quote against the traveler's stock. The timed working saves that quote, checks the fee and funds again at arrival, and uses the same settlement to debit the traveler and move the ward. In the test, a two-unit toll and one-unit fee leave one of four units after arrival. A closing doorway preserves all four. Spending two elsewhere during the crossing leaves two in the purse and the whole assembly at the origin. Two pending crossings settle one trip and one payment. The route currently accepts whole payments from the traveler. A named collector can receive those payments through the extension below.

**Verification.** PC95, AD36/AD38/AD51, KW5/KW10/KW15, WER1 and WER9. Seventeen related files passed 266/266. Architecture, rules and coverage passed. Isolated build SHA-256 `ded34f208028a8a030259737dd4b77ab7115e6dec4265f79f719bbd96c9bca75`. The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF17, ENF18 and ENF20. An area spell meets each recipient's equipment

The workshop impact reader uses the effect host's admitted recipients. In the saved ten-point fire burst, the wearer takes two damage after the lining and a four-charge ward pulse, the unprotected recipient takes ten, and the screened body takes zero. The same wearer takes six with the lining alone. Restoring at settlement applies the burst once. The reader handles direct spells and present or explicit area groups.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6/AR11. Seventeen related files passed 267/267. Architecture and coverage passed. Isolated build SHA-256 `d5f9b19ef1b602e4e6d845e1ab4bfde1d06d4722c88c748e66d36b3d24b50967`. The rules check flagged two shared Hogwarts strings using “fixture.” The shared docs check flags acceptance claims in Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF17, ENF18 and ENF20. A mixed spell carries separate damage packets

A spell can supply whole damage packets with a type and phase. Their sum must agree with the spell's declared damage. The lining rounds each type and phase as a whole, so splitting seven contact fire into one and six gives the same protection. In the restored twelve-point burst, the lining reduces seven fire to four, one ward pulse catches those four, and five slashing damage lands. The unprotected body takes twelve and the screened body takes zero. Moving six fire to a different phase lets four fire through as well. Invalid packet totals use the spell's declared scalar damage.

Timed contest interception remains open. It needs a settlement hook in the contest owner to intercept typed impact before damage, interruption and defeat.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6/AR11. Seventeen related files passed 267/267 on shared HEAD `f0430dde2` plus working changes, including restore before and after settlement. Architecture and coverage passed. Isolated build SHA-256 `68a0b867c4b273a8829d4635516e7d9305b1f5b8391b22451141cb9ceb7c2012`. The rules and docs checks still flag the shared issues above. Agent-verified in the headless workshop.

### ENF22. A doorway collector receives the toll

A named doorway can bind a collector's stock account. The saved crossing quotes the collector and the combined fee. It rechecks the traveler's stock, the collector's room and the loaned assembly before settlement. A restored crossing moved the borrower, mount and insert, and transferred three units from the borrower's six into the collector's account of one. A competing crossing transferred nothing. An account with room for two, a borrower with two, or a different collector on restore each stopped the crossing with both accounts and all three holders in place. The ward still absorbed four points after arrival.

The collected toll moves the quoted stock itself. Sponsorship reopens when a route can supply the sponsor's spend authorization and live account to the realm planner. Debt or a substitute payment needs a separate quote that names what the collector agrees to receive.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6, WER1 and WER9. Seventeen related files passed 268/268, including restore in flight and after payment. Architecture and coverage passed. Isolated build SHA-256 `c4b899995f04c48035365da451e7541e14d392eef6c9a08464f547b9d0ff6003`. The rules check passed with shared warnings. The docs check flags unrelated acceptance claims in combat, Gu abilities and procedural spellcraft. Agent-verified in the headless workshop.

### ENF14, ENF18 and ENF22. A charged ward intercepts sustained route heat

Each minute of the heated crossing first applies the lining's insulation. An exposure ward can then intercept the remaining fire and store it on its carrier. On the four-minute route the contact ward leaves sixteen damage and keeps both pulses. The exposure ward spends two pulses, captures eight heat and leaves eight damage. If the mount breaks after one pulse, twelve damage lands and the insert keeps its second pulse. The mount, insert, plate and lining travel with the wearer. Closing the path after one minute stops the crossing with the assembly and unused pulse at the entrance.

The workshop uses one exposure packet per route minute and captures heat in the insert's own account. Route segments with different hazards need positions and hazard data from the travel owner. Timed contest interception still needs the ENF20 settlement port.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and WER9. Seventeen related files passed 269/269 on shared HEAD `f0430dde2` plus working changes, including engine and crossing record restore after the first pulse. Architecture, coverage and rules passed. The isolated game build passed with bundle SHA-256 `c4b899995f04c48035365da451e7541e14d392eef6c9a08464f547b9d0ff6003`. The opt-in route was exercised through the headless workshop tests. The docs check flags unrelated shared claims.

### ENF16 and ENF20. Swap a ward insert before a spell lands

A three-minute job swaps the exact insert in a worn mount. The old insert stays in the bearer's custody with its full charge. Settlement checks both attachment links, current custody, the loan terms and the replacement's fit before it moves either insert. A competing swap sees the original insert is gone and stops. A missing or incompatible replacement leaves the old insert fitted.

In the restored headless cast, a seven-point fire spell arrives one minute after a cut ward is swapped for a fire ward. The wearer takes three damage, the fire ward spends four charge and the removed ward keeps all eight. If the replacement is moved away or fails the fit check, the wearer takes seven and both wards keep their charge. The workshop uses the existing spell impact reader. Timed contests still need their own impact settlement port.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Seventeen related files passed 271/271, including restore in flight and after settlement. Architecture, coverage and rules passed. The isolated game build passed with bundle SHA-256 `5b2bd24162a511d508921b35d5259d8083b3ea0350fd2f2ffe954fba7e0f71da`. The swap was exercised through the headless workshop. The docs check flags unrelated shared claims.

### ENF16 and ENF20. Wear or remove a ward during spell flight

A two-minute equipment job fits or removes the named carrier. Fitting checks that the bearer still holds the carrier and the worn slot still matches the one at the start. Removal checks that the named carrier is still worn. In the headless test, putting on the ward before the incoming spell lands leaves two damage and spends one pulse. Removing it before impact leaves six damage and preserves both pulses. Giving away the carrier while fitting is pending interrupts the job and leaves the six-point lined impact. Restore with both jobs in flight reproduces the uninterrupted results.

Ward recharge and renewal still use the direct stored-working action. Timed maintenance reopens when the shared host can settle a working's requested recharge with the stored owner and carry its updated record and receipt forward before later impacts. Timed contests need their own pre-damage settlement port.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Seventeen related files passed 271/271. Architecture, coverage and rules passed. Isolated game build SHA-256 `995125dd44290c08e4e6f1fc227f0cc58a4d16faf07e44d58e0c0f4f5861f4e9`. The wear and removal jobs were exercised through the headless workshop. The docs check flags unrelated shared claims.

### ENF7 and ENF18. Released force meets the target's protection

A wearer can release the force captured by a ward as a typed contact hit. The effect host first checks whether the target admits the hit. A field that blocks vitality removal leaves the reserve intact. Once admitted, the release spends the declared force and uses the same lining and ward reader as a spell impact. In the restored test, spending five force deals five to an unprotected target, three through a fire lining, and one through the lining and a second ward. That ward spends its pulse and captures the two points it intercepted. The original shield keeps its other three force after the release.

This action uses the originating ward's damage type and the contact phase. A world that turns captured energy into a different effect needs an authored output and its corresponding reader. Timed contest release still needs the ENF20 settlement port.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6. Seventeen related files passed 271/271. Architecture, coverage and rules passed. The isolated game build passed with bundle SHA-256 `995125dd44290c08e4e6f1fc227f0cc58a4d16faf07e44d58e0c0f4f5861f4e9`. Release and interception were exercised through the headless workshop with JSON restore. The docs check flags unrelated shared claims.

### ENF7 and ENF18. A target's screen can stop a reflected hit

The reflected share now checks reach and vitality-removal admission before the target's lining or return ward answers. In the saved comparison, the reflecting shield intercepts eight, keeps four in its own reserve, and redirects four. The lined target's return ward catches one and the target takes one. With a screen admitting no vitality removal, the target takes zero and its return ward keeps both charge and reserve. The original shield still spends its pulse and keeps the four points allocated to its reserve. This workshop treats the screened share as dissipated. A screen that stores or redirects force needs its own destination and accounting.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6. Seventeen related files passed 271/271. Architecture, coverage and rules passed. The isolated game build passed with bundle SHA-256 `995125dd44290c08e4e6f1fc227f0cc58a4d16faf07e44d58e0c0f4f5861f4e9`. The reflection comparison ran through the headless workshop and matched after JSON restore. The docs check flags unrelated shared claims.

### ENF2, ENF7 and ENF18. A reflected blunt hit can stagger its caster

The workshop's ordinary and reflected impacts share the same balance calculation. After the target's lining and return ward act, enough remaining blunt contact force costs three stamina on a nonlethal hit. In the saved seven-point spell, the shield wearer takes one damage and reflects six. The caster takes six damage and loses three stamina. Wearing the return ward before impact catches two, leaving four damage below the five-point stagger threshold. The return pulse spends its charge and sends no further reflection.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6. Seventeen related files passed 272/272. Architecture, coverage and rules passed. Isolated game build SHA-256 `995125dd44290c08e4e6f1fc227f0cc58a4d16faf07e44d58e0c0f4f5861f4e9`. The spell restored in flight and after impact through the headless workshop. The docs check flags unrelated shared claims.

### ENF10, ENF15 and ENF17. Preserve a fragile pelt for study

A two-minute inscription spends one ink on the exact blade. During harvest the mark prevents the handling loss authored for a fragile carcass. The ordinary and marked blades produce the same quality on the matched cut. The ordinary cut leaves a damaged pelt, and the marked cut leaves a whole one with its original specimen lineage. A saved study job requires the whole pelt and records that specimen in the observer's knowledge. The study keeps the pelt in stock. Preexisting burns still leave a damaged pelt. Losing custody of the blade before inscription preserves the ink, and competing jobs charge once.

The workshop applies preservation to handling loss on this harvest. Planting needs a harvest source with a viable propagule and a plant consumer that can read its exact identity and viability. The headless pelt proves the study route.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Eighteen related files passed 292/292, including the native harvest suite. Architecture, coverage and rules passed. The isolated game build passed with bundle SHA-256 `995125dd44290c08e4e6f1fc227f0cc58a4d16faf07e44d58e0c0f4f5861f4e9`. Inscription, harvest and study were each exercised after JSON restore in the headless workshop. The docs check flags unrelated shared claims.

### ENF2, ENF17 and ENF22. Protective gear answers lingering spore exposure

A spore site can set a repeat interval. Arrival still checks exposure immediately and starts the interval for occupants. A saved exposure check reads the current lining. The same body stays at thirty stamina with its seal on, loses five when it removes the seal and remains inside, and stays at thirty if it leaves before the check. Leaving cancels further exposure checks and an established affliction still follows its own clock.

The purge charm clears the existing infection at its next stage and spends its charge. Staying in the cloud can start a new infection on a later exposure check. The workshop keeps one active track and processes its stage before any later exposure can start another. Cumulative dose during an active infection would need an affliction rule for how repeat inhalation changes the track.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6. Eighteen related files passed 292/292. Architecture, coverage and rules passed. Isolated game build SHA-256 `22c6cef699baef6889061cf7dbb33ba8a0c9c50b0c22c176c58dc113ebb069e3`. The headless workshop exercised seal removal, leaving, purging and renewed exposure after restore. The docs check flags unrelated shared claims.

### ENF2, ENF17 and ENF18. A rechargeable filter stops spores at intake

The charm can be inscribed as a filter using one measure of salts. When worn it spends a pulse on an exposure that gets through the lining. The same cloud that an intact lining seals off leaves the filter charged. An empty filter admits the next exposure. The existing purge pattern remains a separate inscription that acts on an established track.

In the headless test the filter spends its first pulse on arrival and keeps the wearer at thirty stamina. A three-minute refill settles before the next exposure, spends one measure of salts and protects at that check. A competing refill spends nothing. The next unfiltered check costs five stamina. Save and restore preserve the charm, the pending refill and the exposure clock. The workshop uses one pulse per admitted cloud exposure. Filters that progressively clog or reduce dose would need an exposure rule that tracks dose and capacity separately.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Eighteen related files passed 293/293. Architecture, coverage and rules passed. Isolated game build SHA-256 `84de3ab064e81542d6f50d21e74d6fbddf1da2e1b6dc4a900e6f735cef9640b5`. The headless workshop exercised fitting, exposure, and recharge after restore. The docs check flags unrelated shared claims.

### ENF2, ENF17 and ENF18. Filter measured spore doses

Clouds can supply a dose per exposure and a filter can hold several units of capacity. The lining checks whether the cloud reaches the filter. The filter spends one capacity per intercepted unit. Any residual dose reaches the affliction save, with each unit above the first subtracting one from the save total. Unmeasured sites and charms retain the one-unit behavior. Purge inscriptions still treat established affliction stages.

In the restored test a three-unit filter catches a two-unit arrival dose and retains one. It catches one unit of the next dose, and the other unit opens a poison track and costs five stamina. An empty filter can refill to its full rating with a saved salt job. Repeat inhalation during an active track remains on the existing single-track rule. A cumulative poisoning rule would need to define how new dose changes stage, duration or recovery.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6. Eighteen related files passed 293/293. Architecture, coverage and rules passed. Isolated game build SHA-256 `833c28ff3af1a725b907874ce70b3d0f700dc341a30aae6b2cca5b7d69fa59c6`. The headless workshop restored a partly spent filter and an in-flight refill. The docs check flags unrelated shared claims.

### ENF2, ENF17 and ENF18. A filter delays cumulative spore exposure

A site can set a dose threshold for the existing affliction save. The seal and filter reduce exposure first. Remaining dose accumulates at that site until the threshold, then the affliction owner rolls the save and the workshop clears the accumulated dose. Leaving the cloud clears subthreshold buildup. An active infection still follows its own stage schedule.

In the headless test the unfiltered wearer reaches the four-unit threshold on the second exposure. A three-unit filter delays the save until the fourth exposure. The partly spent filter and the one- and three-unit buildup states survive restore. Leaving with three units prevents the later infection. The default for sites with no threshold is to check each exposure independently. A retained bodily dose across sites or a dose that aggravates an established track needs a rule for clearance, stage and recovery.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6. Eighteen related files passed 293/293. Architecture, coverage and rules passed. Isolated game build SHA-256 `2d230258ec5f22df0357f994ae1b67b5e09886e6200448e289a8b84f0d814c19`. The headless workshop exercised cumulative exposure and departure after restore. The docs check flags unrelated shared claims.

### ENF2, ENF17 and ENF22. Retain inhaled dose between rooms

A body with an authored clearance interval keeps its subthreshold dose across rooms. Clean air removes one unit per interval. Entering another cloud stops clearance, applies current equipment to the new dose and adds what gets through to what the body already carries. Bodies without this interval keep the earlier site-local behavior. An established infection keeps its own affliction clock.

In the restored headless comparison the wearer carries three units after the filter is depleted. Going straight to the second cloud adds two units, exceeds the threshold of four and costs five stamina. Waiting four minutes in clean air reduces three units to one. The same entry then leaves three units and full stamina. The clearance deadline survives restore. The workshop uses one spore family. Different airborne substances would need their own buildup and clearance state.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6. Eighteen related files passed 293/293. Architecture, coverage and rules passed. Isolated game build SHA-256 `2d230258ec5f22df0357f994ae1b67b5e09886e6200448e289a8b84f0d814c19`. The headless workshop restored dose and clearance across the two-room route. The docs check flags unrelated shared claims.

### ENF15, ENF17 and ENF18. Refit a filter with a separate cartridge

**ACT NOW.** An inscribed frame accepts a cartridge with its own identity, capacity and remaining charge. A timed swap checks that both parts are still in the wearer's custody and that the expected cartridge is still seated. Detaching preserves the removed cartridge for reuse. In the headless comparison, a one-unit cartridge admits one unit of a two-unit dose and the wearer loses five stamina. A three-unit cartridge catches both units and keeps one. The removed cartridge keeps its charge. A pending swap survives restore, and a competing swap or a swap that loses custody is interrupted.

**ACCOUNT FOR NOW.** The workshop defaults to refilling a loose, empty cartridge for one measure of salts. Its capacity comes from the cartridge rating. Integral filter charms keep their existing inscription, charge and recharge behavior.

**LATER/DELEGATE.** A moderate workshop integration would expose the existing jobs and cartridge charge on the equipment surface. Check that a player can compare two cartridges, swap them, reload a save and see the same fitted part and charge.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Eighteen related files passed 294/294, including the headless crossing and JSON restore. Architecture, coverage and rules passed. Isolated game build SHA-256 `01bbe32a841592fa617b6c302254d311ace56d5d2ebe7c52e2e859fc7f62d8ae`.

### ENF3 and ENF18. Recharge a light ring at the appraisal bench

**ACT NOW.** A light ring can bind a price per charge. The bearer who holds it pays through the existing stored-working maintenance action. In the restored workshop, a spent ring leaves the bench too dark for appraisal. Paying two ink buys one charge. The same command lights the bench for three minutes and makes the lining appraisable. A short payment leaves the ink and charge intact. Asking to refill an already full ring spends nothing.

**ACCOUNT FOR NOW.** This action refills a sound ring immediately up to its stored capacity. Timed recharge still needs the shared settlement port that can update stored records and publish their receipts at a working deadline.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW10. Twenty related files passed 319/319. Architecture, coverage and rules passed. Isolated game build SHA-256 `5313c0620a4726231ec1d43b2e673ba990e6eb7df59e930294ad541af389b857`. The headless workshop restored the expired glow, charge purchase and second appraisal. The docs check flags five claims in other documents.

### ENF16 and ENF18. Repair a fractured light ring and renew its glow

**ACT NOW.** A physical break ends the ring's timed glow immediately and quiets the stored pattern. A three-minute repair spends one supply on the ring. The old glow stays out after repair, even before its former expiry. Paying the renewal price lets the ring start a new glow on its own deadline. In the restored test the renewed light makes the lining appraisable. A ring moved away interrupts repair, and competing repairs spend one supply.

**ACCOUNT FOR NOW.** The workshop uses an explicit fracture action and a separate paid renewal. The fracture removes the ring's timed field. Ambient light already delivered by an instant pulse belongs to the site.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 322/322. Architecture, coverage and rules passed. Isolated game build SHA-256 `1f62f72d60dd90cb22174786c6a4a08a5054454d1579d2347dd9d6e36b83dfac`. The headless workshop restored fracture, pending repair, renewal and appraisal. The docs check flags five claims in other documents.

### ENF16 and ENF22. Hand over a glowing ring

**ACT NOW.** A three-minute handoff transfers the exact ring when both people and the ring are still together. In the restored workshop test the recipient carries the already glowing ring across a heated path and uses it to appraise a lining at the far bench. The first glow expires on its original deadline. The new bearer then invokes the same ring and spends its remaining charge. A recipient who leaves early interrupts the handoff, and competing gifts transfer custody once.

**ACCOUNT FOR NOW.** The handoff changes custody. Portable glow follows the ring, while a field bound to a fixed bench stays there.

### ENF16 and ENF22. Lend a light ring and return it after use

**ACT NOW.** The three-minute loan records the lender and the specific loan on the ring. The borrower can invoke it for appraisal. A return checks the expected loan and requires both people and the same ring together. In the restored comparison, the borrower spends one of two charges and returns the ring while it still glows. The lender can spend the last charge after the original glow expires. The borrower cannot give the ring away, and a return interrupts if the lender leaves.

**ACCOUNT FOR NOW.** A voluntary return takes place at a meeting. The parties can also include a recall term when the loan is made.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 324/324. Architecture, coverage and rules passed. Isolated game build SHA-256 `1f62f72d60dd90cb22174786c6a4a08a5054454d1579d2347dd9d6e36b83dfac`. The headless workshop restored the pending loan and return, the original glow deadline and the remaining charge. The docs check flags five claims in other documents.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 323/323. Architecture, coverage and rules passed. Isolated game build SHA-256 `1f62f72d60dd90cb22174786c6a4a08a5054454d1579d2347dd9d6e36b83dfac`. The headless workshop restored the pending gift, recipient's crossing and glow expiry. The docs check flags five claims in other documents.

### ENF16 and ENF22. Recall a ring under an agreed loan term

**ACT NOW.** A loan can authorize a paid recall over the workshop's open heated passages. Settlement rechecks the exact loan, both people, the ring's custody and the quoted path. In the restored run, recall moves the glowing ring back to the lender for one ink while the borrower stays at the far bench. The glow makes appraisal possible at the lender's bench, then expires on its original deadline. A closed passage, an ordinary loan or a competing recall leaves the ink unspent.

**ACCOUNT FOR NOW.** This workshop quotes one minute plus passage cost on routes of up to ten minutes. Recall carries the ring with its remaining charge. Realm-door recall would need a loan term that names the connection and uses its transfer and toll rules.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 325/325. Architecture, coverage and rules passed. Isolated game build SHA-256 `1f62f72d60dd90cb22174786c6a4a08a5054454d1579d2347dd9d6e36b83dfac`. The headless workshop restored the pending recall, appraised at the destination and verified the original glow expiry. The docs check flags five claims in other documents.

### ENF3 and ENF18. Light an appraisal bench when it gets dark

**ACT NOW.** A ring can watch the ambient light account of a fixed bench. In the restored headless workshop, a bright reading spends no charge. After the bench darkens, the next scheduled check spends one charge and lights it for appraisal. If it stays dark, the next check renews the glow. If ambient light returns before that check, the current glow expires and the ring keeps its remaining charge. When the ring runs out, a dark bench stays dark.

**ACCOUNT FOR NOW.** The ambient watch samples once per glow duration. This gives each field time to expire before a replacement pulse. Passage reach and any remote surcharge still apply. A bench can also use the effective-light watch below.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW10. Twenty related files passed 320/320. Architecture, coverage and rules passed. Isolated game build SHA-256 `5313c0620a4726231ec1d43b2e673ba990e6eb7df59e930294ad541af389b857`. The headless workshop restored the pending threshold check and both daylight and sustained-darkness branches. The docs check flags five claims in other documents.

### ENF18 and ENF19. Share an appraisal bench between automatic rings

**ACT NOW.** An effective-light watch reads the same light as appraisal, including the active glows of other rings. The stored-working clock reads the bench after each earlier pulse at the same minute. In the restored headless comparison, the first ring lights the bench and the backup keeps its charge. The backup lights it at the next check when the primary's glow expires and the primary has no charge. Putting down the primary before the first check lets the backup light the bench immediately at that check. The bench supports appraisal until the last glow expires.

**ACCOUNT FOR NOW.** Simultaneous watches follow the stored owner's order by record ID. Each ring samples once per glow duration and needs a bearer in custody at the check. A priority selected by the maker would need an explicit order in the stored-working host.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW10. Twenty related files passed 321/321. Architecture, coverage and rules passed. Isolated game build SHA-256 `1f62f72d60dd90cb22174786c6a4a08a5054454d1579d2347dd9d6e36b83dfac`. The headless workshop restored the watch before the shared pulse and before backup takeover. The docs check flags five claims in other documents.

### ENF18 and ENF22. Speak a command to light a linked bench

**ACT NOW.** A light ring can store an exact command and a fixed destination. The stored-working owner checks the spoken word and reads the live passage graph from the ring. In the restored comparison a wrong command and a closed passage each preserve all three charges. Opening the passage lets the command spend two charges and light the far bench for three minutes. An observer there can appraise a lining while the origin stays dark. After the glow expires, one charge falls short at range. Bringing the ring to the bench lets that final charge light it locally.

**ACCOUNT FOR NOW.** The link range and additional charge are authored per binding. This bench uses one open link and one extra charge. A timed remote glow holds its published grade, so the ring waits for the full pulse. Earlier rings keep their local command and output from their saved working.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW10. Twenty related test files passed 305/305. Architecture, coverage and rules passed. Isolated game build SHA-256 `61f72f41051e7507cea96b69b274cdc5b01a201e031d8ed848dcc5da150c11ec`. Agent-verified through headless invocation, live passage changes, appraisal and JSON restore. The docs check flags five acceptance claims in other documents.

### Preserve ore with a removable head

**ACT NOW.** ENF15–ENF19. Inscribe a sound head with the ore preservation mark. Fit and disassembly carry the marks with the head, so a new grip keeps the original protection. A fracture through the metal loses the surface pattern. A saved tracing of that head lets the maker reinscribe the recast iron for one ink per missing mark. A tracing made before preservation was available still describes the split mark. In the headless test the same cut yields two fragments in all cases. The protected and refitted head recover grade 72, the recast head recovers grade 32, and the reconstructed mark returns the cut to grade 72. A competing reconstruction spends no ink.

**ACCOUNT FOR NOW.** Preservation is a surface mark with no bearer key in this workshop. A tracing records whether the quantity mark was keyed. The paid reconstruction of that mark keys it to the maker who restores it, following the existing split-mark behavior.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 306/306. Architecture, coverage and rules passed. Isolated game build SHA-256 `eb6cc7ff96bfc8f5dbacc44ce4031d581c5c47994d93cbd3f8e8a36d47c7fffa`. Agent-verified through the headless workshop and JSON restore. The docs check flags five claims in other documents.

### ENF7, ENF18 and ENF22. Recharge a ward from its captured force

**ACT NOW.** A ward can bind its recharge price to its own captured-force account. The current bearer operates it, and the stored-working owner debits that account and restores charge together. In the restored workshop test, two seven-point fire hits fill the reservoir with eight force and spend both pulses. After transfer the new bearer exchanges those eight units for one four-charge pulse. The next hit deals three damage and leaves four force, and the hit after it deals seven. A request for five charge leaves the reserve and charge intact when the price exceeds the reserve. The saved receipt identifies the paying carrier and the operator.

**ACCOUNT FOR NOW.** This binding spends two force for each charge. The same reservoir also supplies the existing release action. The authored price determines how many intercepted hits can fund a later pulse. Existing bearer-funded recharge and renewal still use their published prices.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW10. Twenty related files passed 307/307. Architecture, coverage and rules passed. Isolated game build SHA-256 `20e1bb1f39333fce89381091f9e0d5448de9c3606b8e89b5943444316708758c`. Headless custody, failed payment, recharge and impact passed through JSON restore. The docs check flags five claims in other documents.

### ENF16 and ENF22. Hand over a fitted spore filter

**ACT NOW.** A three-minute handoff binds the giver, recipient, frame and exact seated cartridge. At settlement the people and both parts must still be together. A successful gift clears the giver's worn slot, transfers both parts and preserves their links and charge. An empty frame can go by itself. A frame-only gift aimed at a fitted filter interrupts, as does a competing handoff after custody changes. In the restored workshop the former wearer and the recipient before equipping each lose five stamina to the same two-unit exposure. Wearing the received filter keeps the recipient at full stamina and leaves one charge in the original cartridge.

**ACCOUNT FOR NOW.** The receiver equips the filter with the existing wear job. The same handoff supports an intact loan and return under the terms below.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 307/307. Architecture, coverage and rules passed. Isolated game build SHA-256 `18ff7c604e6782c3ee746605410b6b9330054b502a334d98830392100bf87466`. The headless workshop restored the pending transfer and ran the same crossing with both bearers. The docs check flags five claims in other documents.

### ENF16 and ENF22. Lend and return the same fitted spore filter

**ACT NOW.** A loan records the lender on the fitted frame. The borrower can equip it and spend its charge in a spore cloud. The return checks that the lender, borrower and exact assembly are still together at settlement, then clears the loan and the borrower's worn slot. The restored test uses two of three charge during a crossing and returns the original cartridge with one charge. A pending return interrupts when the lender leaves. After successful return the lender can detach the cartridge and still has that charge.

**ACCOUNT FOR NOW.** This loan lends the frame and cartridge intact. Detachment, replacement and gifting wait until return, preserving the assembly the lender expects back. The existing wear and exposure jobs use the borrower's custody.

**Verification.** PC95, AD36/AD38/AD51, AR3/AR6 and KW5/KW10/KW15. Twenty related files passed 307/307. Architecture, coverage and rules passed. Isolated game build SHA-256 `18ff7c604e6782c3ee746605410b6b9330054b502a334d98830392100bf87466`. Headless loan, exposure and return passed through JSON restore. The docs check flags five claims in other documents.

### ENF1, ENF15 and ENF20. Inscribe a blade to deepen its cut

**ACT NOW.** A three-minute inscription spends one unit of ink and marks the exact blade. The workshop `bladeCut` resolver adds the blade's effective edge power to the original strike. It reads current custody, equipment and condition at settlement. The restored contest dealt 23 damage with the plain blade, 28 with a marked blade at half condition, and 32 at full condition. Removing the blade during the windup returned damage to 23. Two overlapping jobs spent one ink. Transferring the blade before inscription settlement kept both ink units.

**ACCOUNT FOR NOW.** The authored mark adds eight base power at full condition, scaled and rounded down with wear. This is a passive pattern with no charge cost. Authors opt in through the workshop `bladeCut` move resolver. Charged pre-damage interception still needs a contest settlement port. The [PC95 handoff](gm/dispatch/procedural-crafting-2026-11-11/CHECKPOINT.md#november-13-handoff-for-pc95-fabrication-and-enchantment) records the current contest and maintenance seams and the checks that reopen them.

**Verification.** PC95, AD36/AD38/AD51 and AR3/AR6/AR11. Twenty focused files passed 326/326 on base `db81f1f117cde9f65ebed260fad5f6361c48d8a2` plus shared working inputs. Architecture, coverage and rules passed. Isolated game build SHA-256 `1f62f72d60dd90cb22174786c6a4a08a5054454d1579d2347dd9d6e36b83dfac`. The [headless fixture](../tests/strike_enchantment.test.js) restored inscription work and the pending contest. The docs check flags five claims in other documents.
