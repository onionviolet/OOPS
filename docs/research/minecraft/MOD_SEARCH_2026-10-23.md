# Minecraft mod search, 2026-10-23

Research only. 37 more source repos held beyond the 61 in
[the 2026-10-14 pass](MINECRAFT_DOWNLOAD_COMPLETION_2026-10-14.md) and the five
sibling targets (GregTech, Mekanism, AE2, Immersive Engineering, Thermal).
Applies MR (making), SR (sites), AU (agent usage) rules as research input only;
nothing here is an accepted decision.

**State:** downloaded and inert (shallow `git clone --depth 1`, default branch
HEAD, hooks off, LFS skipped, nothing built or run). Not read yet: mechanism
column comes from my prior knowledge of each mod, not from these clones, so
treat it as a pointer to verify. Total 911 MB across 37 repos, each under 400 MB.
Folder: `docs/research/minecraft/private/search-2026-10-23/<slug>/` (gitignored
via `/docs/research/*/private/`); each has `RECEIPT.txt` (slug | origin | commit |
SPDX license | size) and the clone in `src/`. License "NOASSERTION" means GitHub
found a custom or non-SPDX license; read it before quoting code. Blank means no
license file found (all rights reserved by default). Design ideas are free;
code and assets are not ours to copy.

Paths below are relative to `docs/research/minecraft/private/search-2026-10-23/`.

## Ranked table

Rank is fit for this idle RPG's crafting, logistics, magic and world systems, not mod popularity.

| Code | Mod | Known for | License | Path | Question for this game |
|---|---|---|---|---|---|
| M1 | Blood Magic | Life essence, altar tiers, ritual stones, binding items to a soul network | CC-BY-4.0 | bloodmagic/ | How should a magic cost be paid in a persistent resource (health, lifespan) that other systems also draw on? |
| M2 | Astral Sorcery | Constellation attunement, sky-dependent starlight crafting, perks | custom | astralsorcery/ | Can crafting yield depend on world clock and sky state, with a progression tree on the player? |
| M3 | Mystical Agriculture | Resource crops by tier, seed-essence chain, farming as mining | MIT | mysticalagriculture/ | What does a tiered "grow it instead of find it" loop do to a resource economy and idle pacing? |
| M4 | ProjectE | Item EMC values, transmutation, alchemical conversion graph | MIT | projecte/ | How do you value every item on one scale without breaking the economy, and how do we price learned recipes? |
| M5 | Ender IO | Conduits, capacitor tiers, machine upgrades and sided IO config | Unlicense | enderio/ | What is the lightest logistics UI that still feels like building a factory? |
| M6 | Industrial Foregoing | Read in wave 3 (ce2852db, MC 1.21, MIT): four machine frames gated by plastic, pink slime and ether gas; one augment per type (speed, efficiency, processing, 12-tier range); work area (2r+1)^2 swept one tile per cycle; latex to plastic chain; mob crusher, duplicator and essence loop; ore laser, ferment and sieve ladder. Black hole units were removed in 3.6.2. No ethanol chain found; the fuel is a variety-quadratic biofuel. See WV3 W3-13 to W3-20 | MIT | industrial-foregoing/ | Which machine "work areas" let a home or estate run chores while idle? |
| M7 | Refined Storage | Network storage, autocrafting patterns, grids and external storage | MIT (archived 1.x repo) | refinedstorage/ | How do we make a home's stores one searchable inventory with queued crafts? |
| M8 | Extended Crafting | Read in wave 3 (e54a4a41, 26.1.2-8.0.3, MIT): 3x3 to 9x9 tables whose recipes self-tier by size, each table built from two of the previous; auto tables at 500 FE/tick and 20 x tier ticks; typed singularities (10,000 items, 5M FE, catalyst) and an 81-cap capstone; ender crafter shortened 1% per alternator; pedestal combination core. No compressor or combination recipes ship. See WV3 W3-21 to W3-26 | MIT | extendedcrafting/ | How should recipe grids scale to late tiers without new UI per tier? |
| M9 | Forbidden Arcanus | Hephaestus forge, essence tiers, corruption, rituals | none stated | forbidden-arcanus/ | Can a forge-ritual crafting station add corruption risk to ordinary crafts? |
| M10 | Tough As Nails | Thirst, temperature, body-state survival | custom | toughasnails/ | Which body-state meters add real choices at idle timescales rather than chores? |
| M11 | Serene Seasons | Seasons altering crop growth, biomes, calendars | custom | sereneseasons/ | How should seasons gate yields and recipes in a calendar-driven world model? |
| M12 | Vampirism | Faction (vampire/hunter), skill trees, blood economy | custom | vampirism/ | How does a faction path change the same world's rules and NPC reactions? |
| M13 | Millenaire | Village cultures, NPC trade, reputation, village construction | GPL-3.0 | millenaire/ | How do culture-specific villages with their own economy and attitudes get generated? |
| M14 | FTB Quests | Quest graph, tasks, rewards, team progress | none stated | ftb-quests/ | How should quest dependency graphs and reward tables be authored and validated? |
| M15 | Better Questing | Scripted quest lines with logic gates | MIT | betterquesting/ | What quest logic types (AND/OR/XOR, repeat) are enough for authored arcs? |
| M16 | Create Additions | Electricity bridge into Create, rolling and wire crafting | custom | createaddition/ | How do you bolt a second energy kind onto an existing mechanical system? |
| M17 | Create Ore Excavation | Finite veins, drilling with fluids and extractors | MIT | create-ore-excavation/ | How do finite deposits plus a drill chain compare to infinite nodes for resource worlds? |
| M18 | Steam 'n' Rails (Railway) | Trains, tracks, signals, scheduling | LGPL-3.0 | railway-1.21.1/ | How is route scheduling and transport time modelled as a logistics layer? |
| M19 | Draconic Evolution | Tiered reactor, fusion crafting, endgame chaos | custom | draconic-evolution/ | How does a late power-tier fuse crafting with a risk meter? |
| M20 | Bigger Reactors | Read in wave 3 (b08980a, 0.6.0-beta.10.2, MC 1.20.4, LGPL-2.1): ray-traced neutron heat model with fertility, passive or active cooling, no meltdown (output falls as heat rises), turbine blades, coils and a double-peak RPM efficiency curve; waste (cyanite) gates turbine parts. Phosphophyllite not in clone. See WV3 W3-01 to W3-07 | LGPL-2.1 | biggerreactors/ | How could a simple heat/fuel simulation make a build puzzle, not a number? |
| M21 | TechReborn | Rebuild of classic tech tree, machines, tiered power | MIT | techreborn/ | What does a clean readable tech tree with few resource types look like? |
| M22 | Flux Networks | Wireless energy networks with priorities and transfer limits | MIT | flux-networks/ | How are priorities and caps on shared transfer expressed to the player? |
| M23 | Powah | Read in wave 3 (42742741, 26.1.0-alpha, MC 26.1.2, LGPL-3.0): seven tiers from two multiplier rows (1 to 2000 active, 1 to 100 passive), fuel energy tier-independent; a reactor whose output depends on solid-coolant cooling; energizing orb and rods with progress lost on change; ender channels bought with sacrificed batteries. See WV3 W3-08 to W3-12 | LGPL-3.0 | powah/ | How do power-generator tiers scale without a trivial max-out? |
| M24 | Ars Elemental | Spell addon: elemental schools and focus items on Ars Nouveau | GPL-3.0 | ars-elemental/ | How do addons add schools to an existing spell-composition grammar? |
| M25 | Bewitchment | Witchcraft, rituals, curses, pledges to patron entities | none stated | bewitchment/ | How do pledge-to-entity systems bind the player to costs and boons? |
| M26 | Reliquary | Relics with unusual abilities, mob-drop crafting, tool effects | custom | reliquary/ | What makes a unique-effect item feel earned rather than stat-based? |
| M27 | Ice and Fire | Read in wave 3 (02b29220, 2.1.13-1.18.2, LGPL-3.0): dragon in five 25-day stages with capped stat lerp, element-gated egg incubation, random (not inherited) egg color, stage-gated carry and ride verbs, stepped corpse harvest, forge powered by a living dragon, lectern-unlocked bestiary of 27 chapters, myrmex hive with reputation ledger. Dragons are never tamed in the wild. See WV3 W3-38 to W3-45 | LGPL-3.0 | ice_and_fire/ | How deep can a creature lifecycle (egg, stages, bond) go in a text/idle model? |
| M28 | Farmer's Delight | Cooking pots, meals with effects, farming extensions | MIT | farmersdelight/ | How does a recipe chain from farming to cooking produce buffs worth planning around? |
| M29 | Cooking for Blockheads | Kitchen multiblock that uses linked stores | custom | cookingforblockheads/ | How does a crafting station read from nearby inventories with no manual hauling? |
| M30 | Dynamic Trees | Read in wave 3 (8bf66d83, 1.7.2, MC 1.21.1, MIT): branching growth by a signal with energy and taper, soil fertility 0 to 15 as growth fuel, per-species parameter bundles and a climate matrix, counted accelerants, support-based die-back. No mutation, cross-pollination or live seed genetics exist in this version. See WV3 W3-32 to W3-37 | MIT | dynamictrees/ | How do growth rules by species and environment generate resource variety cheaply? |
| M31 | Mystical Agradditions | Add-on tiers and crops for Mystical Agriculture | MIT | mysticalagradditions/ | How do addon tiers extend a chain without rewriting it? |
| M32 | Applied Mekanistics | Bridge between AE2 and Mekanism chemicals | LGPL-3.0 | applied-mekanistics/ | How are two resource kinds shared across storage systems? |
| M33 | ExtendedAE | Adds pattern provider and crafting extensions to AE2 | LGPL-3.0 | extendedae/ | What quality-of-life additions does an autocrafting network need at scale? |
| M34 | Immersive Petroleum | Oil deposits, refining, fuels for Immersive Engineering | none stated | immersivepetroleum/ | How do regional deposits become a map-scale trade resource? |
| M35 | Ad Astra | Read in wave 3 (45abf0ec, 1.16.26, MC 1.21.1; custom Terrarium License v1: data and source MIT, art, lang and book text All Rights Reserved): rocket tier is a passport against planet tier with flat launch fuel; capped flood-fill oxygen distributor; suit set over air, cold and heat axes; gravity-scaled fall damage; desh, ostrum, calorite ladder. Oil source not found. See WV3 W3-27 to W3-31 | custom | ad-astra/ | How does an off-world frontier gate resources behind life support? |
| M36 | Sophisticated Backpacks | Upgradeable portable storage with filters and auto-features | custom | sophisticatedbackpacks/ | What portable-container upgrades reduce inventory friction for a traveller? |
| M37 | Quark | Many small quality-of-life and world modules | custom | quark/ | Which small world additions (variety, tweaks) are cheap to add per world? |

## Picks for the next deep-dive wave

1. **M1 Blood Magic, M2 Astral Sorcery, M9 Forbidden Arcanus.** Three distinct ritual-crafting designs (persistent cost, sky-gated yield, corruption risk). Magic is the least covered area in the held 61 for resource-cost models.
2. **M4 ProjectE and M3 Mystical Agriculture.** They test the economy question from two sides: one price scale for everything versus growing resources on a tier ladder. Both bear on trade and crafting balance.
3. **M10 Tough As Nails and M11 Serene Seasons.** Cheap, small codebases (3.7 MB and 1.2 MB) that show calendar and body-state coupling to crops, travel and rest.
4. **M13 Millenaire and M12 Vampirism.** World and faction depth: culture-generated villages with their own economy, and a faction path that rewrites the rules around one player.
5. **M14 FTB Quests plus M15 Better Questing.** Authoring graph for quests and rewards; useful for the authored-arc side of world design.
6. **M5 Ender IO and M7 Refined Storage** if the home logistics UI gets a design pass. The rest of the logistics group (M20 to M23, M31 to M33) are second tier because Mekanism, AE2 and IE already cover the same ground.

## Failed or manual

- **Twilight Forest:** `TwilightForest/twilightforest` on GitHub is an empty 0 KB stub (development moved off GitHub); no clone. A Modrinth or CurseForge JAR would need a manual hash-verified fetch.
- **Mods not pursued as source:** Thaumic additions, Astral and Roots forks, Pam's HarvestCraft (old, scattered forks only), Tinkers addons (Tinkers already held), Minecraft Comes Alive, Settlements (no clear public repo found). Hardcore Questing was not found as a public source repo.
- **Closed or unclear source:** Several clones carry non-SPDX licenses (see receipts). Draconic Evolution, Quark and Sophisticated Backpacks are source-visible with custom terms; read their license files before extracting anything beyond notes.
- **Not run or built:** no code executed. Default-branch HEAD may be a newer Minecraft version than the one the community remembers; pin a version-matching tag before citing behavior.
- **Not read yet:** table rows are from my existing knowledge. A first reading pass should confirm each mechanism column and replace it.
- **Receipts missing:** none. All 37 folders have `RECEIPT.txt`.
