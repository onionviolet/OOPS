Lane: weapons, runes and inscription by world, plus item-model audit, for
YAIRPG. Weibao (2026-10-14): "Weaponcrafting, runestuff, other stuff and
more? ... Cheats that would show stuff like these and more? ... Subtle stuff
too? Overarching stuff? Implementation implciations and more? Abstaction
thats needed?"

Read `docs/gm/dispatch/relationship-prereqs-2026-10-14/runs/COMMON.md` first and follow it.

You own only:
- `docs/worlds/world-depth-2026-10-13/42_WEAPONS_RUNES_BY_WORLD_AND_ITEM_MODEL.md` (create)
- `docs/gm/dispatch/relationship-prereqs-2026-10-14/RUNES_REPORT.md` (create)
Read every other file; edit none. Another lane is writing part 40
(implementation considerations); read whatever exists.

Read first: Claude's `41_WEAPONCRAFT_RUNES_AND_REVEAL_CHEATS.md` (WR, RU,
RV, AX codes), `docs/PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md`,
`docs/PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md`
(do not edit; another session may own it), `docs/gm/dispatch/procgen-2026-10-13/p6/`
(SMITHING, COATINGS, PATTERNS, TECHNIQUE_INVENTION, REPAIR_SALVAGE,
CANON_LOCATORS), `docs/MEANS_AND_APPRAISAL.md`, `docs/CHEAT_LIBRARY.md`
(status window), `docs/SIMULATORS_AND_CHEAT_IMPLEMENTATION.md`, part 22
cheat test, part 39 principles. World sources: `docs/worlds/<world>/`, wiki
digests in `docs/research/power-systems/wiki-digests/`, dossiers in
`docs/research/novels/` (paraphrase only, never quote prose).

Code to audit (cite file:line): `src/crafting_recipes.js`,
`src/crafting_detail.js`, `src/crafting_visibility.js`,
`src/crafting_component_filling.js`, `src/native_craft_transaction.js`,
`src/alloy_equipment.js`, `src/world_completion_materials_*.js`,
`src/nethack_fieldcraft_*.js` (item views, identification), equipment and
item classes (find them), enchant or socket fields if any, item save
format and decoders.

Part 42 contents:
1. Item model today: how items, equipment, components, quality, condition
   and identification are represented and saved; how close each AX1-AX12
   abstraction in part 41 is to an existing seam (reuse / extend / new),
   with save impact.
2. Abstraction proposal at code level: concrete record shapes for thing,
   part, attachment, effect grammar, known layer, reveal route, capacity,
   power binding, condition clock, provenance; how legacy items decode;
   what the shared predicate layer needs. Proposals, not code.
3. Per world, weapons and inscription from lore with evidence labels:
   Harry Potter (wands, wandlore, enchantment, runes as a subject), D&D
   (magic items, attunement, scrolls, glyphs, smithing), Mother of Learning
   (shaping, wards, golems, spell formulas), Shadow Slave (Memories, weaving,
   runes), Naruto (fuinjutsu, chakra blades), Bleach (Zanpakuto, Kido),
   Frieren, LOTM (mystical items, characteristics), cultivation (talismans,
   arrays, artifact refining, spirit weapons), Elden Ring if documented,
   Fallout (weapon mods), TTKS and A Soldier's Life where sources allow,
   home Village original. Mark original fill-ins. Sealed truths by ID only.
4. Reveal cheats per world: which RV cheats fit each world's rules, and new
   world-specific reveal cheats.
5. Subtle details: small signals for crafting and runes (follow part 36 rules).
6. Cheapest five slices with save impact and acceptance cases (specified,
   not run), desktop 1366x768 first.
Also propose the index row for part 42 in the report (do not edit the index).
