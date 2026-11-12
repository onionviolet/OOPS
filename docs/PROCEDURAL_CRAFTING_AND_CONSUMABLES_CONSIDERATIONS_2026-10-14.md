# Procedural crafting, potions and consumables: more to consider

> Codes renamed 2026-10-19 from CX1-CX10 to PCX1-PCX10 and AU1-AU5 to PAU1-PAU5 to avoid collision with registered CX (complexity guardrails) and AU (agent usage). See [reserved prefixes](RULES_INDEX.md#reserved-prefixes-2026-10-19).

Claude (root), 2026-10-14. A palette, not a spec. Nothing here is selected for a
build. Request: "Procedural stuff like crafting and potion and other similar stuff
and more? expand and consider accordingly?" (recorded in
[USER_VISION](USER_VISION.md)).

## What already exists (verified 2026-10-14)

Read these first; this doc does not restate them.

| Owner | Covers |
|---|---|
| [Materials and alchemy audit](PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) | Live code gaps, the five-record contract (material, batch, process, product, knowledge), worked potion, P5-P15 deeper systems, R1-R9 hazards |
| [Joined research](research/procedural-materials-2026-10-13/REPORT.md) and [deep report](research/procedural-materials-2026-10-13/deep/REPORT.md) | Four product logics, three generation modes, book-world laws, 85-card material coverage |
| [P6 creation systems](gm/dispatch/procgen-2026-10-13/p6/REPORT.md) | Smithing, tools/textiles, repair/salvage, cooking, coatings, patterns, agriculture, constructs, technique/pill invention, buildings, creative works, plus M1-M11 (fuel, containers, devices, cultures, instruments, vehicles, rituals, organizations, spatial goods, bodies, documents) |
| [P8 resources](gm/dispatch/procgen-2026-10-13/p8/REPORT.md) | Deposits, yields, ecology, creature and magical resources, logistics, idle gathering |
| [P11 more domains](gm/dispatch/procgen-2026-10-13/p11/MORE.md) | Services, research questions, apprenticeships, artifact provenance, maintenance; P5 owns item affixes and per-save unidentified appearances |

Sibling palette: [weaponcraft, runes and inscription](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) is canonical (lanes R1-R3 in `gm/dispatch/weaponcraft-runes-2026-10-14/`, UI-at-scale session). The reveal-cheats companion (merged there 2026-10-30, [Round 4](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md#round-4-the-three-companion-palettes-merged-here-2026-10-30)) holds the RV and XA codes cited below; its WR lanes were stopped.

Code state (updated 2026-10-14): P1-P4 merged into `codex/gameplay-foundations` as `4e13f97f`. Original note: P2 procedural Village mixing (ratio-sensitive generated potions, one
discovered property, timed repeat) is committed on branch `proc/p2-mixing`
(`f8fe6994`) and **not merged** into `codex/gameplay-foundations`. Nothing below
is implemented.

Standing rules apply to every entry: true properties work whether known or not,
reload never rerolls, no fixed "once" limits (per-world adjectives instead),
sealed secrets by ID only, comfortable idle play, desktop first.

## CO. More kinds of consumables

The P2 contract (composition, process, route, dose) already supports these; each
needs only its own consumer.

| Code | Consumable | What makes it distinct |
|---|---|---|
| CO1 | **Poisons and antidotes** | Antidotes neutralize a specific fraction (audit P4 rule), never "all poison". Delivery route matters: blade coat, food, gas. Detection by smell, taste test, assay or appraisal cheat. |
| CO2 | **Thrown and burst items** (bombs, smoke, flash, oil flasks, holy water) | Area route: effect spreads over targets and ground, not one body. Reuses fuel (P6 M1) and containers (M2). |
| CO3 | **Permanent elixirs and pills** | Stat or cultivation gains with a world law for diminishing returns, impurity buildup or bottleneck. Xianxia pill toxicity that must be refined out is a natural fit. |
| CO4 | **Tolerance, toxicity and exposure budget** | Witcher-style toxicity cap or per-body tolerance that rises with repeated use and decays over game time. Makes potion choice a loadout decision. Per-world: some worlds have none. |
| CO5 | **Mutagens and body-changing draughts** | Changes body, species traits or bloodline (ties [genetics](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md), [nonhuman bodies](worlds/NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md)). Reversible or not by world law. |
| CO6 | **Social consumables** (perfume, love draughts, truth serum, calming tea, liquid luck) | Effect lands on relationships, mood or a dialogue check rather than a vital. Consent and NPC suspicion are world-law questions, not bans. |
| CO7 | **Baits, lures, repellents and animal feed** | Consumer is creature behavior or a pet/familiar. Pairs with P8 creature resources and taming. |
| CO8 | **Scrolls, talismans and one-shot charges** | A pattern (P6 X5) on a carrier that is spent on use. Charge owner shared with the pattern system. |
| CO9 | **Ammunition and coatings by the stack** | Arrows, bullets, darts carry a coating batch; finite uses per coated stack. |
| CO10 | **Mind and dream substances** (incense for meditation, dream tea, insight draughts) | Effect on training speed, dreams (P11 N7), memory or comprehension. Good idle lever: brew before a long offline-free session of practice. |

## FE. How crafting feels to play

| Code | Idea | Why |
|---|---|---|
| FE1 | **Ingredients as moves on a map.** Each ingredient pushes the brew in a direction on a property map; the player plots a route to a target region (Potion Craft's core idea). Mixing ratios become a visible path. | Turns the composition math into something readable at a glance. A UI over P2, not a second chemistry. |
| FE2 | **Synthesis grid or slots.** Place ingredients into shaped slots where adjacency and element links add traits (Atelier Ryza style). | A different, more puzzle-like front end over the same resolver. Optional per station. |
| FE3 | **Learn by tasting or touching.** Eating a raw ingredient reveals its first property (Skyrim style). Tasting has the ingredient's real side effects. | The cheapest discovery route, always available, with honest cost. |
| FE4 | **Experiment journal that suggests.** The journal lists what's unknown and proposes the next test that would split two hypotheses (audit P8). | Research becomes guided, still never free identification. |
| FE5 | **Interesting failures.** A failed brew is a new, often useful thing: a smoke bomb, a fertilizer, a dye. Name it from what the player knows. | Noita lesson. Failure as content, not waste. |
| FE6 | **Active and idle modes for the same recipe.** Hand-brew for control and bonus precision; queue a learned method for steady output. Neither is mandatory. | Matches comfortable idle play. Audit P9/P10 own the queue. |
| FE7 | **Tiny moment-to-moment choices.** Stir timing, heat dial, when to stop simmering. Each maps to one process variable that a rule actually reads (audit P6: no empty controls). | Gives active crafting texture without a minigame per station. |

## MK. The maker's identity

| Code | Idea | Notes |
|---|---|---|
| MK1 | **Signature style.** A crafter's habits (preferred process, favored ingredient, typical ratio) show in their products and are recognizable to experts. | NPC makers get one from P4 data; the player's emerges from actual use. |
| MK2 | **Maker's marks and provenance.** Products record who made them; reputation attaches per product line. | Builds on P11 M9 artifact biographies. |
| MK3 | **Masterworks from saved draws.** Rare exceptional results come from a committed stream draw plus skill, never a reroll on reload. Masterworks get names and histories. | Excitement without savescum. |
| MK4 | **Specialization and schools.** Herbalist vs alchemist vs pill refiner vs apothecary: different process access and precision, same materials. Schools teach a style (P11 M4 apprenticeships). | Several progression paths, as the vision asks. |
| MK5 | **Recipe secrecy.** Guild secrets, family formulas, stolen notebooks, reverse-engineering a rival's product by assay. | Knowledge is an owned object; links P6 creative works (manuals). |
| MK6 | **Commissions with specs.** An NPC asks for "something to keep my son awake for the exam, nothing bitter". The request reads actual properties, so many solutions pass. | Turns the resolver into quest content (P11 N1). |

## IT. Items over time

| Code | Idea | Notes |
|---|---|---|
| IT1 | **Aging and maturing.** Some products improve with time: wine, aged pills, cured salves, seasoned wood. Others spoil (audit P14). Per-material law. | Rewards stockpiling and patience, a natural idle hook. |
| IT2 | **Items that grow with use.** A blade that drinks blood, a cauldron that remembers brews and improves at them, a staff that bonds. | I13 evolving items; reads actual use receipts. |
| IT3 | **Sentient or awakened items** in worlds that allow it. Personality from history. | Constructs owner (P6) for the actor side. |
| IT4 | **Curses and blessings from events.** An item used in a murder or a miracle gains a lasting property (story H4 residue). | Event writes a property; the material truth changes once, saved. |
| IT5 | **Heirlooms.** Products pass through inheritance and prestige (story G3, L2). | Needs prestige-carryover policy per item. |

## WL. World-specific crafting laws

These are public franchise mechanics, not sealed truths. Each world adapter
declares which laws apply; the shared resolver stays the same. Cross-check the
world folder and [P9](gm/dispatch/procgen-2026-10-13/P9.md)/[P10](gm/dispatch/procgen-2026-10-13/P10.md)
profiles before building.

| Code | World | Law worth modeling |
|---|---|---|
| WL1 | Lord of the Mysteries | Beyonder potions are exact-formula, conserved characteristics (research B4), and "digestion by acting" means the potion's full benefit arrives through role-play behavior over time. Wrong formula or undigested advancement risks loss of control. |
| WL2 | Xianxia/cultivation worlds | Pill refining with pill grade, pill fire control, impurity, and heavenly signs for high grades. Pill toxicity accumulates (CO3/CO4). |
| WL3 | Harry Potter | Exact recipes with ordered steps, stir counts and timing; ingredient provenance matters (research B1). Improvised margins work for skilled brewers (the Half-Blood Prince's notes). |
| WL4 | Fullmetal Alchemist | Equivalent exchange: transmutation conserves mass and type; circles define the pattern. A natural fit for the conservation checks already required (audit R4). |
| WL5 | Witcher-like worlds | Toxicity cap, mutagens, oils per monster type, decoctions. Pure CO4 plus coatings. |
| WL6 | D&D 2024 | Abstract crafting: tool proficiency, material budget, work time (research B2). The resolver can run in "budget mode" with no composition at all. |
| WL7 | Demon Slayer, JJK, Fate | Materials with a single exact source (sun-steel ore, cursed tools, mystic codes). Mostly P4 exact identity, little mixing. |
| WL8 | Original worlds | Free to define new laws: alchemy powered by emotion, potions that only work at the hour they were brewed, recipes that change with the moon. One small original law per world keeps them distinct. |

## CT. Cheats that touch crafting

Fits the [cheat library](CHEAT_LIBRARY.md) and status window work. Each cheat
declares how it interacts with conservation and observation laws.

| Code | Cheat | Interaction |
|---|---|---|
| CT1 | **Appraisal / identify** | Reads true properties through an allowed observation route. Levels reveal more fractions. Never shows sealed truths outside their route. |
| CT2 | **Perfect craft** | Removes execution variance (precision max), not material truth. A bad recipe still makes a bad potion perfectly. |
| CT3 | **Duplication or storage-copy** | Breaks conservation on purpose. Must be an explicit per-cheat law with its own cost or limit adjective, so the rest of the economy stays coherent. |
| CT4 | **Recipe sense / system shop** | Shows recipe outlines or sells ingredients from outside the world. Imported materials still need local compatibility (research F2). |
| CT5 | **Absorb and analyze** (Tensura-style) | Consuming a material grants its property to the body or to a synthesis skill. Ties the absorb-all dispatch. |
| CT6 | **Fusion** | Combine two finished items into one, keeping selected traits. A product-to-product rule, not raw chemistry. |

## PAU. Automation and idle production

Audit P9/P10 own learned procedures and queues. These extend them.

| Code | Idea | Notes |
|---|---|---|
| PAU1 | **Standing orders with thresholds.** "Keep 10 healing draughts; brew when below 5; stop if herb stock falls under 3." | The main idle crafting control. Stops on shortage, never silently substitutes. |
| PAU2 | **Production chains.** Grow herb, dry it, extract, brew, bottle, sell; each stage a station with a queue. | P6 buildings and P8 logistics own stations and transport. |
| PAU3 | **Workshop staff.** Hired or apprenticed NPCs run learned methods at their own skill, with their own style (MK1) and mistakes. | P4 people as workers; wages and loyalty real. |
| PAU4 | **Quality targets.** A queue can accept only output above a threshold and route the rest to a cheaper use (fertilizer, practice). | Uses FE5 failures. |
| PAU5 | **Batch planner.** Given stock, shows which known recipes are makeable and how many, with a known-effects preview. | Pure UI over the resolver's preview, which already must not spend or reroll. |

## EC. Economy around crafted goods

P11 N2 owns markets. These are crafting-specific.

| Code | Idea | Notes |
|---|---|---|
| EC1 | **New product, new demand.** A potion nobody sold before creates a market slowly as people try it. Early sales are cheap; reputation builds price. | Story J1 booms and busts from actual supply. |
| EC2 | **Copycats.** NPC makers reverse-engineer a popular product over time; the player's edge decays unless they innovate or protect the formula (MK5). | Living competition. |
| EC3 | **Counterfeits and adulteration.** Diluted or fake goods in markets; appraisal and maker's marks matter. | Only where a world authors fraud. |
| EC4 | **Fads and seasons.** Demand shifts by festival, disaster or plague (P11 N8/N9). A plague creates a research race for a cure. | Ties disasters to crafting stakes. |
| EC5 | **Ingredient speculation.** Rare herbs bloom on seasons; stockpiling, futures, cornering a market. | Optional depth for players who like trading. |

## SO. Crafting in the social web

| Code | Idea | Notes |
|---|---|---|
| SO1 | **Gifts that read the person.** A crafted gift's actual properties meet the recipient's tastes (sweet tooth, allergy, hates bitterness). | Turns crafting into relationship play. |
| SO2 | **The village healer role.** Being the one who makes medicine changes how people treat the player, who comes calling and what they owe. | Life-sim core. |
| SO3 | **Contests and exams.** Alchemy tournaments, guild certification, pill-refining contests in sects. | Story B2 exams with a crafting judge reading real properties. |
| SO4 | **Plots that use potions.** Poisoning, sleeping draughts at a wedding, a love potion gone wrong. NPCs can do this too, using the same rules. | Story I/G threads with real chemistry. |

## TL. Tools for the creative director

| Code | Idea | Notes |
|---|---|---|
| TL1 | **Recipe sandbox.** Dev panel: drop any ingredients and process, see the resolved product, cause trace and effects, no stock spent. | The resolver's preview with every truth shown. Dev only, never in player UI (sealed rule). |
| TL2 | **Coverage report.** Headless scan of how many distinct products are reachable from current ingredients, which properties no rule reads (dead tags), and which ingredient is never worth using. | Keeps the combinatorics honest. Pairs with story P18 QA. |
| TL3 | **Exploit fuzzing.** Search mix/split/dilute/separate loops for free mass, infinite value or duplicate catalysts. | Automates audit R4 conservation checks. |
| TL4 | **Ingredient packs.** Versioned per-world material packs Weibao can switch on, with agents authoring new ingredients on request through a lint gate. | Same shape as story K2/K3 content packs. |

## Suggested order, if Weibao picks any

Proposal only.

1. Merge P2 mixing (`proc/p2-mixing`) after its browser proof, since every entry
   above builds on it.
2. TL1 recipe sandbox and PAU1 standing orders. The first makes tuning fast; the
   second makes crafting pleasant in idle play.
3. FE1 property map as the visible front end, plus FE5 interesting failures.
4. CO1 poisons/antidotes and CO4 tolerance, the two consumable kinds that add
   the most decisions for the least new code.
5. One world law (WL1 LOTM digestion or WL2 pill refining) as the first proof
   that a world adapter changes how the same resolver plays.

Reference points (my knowledge, not verified this session): Potion Craft
(ingredient-path map), Atelier Ryza (synthesis grid), Skyrim (learn by eating,
four-effect ingredients), The Witcher 3 (toxicity, oils, decoctions), Noita
(material reactions), Potionomics (crafting plus market and social play),
Minecraft brewing (modifier ingredients).

---

## Round 2 (2026-10-14): more to consider

Request: "more to consider? other stuff and more? save and extend accordingly Send
out codex as usesfule Merge stuff and more?" Lanes CR1 to CR4 in
[procgen wave 1](gm/dispatch/procgen-2026-10-13/PLAN.md) deepen these sections;
P1 to P4 integration runs separately.

## RX. Place, time and conditions

| Code | Idea | Notes |
|---|---|---|
| RX1 | **Where you brew matters.** Ley lines, holy ground, a volcano's heat, a cursed swamp or a sect's spirit vein change process outcomes through a declared site law. | Reuses P11 context snapshot; only sites with a law have an effect. |
| RX2 | **When you brew matters.** Moon phase, season, festival night or the hour of a star alignment gate or boost certain processes. | Calendar exists; a rule reads it. Gives idle timing decisions. |
| RX3 | **Harvest timing and handling.** Picked at dawn, before rain, by silver knife, fresh or dried: provenance becomes batch properties (research B1). | P8 harvest yields own collection; this is the property side. |
| RX4 | **Station tiers and quirks.** A cracked cauldron leaks a trace of the last brew; a master's furnace has a famous temperament. Stations carry state. | Contamination is a real constituent, not flavor text. |

## KN. Knowledge and its flaws

| Code | Idea | Notes |
|---|---|---|
| KN1 | **Old recipe books with errors.** Found recipes may be incomplete, mistranslated, regional or deliberately sabotaged. Following them faithfully gives the real result of what's written. | P6 creative works and P11 N6 libraries own the object. |
| KN2 | **Folk remedies.** Village wisdom that's partly right; testing shows which part works. Per-world law decides whether belief itself matters. | Good early-game discovery content. |
| KN3 | **Partial recipes as quest hooks.** Half a formula from a dying master; the other half is in a rival sect's library. | Story A2 hooks and P12 arcs. |
| KN4 | **Teaching loses or adds detail.** A student's copy of a method may drift, simplify or improve. Lineages of a recipe form. | Ties MK1 style and story G3 lineages. |

## SC. Scale

| Code | Idea | Notes |
|---|---|---|
| SC1 | **Not every process scales.** Doubling a batch may lose precision, need a bigger vessel, or change heat behavior. Per-process scale law. | Stops "make 1000" from being free while keeping it reachable. |
| SC2 | **Village to region production.** A plague needs hundreds of doses: staff, stations, supply and logistics become the challenge. | PAU2 chains plus P8 logistics. |
| SC3 | **Tiny-scale precision.** Some outputs need micro-doses or perfect purity; scale down is its own skill. | Pills, poisons, catalysts. |

## RS. Risk in the workshop

Per-world adjectives, never mandatory danger rolls. Solo player: risk is content,
not anti-abuse.

| Code | Idea | Notes |
|---|---|---|
| RS1 | **Accidents from real chemistry.** Unstable mixes can burn, explode or release fumes because their properties say so, not because of a hidden failure roll. | Audit P15: ignorance doesn't add an unrelated danger roll. |
| RS2 | **Exposure over time.** Long work with toxic materials affects the crafter's body (CO4 tolerance applies to fumes too). Gear and ventilation help. | Gives safety equipment a real consumer. |
| RS3 | **Workshop contamination.** Spills persist until cleaned; they can taint later batches (RX4). | Maintenance tasks (P11 M13). |
| RS4 | **Safe mode by world.** Cozy worlds can mark accidents as mild or off; grim worlds keep them sharp. | A world adjective, player-visible. |

## PG. Generated ingredients

| Code | Idea | Notes |
|---|---|---|
| PG1 | **Regional flora and fauna** generated from families with correlated traits, grammar names and a look (research P6/P7, audit P7). | Seeded once per world, saved. |
| PG2 | **Field guide and herbarium.** Collecting specimens fills a guide with what you've observed, including uncertainty and sketches. | A collection loop that also teaches chemistry. |
| PG3 | **Rare variants.** Mutated or blessed specimens of a common plant with one shifted property. | Excitement during gathering; stable once found. |
| PG4 | **Cultivated strains.** Breeding herbs for higher yield of one fraction (P6 agriculture, genetics doc). | The player's own named cultivar. |

## CL. Collection and completion

| Code | Idea | Notes |
|---|---|---|
| CL1 | **Potion codex.** Every distinct product type the player has made or seen, grouped by family, with discovery percentage per world. | Classic idle collector pull. Never reveals unseen entries' truth. |
| CL2 | **Milestones that unlock methods.** Discovering 5 sedatives teaches a general sedative principle that improves predictions. | Knowledge compounding, not stat padding. |
| CL3 | **Rival collectors.** NPCs who trade, steal or compete for rare specimens and recipes. | EC and SO crossover. |

## XD. Cross-domain combinations

| Code | Combo | Payoff |
|---|---|---|
| XD1 | Alchemy + patterns | Enchanted potions: a rune in the vial changes delivery or duration. |
| XD2 | Alchemy + cooking | Medicinal meals, tonic soups, pills baked into buns. Food stays optional (no hunger death). |
| XD3 | Alchemy + genetics | Bloodline-awakening elixirs, crossbreeding aids for companions. |
| XD4 | Alchemy + companions | Pet tonics, familiar treats, beast-taming potions; species response differs. |
| XD5 | Alchemy + smithing | Quench oils that change blade properties; acid etching; alloy flux. |
| XD6 | Alchemy + cheats | A status window that names a potion's effects the moment it's brewed, at the observation level the cheat grants. |

## NP. NPC crafters on the same rules

| Code | Idea | Notes |
|---|---|---|
| NP1 | **NPCs use the same resolver.** Village alchemists, sect pill masters and rival makers craft from real stock with real skill. Their mistakes are real too. | Story SO4 plots follow naturally. |
| NP2 | **Supply webs.** The herbalist's output feeds the apothecary, who supplies the guard. Player disruption ripples. | P8 trade supply. |
| NP3 | **Teaching the village.** The player can teach recipes and change local health, economy and culture over years. | Story H2 changing settlements. |

## PR. Prestige and carryover

| Code | Idea | Notes |
|---|---|---|
| PR1 | **What survives prestige.** Notebook knowledge, muscle memory (precision), learned methods, a famous brand, or nothing, per world and per cheat. | One prestige layer in milestone 1; this decides its crafting content. |
| PR2 | **Old-life products as relics.** A potion from a previous life, still on a shelf, now legendary. | IT5 heirlooms. |

## Round 2 suggested order

Proposal only. After the P1 to P4 integration lands, the biggest gain for the
least new code is CL1 (potion codex) plus PG2 (field guide) for collector pull,
RX2 (brew timing) as a cheap idle decision, and NP1 so the village's own makers
run on the P2 resolver.

---

## Round 3 (2026-10-14): comic worlds, reveal cheats, subtle and overarching

Request: "Considering comic worlds and stuff and more? ... Cheats that would show
stuff like these and more? ... Subtle stuff too? Overarching stuff? Implementation
implciations and more? Abstaction thats needed? Merging, commiting or pushing?"

Division of work: the [comic worlds palette](COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md)
(another session, lanes K1-K6) owns comic traditions, industry laws (CL), comic
cheats (CK) and comic presentation. The canonical [weaponcraft palette](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md)
owns weapons and runes (lanes R1-R3); its reveal companion (merged there, [Round 4](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md#round-4-the-three-companion-palettes-merged-here-2026-10-30))
holds reveal cheats RV1-RV8 and abstractions XA1-XA8 (WR lanes stopped). This round adds only the **making** side of comics and what CR1-CR4 found.

CR1-CR4 finished (docs only): [CR1 consumables](gm/dispatch/procgen-2026-10-13/cr1/REPORT.md),
[CR2 world laws](gm/dispatch/procgen-2026-10-13/cr2/REPORT.md),
[CR3 play and tools](gm/dispatch/procgen-2026-10-13/cr3/REPORT.md),
[CR4 makers and economy](gm/dispatch/procgen-2026-10-13/cr4/REPORT.md). Their top
picks: CR1 poison/antidote with dose; CR2 one world adapter at a time; CR3
notebook/codex with one paid comparison test; CR4 a funded spec commission.

Evidence: comic rows are MEMORY (my recall, unchecked this session). Lane CR5
checks them. Direct franchise versions go in the private pack per PROJECT.md.

## CM. Making things in comic worlds

| Code | Pattern | Example (MEMORY) | What it adds to our rules |
|---|---|---|---|
| CM1 | **Iterating suits and gadgets** | Iron Man's numbered armors | Versioned products: each mark keeps history, parts carry forward, older marks stay usable. Lineage on one maker's own designs. |
| CM2 | **Prep time as power** | Batman's utility belt and contingency plans | A loadout prepared before a fight with known counters; preparation needs intel about the target. Idle-friendly: prepare while away. |
| CM3 | **The unrepeatable formula** | Super-soldier serum, lost with its inventor | Uniqueness law: a product whose method is lost or sealed; copies are partial, unstable or monstrous. Great quest and rival engine. |
| CM4 | **Wonder metals** | Vibranium, adamantium, uru | Exact-identity materials with one source, geopolitics around the deposit, and properties no substitute matches. |
| CM5 | **Color-variant families** | Kryptonite colors | A generated material family where each variant has one distinct, consistent effect on one kind of body. Fits PG1 and CO5. |
| CM6 | **Comic-book science accidents** | Gamma, cosmic rays, radioactive spiders | Comic CL16 applied to the lab: a severe accident can grant a power instead of killing, at a per-world rate. RS1 risk becomes an origin story. |
| CM7 | **Personal signature consumables** | Spider-Man's web fluid | A self-invented formula only the maker refills; supply is a daily concern and a weakness if the lab is lost. |
| CM8 | **Villain chemistry and antidote races** | Fear toxin, laughing gas, Venom (Bane) | NPC makers (NP1) create world threats; the player researches an antidote under a timer. Uses CO1 and FE4. |
| CM9 | **Willpower and emotion constructs** | Lantern rings | Making without materials: a construct shaped by a stat and an emotion, lasting while focus holds. A pattern with a mental fuel (RN4). |
| CM10 | **Size and mass tricks** | Pym particles | A consumable that changes scale; SC laws apply to the body, not the batch. |
| CM11 | **Living gear** | Symbiotes, organic suits | An item that is also a body with wants (IT3, companions doc). Bond and rejection. |
| CM12 | **Alien tech salvage** | Post-invasion tech, black markets | Reverse-engineering unknown devices (X7 salvage plus KN1); regulators and clean-up crews compete for it. |
| CM13 | **Licensed support gear** | My Hero Academia support companies | Regulated crafting: hero licence plus support licence, sponsor companies, approval paperwork, patent rivalry. |
| CM14 | **One-per-eater consumables** | Devil Fruits (One Piece manga) | A conserved unique power in edible form; one per body; returns to the world when the holder dies. Uniqueness registry plus reincarnating item. |
| CM15 | **System shop potions** | Solo Leveling, webtoon hunter worlds | Bought from a System, graded (E to S), with a market for hunter drops. Abstract budget mode (WL6) with System pricing. |
| CM16 | **Magic potion with an exception** | Asterix | A village-held potion; one person permanently saturated and forbidden more. Tolerance (CO4) as a story rule. |

## CK-X. Cheats that show making stuff

These extend comic CK1-CK22 and weapon RV1-RV8; each is a lens writing to the P2
knowledge store, never a direct truth dump.

| Code | Cheat | Shows | Extends |
|---|---|---|---|
| PCX1 | **Workshop AI** (JARVIS-like) | Suggests designs, simulates a build before spending stock, warns of failure modes | RV6 analysis advisor, FE4 journal |
| PCX2 | **HUD overlay** | Live readouts on any device or potion in view: charge, dose, wear | RV3 status view, at range |
| PCX3 | **Forensic lab** (Batcomputer-like) | Reconstructs how a crime-scene residue was made and by whom | RV2 tracing, MK1 signatures |
| PCX4 | **Blueprint sight** | The schematic of any device you hold, including hidden compartments | RV2, CM12 salvage |
| PCX5 | **Danger sense for mixes** (spider-sense-like) | A tingle before an unstable combination, without saying why | RS1, honest partial info |
| PCX6 | **Power Grid for products** | Comic CK1's six ranks applied to items: durability, energy, utility | CK1 |
| PCX7 | **Recipe ghost** | See the last person who brewed at this station and what they made | RX4 station memory, RV8 |
| PCX8 | **Uniqueness radar** | Know when a one-of-a-kind item or formula changes hands in the world | CM3, CM14 |
| PCX9 | **Copy-by-touch** | Learn a product's method by consuming or touching it, at a cost | CT5 absorb |
| PCX10 | **Grade window** | System-style E-S grades with a hidden true value the grade rounds | CM15, R3 naming leaks |

## SU. Subtle making details

| Code | Detail |
|---|---|
| SU1 | **Look-alike twins.** A harmless herb and a toxic twin differ in one small observable feature. Knowing the tell is real knowledge. |
| SU2 | **Brews that announce progress.** Smell, color, bubbling and sound change as fractions convert; a trained nose reads it (only where a world's law makes the tell reliable). |
| SU3 | **Settling layers.** A vial left still separates into visible bands that match its real fractions; shaking mixes them again. |
| SU4 | **Hands that remember.** Residue, stains, burns and calluses show what someone works with; NPCs notice a poisoner's hands. |
| SU5 | **Fatigue in precision.** Long sessions cost steadiness; the twentieth vial is a little worse than the first unless the crafter rests. |
| SU6 | **Labels and handwriting.** Hand labels can smudge, be mislabeled or forged; a maker's hand is recognizable. |
| SU7 | **Gadget wear patterns.** A grip polished by one hand, a scuffed side from a habit; tells an expert who owned it. |
| SU8 | **Quiet expiry tells.** Clouding, a skin on the surface, a sour note: freshness shows before numbers do. |
| SU9 | **"Where did you learn that?"** NPC experts recognize a school's method from the product and ask, opening KN and MK5 threads. |
| SU10 | **Comic tells for crafted things.** A suit's new mark gets a cover moment; a destroyed gadget gets a silent panel (comic CS4/CS5). |

## OA. Overarching

| Code | Point |
|---|---|
| OA1 | **One making contract for everything.** Potions, meals, weapons, runes, gadgets and suits share inputs, process, product identity, knowledge and publication. Families add layers (composition, parts, inscription, bond), never parallel item systems. |
| OA2 | **NPC parity.** NPC makers use the same resolver, stock and stations. Comic villains' chemistry (CM8) and village healers run on the same rules as the player. |
| OA3 | **Uniqueness is a world law.** Some things exist once (CM3, CM4, CM14). A registry, not a hidden "once" flag; per-world adjectives decide how unique. |
| OA4 | **Comic continuity meets items.** Status-quo pull, reboots and retcons (comic CL1, CL4, CL5) need an item policy: does the suit survive a reboot, does a retcon change what a potion did? Player-earned items should be protected unless the player opts in (comic CO5). |
| OA5 | **Knowledge, not truth, is what the player sees.** Every cheat in PCX and RV is a lens with scope and error that writes to knowledge. |
| OA6 | **Idle making is learned methods.** Standing orders and NPC staff run saved methods (PAU); active play discovers and refines them. |

## II. Implementation implications, against the merged P2 code

P2 is now on `codex/gameplay-foundations` (`4e13f97f`). What exists and what is
missing, from reading `src/mixture_state.js` and `src/mixture_native.js`:

| Code | Implication |
|---|---|
| II1 | **The resolver is pure and seeded** (`resolveMixture`, `localMixtureSeed`); keep it that way so NPCs (OA2), previews and sandboxes (TL1) call it freely. |
| II2 | **Product identity is one owner** (`MIXTURE_ID`, `mixtureKey`/`productFromKey`). It is Village-mixture-specific. Generalizing to other families means a product-family registry keyed by family ID, with P2 as the first entry, not a second inventory path. |
| II3 | **Exposure is a single replace policy** (`mixtureExposure`, `validateExposure`, `policy:'replace'`). CR1's poison/antidote, tolerance and stacking need effect families and an exposure ledger per body. |
| II4 | **Staging and publication** (`stageMixtureAction`, `commitMixturePlan`) are the right seam for every making family and for NPC makers; reuse them rather than writing per-family save code. |
| II5 | **Knowledge is per player today.** Lenses (PCX, RV), NPC knowledge (SU9) and codex views (CR3 S1) need knowledge scoped by observer. |
| II6 | **Ingredients are a fixed list** (`INGREDIENTS`). Generated families (PG1, CM5) need a material catalogue with revisions, as the audit's R6 asks. |
| II7 | **Uniqueness registry** (OA3) is new: a saved world-scoped record of one-of-a-kind items and formulas, checked at generation and transfer. |

## AB. Abstractions still needed (beyond WR XA1-XA8 and comic CA1-CA10)

| Code | Abstraction | Why |
|---|---|---|
| AB1 | **Product family registry** | II2: lets potions, meals, gadgets and suits share identity, keys, presentation and validation. |
| AB2 | **Exposure ledger** | II3: per-body dose history, tolerance, toxicity and effect families with stacking policies. |
| AB3 | **Observer-scoped knowledge** | II5: player, NPCs and cheat lenses each know different things about one product. |
| AB4 | **Maker actor** | OA2: any actor (player, NPC, staff, construct) runs a method with its own skill, stock and station access through the same staging. |
| AB5 | **Uniqueness registry** | OA3, CM3, CM14. |
| AB6 | **Continuity policy for items** | OA4: how reboots, retcons and status-quo pull treat owned products. |
| AB7 | **Versioned design lineage** | CM1, KN4, MK: a design that evolves through numbered versions and copies. |

WR4 was stopped; lane CR6 maps AB1-AB7 and XA1-XA8 onto P2 and aligns with the
canonical weaponcraft lanes R1-R3 where they define item identity.

## Round 3 suggested order

Proposal only. First CR3 S1 (notebook/codex with one paid comparison) and CR1 S1
(poison/antidote), built on AB2 and AB3, because every reveal cheat and every
later family needs the exposure ledger and observer-scoped knowledge. Then AB1 so
the second family (a meal or a gadget) reuses P2's identity. Comic making (CM)
waits for a comic world to be selected; CM2 prep loadouts and CM7 signature
consumables also work in original worlds.

## Round 3 lane returns (CR5, CR6)

[CR5](gm/dispatch/procgen-2026-10-13/cr5/REPORT.md) source-checked all 27 CM/PCX
rows ([SOURCED_CHECK](gm/dispatch/procgen-2026-10-13/cr5/SOURCED_CHECK.md)) and
added 15 making patterns, 12 reveal cheats and 12 subtle details. Corrections to
this palette:

| Code | Correction |
|---|---|
| CR5-C1 | "Only one source" claims are too strong. State the exact recipe, origin, identity, authority or body requirement instead; scarce know-how is not automatically AB5 uniqueness. |
| CR5-C2 | Character rank, hunter licence, item grade and measured strength are separate things; a printed grade (CM15, PCX10) does not set world odds or output strength. |
| CR5-C3 | Pin a continuity before using canon: comic versus film suits, New Earth versus Prime Earth, manga versus anime, main webtoon versus sequel, album versus film. |
| CR5-C5 | PCX1-PCX10 and SU10 are original proposals, not canon abilities, unless a selected scene proves one. Analogues stay useful. |

CR5's top original-world picks: a refillable signature-fluid kit, a design-version
comparison bench, a hired collaborator workshop, a temporary strength pill for one
real job, and a forged magic key bound to one lock.

[CR6](gm/dispatch/procgen-2026-10-13/cr6/REPORT.md) wrote the build packet
([REGISTRY](gm/dispatch/procgen-2026-10-13/cr6/REGISTRY.md),
[EXPOSURE](gm/dispatch/procgen-2026-10-13/cr6/EXPOSURE.md),
[KNOWLEDGE](gm/dispatch/procgen-2026-10-13/cr6/KNOWLEDGE.md),
[SLICES](gm/dispatch/procgen-2026-10-13/cr6/SLICES.md)). It refines the round 3
order: a **minimal registry adapter with P2 as entry one goes first** (so the next
family doesn't create a second key/use/save path), then poison/antidote with dose,
stacking and specific neutralization, then the observer notebook with a paid
comparison test. Item identity aligns with maker-arts W4 and weaponcraft R1;
CR6's knowledge and receipts are narrow adapters, not new universal services. Top
risks: version drift between registry and P2 data, effects expiring twice across
clocks, partial publication, and hidden chemistry leaking through keys, sorting or
tooltips. Remaining gate for any builder: rebuilt port 21700 at 1366x768 and
1600x1000 with Save/reload/Export/literal Import and old-save compatibility.

## Fold: maker-arts W1-W7 and weaponcraft R1-R3 (2026-10-14)

These lanes belong to the weaponcraft owner session; its
[canonical palette](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md)
and maker-arts palette (merged there, [Round 4](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md#round-4-the-three-companion-palettes-merged-here-2026-10-30))
own their content. This section records only how they relate to crafting codes
here. Everything stays proposal.

| Lane | Adds to this palette | Duplicates | Contradicts or corrects |
|---|---|---|---|
| [W1 maker arts by world](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md) | Weapon/armor/rune laws for all 25 world folders and 17 full-book folders; fabrication, exact identity, ownership, bond and fuel kept distinct | WL1-WL8, CR2 world laws (both now point here for weapons) | Of 11 memory rows, 4 confirmed and 7 corrected. Legendary Mechanic blueprints come from combining knowledge and talents, not fusing two finished blueprints. CT6 fusion stays an original idea. |
| [W2 rune language](gm/dispatch/maker-arts-2026-10-14/W2_REPORT.md) | Runes as programs with execution traces and failures | XD1 enchanted potions only as a pointer | None |
| [W3 reveal cheats](gm/dispatch/maker-arts-2026-10-14/REVEAL_CHEATS.md) | RC1-RC16 plus 12 additions, with status-text samples and companion ladders | CT1 appraisal, PCX1-PCX10 and RV1-RV8 overlap in purpose | None. Rule here: CX rows are making-specific lenses, and RC is the general item lens set. CR5-C5 still applies: both are original unless a scene proves it. |
| [W4 implementation](gm/dispatch/maker-arts-2026-10-14/IMPLEMENTATION.md) | AB1-AB12 with live file:line evidence; PS1-PS5 ordered slices | II1-II7 analysis of P2 | **Code collision:** W4's AB1-AB12 is maker-arts-local. Crafting AB1-AB7 here map as below. **Build order:** W4 starts with braces, repair, blades, appraisal and a work lamp; CR6 starts with the registry adapter, then poison/antidote, then the notebook. Both are reachable and selectable separately. CR6 adopts W4's identity contract (ID1-ID5). |
| [W5 micro craft](gm/dispatch/maker-arts-2026-10-14/MICRO_CRAFT.md) | 80 sourced text cues (SB13-SB92) across ten crafts | SU1-SU9 cover the same idea for potions | None; SU stays potion-side and SB covers the other crafts |
| [W6 other arts](gm/dispatch/maker-arts-2026-10-14/OTHER_ARTS.md) | 12 more arts, 16 game references, worked joins (ceramic containers, hauling frames, training as bond) | P6 M1-M11, CO kinds | None |
| [W7 item lifetimes](gm/dispatch/maker-arts-2026-10-14/ITEM_LIFETIMES.md) | LT1-LT12 lifetimes, a three-generation weapon biography, carryover matrix CR1-CR8 | IT1-IT5, PR1-PR2, MK2 | None. Note: W7's "CR1-CR8" are carryover rows, not crafting lanes CR1-CR6. |
| [R1 weapons by world](gm/dispatch/weaponcraft-runes-2026-10-14/) | Recorded W1 as its source-world replacement | W1 | None |
| [R2 game references](gm/dispatch/weaponcraft-runes-2026-10-14/R2_REPORT.md) | Top 10 (Tinkers' Construct, Ars Nouveau, Noita, Atelier Ryza, ...), GX1-GX10; suggests absorbing GX1-3, GX5, GX7 and GX8 | FE1/FE2 reference list | GX5/GX6: old paid items under revised rules need pinning or migration, never silent rerolls. Same rule as audit R6. |
| R3 shared abstraction | Stopped as a duplicate of W4 | | |

**Code map, crafting AB to maker-arts W4 AB:** AB1 product family registry
covers W4 AB12 entity refs and AB4 material/batch. AB2 exposure ledger extends W4
AB7 consumer profile and is new for doses. AB3 observer knowledge is W4 AB6. AB4
maker actor joins W4 AB1 process and AB11 station. AB5 uniqueness registry has no
W4 counterpart and is new. AB6 continuity policy and AB7 design lineage build on
W4 AB8 history.

**Top picks after the fold:** CR6's registry adapter, then CR1-S1 poison/antidote,
then CR3-S1 notebook, for potions; W4 PS1 braces for equipment, on the same
registry. W3's RC1 appraisal is the first lens either path uses.


## Content reconciliation B337: whole palette, later corrections and local mechanisms

The complete original466-line owner was reviewed: all first-round tables, Round2, all comic/making/abstraction rows, CR5/CR6 returns and the entire maker-arts/weaponcraft fold and code map. Retain every local code and original lane locator. The prefix rename means the W3 row's residual “CX rows” refers to PCX making lenses here, not the registered complexity-guardrail family. Crafting AB1–AB7, W4 AB1–AB12, comic codes and W7 carryover CR rows remain source-local families, not interchangeable registered rules.

The code-state paragraph already contains both a later merged P2 statement and its original not-merged note. The original note is history, not a current merge conflict. “Nothing below implemented” and fixed-ingredient/observer/exposure absence claims describe the inspected revision; this read does not establish their present truth or every later linked lane's runtime state. The one-prestige milestone in PR1 is superseded by October24 direction. The successive mixing→sandbox→toxicity, codex→poison, registry-first and braces-first orders are proposals with different selected consumers, not cumulative mandatory prerequisites. Current LOTM-first/Harry developer priorities and AD51 govern actual selection.

Preserve the five-record distinction and one authoritative identity/stock path, without requiring every world to use one chemistry. OA1/II4's broad making contract is a useful shared seam where actual operations fit; composition, exact-formula identity, budget/work, pattern execution, fabrication and a willing living object can require different local consumers. AD46/AD51 qualify the claim that the shared resolver always stays the same. A second world validates the first useful seam rather than being its prerequisite. Neither all seven AB adapters nor a global material registry/exposure ledger is required before every crafting behavior. Narrow registered owners remain the implementation route.

CO1's fractional neutralization, CO3's diminishing returns/impurity, FE3's always-available tasting and FE5's useful failed product are possible local laws. A real universal cure can work where its mechanism supports it; a failure may instead yield waste, no output or actual loss. A body may lack a mouth, be unable to safely touch a material, or require preparation; tasting is not a universal discovery control. A reliable diagnosis or inherited/learned method can bypass repeated personal experimentation. CO4 already admits worlds without tolerance. Do not add toxicity, upkeep, a hidden danger roll, a twentieth-vial penalty or guaranteed failure residue just to balance useful power.

The world/comic rows need their selected source, edition and continuity before factual use. CR5's later corrections qualify the earlier single-source and uniqueness shortcuts and separate licence, displayed grade and actual strength. Exact identity, rare knowledge, a lost recipe, scarce material and a genuinely unique instance are different predicates. A named franchise row is not complete canon: the Fullmetal Alchemist “type conservation” summary, LOTM benefit/digestion phrasing, Devil Fruit ordinary/exception/body conditions and broad Demon Slayer/JJK/Fate grouping need actual source qualification at the chosen operation. Current selected D&D contract controls over a bare2024 label. No linked novel, comic, source check or modern rules text was reopened here.

A perfect-craft power changes exactly the operation its law covers; it can include more than precision if its actual scope does. Duplication or creation can legitimately add stock without a compulsory compensating cost, quota or economy tax. Conservation checks distinguish an authored creation route from accidental duplicate publication. TL3 fuzzing should preserve save/stock integrity under AD22, not prohibit a supported profitable loop or require every ingredient to be economically useful. Preview, actual assay, developer sandbox and an in-world analysis faculty have different spending and knowledge scopes. Existing sealing policy still applies to reports and debug displays shown outside their discovery route; a developer label alone does not authorize disclosure to the player.

Shared rules for NPCs do not imply identical resources, competence, error rates or costs. The actual maker, teacher, buyer, source and recipient determine learning, property and payment. A staff member need not make mistakes or require loyalty bookkeeping merely because PAU3 mentions them. A gift can affect a real mood or relationship through a supported mechanism without turning preference into consent or permanent allegiance. A reputation, inherited brand, notebook, muscle memory, earned item and bond have distinct carrier/continuation rules. IT3's awakened object also has its own agency, rather than being only inventory.

Current AD52 qualifies FE6/OA6's manual-versus-idle split: supported routines can discover/refine, and detailed clicking earns no blanket precision bonus. Real extra control can still change an actual process variable and outcome. Standing orders may substitute ingredients, route low-grade output or sell goods where the player actually instructed that policy; the default no-silent-substitution rule protects the agreed work, not a global ban. Partial processing, repeated periods, interruptions, support loss, custody and delayed clocks must preserve settled work/results rather than refunding a whole chain or publishing it twice.

Disclosure is observer-specific: product keys, sorting, counts, labels, signature traces and codex percentages can leak unknown truth even when prose is masked. A lens can genuinely know exact truth when its source supports it; it need not be arbitrarily noisy, and public canon is distinct from altered sealed truth. A new market need not always start cheap or develop a copycat; demand, competition and suspicion require actual agents/causes. Current desktop direction qualifies CR6's old1366×768/1600×1000 proof targets. AD42 leaves generic human taste review optional; actual runtime/persistence/source gaps remain explicit. No family, registry, batch, world law, crafting behavior, build, primary-source reading or browser result was newly implemented or verified by this review.


## Content reconciliation B402: CR1–CR6 checkpoints and collision routing

All six CR checkpoints and the preserved old-P29 partial checkpoint were read in full. The actual PLAN and CR3/CR4 delivery lists resolve the label collisions: crafting play, automation, collection and director tools belong to CR3; makers, items over time, economy/social/NPC crafting and carryover belong to CR4. The mixed P28 tail and old-P29 next steps remain history, not two missing work streams. P26/P27 story content and the old snapshots remain preserved. No retirement, relocation or deletion is needed to keep this routing truthful.

Retain each checkpoint's substantive boundaries. CR1 dose, body, delivery and social/mind examples are abstract proposals, not native response or clinical proof. CR2's39book-profile and17P10 links establish coverage pointers, not verified world laws. CR3's notebook, real queue, equivalent intent/view and isolated developer proposals reuse the selected resolver and knowledge owner; equal-looking interface labels do not authorize copying another world's law into it. CR4 keeps actual maker/teacher, worker competence, stock, customer, payment, relationship and inherited-right attribution distinct. A generated person is not automatically a craft worker. CR5's comic tables retain continuity, exact-source and indexed-evidence gaps; displayed grade, licence, function and unique instance are different. CR6's product-family/exposure/knowledge packet does not allocate all seven adapters or require them before a useful first consumer.

The then-unmerged P2 worktree and later merged-main observations refer to different checkpoints; source-identical modules do not supply current browser/native/persistence proof or a new writer reservation. Source locators refreshed after a start-probe integration retain their exact inspected meaning. All proposed ports, state formats, initial ACTIVE labels, first-slice rankings and desktop widths remain dated. Current B337 owner qualifications, local source law, compatibility, AD36/AD42/AD51/AD52 and PROJECT govern. Food remains optional, supported powers can remove work, and genuine creation/copying differs from accidental double settlement. Preserve the whole idea palette without introducing a universal chemistry, mandatory toxicity/tasting, unnecessary remort or a new crafting wave. No runtime, real exposure, source issue, build, native route or migration was newly verified.

## Foundational vocabulary and enhancement, 2026-11-11

Proposed expansion following the [three-world play evidence](gm/dispatch/procedural-crafting-2026-11-11/CHECKPOINT.md#repair-failed-save-and-completion-audit). AD5, AD38, AD51 and MR1–MR36 apply. The aim is to give worlds a shared way to describe and execute making while leaving each world in charge of what actually works.

**ACT NOW — Record the boundary.** The completed slice proves native custody, timed operations, observations, consequences and saved use across Village forging, Tingen inscriptions and Mistglass refinement. The [engine owner](CRAFTING_ENGINE.md#modules) also describes seeded materials and recipe generation with witness batches. [The experiment log](../src/craft_experiment_log.js) compares trial setups and deductions. These pieces establish a base for invention. The native proofs exercise authored ways of making and learning. Player-directed composition of arbitrary operations across worlds remains a proposal.

**ACCOUNT FOR NOW — Use the smallest vocabulary that explains a working method.**

| Question | Vocabulary and ownership |
| --- | --- |
| What is being worked on? | Material or living subject, its lot or individual identity, traits, parts, condition, history and current custody. Use each owner's representation. A metal lot, a particular blade and a living Gu can each have different identity rules. |
| What makes the operation possible? | Consumed stock, retained catalyst, tool, fixture, actor or helper, skill, environment, time, energy and any access or consent the operation depends on. Keep their roles distinct. |
| What actually happens? | Operations change state: heat, cut, mix, separate, join, inscribe, bind, charge, test, repair or cultivate. Each local law declares its inputs, ordering dependencies and changes. |
| What survives the work? | Product, altered parent, returned tool, spent support, recoverable remainder, irreversible loss, failure and a receipt. Each ledger conserves its own units under the local mechanism. An interruption can leave reusable work, damaged work or a spent attempt. |
| What can the maker know and do with it? | Observe, infer, test, recognize, record and teach. The thing's behavior, the maker's evidence and the actual system that reads the resulting property are separate facts. |

**ACCOUNT FOR NOW — Give enhancement a mechanism and a consumer.** Enhancement is an intended improvement relative to a stated use. The world explains the change: a temper alters toughness; a fitting changes grip or part compatibility; an inscription gives a surface a function; binding creates a retained magical behavior; charging restores a spendable reserve; repair restores condition. An operation can affect several of these. Ask what changed, what stayed attached to the object, when the result acts, how it persists, and what use reads it. Compare effects and costs that actually follow from the operation. An improvement can be straightforward when the mechanism supports it. A tradeoff needs its own reason. A player can work toward different improvements on the same object.

**ACCOUNT FOR NOW — Let known recipes and inventions share execution.** A known recipe records a reproducible plan with conditions and tolerances. It can name a mandatory catalyst or sequence when the mechanism depends on it. For an experiment, a maker can change a material, order, technique or support and run the same local laws. Infer only what the comparison supports. Tingen's intact front engraving supports finishing the back, and its back-first success shows that the two faces must be ready at binding while either can be marked first. Wider discovery could preserve a candidate method after one working trial and strengthen it with repeat results or instruction. A new world can supply a specialist resolver for mechanisms such as living cooperation, semantic intent or authority. It can still report exact custody, payment, work and observed consequences through the shared contracts. Imported things keep their histories, and use after crossing depends on the actual support available there.

**LATER / DELEGATE — Prove open invention in one already-playable bench** (substantive coding, medium effort). Consider a larger recipe catalogue, a general-purpose rule interpreter, or a bench that accepts a small set of composable operations and delegates to existing law owners. Prefer the bench as the first proof. Catalogue expansion can deepen known methods, and a more general interpreter can follow if several real operations need the same expressive power. An unusual first test is to use one intentionally failed workpiece as the starting stock for an improvement its original recipe never described. Done when a player can propose an unnamed combination from carried stock, discover why its first result falls short, change one operation, and save a reproducible working method that changes an existing consumer after reload. Use a contrasting world to test which vocabulary travels and which rule belongs with its local owner.

## Hogwarts refinement ideaboard, 2026-11-11

**ACT NOW (done) · D1.** The [Hogwarts and Cyoria receipt](gm/dispatch/open-craft-invention-2026-11-11/CHECKPOINT.md#completion-audit) supersedes the earlier proposal boundary for these two local laws. At Hogwarts the pupil learns and practices repair, selects a complete shard set and a supported wand, and can spend the set and stamina on a join that fails because the fragments were never aligned. Adding the layout part before joining yields a pane. The witnessed result saves the method, and the player can replay it with fresh shards and the fitted wand after returning the borrowed one. Both wands currently provide the same catalyst function. Cyoria instead pays and reserves Nora and the materials for a timed anchoring trial. Its lamp needs separate calibration.

**ACCOUNT FOR NOW · D2. Shared vocabulary, local law, domain behavior.** The [working compiler](../src/craft_working.js) binds exact lots to material roles, expands versioned parts into operations, and preserves their order for replay. The [trial comparison](../src/craft_experiment_log.js) can reuse setup and observation vocabulary. The [timed procedure](../src/making_procedure.js) offers a separate existing route for commitments. The reusable contract is to bind a plan, quote current means, resolve, settle through the owner, record the observation, and retain a method with its evidence. World definitions say what alignment, joining, anchoring, focus, or mana actually do. A glass resolver decides fit and seam properties. A spell resolver handles target, control and counterplay. A living graft resolver would own compatibility, growth and rejection. Inventory, clock, custody and consent stay with their existing authorities. The domain publishes properties and consequences that an actual consumer can read.

**ACCOUNT FOR NOW · D3. Proposed discovery and tradeoff.** Extend the Hogwarts lesson with two same-size stock variants, ordinary clear fragments and wired fragments. Align matching edges, rejoin the glass with the retained wand, then inspect it over Mara's reference lettering and test whether a cracked offcut sheds fragments. Alignment supplies fit. Rejoining restores continuity and preserves the wire already embedded in the wired lot. An offcut that cracks can remain a test remnant with observed damage. The wired pane scatters more of the lettering's detail and holds cracked fragments better. Save the clear method after the first useful result, then branch it with the wired lot and record both observations. Proposed comparison on an illustrative 0–4 scale, with size and wand held constant: clear 4 for legibility and 1 for fragment retention, wired 2 and 4. The native trial currently spends one shard set and one stamina and keeps the wand. A proposed destructive test spends a separate offcut, leaving the pane available for use. The result follows from fitting, joining and retained wire, with no recipe for the finished tradeoff. Mara's existing classroom contribution is the consumer to extend. A reading panel uses legibility of at least 3, so the clear pane fits that job. A low protective screen can use retention of at least 3, so the wired pane fits that job. Today the action takes a shard set and repairs it on the spot. It would need an owned-pane handoff and a requested use to make this distinction matter in play.

**ACCOUNT FOR NOW · R1. Strain test.** Let a pane with incompatible donor edges pass a quick fit check and later crack under temperature change. The method may still be reproducible, and the first fit observation remains true. Later behavior depends on seam placement, attachment and accumulated stress in the particular pane. The glass owner needs that identity and delayed observation if the game promises this behavior. A mixed batch score would lose which seam cracked. The shared method can carry a reference to the workpiece and the observed event while the local resolver advances the seam. Carrying that pane to Cyoria also tests whether the physical object, the work history and any local magical support have distinct lifetimes.

**LATER / DELEGATE · O1–O3.** O1, expand authored variants and consumer requirements (low coding effort). Done when one known pane can satisfy an existing use by its observed property. This gives quick play evidence and each authored variant costs content work. O2, use shared plans and domain resolvers (substantive coding, medium effort). Done when both materials run through one working, the player learns the measured tradeoff, and Mara takes the fitting pane from real inventory after reload. This is the first build I would compare. O3, start from persistent failed workpieces (substantive coding, higher effort). Done when one damaged pane can survive reload, be salvaged, and yield a useful result with a revised method. It exercises identity and consequences early and needs a domain-owned workpiece lifecycle. These are design options for review. No new mechanic was implemented for this round.

## Root rules across five domains, 2026-11-11

**ACT NOW (done).** Use the completed [Hogwarts and Cyoria trials](gm/dispatch/open-craft-invention-2026-11-11/CHECKPOINT.md#completion-audit) as execution evidence. The existing [Gu chapter checks](research/GU_AND_HOGWARTS_RULE_DERIVATION_2026-11-11.md#gu-rules) and [Hogwarts potion derivations](research/HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md) are the book-evidence owners. This pass cross-checks selected cases and derives design tests. AD38, AD51, MR1–MR36.

**ACCOUNT FOR NOW.** A rule earns a place in a resolver when changing one input predicts a different observable outcome. Share method binding, exact custody, commitment, observation and versioned replay. Keep five kinds of state distinct.

| Domain | Source case | Derived rule and discriminating test |
| --- | --- | --- |
| Creatures | Boreal toad experiments varied temperature, moisture and prior exposure. Disease manifestation changed with conditions and history. [Murphy et al.](https://pubmed.ncbi.nlm.nih.gov/21797033/) | An animal retains individual condition and exposure history across habitat changes. Track stage and current environment in the existing creature owner. Run the same care method on two similar animals with different exposure histories, and check that transfer preserves their differences. |
| Gu | In chapter 106 a fusion attempt kills one Little Light and injures survivors. The protagonist waits because injury would undermine the next attempt. The refinement wiki also indexes claiming and fusion as distinct cases. [Chapter 106](https://www.webnovel.com/book/32605619408374705/87585817844827688), [Gu wiki](https://reverend-insanity.fandom.com/wiki/Gu) | Claiming, activating and fusing have different effects on identity. A failed fusion can consume one participant and leave another alive but injured. Check retry now versus retry after recovery, including custody, upkeep and individual condition after reload. Let the Gu owner decide will, rank, injury and survival. |
| Potions | Half-Blood Prince ch. 9 changes both bean preparation and stirring. The scene gives evidence for the combined method. [Chapter index](https://www.hp-lexicon.org/source/the-harry-potter-novels/hbp/hbp9/), [official scene recap](https://www.harrypotter.com/features/8-times-the-half-blood-prince-reveals-the-real-snape) | Track available extract, batch history and observed cues. Run a two-by-two comparison of cutting/crushing and steady/reversing stir. Calibrate the combined case and label the isolated predictions as original. Dose use owns what happens in the recipient. |
| Chemistry | IUPAC defines catalysis by rate and unchanged overall standard Gibbs energy change. [Gold Book](https://goldbook.iupac.org/terms/view/C00876) | Separate rate, equilibrium and quantity. In a proposed closed batch with the same reactants and conditions, compare a catalyzed batch and a control at an early time and after equilibration. Predict faster progress early and the same equilibrium composition. The generic crafting role for a retained wand is a custody designation. |
| Engineering | NASA measures in-service damage progression and crack growth through testing and inspection. [NASA fatigue crack growth laboratory](https://ddtrb.larc.nasa.gov/fatigue-crack-growth-laboratory/) | A part keeps its fit, joints, flaws and accumulated loading. In a proposed comparison, two repaired parts pass a first fit check, then show different crack growth under repeated load. The assembly resolver owns the joint and the inspection method reveals what it can see. |

**LATER / DELEGATE.** Test one cross-domain handoff on paper first (substantive design, medium effort). Use a creature-derived reagent in two otherwise matched batches, with processing records that explain the differing extract. The creature owner releases the actual lot, chemistry resolves extraction, and a potion's use reads its dose. Done when the prediction identifies which observation would distinguish an upstream material difference from a processing difference, and what remains in stock after either attempt. A Gu fusion that kills one input and leaves an injured survivor is a separate lifecycle stress test. No gameplay changes are authorized by this research pass.

## Four checks for a proposed rule, 2026-11-11

**ACCOUNT FOR NOW.** These checks extend the five-domain ideaboard. Each proposal specifies a comparison, what the player can observe, and what would make us revise the rule.

| Check | Player trial and evidence |
| --- | --- |
| **F1 · A case that could prove the rule wrong** | One Little Light supporting Moonlight fits both an additive bonus and a bonus that saturates. Ask the player to repeat the same ordinary moonblade shot with zero, one and two supports at a fixed distance. Compare normalized power of 1, 2, 3 under addition with 1, 2, 2 under saturation. Record the essence paid by each active Gu separately. The chapter checks support saturation for this pair. A failed fusion that injures a Gu is a separate change in the participant's condition, so log it before using that Gu in a comparison. Start from the wiki's identity leads, resolve them against chapters 70 and 106, and use IUPAC's rate/equilibrium distinction as a design analogy for measuring separate axes. [Book evidence and wiki trail](research/GU_AND_HOGWARTS_RULE_DERIVATION_2026-11-11.md#gu-rules), [IUPAC catalyst entry](https://goldbook.iupac.org/terms/view/C00876) |
| **F2 · Rules that interfere** | **Proposed:** A strong cleaner removes the last visible residue and strips an attached protective coating. On two equivalent used cauldrons, compare a mild clean and a strong clean. Inspect residue and coating separately, then run the same heating cycle and compare wear. The cleaner spends a dose and leaves wash waste. The stronger choice may be useful when residue would contaminate a sensitive brew, while the milder choice preserves the coating for repeated work. Cleaning and surface treatment each update their own property, and the next job reads both. Record a second interaction if the vessel retains heat: better insulation can keep the current brew warm and leave a cooldown before the next job. [Existing vessel and workbench ideas](research/HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md) |
| **F3 · Scale and repetition** | **Proposed:** Save a vial method with its batch amount, vessel, witnessed cue and the maker's actual stirring work. Replay in a larger vessel at the same proportions and stop at the original checkpoint. Compare temperature and the cue. A vat with slower mixing can need more work to reach the same condition. Then change only stirring or hold time and record the recovered result as a variant. A repeat should show which bound condition changed and let the maker continue to a cue, adapt the step or cancel under the job's current terms. A successful vial observation remains attached to its tested setup. [Equal-work and doubled-batch checks](research/HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md) |
| **F4 · Learning and sharing** | Give the apprentice a note with material roles, actual tool, step order, observed cue and a failed batch's condition. Label the explanation as the writer's inference. A second apprentice binds fresh lots, runs the procedure and records whether the cue and classroom assessment recur. The note carries the observation and method, and their actual tool and skill still determine execution. A breeder can publish a record of diet, housing and subsequent condition in the same format. A mechanic can attach an inspection and loading history to a worn part. Each recipient can reproduce a method, compare conditions or ask for another observation. [Hogwarts evidence for instruction and collaborators](research/HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md) |

**LATER / DELEGATE.** First paper-test F2 and F3 together on a clean, used vessel and on a larger batch (substantive design, medium effort). Done when two plausible explanations for a failed cue predict different results under one controlled change, the intervening player can see the pertinent condition, and another maker can reproduce the comparison from the note. F1 supplies a chapter-grounded falsifier and F4 supplies the evidence format. These are proposed tests.

## Foundation-first sequencing, 2026-11-11

**ACT NOW (done).** Weibao proposed focusing on foundations and rule coverage before building further playable slices. Treat the verified Hogwarts and Cyoria journeys as existing evidence. The pane substitution has focused resolver evidence. Its stock route, exact-pane handoff and new browser proof belong to a later integration pass.

**ACCOUNT FOR NOW.** Map source cases by what they require the engine to express, which owner supplies the state, and what would distinguish a correct rule from a plausible alternative. Begin with the cases already examined across creatures, Gu, potions, chemistry and engineering. Use the following coverage questions for each case.

| Coverage question | Evidence to retain |
| --- | --- |
| What persists? | Lot, batch, individual, assembly or relationship identity. Record what survives splitting, joining, injury, custody transfer and passage. |
| What changes? | Inputs, ordered steps, local conditions, interactions, time, scale, outputs, remainders and downstream use. Identify shared contracts and the domain-owned transition. |
| What can be learned? | Observations, competing explanations, a discriminating test, and the conditions another maker needs to reproduce the method. |
| What can the foundation express today? | Mark a case covered by an existing contract, representable with a named extension, or still open. Give a focused proof for claims about code and a source locator for claims about the world. |

**LATER / DELEGATE.** Implement foundation extensions when a sourced case exposes a specific gap. Prefer pure examples and focused save or resolver checks while expanding coverage. Candidate cases include Gu survival and injury after fusion, and vessel residue or retained heat across batches. Return to player-facing integration after this pass and choose slices for their ability to exercise several proven rules together.

## FG4. Assembly rules and paper checks, 2026-11-11

**ACT NOW (done).** [Round 6](CROSS_WORLD_SYSTEMS_TRANSFER.md#round-6-foundations-goals-by-existing-chat) assigns this lane physical joins, load paths, power, wear, maintenance and salvage. The bounded source pass uses force and moment balance, NASA's fastener catalogue record and fatigue test description, and work per unit time. All capacities, energy, wear and salvage values below are original game-fixture numbers. MR5, MR29, AD38 and AD51 apply.

| Case and source | Proposed rule | Counterexample to a simpler rule | Paper check |
| --- | --- | --- | --- |
| **FG4-A · Familiar assembly.** A plank on two trestles carries a crate. [OpenStax statics](https://openstax.org/books/university-physics-volume-1/pages/12-2-examples-of-static-equilibrium) | The load follows the plank through its seat joints, the trestles and the ground. In the fixture, use a span of 12, a load of 8 at distance 9 from the left support, and ignore plank weight. The left and right reactions are 2 and 6. | An even split predicts 4 and 4 and hides the right support's load. A beam can be assembled successfully and still overload a seat under a later, off-center load. | Check force balance 2 + 6 = 8 and moment balance 6 × 12 = 8 × 9. Move the same crate to the center and get 4 and 4. Remove the right support and reject the old static result. |
| **FG4-B · Changed component.** Substitute the right seat fastener with a compatible, stronger one. The NASA manual catalogue describes distinct shear, tension, fatigue and pullout checks. [NASA Fastener Design Manual record](https://ntrs.nasa.gov/citations/19900009424) | A join records its mating parts, fit, constraint, direction of demand and local failure modes. Keep the load position from A and raise load gradually. The original right joint reaches its limit at reaction 6, corresponding to total load 8. The replacement joint limit is 10, while the unchanged right anchor limit is 9, so the first limiting point moves to the anchor at total load 12. Other parts are above these demands in this fixture. | The fastener swap raises one capacity. Treating its rating as the whole assembly's capacity would predict a total load of 13⅓ and miss the anchor. An incompatible replacement can fail fit before either capacity is tested. | Compare original, compatible replacement and mismatched replacement. Keep the supported reactions identical for the first two at the same load. Show which part reaches its limit, and refuse to transfer the original joint's condition history to the replacement. |
| **FG4-C · New arrangement with interruption.** Couple a drive and borrowed drum to the trestles to raise a test load. Add an independently mounted holding pawl. [OpenStax power](https://openstax.org/books/university-physics-volume-1/pages/7-4-power) | The assembled mechanism defines available paths. The job reads drive rate, stored energy, transmission, current pose, support and permission. In this fixture, each driven beat spends 8 energy units, raises a load of 6 by one height unit and leaves 2 energy units as loss. Power cuts after beat three. The pawl carries the equivalent hold load of 6 against capacity 7, with the frame and ground still carrying the resulting demand. The pawl's mount must support its local reaction. | A complete machine can have energy left and still be unable to raise a load after the drive disconnects. A stopped motor alone does not establish a holding path. With the pawl removed or its mount unavailable, the load enters the local descent or arrest resolver. | Start with 30 energy units. At interruption preserve height 3, stored energy 6, cumulative loss 6 and raised-load energy 18. No fourth beat can be paid at the stated rate. Recheck mount, drum custody and drive connection before lowering or continuing. Compare with a pawl-free run and require a different physical outcome. |
| **FG4-D · Maintenance and salvage after B or C.** NASA fatigue testing measures damage progression and inspection results. [NASA fatigue laboratory](https://ddtrb.larc.nasa.gov/fatigue-crack-growth-laboratory/) | Record repeated loads and inspection on the particular joint or part. An inspection can find evidence while the part's physical condition stays the same. Replace an exhausted seat or repair its fit with actual parts and work. If retiring the interrupted rig, first lower or independently support the load. Then release the borrowed drum to its owner and partition owned worn material. | A used bracket can pass a single static check and still have a shorter next service interval. Salvage cannot return the borrowed drum as owned stock or turn a damaged bracket into fresh stock just because it was detached. | For a 10-unit owned metal bracket, settle 7 reusable units, 2 scrap and 1 cutting loss. The drum stays outside that ledger. Check that the next job sees the reused piece's condition, debits only present owned stock, and cannot salvage the original bracket again. |

**ACCOUNT FOR NOW.** Making an assembly binds parts and joints to a versioned arrangement and pays the actual fabrication or installation costs. Running it is a fresh job on that installed instance. Read current supports, geometry, demand, energy, output rate, wear and custody. At interruption, settle the paid work, position, support path, spent energy, loss and reservations once. Restoring a connection changes the next quote. Detachment needs a settled support handoff, and the salvage plan preserves the owned pieces and borrowed assets separately.

The proposed assembly owner keeps connection topology and local joint condition. Existing equipment wear and maintenance can supply known component profiles. The existing processed-material owner can preserve exact ancestry and partition recoverable stock. Inventory and any loan owner retain title and custody. The operation owner retains progress and energy expenditure. The place owner supplies whether the frame and anchors exist and may be used. Case C crosses those owners when the borrower loses access at interruption: the operation's physical hold remains, while a subsequent job must acquire legitimate support and authority before moving or detaching the drum. [Gear work](../src/gear_work.js), [durability](../src/absorb_e2/durability.js), [material partition](../src/material_lineage.js).

**LATER / DELEGATE.** Open gaps are a shared representation of joint geometry and restraint, load redistribution after progressive failure or loss of one support, and interrupted power settlement with stored energy and a competing holder. Compare an explicit joint graph with a small set of local load cases before choosing an implementation. Add a bounded resolver when it can distinguish A from B and the two interruption outcomes in C, then check exact partition and custody in D (substantive foundation work, medium effort). This phase is documentation only.
