# Weaponcraft, runes and inscription: considerations, 2026-10-14

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
