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
