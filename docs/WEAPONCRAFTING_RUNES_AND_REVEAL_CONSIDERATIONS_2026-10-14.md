# Weaponcrafting, runes and the cheats that reveal them: considerations

Claude (Procedural story generation session), 2026-10-14. A palette, not a spec;
nothing is selected. Request: "Weaponcrafting, runestuff, other stuff and more? ...
Cheats that would show stuff like these and more? ... Subtle stuff too? Overarching
stuff? Implementation implications and more? Abstraction that's needed?"

**Owners this builds on, not replaces:**
[crafting and consumables considerations](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md)
(Procedural crafting and potions session; CT cheats, XD1 rune-in-a-vial, XD5 quench
oils), [P6 smithing](gm/dispatch/procgen-2026-10-13/p6/SMITHING.md) and
[patterns](gm/dispatch/procgen-2026-10-13/p6/PATTERNS.md),
[CR2 world crafting laws](gm/dispatch/procgen-2026-10-13/cr2/REPORT.md),
[cheat library](CHEAT_LIBRARY.md), [cheats by world](CHEATS_BY_WORLD.md), and the
story spine in [story considerations](PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md)
round 7. Source facts below are my general knowledge of the franchises, labeled
**recalled**, to be checked with locators by lanes WR1 to WR4.

## WC. Weaponcrafting

| Code | Idea | Notes |
|---|---|---|
| WC1 | **Weapons from parts.** Blade, guard, grip, pommel, haft, head, string, limbs; each part has material, shape and quality, and the parts' interfaces decide what fits. | P6's parts/interfaces product logic. Generated weapons are combinations, not a list. |
| WC2 | **Technique changes the result.** Folding, differential hardening, quenching medium (water, oil, blood, quench oils from alchemy XD5), tempering, pattern welding. Each leaves readable traits. | The maker's skill and choices show in the product. |
| WC3 | **Weapons that grow with their owner.** Recalled: Bleach zanpakuto awaken through shikai and bankai with the wielder; xianxia natal treasures and flying swords bind to the cultivator; Monster Hunter weapon trees upgrade from monster parts; Dark Souls reinforcement. | One shared "bond and stages" abstraction (XA4) with per-world rules. |
| WC4 | **Weapons shaped by the wielder.** Recalled: Demon Slayer nichirin blades change color with the user; HP wands choose the wizard; Nen users shape conjured weapons by their type and vows. | The owner is an input to the item, not just a holder. |
| WC5 | **Weapons with souls or wills.** Sentient blades, cursed tools (JJK, recalled), demon swords, spirit-bound relics: preferences, refusals, hunger, bargains. | Items as story actors (story P3 round 3). |
| WC6 | **Named weapons and lineage.** A weapon earns a name from deeds (story BC2), passes through owners, and its history affects price, NPC reactions and sometimes power. | Reads the spine's receipts. |
| WC7 | **Canon-reserved weapons.** Noble Phantasms, legendary swords and unique artifacts are found, earned, repaired or copied only through a world's own route, never minted randomly. | P9 reserved-item rule. |
| WC8 | **Maintenance as gameplay.** Sharpening, oiling, re-wrapping grips, rust, chips, broken tips reforged shorter. Idle-friendly upkeep with small benefits, no punishment for absence. | Pairs with P6 repair and salvage. |
| WC9 | **Commissions and smith reputations.** NPC smiths with styles and signatures; commissioning reads your stats and fighting style; famous smiths' work is recognizable. | Pairs with CR4 NPC crafters. |
| WC10 | **Testing and trials.** Cutting tests, proof marks, tournaments for blades, a smith's guild examination. | Pairs with story B2 exams. |

## RN. Runes, inscriptions, seals and circles

Many sources use structured symbols to change what an object or space does. One
inscription layer can serve all of them with per-world grammar.

| Code | Idea | Source patterns (recalled) |
|---|---|---|
| RN1 | **A symbol grammar per world.** Symbols have meanings, slots, connections and conflicts; a valid composition does something. | Naruto fuinjutsu seals, FMA transmutation circles, xianxia formation arrays and talismans, D&D glyphs and symbols, Witch Hat Atelier drawn spells, Rithmatist chalk lines, Norse-style runes in original worlds |
| RN2 | **Surface capacity.** An object only holds so much inscription: by area, material quality, purity or spiritual capacity. Better materials hold richer runes. | Ties runes to materials and smithing. |
| RN3 | **Resonance and conflict.** Some symbol pairs amplify, others cancel or explode. Discovering combinations is research (story O3). | Noita-style emergent combos; P2 experiment model. |
| RN4 | **Activation and fuel.** Runes need a trigger (touch, word, blood, mana, time, condition) and a power source (wielder, stored charge, ambient, sacrifice). | Per-world energy laws (E9 world laws). |
| RN5 | **Places as surfaces.** Wards on doors, formations around a sect, circles on floors, seals on prisons. A whole house can be inscribed. | Pairs with story H places and P6 buildings. |
| RN6 | **Inscription skill and errors.** Steady hand, ink quality and knowledge decide accuracy. Small errors produce weaker, stranger or dangerous results. | Failed results as keepsakes or hazards (story BC3). |
| RN7 | **Reading foreign runes.** Ancient or alien inscriptions are a puzzle and a knowledge route (story B5 scripts). | Discovery route for sealed secrets where authored. |
| RN8 | **Rune drift and decay.** Inscriptions fade, crack or corrupt over time and use; maintenance or re-inking keeps them. | Idle-safe upkeep. |
| RN9 | **Runes on bodies.** Tattoos, brands, curse marks, contracts written on skin. | Recalled: seals on people in Naruto, curse marks; per-world consent and cruelty adjectives. |

## RV. Cheats that reveal

Many cheats are lenses: they show hidden properties of items, runes, people or
places. One lens abstraction (XA6) can serve all of them.

| Code | Lens | Source patterns (recalled) |
|---|---|---|
| RV1 | **Appraisal and identify.** Shows item name, grade, stats, hidden traits; depth scales with skill. | LitRPG appraisal skills, D&D identify, Solo Leveling item windows |
| RV2 | **Structural analysis and tracing.** Reads how an object was made, its materials and history, and can reproduce it at a cost. | Fate's structural grasp and projection (Unlimited Blade Works) |
| RV3 | **Status window item view.** A System shows item descriptions, sometimes with lore and flavor. | The live cheat status window work (R15) owns the window itself. |
| RV4 | **Eyes.** Sight of auras, flows, weak points, lines of death or lies. | Six Eyes (JJK), Gyo (HxH), Sharingan (Naruto), Mystic Eyes of Death Perception (Fate), Spirit Vision (LOTM) |
| RV5 | **Rune readers.** Descriptions of an item's attributes written as runes only the cheat holder can read. | Shadow Slave's rune descriptions of Memories and attributes |
| RV6 | **Analysis advisors.** An inner voice that explains properties and suggests recipes. | Great Sage (Slime), system assistants |
| RV7 | **Smith's sense.** Hear or feel the material and know where it will break. | Common in blacksmith isekai and xianxia refining |
| RV8 | **Provenance sight.** See an item's past owners and deeds. | Psychometry; reads story receipts directly |

**Subtle lens rules.** Lenses have scope (what kinds of properties), depth (how
much), cost (stamina, mana, sanity), range, and error rate. Some lie or simplify.
Hidden properties stay hidden until a lens or an experiment reveals them, and what
was revealed is recorded as knowledge (story S-4), so it survives reload without
re-rolling. Sealed world secrets are only revealed by their authored discovery
route; a lens can be that route only when the secret's file says so.

## OV. Overarching and subtle

| Code | Idea | Notes |
|---|---|---|
| OV1 | **Everything made is a story object.** First blood, naming, breaking and reforging write receipts that story generators read. | The spine's receipt log is the bridge. |
| OV2 | **The same rule set for NPC makers.** NPC smiths and rune masters use the player's rules, so their products are coherent and comparable. | CR4 makes the same point for crafting. |
| OV3 | **Economies react to good gear.** Well-armed villages change bandit behavior; a famous rune ward raises land value. | Story J economy, I conflict. |
| OV4 | **Small honest tells.** A blade that sings when struck right, a rune that warms near its trigger, a wand that sputters for the wrong owner. Subtle feedback before full appraisal. | Micro texture (story BA to BH). |
| OV5 | **Repair keeps identity.** A reforged sword is the same named sword with a new chapter, unless a world says otherwise. | Ship-of-Theseus rule per world. |
| OV6 | **Per-world weapon culture.** Who may carry what, peace-bonding, duel etiquette, sect weapon traditions. | P37 per-world micro texture. |

## XA. Abstractions needed

These are the shared models that let weapons, runes, potions, story and cheats use
one engine instead of five. They extend existing proposals and must reconcile with
P2's product identity, P6's product logics and P38's entity and receipt
consolidation.

| Code | Abstraction | What it unifies |
|---|---|---|
| XA1 | **Item identity** = template + instance properties + provenance + knowledge state, with a stable ID | Every made, found or generated thing. P38 owns the reference scheme. |
| XA2 | **Composition graph.** Parts with typed interfaces assemble into products; properties derive from parts, process and maker. | Weapons, tools, armor, constructs, buildings |
| XA3 | **Inscription layer.** A typed symbol graph on a surface with capacity, connections, activation, fuel and conflicts, interpreted by a per-world grammar | Runes, seals, circles, formations, talismans, tattoos, enchantments |
| XA4 | **Bond.** A relationship between an item and an owner with stages, growth conditions, refusals and transfer rules | Zanpakuto, natal treasures, wands, cursed tools, sentient weapons |
| XA5 | **Effect algebra.** Typed modifiers with per-world stacking, caps and conflict rules | Weapon traits, rune effects, potion effects, buffs |
| XA6 | **Lens.** A typed reveal with scope, depth, cost, range and error, writing to knowledge | Appraisal, eyes, status windows, experiments, expert NPCs |
| XA7 | **Process.** A work order of steps over inputs, tools, place and time, with skill checks and seeded outcomes | Smithing, inscribing, brewing, cooking |
| XA8 | **World law adapter.** Per-world rules that transform generic processes and effects (equivalent exchange, mana affinity, sequence characteristics) | All of the above |

## IM. Implementation implications

| Code | Implication |
|---|---|
| IM1 | **Hidden properties need a knowledge store from day one.** If an item's traits are shown directly from state, adding lenses later means rewriting every UI. Route item views through the same known-context projection as story (S-4, story BL9). |
| IM2 | **Derived stats are computed, not saved.** Save parts, process record, inscriptions, bond state and revealed knowledge; derive numbers on load so balance changes don't corrupt saves. Pin a value only where a world says it is fixed. |
| IM3 | **Inscription validation is a parser.** A rune composition is checked like code: grammar, capacity, connections, conflicts. That makes the lint tooling (P15, P40) reusable for content and for player-made runes. |
| IM4 | **Seeded outcomes per process step**, on named streams, so reloading mid-forge never rerolls (story BL1 to BL5). |
| IM5 | **Registry entries, not main.js edits.** New part types, symbols, lenses and bond rules register in their own files (story BJ3). |
| IM6 | **Canon-reserved IDs are checked at generation time,** not just in docs. |
| IM7 | **Desktop item view.** At 1366x768 an item panel shows known traits, unknown slots ("?"), provenance and bond; inscription editing needs a canvas-like area and is a larger UI investment. |

## Suggested order

Proposal only. Decide XA1 (item identity with knowledge state) and XA6 (lens)
first, because they shape every item UI and every reveal cheat. Then a first
playable slice: WC1 weapon from two parts with one technique choice, one RV1
appraisal lens revealing one hidden trait, and WC6 a name earned from a recorded
deed. Runes (XA3) follow once the item model holds.
