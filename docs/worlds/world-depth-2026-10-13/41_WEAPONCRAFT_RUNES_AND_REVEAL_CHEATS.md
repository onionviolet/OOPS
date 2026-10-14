# Weaponcraft, runes, reveal cheats and the abstraction under them (proposal, 2026-10-14)

Weibao (2026-10-14): "Weaponcrafting, runestuff, other stuff and more? more to consider? ... Cheats that would show stuff like these and more? ... Subtle stuff too? Overarching stuff? Implementation implciations and more? Abstaction thats needed?"

Proposals only. Nothing here is accepted.

**Duplicate notice (2026-10-14).** Parallel sessions answered the same request. [WEAPONCRAFTING_RUNES_AND_INSCRIPTION](../../WEAPONCRAFTING_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) is primary per its own notice, with Codex lanes R1 (by world), R2 (game references) and R3 (engine fit and abstraction) in `docs/gm/dispatch/weaponcraft-runes-2026-10-14/`; [WEAPONCRAFT_RUNES_AND_MAKER_ARTS](../../WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md) is a second sibling. Fold rows here that add something (RV1-RV14 reveal cheats, AX1-AX18) into the primary after its lanes finish; this part's planned Codex lane (part 42) was stopped as a duplicate of R1 and R3.

**Read first, not restated here.** General crafting already has deep owners: the [materials and alchemy audit](../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) (five-record contract: material, batch, process, product, knowledge), the [procedural crafting palette](../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) (including CT1-CT6 crafting cheats), and [P6 smithing](../../gm/dispatch/procgen-2026-10-13/p6/SMITHING.md) (alloy ratios, treatment, parts, the S3-A brace slice). Code today: `src/crafting_recipes.js` assembles template parts, `src/alloy_equipment.js:5-27` derives one brace's stats and technique effect, `src/crafting_visibility.js` decides what is makeable. This part adds weapon-specific angles, a rune and inscription layer, cheats that reveal these systems, and the shared abstraction they all need. Codes WR, RU, RV, AX checked free.

---

## 1. Weaponcraft angles (WR1-WR14)

| Code | Consideration | Why it matters |
|---|---|---|
| WR1 | **A weapon is parts.** Default: blade or head, core, guard, grip, pommel or haft, binding, sheath. Each part has a material, process and condition; the weapon's behavior comes from parts plus fit (SMITHING L2 parts logic). | Lets repair, upgrade, salvage and heirloom reforging work per part instead of per item. |
| WR2 | **Fit to the wielder.** Default: length, weight and balance suit a body (part 30 body age, nonhuman bodies). A blade forged for you works better in your hand (part 38 HB22). | Weapons for children, giants or tails feel different; custom work is worth paying for. |
| WR3 | **Weapon families by world.** Default: each world declares its families and techniques (katana and kunai in Naruto, wands in HP, Spell foci in D&D, Zanpakuto in Bleach, firearms in Fallout). A family unlocks technique compatibility. | Keeps worlds distinct and avoids a universal sword table. |
| WR4 | **Bonded and living weapons.** Default: some worlds have weapons with will or spirit (Zanpakuto, Shadow Slave Memories, intelligent D&D items). These are ties as well as items (part 29 BK1), with their own wants. | A weapon you talk to is a character, and the relationship engine already fits. |
| WR5 | **Wear, maintenance and edge.** Default: edges dull, hafts crack, rust spreads; whetting and oiling are small idle routines. Neglect lowers performance, never deletes the weapon without warning (OA11). | Upkeep texture with no punishment spiral. |
| WR6 | **Signature style.** Default: a smith's habits show in their work (a fuller shape, a mark). Others recognize the maker (part 33 lineage, part 29 BK19). | Craft lineages and fame through objects. |
| WR7 | **Commissions.** Default: NPCs order weapons with specs, deadlines and payment; satisfaction writes a tie and renown. A famous blade carries the maker's name. | Smithing becomes social and economic, not only power. |
| WR8 | **Testing and proving.** Default: test cuts, proof shots and trials reveal true quality and flaws (part 29 DV13). Public proving builds reputation. | Truth about an item is earned, not shown for free. |
| WR9 | **Weapon history.** Default: kills, battles, owners and repairs write lines on the weapon (part 36 MC15). Famous weapons gain titles (part 24). | Heirlooms and legendary arms grow from play. |
| WR10 | **Law and weapons.** Default: who may carry, forge or sell arms per world and place (part 28 LF11). Illegal arms work but carry witness risk. | Weaponcraft touches law, class and institutions (part 33). |
| WR11 | **Ammunition and consumable arms.** Default: arrows, bolts, bullets, throwing knives, talismans as consumables crafted in batches; idle production fits (palette AU). | Gives ranged and talisman builds a supply loop. |
| WR12 | **Siege and large arms.** Default: ballistae, cannons, wards on walls, ship weapons are projects with crews and institutions. | Scale up from personal to group work (part 33 founding). |
| WR13 | **Non-weapon combat gear.** Default: armor, shields, focus items, prosthetics and mounts' tack follow the same parts model. | One model covers all equipment. |
| WR14 | **Mastercraft is rare by world adjective.** Default: legendary results come from rare materials, rare skill and rare moments, with a per-world rarity adjective, not a fixed cap. | Fits the solo-player, no-"once" direction while keeping legends special. |

## 2. Runes, inscriptions and enchantment (RU1-RU16)

| Code | Consideration | Why it matters |
|---|---|---|
| RU1 | **A rune is a rule written on a carrier.** Default: a rune or inscription has a script, a meaning, a carrier (stone, steel, skin, paper, air), a power source and a lifetime. Carrier, material and fuel stay separate (procgen R10 source law). | One model covers runes, seals, glyphs, talismans, enchantments and fuinjutsu. |
| RU2 | **Runes compose.** Default: runes combine by a world's grammar into effects. Some combinations amplify, some cancel, some are unstable. Grammar is per world. | A discovery system with depth, not a fixed enchant list. |
| RU3 | **Learning the script.** Default: a rune system is a language learned from teachers, books or analysis (part 28 DS2 literacy). Partial knowledge allows partial, riskier work. | Ties runes to knowledge, mentors and institutions. |
| RU4 | **Precision matters.** Default: a flawed stroke weakens or warps the effect. Skill lowers flaws; a steady hand (part 36 MC19) and good tools help. | Execution skill without random fail rolls everywhere. |
| RU5 | **Power source.** Default: runes draw from the carrier's material, the user's mana or chakra, ambient energy, a battery or a sacrifice, per world. Empty runes are dormant, not broken. | Makes power budgets real and rune maintenance a routine. |
| RU6 | **Capacity and slots.** Default: a carrier holds limited inscription by size, material and quality. Better materials hold more; overloading risks cracks. | A natural reason to seek fine materials and to choose carefully. |
| RU7 | **Runes on bodies.** Default: tattoos, curse marks, seals on skin (Naruto seals, Bleach Kido inscriptions where lore has them) follow the same model with consent and body rules. Removal can hurt. | Body inscription as progression with real cost. |
| RU8 | **Runes on places.** Default: wards, circles and barriers on rooms, buildings and land (MoL wards, HP protective enchantments). They need upkeep and can be read by others. | Home security and dungeon design share one model; ties to part 31 home record. |
| RU9 | **Reading others' runes.** Default: an inscription can be studied to learn its meaning, counter it or copy it. Skill and appraisal decide how much you learn. | Puzzle content and a learning route from found items. |
| RU10 | **Counter-runes and dispelling.** Default: effects can be disrupted, overwritten or drained by fitting counters. | Runes become tactical, not only stat boosts. |
| RU11 | **Lost and forbidden scripts.** Default: ancient or banned scripts exist per world, more powerful and more dangerous, with institutions guarding them. | Long goals and secrets; refer to any sealed truths by ID. |
| RU12 | **Inventing runes.** Default: with deep knowledge, a player can design new runes within the world's grammar (TECHNIQUE_INVENTION owner). | Top-end creativity path. |
| RU13 | **Rune drift and decay.** Default: inscriptions fade, rust or lose charge over time; re-inking is upkeep. | Quiet clocks (part 38 HB29) with in-world warnings. |
| RU14 | **Rune signatures.** Default: a rune-crafter's hand is recognizable, so wards and seals can be traced to their maker. | Investigation and identity risk (part 29 DV). |
| RU15 | **Worlds without runes.** Default: worlds that lack inscription magic keep it absent; bringing it in is a carried cheat (part 28 DS6). | Respects world rules and gives carryover meaning. |
| RU16 | **Runes as language.** Default: rune meanings can carry into speech, names and true names in worlds that link them (Shadow Slave True Names, Earthsea-style names in originals). | Ties runes to identity and social power. |

## 3. Cheats that reveal these systems (RV1-RV14)

Extends the crafting palette's CT1-CT6. All follow part 22's cheat test and part 39 OA2: they reveal the true layer through a declared route and never show sealed truths outside discovery.

| Code | Cheat | What it shows | Why it matters |
|---|---|---|---|
| RV1 | **Smith's eye** | A weapon's true parts, materials, flaws and hidden history lines. | Reveals WR8 truth without testing. |
| RV2 | **Rune sight** | Inscriptions on items, bodies and places, including hidden or invisible ones, with partial meaning by level. | Turns RU9 into a sense. |
| RV3 | **Grammar insight** | Which rune combinations work, amplify or cancel before trying. | Removes RU2 trial-and-error cost, not material cost. |
| RV4 | **Recipe whisper** | A hint of what a material could become in a weapon or rune carrier. | Guides experimentation. |
| RV5 | **Durability readout** | Exact wear, charge and time to failure for items and wards. | Turns quiet clocks (HB29) into numbers. |
| RV6 | **Maker's trace** | Who made or inscribed an item or ward. | Investigation shortcut (RU14, WR6). |
| RV7 | **Potential gauge** | The best result a material or blank could reach with ideal work. | Shows ceilings, helps choose what to keep. |
| RV8 | **Status window crafting tab** | A system panel listing known recipes, rune vocabulary, crafting stats and progress (CHEAT_LIBRARY status window). | Fits the existing status window cheat line. |
| RV9 | **Item history reader** | Past owners, battles and events of an item (psychometry). | Unlocks heirloom stories and clues. |
| RV10 | **Weakness sight** | The weak point of an enemy's weapon, armor or ward. | Combat use of the same reveal rule. |
| RV11 | **Market sense** | True value of crafted goods and what buyers want now. | Economy reveal (palette EC). |
| RV12 | **Blueprint memory** | Perfect recall of any design or rune seen once. | Copying path with its own law, not free duplication (CT3). |
| RV13 | **Mentor ghost** | A voice that comments on your work with a master's eye. | Reveal as a character; ties to bonds (WR4). |
| RV14 | **Simulation forge** | Try a craft in a mental space before spending materials (SIMULATORS doc). | Removes risk, keeps time and skill costs. |

Each reveal cheat should name: what layer it reads, its level steps, its tell to observers, and what it never shows.

## 4. The abstraction they need (AX1-AX12)

The goal: one small set of shared shapes so weapons, runes, potions, wards, tattoos and gear do not each grow their own engine. Codex lane [part 40](40_IMPLEMENTATION_CONSIDERATIONS.md) covers code-level detail; this is the design shape.

| Code | Abstraction | What it unifies | Why it matters |
|---|---|---|---|
| AX1 | **Thing = parts + materials + processes + attachments + condition + history.** | Weapons, armor, tools, wards, bodies with inscriptions. | One item shape; matches the five-record contract and SMITHING parts. |
| AX2 | **Attachment** (rune, enchantment, coating, gem, seal, tattoo) with carrier, meaning, source, lifetime. | Runes, enchants, poisons on blades, sockets. | One way to put an effect on a thing. |
| AX3 | **Effect grammar per world.** Rules for how attachments combine, amplify, cancel. | Rune composition, alchemy mixing, alloy interactions. | Worlds differ by grammar, not by new code (OA4). |
| AX4 | **True layer and known layer for every property.** | Appraisal, reveal cheats, testing, counterfeits. | OA2 at the item level. |
| AX5 | **Reveal route** (sense, skill, test, cheat, mentor) with level steps and what it never shows. | Every RV cheat, appraisal skills, part 29 DV24. | Cheats become data, not one-off code. |
| AX6 | **Capacity budget** on carriers and bodies. | Rune slots, enchant limits, tattoo space, socket counts. | One rule for "how much fits". |
| AX7 | **Power source binding.** | Rune fuel, mana weapons, batteries, ward upkeep. | Upkeep and drain share one clock. |
| AX8 | **Condition clock.** Wear, charge, decay on any thing with warnings. | Edges, wards, ink, potions spoiling. | Quiet clocks in one place (HB29). |
| AX9 | **Provenance and history lines.** | Maker marks, owners, battles, repairs. | Heirlooms, investigation, titles. |
| AX10 | **Fit to holder.** Body, skill, family and bond compatibility. | Weapon fit, wand choice, bonded weapons. | One check for "does this work for you". |
| AX11 | **Law tags.** Who may own, make, carry, inscribe per place. | Weapon law, forbidden scripts, banned potions. | Law reads tags, not item ids. |
| AX12 | **Process operators** shared by crafts: heat, shape, mix, inscribe, bind, cure, charge. | Smithing, runes, alchemy, cooking. | New crafts are new operator sets, not new engines. |

## 5. Overarching and implementation implications (AX13-AX18)

| Code | Implication | Why it matters |
|---|---|---|
| AX13 | **Build the shapes before content.** AX1, AX2, AX4 and AX8 first; content and cheats after. | Avoids one-off item code that later needs migration. |
| AX14 | **Save budget.** Generated items with history and attachments grow saves; compact history lines (part 29 CQ4 pattern) and store generators plus seeds where possible. | Keeps saves within localStorage bounds (part 40). |
| AX15 | **Legacy items keep working.** Existing template items and the brace stay valid; new shapes wrap them with a decoder (SMITHING persistence). | Persistence safety (OA16). |
| AX16 | **Lint.** Reveal views read only the known layer; sealed rune meanings never appear in UI text. | OA28 leaks at item level. |
| AX17 | **One reveal UI.** A single inspect panel shows known properties, unknowns as "?", and which routes could reveal more. Desktop first. | Consistent discovery across every craft. |
| AX18 | **Cheapest first.** (1) WR5 whetting as an idle routine on the existing brace. (2) RU8 one Village door ward with charge and upkeep. (3) RV1 smith's eye as a cheat reading the existing brace's true stats. | Each sits on existing items with small additive save fields. |
