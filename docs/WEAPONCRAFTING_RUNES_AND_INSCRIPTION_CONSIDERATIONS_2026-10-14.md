# Weaponcrafting, runes and inscription: more to consider

Claude, 2026-10-14. A palette, not a spec. Nothing here is selected for a build.

**Duplicate notice (2026-10-14).** Parallel sessions answered the same request in [WEAPONCRAFT_RUNES_AND_INSCRIPTION](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) (listed first in IDEA_INDEX, lanes in `docs/gm/dispatch/weaponcraft-runes-2026-10-14/`) and [WEAPONCRAFT_RUNES_AND_MAKER_ARTS](WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md). Treat the first as primary. Rows here that add something (assemblies on vanilla head plus handle WF1, rune as a program on a carrier RU1, base smith's sense vs cheat CS12, AB1-AB10) should be folded into it once its lanes finish; then this file can become a pointer.

Weibao (2026-10-14): "Weaponcrafting, runestuff, other stuff and more? more to consider? other stuff and more? Cheats that would show stuff like these and more? MOre to consider save and extend accordingly Send out codex as usesful? Subtle stuff too? Overarching stuff? Implementation implciations and more? Abstaction thats needed?"

## What already exists (read 2026-10-14)

This doc does not restate these owners.

| Owner | Covers |
|---|---|
| [Procedural crafting and consumables](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) | Consumables, crafting feel, maker identity, items over time, world laws WL1-WL8, crafting cheats CT1-CT6, automation, economy, round 2 |
| [Materials and alchemy audit](PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) | P2 five records (material, owned batch, process, resolved product, knowledge) and the pure `resolveBatch` resolver |
| [E4 tags and rules](emergent/E4_TAGS_AND_RULES.md), [E4B materials](emergent/E4B_MATERIALS_AND_NOITA.md) | Tag store, instance deltas, rule schema |
| [Means and appraisal](MEANS_AND_APPRAISAL.md) | Appraisal routes |
| [Cheat library](CHEAT_LIBRARY.md), [part 22 features as cheats](worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md) | Cheat test: a feature is a cheat where locals lack it and it breaks a rule they live by |
| [Part 39 overarching principles](worlds/world-depth-2026-10-13/39_OVERARCHING_PRINCIPLES.md) | Recurring rules across parts 28-38 |

**Code today (shown).** Vanilla weapons are assembled from components: blade or head plus handle, each with a `component_type` (`src/items.js:26-40`, `:397-398`). Quality maps to rarity with an extra multiplier on top (`src/items.js:13-24`). Armor has interior components by slot (`:127-138`). `src/crafting_recipes.js` (2,118 lines) holds recipes; `src/alloy_equipment.js` derives a brace's stats from an authored alloy profile. There is no rune, inscription, enchantment or weapon-history system.

---

## 1. Forging and making weapons (WF)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| WF1 | **Weapons are assemblies** | Keep vanilla's head plus handle and extend: guard, pommel, binding, fittings, sheath. Each part is its own product with material and quality. | Builds on the live component model; repair and upgrade can target one part. |
| WF2 | **Material decides limits, skill decides how close you get** | A material sets a ceiling (hardness, flex, weight, conductivity to power); the smith's skill and process set how near the ceiling the result lands. | Good steel in bad hands stays mediocre; legends need both. |
| WF3 | **Process steps matter** | Heat, fold, quench, temper, grind, assemble. Each step can be done well, rushed or skipped, with readable effects. | Smithing as play, not a single click (crafting doc FE). |
| WF4 | **Heat treatment as the classic choice** | Harder and brittle vs softer and tough. One slider, real trade-off. | A meaningful decision every smith understands. |
| WF5 | **Fit to the wielder** | Length, balance and grip fitted to a person give a small bonus to them and a small penalty to others. | Commissioned weapons feel personal. |
| WF6 | **Style schools** | Smithing traditions (regional, sect, guild) each favor certain shapes and processes and teach techniques. | Teachers and places matter (crafting doc MK). |
| WF7 | **Signature marks** | A maker's mark records who made it; famous marks raise value and recognition. | Maker identity and provenance. |
| WF8 | **Commissions** | NPCs order weapons to spec; delivered work builds renown (QP, MDQ10). | Crafting connects to the quest board. |
| WF9 | **Failures teach** | A cracked blade still yields knowledge of the material (knowledge record). | Failure moves you forward. |
| WF10 | **Non-metal weapons** | Bows, staves, wands, focus crystals, bone, chitin, living wood. Same assembly model, different process verbs. | One system for many weapon kinds. |
| WF11 | **Ammunition and consumable weapons** | Arrows, bolts, throwing knives, bullets in fitting worlds; batch crafted. | Idle-friendly batch work. |
| WF12 | **Armor follows the same model** | Plates, linings, straps, enchant slots. | One abstraction for wearables. |

## 2. A weapon's life (WP)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| WP1 | **Wear and maintenance** | Edges dull, hafts loosen, rust appears; sharpening and oiling are small routine actions (MC15). | Ownership has texture. |
| WP2 | **Repair vs reforge** | Repair keeps history; reforging changes the item and may break bonds or inscriptions. | A choice with sentimental cost. |
| WP3 | **History log** | A weapon records notable kills, owners, battles, repairs (item history from part 36 MC15). | Legends grow from use. |
| WP4 | **Naming** | Used long enough, it gets a name from you or others (MC16, XP2). Named weapons appear in legends. | Attachment. |
| WP5 | **Bond growth** | In worlds that allow it, a weapon grows with its wielder: unlocks, awakens, speaks (Bleach zanpakuto as a soul, not crafted; intelligent swords in D&D). Law per world. | Weapon as companion. |
| WP6 | **Heirloom weapons** | Passed down with history; heirs get the item, not the skill (LR3, LR4). | Ties to succession. |
| WP7 | **Breaking** | Weapons can break; broken legendary pieces become quest hooks (reforge the shards). | Loss creates goals. |
| WP8 | **Theft and recovery** | Stolen named weapons can be traced by their mark or history (QT3). | Items carry stories across owners. |

## 3. Runes and inscription (RU)

Runes here means any written or drawn power: runes, glyphs, seals, sigils, circles, talismans, wards, tattoos, scrolls.

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| RU1 | **A rune is a small program on a carrier** | Each inscription has: symbols (what), arrangement (how they combine), carrier (what it is written on), medium (ink, blood, carving, chakra, mana), and power source. | One abstraction for runes, seals, circles and talismans. |
| RU2 | **Grammar** | Symbols combine by world rules: some worlds have strict grammars (circle geometry), some loose (sigil stacking). Wrong grammar fails or misfires. | Learning runes is learning a language. |
| RU3 | **Runes are knowledge first** | You must learn a symbol (book, teacher, observation, deciphering) before using it; partial knowledge gives partial effects or errors (Knowledge record). | Discovery-gated depth. |
| RU4 | **Carrier limits** | A carrier has capacity (how many symbols), affinity (which kinds hold) and durability (how long it lasts). | Material matters for runes too (WF2). |
| RU5 | **Precision** | Hand steadiness, tools and time decide how clean a line is; sloppy lines weaken or twist the effect. | Skill without dice. |
| RU6 | **Power source and upkeep** | Some runes are self-powered once made, some draw from the wielder, some need charging. | Different costs feel different. |
| RU7 | **Misfire and backlash** | Errors can hurt the maker, damage the carrier or create a different effect. Severity is a world adjective. | Risk in the workshop (crafting doc RS). |
| RU8 | **Deciphering found runes** | Ruins, old weapons and books carry runes you can study, partly understand and misread (Honest uncertainty, MC40). | Exploration feeds crafting. |
| RU9 | **Composition discovery** | New combinations can be found by experiment; some are dangerous, some are lost lore. | Player creativity with limits. |
| RU10 | **Erasing and overwriting** | Runes can be scraped, burned out or overwritten, sometimes leaving residue. | Items change over time. |
| RU11 | **Runes on bodies** | Tattoos, curse marks, seals on people; social and legal meaning varies (DP12 disguise tell). | Body as carrier, with consequences. |
| RU12 | **Runes in places** | Wards on doors, circles on floors, boundary stones; they persist in the world instance (QM9). | Fortification and home building. |
| RU13 | **Reading runes reveals intent** | A skilled reader can tell what a rune does and sometimes who made it (signature, WF7). | Investigation route. |
| RU14 | **Runes as language and culture** | Each culture's script carries history; runes can be words as well as power (PROCEDURAL_STORY B5). | Lore depth. |

## 4. Other making near these (OM)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| OM1 | **Enchanting** | Adding an effect to an item through a ritual, rune or infusion, with slots and conflicts. | Common fantasy craft. |
| OM2 | **Socketing and gems** | Gems or cores set into fittings add properties; removal may destroy one or the other. | Modular upgrades. |
| OM3 | **Golems, constructs and puppets** | Body (materials) plus control program (runes) plus power. | Same abstractions combined. |
| OM4 | **Wands and foci** | Core plus wood plus maker, matched to a wielder (HP wandlore). | Fit (WF5) as a world law. |
| OM5 | **Talismans and charms** | Single-use inscribed paper or objects; batchable. | Idle production. |
| OM6 | **Jewelry and trinkets** | Small carriers with high rune affinity, low durability. | Trade and gift goods. |
| OM7 | **Traps and devices** | Mechanical or runic; placed in the world. | Defense and hunting. |
| OM8 | **Fusion of finished items** | Two items become one with chosen traits (crafting doc CT6). | Late-game crafting. |

## 5. Cheats that show these things (CS)

Cheat test per world: a feature is a cheat where locals lack it. Base versions (a smith's eye, a scholar's rune reading) exist where locals have them. These extend crafting doc CT1-CT6.

| Code | Cheat | What it shows | Limits |
|---|---|---|---|
| CS1 | **Item status window** | Exact stats, quality percent, hidden properties, history log of an item. | Never sealed truths outside their route; may crack or glitch (part 22 FR5). |
| CS2 | **Material sight** | Ore grade, impurities and true material identity at a glance. | Reveals the material record, not what it can become. |
| CS3 | **Forge preview** | Shows the likely result before a step: crack risk, hardness, quality band. | A preview never consumes a draw (IX1); only commit advances. |
| CS4 | **Rune reading** | Reads any rune's function, possibly maker and age. | Partial at low level; dangerous runes may react to being read. |
| CS5 | **Recipe or pattern sense** | Outlines of designs never seen: a shape, a fold pattern, a circle layout. | Outline only; execution still needs skill (crafting doc CT4). |
| CS6 | **Weapon voice** | Hear a weapon's history or will (psychometry). | Information about the past, not stats. |
| CS7 | **Perfect line** | Removes precision error when inscribing (crafting doc CT2 for runes). | A wrong design is still wrong. |
| CS8 | **Copy inscription** | Duplicates a rune you have seen onto a new carrier. | Breaks knowledge gating on purpose; has a cost adjective. |
| CS9 | **Upgrade path display** | Shows what a weapon could become and what it needs. | A goal tree for items (QG3); spoils discovery if overused, so it is a cheat. |
| CS10 | **System smithy** | An outside shop or forge that crafts with system rules (Solo Leveling style). | Imported goods still face local laws (crafting doc CT4). |
| CS11 | **Absorb a weapon's skill** | Learn a technique from a weapon's history (Shadow Slave style memories, Tensura absorption). | World-specific; follows carry rules (LR4). |
| CS12 | **Smith's sense (base, not cheat)** | Tap a blade and hear its temper; a common trained skill in smithing cultures. | Shows the line between skill and cheat. |

## 6. Per world (WW)

Public franchise mechanics only; verify before building (codex lane C1).

| Code | World | Making law worth modeling |
|---|---|---|
| WW1 | Harry Potter | Wandlore (core, wood, wand chooses the wizard); Ancient Runes as a school subject; goblin metalwork. |
| WW2 | D&D | Magic item crafting by budget and time; scrolls, glyphs and symbols by spell; intelligent items. |
| WW3 | Mother of Learning | Shaping, ward schemes, golem and enchanted item crafting with mana. |
| WW4 | LOTM / CoI | Mystical items carry Beyonder characteristics and negative effects; symbols and rituals matter. |
| WW5 | Shadow Slave | Memories (items) the Spell describes in runes; runes as the Spell's readable text. |
| WW6 | JJK | Cursed tools, technique-imbued objects, binding vows on items. |
| WW7 | Bleach | Zanpakuto are souls, not crafted; Kido incantations; Quincy tools. |
| WW8 | Naruto | Ninja tools, sealing jutsu (fuinjutsu) as inscription, storage scrolls, explosive tags. |
| WW9 | FMA | Transmutation circles; equivalent exchange on materials; automail engineering. |
| WW10 | Fate | Mystic codes, Noble Phantasms as legends, not crafted; runes as a magecraft line. |
| WW11 | HxH | Nen imbued into objects; conditions and vows strengthen them. |
| WW12 | One Piece | Graded named swords, seastone, Den Den Mushi and dial technology. |
| WW13 | Chainsaw Man | Devil contracts rather than crafting; few made items matter. |
| WW14 | A Soldier's Life, TTKS | From private packs; codex lane checks. |
| WW15 | Original worlds | One small original making law per world (crafting doc WL8). |

## 7. Subtle stuff (SB)

| Code | Detail | Why it matters |
|---|---|---|
| SB1 | The smithy is hot and loud; neighbors complain at night. | Place texture and social cost. |
| SB2 | Burns and calluses on a smith's hands (MC13). | Practice shows on the body. |
| SB3 | A new blade's first nick is mentioned once. | History begins. |
| SB4 | Rune ink smells of iron or herbs by medium. | Sense detail per tradition. |
| SB5 | A misread rune in an old ruin, corrected later in the notebook. | Knowledge with revision. |
| SB6 | A famous maker's mark faked on cheap work at the market. | Forgery as world texture. |
| SB7 | A weapon hums near the runes of its own tradition. | Hint of hidden links without stats. |
| SB8 | Apprentices sweep, sort scrap and fail before they forge. | Training feels real. |
| SB9 | A customer comes back to complain or to thank. | Work has afterlives (MDQ9). |
| SB10 | Scrap and offcuts pile up and can be sold or reused. | Material conservation felt. |

## 8. Overarching (OV)

| Code | Principle | Why it matters |
|---|---|---|
| OV1 | **One making model for all things** | Weapons, armor, potions, runes, golems, food use the same records: material, owned batch, process, product, knowledge (audit P2), plus carrier and inscription for runes. | Systems combine instead of multiplying. |
| OV2 | **Truth vs knowledge** | The item's real properties are separate from what any actor knows about them. Cheats and skills change knowledge, not truth. | Appraisal, misreading and cheats all fit. |
| OV3 | **Ceilings from materials, closeness from skill** | Applies to forging, inscribing, brewing. | One rule players learn once. |
| OV4 | **History is part of an item** | Provenance, owners and events are data, not flavor. | Legends, heirlooms and theft all need it. |
| OV5 | **World laws plug in** | Each world declares its making laws over the shared resolver (crafting doc WL). | Distinct worlds, one engine. |
| OV6 | **Everything idles by batch and routine** | Routine-able steps for ammo, talismans, repairs; turning points stay active. | Idle fit. |

## 9. Abstractions needed (AB)

| Code | Abstraction | Fields (minimum) | Notes |
|---|---|---|---|
| AB1 | **Material** | id, revision, properties (hardness, flex, weight, affinities), tags | Audit P2 material definition. |
| AB2 | **Part** | part type (head, handle, guard, plate, core, carrier), material batch ref, quality, process record ref | Generalizes vanilla `component_type`. |
| AB3 | **Assembly** | slots by item type, parts in slots, fit (wielder ref), derived stats | Vanilla head plus handle becomes one case. |
| AB4 | **Process record** | ordered steps with parameters and actor skill, station, commit draw refs | Audit P2 process; one per part. |
| AB5 | **Inscription** | symbols, arrangement, carrier ref, medium, power source, precision, maker | RU1. A small program evaluated by world rules. |
| AB6 | **Effect** | E4 tag rule or authored effect id with parameters | Effects stay authored; generation picks and combines. |
| AB7 | **Knowledge entry** | actor, subject (material, rune, item), what is known, confidence, source | Audit P2 knowledge; drives CS cheats and appraisal. |
| AB8 | **Item history** | stable item id, maker, owners, notable events, repairs, name | WP3; bounded and compactable. |
| AB9 | **World making law** | world id, allowed processes, rune grammar rules, conservation rules, forbidden combos | OV5, crafting doc WL. |
| AB10 | **Stat derivation** | pure function from assembly plus inscriptions plus world law to stats | Replaces hardcoded multipliers gradually; vanilla items keep their numbers. |

## 10. Implementation implications (IM)

| Code | Consideration | Implication |
|---|---|---|
| IM1 | **Vanilla compatibility** | Existing items keep their stats and `component_type`; AB2-AB3 wrap them as single-material parts. Old saves load unchanged (rule 8). |
| IM2 | **Item identity** | History and names need a stable per-item id; vanilla stacks items by template and quality. Unique items must stop stacking. Migration: only new crafted or named items get ids. |
| IM3 | **Save size** | Per-item history is bounded and compacted (part 22 IS1, 4 MiB budget). |
| IM4 | **Pure resolvers** | Forging and inscription resolve through pure functions over committed draws, testable with fixed seeds (audit resolver). |
| IM5 | **Knowledge filter in UI** | Item tooltips show only the actor's knowledge (part 22 IP6); cheats raise knowledge, never print hidden truth directly. |
| IM6 | **Rune evaluation safety** | Inscription programs are data evaluated by a bounded interpreter: no loops without limits, capped symbol counts, validated grammar. |
| IM7 | **Content scale** | Symbols, materials and part types live in data tables per world with validators (part 22 IA1). |
| IM8 | **Browser proof** | Any slice is checked rebuilt, fresh origin, 1366x768, save, reload, import (AGENTS.md). |

## Suggested smallest slice, if Weibao picks any

1. **Guard and pommel parts** added to vanilla's head plus handle assembly, each with material and quality (WF1, AB2-AB3).
2. **A maker's mark and five-line history** on newly crafted weapons (WF7, WP3, AB8), with stable ids only for new items (IM2).
3. **One rune on one carrier**: a single learned symbol that sharpens or warms a blade, with precision from skill (RU1-RU5, AB5).
4. **A base smith's sense** (CS12) and one cheat version (CS1 item status window) to show the line between skill and cheat.

Codex lanes `docs/gm/dispatch/making-runes-2026-10-14/` C1 and C2 were stopped as duplicates of the primary doc's lanes.
