# Weaponcraft, runes and other maker arts: more to consider

> Codes renamed 2026-10-19 from WC, RN, OV, IM, AB, SB, OM and AR codes to MKR-prefixed forms (for example MKR-AB6) because the four 2026-10-14 weaponcraft palettes reused them with different meanings; also avoids collision with registered AR (architecture). Companion of the canonical [Weaponcraft, runes and inscription](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) palette, which keeps its bare codes. Bare codes in the maker-arts dispatch lane files mean this doc's MKR- codes. See [reserved prefixes](RULES_INDEX.md#reserved-prefixes-2026-10-19).

Claude (root), 2026-10-14. A palette, not a spec. Nothing here is selected for a
build. Request: "Weaponcrafting, runestuff, other stuff and more? more to
consider? ... Cheats that would show stuff like these and more? ... Subtle stuff
too? Overarching stuff? Implementation implciations and more? Abstaction thats
needed?" (recorded in [USER_VISION](USER_VISION.md)).

Codex lanes W1 to W7 deepen this in
[maker-arts dispatch](gm/dispatch/maker-arts-2026-10-14/SESSIONS.md). Lane
outputs are proposals until folded here.

## What already exists (read first, not restated)

| Owner | Covers |
|---|---|
| [P6 smithing X1](gm/dispatch/procgen-2026-10-13/p6/SMITHING.md) | Alloy as composition, equipment as parts, ordered melt/shape/cool/fit, first slice S3-A (two braces from one alloy) |
| [P6 patterns X5](gm/dispatch/procgen-2026-10-13/p6/PATTERNS.md) | Enchanting, inscriptions, runes, formations, talismans as a typed channel graph on a carrier with an energy payer; slice S6-A work lamp |
| [P6 coatings, repair/salvage, constructs, tools](gm/dispatch/procgen-2026-10-13/p6/REPORT.md) | Oils and finishes, repair that cannot silently rewrite alloy, golems, textiles |
| [Crafting and consumables palette](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) | CO consumables, FE feel, MK maker identity, IT items over time, WL world laws, CT crafting cheats, AU idle, EC economy, XD5 alchemy + smithing |
| [Materials and alchemy audit](PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) | Five-record contract: material, batch, process, product, knowledge |
| [Progression and assembly](worlds/PROGRESSION_AND_ASSEMBLY.md) | Nested modules, condition/quality/mastery, craft and refit lifecycle |
| [Technology and progression](TECHNOLOGY_AND_PROGRESSION.md) | Crafting tiers CT1-CT5, craft details CD1-CD12 |

Code state, checked 2026-10-14: `src/crafting_recipes.js` picks authored result
IDs and assembles template parts; `src/alloy_equipment.js` derives one brace's
stats. Weapons appear in `src/items.js` and `src/enemies.js` as authored items.
No rune grammar, part graph or weapon geometry exists in source. Nothing below is
implemented.

Standing rules apply to every entry: true properties work whether known or not,
reload never rerolls, no fixed "once" limits (per-world adjectives instead),
sealed secrets by ID only, comfortable idle play, desktop first.

---

## WC. Weaponcraft

| Code | Idea | Notes |
|---|---|---|
| MKR-WC1 | **Weapons as part graphs.** Blade, tang, guard, grip, pommel; head and haft; limbs and string; barrel, action, stock. Parts have interfaces (tang fit, socket size) and swap. | Tinkers' Construct and Monster Hunter shape. P6 L2 parts logic, no new engine. |
| MKR-WC2 | **Geometry is the stat.** Length, edge angle, balance point, curve, taper and weight distribution derive reach, cut vs thrust, recovery speed and edge life. | One derived profile, not authored numbers per sword. |
| MKR-WC3 | **Heat treatment tradeoffs.** Hard edge holds sharpness and chips; soft spine bends instead of snapping. Differential hardening, quench medium, temper level. | Same alloy, different weapon (S3-A already wants process sensitivity). |
| MKR-WC4 | **Layers and folding.** Laminate cores, pattern welding, visible patterns that identify a maker or a forge tradition. | The pattern is a real record, so it doubles as provenance evidence. |
| MKR-WC5 | **Fit to the wielder.** Grip length vs hand, weight vs strength, reach vs height. Nonhuman wielders (claws, tails, four arms, tiny bodies) need their own fit rules. | A custom piece beats a better borrowed one. Links [nonhuman mechanics](worlds/NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md). |
| MKR-WC6 | **Weapon meets technique.** A style reads the properties it needs: a thrusting style wants a stiff point, a draw-cut style wants curve. Mismatch works, just worse. | Technique-equipment fit becomes a reason to commission gear. |
| MKR-WC7 | **Ranged makers.** Bowyer (draw weight, limb wood, string), fletcher (spine, fletching, head), crossbows, firearms and ammunition where a world allows. | CO9 ammunition stacks already carry coatings. |
| MKR-WC8 | **Edges wear and lives shorten.** Sharpening removes mass; regrinds change geometry; an old family blade is shorter and thinner than when made. | Wear is a slow, readable history. |
| MKR-WC9 | **Weapons are tools too.** Machete clears brush, axe fells trees, spear fishes, knife cooks. | Life-sim fit: gear has consumers outside combat. |
| MKR-WC10 | **Reforging the broken.** A shattered blade reforged keeps its story and loses or changes properties. | Narsil-style arc. Conservation applies to the metal, not the legend. |
| MKR-WC11 | **Proof and testing.** Test cuts, proof marks on armor, ring tests, bend tests. Testing is an observation route that reveals properties at a cost (a test can damage). | Honest knowledge without a cheat. |
| MKR-WC12 | **Weapon law and custom.** Carry permits, peace-bonding, sword hunts, sect rules, duel etiquette. A fine blade in the wrong town is trouble. | World adjective, not a ban. |
| MKR-WC13 | **Commissions for others.** Arm a companion, an apprentice, a village militia. NPC users' results change your reputation. | Links MK6 commissions and [companions](COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md). |
| MKR-WC14 | **Monster-part weapons.** Fangs, horns, carapace, venom sacs. Harvest quality depends on how the creature died and how it was carved. | P8 creature resources own the harvest. |

## AR. Armor and protection

| Code | Idea | Notes |
|---|---|---|
| MKR-AR1 | **Coverage map and layers.** Padding under mail under plate; gaps at joints; what covers what. Hits resolve against the layer at that spot. | Reads a body map the nonhuman docs already need. |
| MKR-AR2 | **Weight, heat and stamina.** Armor costs breath on long marches and in hot climates; desert worlds punish plate. | A real cost, not a speed stat. |
| MKR-AR3 | **Fitting and refits.** A growing child, a pregnancy, a body change or a transformation needs refitting. | Ties age phases and transformation docs. |
| MKR-AR4 | **Damage meets material.** Cut, pierce, crush, heat, curse, soul. Each material answers each differently. | One response table per material family. |
| MKR-AR5 | **Shields as spent defense.** Shields split and get replaced; a shield wall is a group object. | Consumable defense fits idle supply loops. |
| MKR-AR6 | **Clothes as armor where magic allows.** Enchanted robes, protective charms in cloth, fashion vs function, social signals of rank. | HP K5 protective clothing is a sourced example (P6 PATTERNS). |

## RN. Runes, inscriptions and patterns

P6 PATTERNS owns the graph contract. These add play shapes on top.

| Code | Idea | Notes |
|---|---|---|
| MKR-RN1 | **Runes as a language.** Nouns, verbs, modifiers and grammar. A wrong word order makes a different spell, not an error message. | The pattern graph gets a readable surface. |
| MKR-RN2 | **One glyph, many meanings.** Context, neighbors and carrier change a rune's sense. Mastery is knowing the senses, not collecting more glyphs. | Depth without content bloat. |
| MKR-RN3 | **Carrier capacity.** Bone, wood, stone, metal, paper, skin and soul hold different densities. Overcrowding leaks, cross-talks or cracks. | P6 already separates carrier, blueprint and fuel. |
| MKR-RN4 | **Triggers and logic.** Conditions (touched, spoken, blood, moonlight, intent, proximity) and gates (and, not, delay, counter) make runes a programming toy. | Noita wands and Factorio circuits feel. Execution trace required, as P6 says. |
| MKR-RN5 | **Erosion and upkeep.** Weather, use and time wear inscriptions; ink fades; arrays need re-inking. | Maintenance tasks, idle friendly. |
| MKR-RN6 | **Body inscriptions.** Tattoos, seals, brands, curse marks. They cost the body something and can be read by others. | Naruto seals, curse seals; body records own the cost. |
| MKR-RN7 | **Formations at scale.** Sect barriers, city wards, anchor stones. A lost node weakens the whole; sieges hunt nodes. | Situated network; site law. |
| MKR-RN8 | **Reading and breaking others' work.** Decipher, counter-rune, smudge, hijack, reroute. | Defense and heist content from the same graph. |
| MKR-RN9 | **Deep words.** Knowing a rune's older or truer meaning strengthens it (true names, words of power). | A knowledge ladder with a real consumer. |
| MKR-RN10 | **Runes as binding.** Seals on spirits, written contracts, oaths in stone. Breaking one has the consequences it says. | Links pacts and contracts work. |
| MKR-RN11 | **Learning from ruins.** Infer meanings from inscriptions found in the world by comparison, the way a linguist works (Heaven's Vault). | Research loop: hypotheses, tests, partial certainty. |
| MKR-RN12 | **Generated scripts per world.** Glyph shapes from a stroke grammar, sound values and meanings per world. A randomized meaning is a sealed truth: referred to by ID only. | Seeded once, saved. |
| MKR-RN13 | **Copying hazards.** A miscopied rune runs as what was written. Forgeries, student errors and drift lineages follow. | KN1 and KN4 for patterns. |
| MKR-RN14 | **Rune crafting as a resource loop.** Make blank runes from essence at an altar (RuneScape-style runecrafting) and spend them on spells. | A second, simpler mode for worlds that want it. |

## OM. Other maker arts

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
| MKR-OM9 | **Awakened weapons** | Weapons that grow from the wielder's soul and are learned, not built (Bleach zanpakuto). A "craft" made of conversation and training. |
| MKR-OM10 | **Living crafts** | Grafting, bred bows, fungal armor, symbiote blades, bio-engineered tools. Shares genetics records. |
| MKR-OM11 | **Woodwork and home** | Furniture, tools, boats, a home that shows your work. Life-sim payoff. |
| MKR-OM12 | **Paper, ink and binding** | Scroll and talisman media, manuals, ledgers. Feeds RN carriers and KN books. |
| MKR-OM13 | **Masks and disguises** | Crafted identity: masks, makeup, forged papers. Links identity laws. |
| MKR-OM14 | **Instruments** | Tone from wood and build; enchanted music where a world allows. P6 M5 owns it. |
| MKR-OM15 | **Tech blueprints and fusion** | Learn blueprints, combine two into a new one (Legendary Mechanic shape, MEMORY). |
| MKR-OM16 | **Gu and living artifacts** | Refining and combining living artifacts (Reverend Insanity Gu, MEMORY, to verify). |

## WQ. World laws for weapons and runes

Public franchise mechanics only. Rows marked MEMORY need lane W1 to verify
against world folders and sources before anything uses them.

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
| WQ14 | Original worlds | One small new law each: blades that only cut what their maker hated, runes that read the reader | INFERRED |

## RC. Cheats that would show this

Fits the [status window work](gm/dispatch/cheat-status-window-2026-10-13/GOAL.md)
and the [cheat library](CHEAT_LIBRARY.md). Every reveal cheat declares its
fidelity tier, observation route and sealed boundary. It writes knowledge, never
truth.

Fidelity tiers, illustrative: **F0** a feeling ("this blade is wrong") → **F1**
category and name → **F2** numbers → **F3** hidden properties → **F4** history
and makers → **F5** what it could become.

| Code | Cheat | Shows | Notes |
|---|---|---|---|
| RC1 | **Item window** | Stats and traits at the cheat's tier | The baseline; tiers grow with use. |
| RC2 | **Blueprint eye** | The part graph and how the item was made | Lets you copy a method, not the item. |
| RC3 | **Breaking point sight** | Where an item, armor or wall will fail next | Combat and repair both use it. |
| RC4 | **Smith's ear** | Flaws, inclusions and cracks by sound | A real craft method raised to a cheat; subtle tier F0-F2. |
| RC5 | **Rune reader** | A pattern as a flowchart, with bugs and dead branches | Turns MKR-RN4 programming into readable play. |
| RC6 | **Psychometry** | Past wielders, deeds and the item's memory | F4; reads item receipts, never sealed truth outside its route. |
| RC7 | **Potential sight** | The best item this stock could make, or a material's ceiling | F5 forecast from current knowledge plus the cheat's grant. |
| RC8 | **Blueprint fusion** | Preview of combining two known designs | MKR-OM15 shape; preview is pure and spends nothing. |
| RC9 | **Weapon voice** | A sentient item talks: wants, grudges, warnings | Personality from history (IT3). |
| RC10 | **Uses-left counter** | Exact durability or charge remaining | Small, beloved, idle friendly. |
| RC11 | **Fit meter** | Wielder-weapon and technique-weapon match | Answers MKR-WC5/MKR-WC6 at a glance. |
| RC12 | **Array sight** | Formation lines, nodes and traps in the world | MKR-RN7/MKR-RN8 scouting. |
| RC13 | **Structural grasp and copy** | Read an item's structure, then project a copy | Breaks conservation on purpose; per-cheat cost or decay adjective (CT3 rule). |
| RC14 | **Buyer sense** | What each buyer would pay and why | EC economy view. |
| RC15 | **Masterwork omen** | That the next job's committed draw is exceptional | Safe because reload never rerolls; it is foresight, not a reroll. |
| RC16 | **Forge memory** | Replays the moment an item was made, showing each choice | A learning cheat: study a master's process. |

## SB. Subtle stuff

| Code | Detail | Why it matters |
|---|---|---|
| MKR-SB1 | Temper colors (straw, bronze, purple, blue) and steel's glow appear as text cues before any number. | The world teaches before the UI does. |
| MKR-SB2 | Item descriptions change with condition: a new nick, a rewrapped grip, a darker edge. | History shows without a log screen. |
| MKR-SB3 | The smith's body records the work: burns, calluses, a bad shoulder, sharper eyes in low light. | Craft shapes the maker (RS2 exposure). |
| MKR-SB4 | Humidity, cold and altitude shift forging and quench results a little. | RX1/RX2 site and time laws at small scale. |
| MKR-SB5 | Guards eye a fine blade; thieves note it; experts name its maker. | Gear has a social footprint; pairs with MKR-SB7 rumor names. |
| MKR-SB6 | Shop jargon is learnable knowledge; using the right word with a smith earns trust. | Language as a skill with a social consumer. |
| MKR-SB7 | Rumor names your weapon something you never called it. Names diverge by town. | Fame with texture. |
| MKR-SB8 | Hand familiarity: switching weapons costs comfort for a while. | Reuses the field-familiarity work in absorb-all P23. |
| MKR-SB9 | Rune ink glows faintly near related magic; a careful player notices. | A free F0 reveal for attentive play. |
| MKR-SB10 | An apprentice's first piece is weak and kept anyway. | Sentiment as a real record with a relationship consumer. |
| MKR-SB11 | Carried weight shows up as travel fatigue, not as a hidden cap. | Body realism without a menu wall. |
| MKR-SB12 | A seal or rune half-remembered from childhood resurfaces in a ruin. | Continuity hook across age phases. |

## OV. Overarching rules

| Code | Rule |
|---|---|
| MKR-OV1 | **One maker pipeline.** Source → material → process → product → use → wear → repair or salvage → legacy. Every maker art is a lane on it, not its own engine. |
| MKR-OV2 | **An item is five things.** Composition, structure (parts), pattern (runes), identity (exact origin) and history (receipts). Any item uses only the parts it needs. |
| MKR-OV3 | **Every stat has a consumer.** No geometry, rune or trait ships without a rule that reads it (P6 "no empty controls"). |
| MKR-OV4 | **Knowledge is not truth.** Testing, study and reveal cheats write knowledge; truth runs regardless. |
| MKR-OV5 | **World laws are adapters.** Skyrim tiers, zanpakuto dialogue and equivalent exchange all run on the same pipeline with different enabled operators. |
| MKR-OV6 | **Conservation by default.** Mass, charge and essence are accounted. Cheats that break it say so and carry their own adjective. |
| MKR-OV7 | **Idle by default, precision when active.** Every known method can queue; hand work adds control, never a mandatory minigame. |
| MKR-OV8 | **Makers live in the social web.** Reputation, commissions, rivals, law and gifts read real item properties. |

## IM. Implementation implications

| Code | Implication | Notes |
|---|---|---|
| MKR-IM1 | **Item instance envelope.** Definition refs plus deltas: parts, per-part material, structural state, installed patterns, condition, charge, bond and a receipt log. Generated definitions save before instances (P6 C8). | Biggest single save-shape change; needs a migration plan. |
| MKR-IM2 | **Part interface registry.** Socket types, fit tolerance, swap rules. Authored once per family. | Small, shared by weapons, armor, tools, devices. |
| MKR-IM3 | **Derived profile as a pure function.** (item, wielder, technique, world law) → combat or work profile, cached as a snapshot and invalidated by receipts. | The derived-snapshots dispatch is the natural owner. Never derive on each render. |
| MKR-IM4 | **Pattern validator and executor.** Validate ports and topology before spend; evaluate triggers at tick boundaries; one energy ledger per reservoir. | Budget the trigger checks per tick for idle. |
| MKR-IM5 | **Wear from use receipts, batched.** Condition updates per job or per fight, never per swing during offline catch-up. | Keeps offline cost bounded. |
| MKR-IM6 | **Knowledge store per item.** Fact IDs with fidelity tier and source route. UI reads only this store. Reveal cheats write here. | Shared with companions' reveal ladder and the cheat status window. |
| MKR-IM7 | **Legacy items wrap, not migrate.** Existing authored items (Springsteel brace, enemy drops) become fixed-definition envelopes. | No old save changes meaning. |
| MKR-IM8 | **Determinism.** Masterwork and flaw draws come from a stream keyed by job ID; previews draw nothing. | Matches P1 streams and the P40 determinism audit. |
| MKR-IM9 | **Combat must read the profile.** Today weapons are authored items; combat needs one adapter that reads derived reach, cut, thrust and durability. | Verify the current combat path before any weapon slice (lane W4). |
| MKR-IM10 | **Text from properties.** Item names and descriptions generate from properties and condition through a grammar pack, so MKR-SB1/MKR-SB2 come for free. | Shares story grammar packs. |
| MKR-IM11 | **Scale.** Thousands of items across worlds: index by owner and location, page lists, lazy-derive. | Pairs with [UI at scale](UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md). |
| MKR-IM12 | **Tests.** Conservation property tests, the exploit fuzzer (TL3), golden saves for each envelope version. | |

## AB. Abstractions needed

The point is to reuse records the other palettes already propose, not add a
"weapon system". Ranked by how many arts they unlock.

| Code | Abstraction | Shared by | Status |
|---|---|---|---|
| MKR-AB1 | **Process operator**: ordered operations with parameters, frozen execution terms and a resolver revision | Forge, brew, cook, inscribe, tan, cut gems | Proposed in audit and P6; unify into one |
| MKR-AB2 | **Assembly graph (L2)**: parts with typed sockets | Weapons, armor, tools, devices, golems, guns | Proposed in P6 |
| MKR-AB3 | **Pattern graph (L3)**: typed ports, triggers, energy payer | Runes, formations, talismans, circuits, traps, spell grammars | Proposed in P6 |
| MKR-AB4 | **Material record (L1)** with response tables per damage and process type | Everything | Five-record contract |
| MKR-AB5 | **Condition vector and wear law** | Weapons, armor, inscriptions, buildings, bodies | Partly in progression and assembly |
| MKR-AB6 | **Knowledge and fidelity store** | Items, companions, materials, people, secrets | Proposed in several docs; needs one owner |
| MKR-AB7 | **Derived profile adapter** per consumer (combat, work, social, travel) | Every item kind | Derived-snapshots work |
| MKR-AB8 | **Receipt log / biography** per entity | Items, companions, places | Story BI1 receipt log |
| MKR-AB9 | **Bond or attunement relation** between actor and item | Weapons, wands, zanpakuto, familiars | Shares the companions bond record |
| MKR-AB10 | **World law adapter** listing enabled operators and laws | All worlds | World core kit |
| MKR-AB11 | **Station with state** (forge, altar, workbench, array site) | All arts | RX4 station quirks |
| MKR-AB12 | **Entity reference scheme** | Everything above | Story BI1 |

The abstraction to avoid: separate weapon, armor and rune engines. Each is a
lane on MKR-OV1 and a combination of MKR-AB1 to MKR-AB4.

## Suggested order, if Weibao picks any

Proposal only.

1. Merge P2 mixing and the P1 streams first; both are prerequisites here.
2. Unify MKR-AB1 process operator and MKR-AB6 knowledge store, since every art and
   every reveal cheat leans on them.
3. Build P6 S3-A (two braces) and extend it with MKR-WC2 geometry and MKR-WC3 heat
   treatment, plus MKR-IM9's combat adapter, to get the first real weapon.
4. RC1 item window and RC10 uses-left counter as the first reveal cheats.
5. P6 S6-A work lamp, then MKR-RN1 rune language and MKR-RN4 triggers on the same graph.

Reference points (my knowledge, not verified this session): Tinkers' Construct
(part-built tools), Monster Hunter (monster-part weapons), Kingdom Come:
Deliverance (sharpening, forging), Noita (wand programming), Heaven's Vault
(inferring a script), RuneScape (runecrafting), Elden Ring (Ashes of War),
Skyrim (smithing and enchanting), Fallout 4 (mods), Dwarf Fortress (material
response, named artifacts).
