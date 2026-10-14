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
