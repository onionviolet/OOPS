# Naev: fifteen deep system traces

Source pin `f8982244800e86553217a2dba555a0f41c2b87ba`. **Shown** means inspected source, not played behavior. **Stated** identifies author notes. **Inferred** identifies interpretation and every YAIRPG proposal. Numbers below are source rules, not recommended balance. All fifteen are bounded static traces; individual residuals stay explicit. Ranked by YAIRPG fit in REPORT, with stable DS IDs here.

## DS01: Fleet deployment and cargo custody

**Data model, SHOWN:** PlayerShip_t retains a pilot and deployed flag. Escort_t distinguishes owned fleet ships from bay craft. PilotCommodity records commodity, quantity and mission cargo ID. Fleet capacity and fleet_used are separate player fields.

**Rules, SHOWN unless tagged:** pfleet_update sums current hull points plus points of deployed owned ships. Cargo free/used includes fleet escorts only when fleet_capacity > 0. Redistribution merges ordinary identical goods, keeps mission cargo separate, sorts mission cargo first then descending base commodity price. Mission cargo is added to the flagship; ordinary cargo goes through fleet distribution. While landed, overflow may be placed on the flagship. Undeploy checks capacity of the remaining fleet and asks before a shortage-producing shrink. A debug warning is not a conservation guarantee.

**Connections, SHOWN:** Owned ships are deployed as escort AI and get automatic weapon sets; cargo transfers affect mission eligibility and travel mass. Ordinary goods and objective payloads have different placement policy.

**Authoring, SHOWN unless tagged:** Hull XML supplies points and cargo stats. Native pfleet_toggleDeploy, pfleet_deploy and pfleet_cargoRedistributeInternal implement transitions; script orders are a separate layer.

**Save boundary, SHOWN / limits:** player_saveShip writes model, name, deployed, fuel, outfits, cargo, acquisition metadata and shipvars. player_saveEscorts persists bay model or fleet name only when e.persist. Load resolves owned fleet ships and checks spaceworthiness; live escort task stacks are not serialized by these records.

**Open:** Full capacity UI admission, cargo discard quantities, deployed death settlement and every fleet API remain unread. Source-traced allocation is not a tested stock invariant.

**YAIRPG routing, INFERRED PROPOSAL:** K6 / K9 / K18; P04 / P06 / P18 / P24. Palette owners: [COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md); [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [src/player_fleet.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player_fleet.c), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c), [src/escort.h](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/escort.h), [dat/scripts/player_escorts.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/player_escorts.lua).

## DS02: Capture is a pending recovery process

**Data model, SHOWN:** board.lua calculates a quote; naev.cache().capture_pilot passes pilot, cost, costnaked and outfitsnaked into the event. Event mem stores ship, name, system, original faction/name, filtered outfits, intrinsics and quotes. A cloned pilot invalidates old references.

**Rules, SHOWN unless tagged:** is_capturable refuses noplayer hulls, carried fighters and actors neither natural nor explicitly capturable. Quote factor is (10 + target crew)/(12 + player crew)/loot_mod. Start with worth; subtract nosteal nonlocked outfit prices from full cost and all nonlocked prices from stripped cost, then multiply; stripped quote is min(full, stripped*factor). Capture removes nosteal outfits, disables and tethers the clone. Added player mass is half captured mass. In drag(dt), outside radius*1.2+20, acceleration is normalized relative position times (target distance - actual distance)*player mass/captured mass. A refuel service without noshipcapture offers full repair, stripped repair, or damaged retention. Insufficient money still retains a damaged hull.

**Connections, SHOWN:** This separates encounter control, travel burden, final ownership and usable equipment. Death/abandon clears drag; landing creates an owned ship with captured shipvar and provenance.

**Authoring, SHOWN unless tagged:** Lua event plus board UI and hull/outfit tags. evt.save(true) requests event persistence. No generic human recruitment or consent model follows from vehicle capture.

**Save boundary, SHOWN / limits:** Pending terms live in saved event mem, while event enter reconstructs a pilot from retained definitions. At settlement owned-ship serializer carries the result. Active pilot/update hooks are transient and must be reconstructed by lifecycle code. Exact mid-tow restore and callback interruption remain untested.

**Open:** No crash-atomic capture/payment claim. loot_mod upstream derivation and all capture blockers outside is_capturable remain partial.

**YAIRPG routing, INFERRED PROPOSAL:** K9 / K10 / K18 / K29; P04 / P12 / P18 / P24. Palette owners: [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md); [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [dat/board.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/board.lua), [dat/events/capture.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/capture.lua), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c), [src/hook.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/hook.c).

## DS03: Deferred repair preserves an impaired asset

**Data model, SHOWN:** Unrepaired captured ships receive the Heavily Damaged intrinsic and per-ship repair_cost. Ship Repairs is a load-triggered event that searches the current ship and player.ships for this outfit.

**Rules, SHOWN unless tagged:** The repair NPC appears only at a shipyard and only with damaged ships. A dynamic menu lists actual repairable ships and reads each saved quote. Credits < cost refuses without debit. Otherwise pay(-cost), remove the intrinsic from the chosen ship, temporarily swapping if necessary, then return to the original ship. The menu repeats until no ships remain, then removes the NPC. This is a paid removal of a damage marker, not timed component fabrication.

**Connections, SHOWN:** Capture can end usefully without funds; later wealth and a fitting service restore use. The stripped capture path does not restore lost noncritical outfits through this repair.

**Authoring, SHOWN unless tagged:** Event Lua is a service wrapper around actual owned ships. One intrinsic identifies impairment and one shipvar stores the accepted future price.

**Save boundary, SHOWN / limits:** Intrinsic and quote are covered by player_saveShip outfit and shipvar domains. The NPC is reconstructed on landing/load; persistent NPC identity or arbitrary VN cursor is not required by this service.

**Open:** Repair does not clear repair_cost in this script; absence of the marker removes it from eligible ships. Missing or corrupt quote behavior and interrupted payment are unverified.

**YAIRPG routing, INFERRED PROPOSAL:** K8 / K9 / K18 / K22; P04 / P12 / P18 / P19. Palette owners: [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md); [GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md](../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [dat/events/ship_repairs.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/ship_repairs.lua), [dat/events/capture.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/capture.lua), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c).

## DS04: Convoy contracts, survival and orders

**Data model, SHOWN:** escort.init retains mem._escort with original/current ship lists, faction, parameters, convoy handles and hook IDs. setDest adds destination system/place, route, current index, nextsys and named success/failure callback.

**Rules, SHOWN unless tagged:** One-second heartbeat commands land or jump when within 2000 units of the target. Death removes corresponding convoy and ship-list entries; nofailifdead changes the all-dead failure policy. Jump/land handlers account for actual departures; entering the wrong next system invokes failure. Route index advances on jumpin. Player order menu sends e_hold, e_return or e_clear and uses drone-specific acknowledgement. These are orders, not relationships.

**Connections, SHOWN:** Companion participation has a place, route, surviving members and explicit completion. Mission author can pay according to survivors. Owned fleets, bay fighters and temporary mission escorts are distinct custody paths.

**Authoring, SHOWN unless tagged:** Lua helper takes hull lists or existing pilots and named callback functions; followorders, nofollowplayer and per-pilot callbacks customize it. Existing-pilot outfit snapshot is a module-local escort_outfits, explicitly commented session-only.

**Save boundary, SHOWN / limits:** Mission mem retains route and survivors, but the snapshot of original outfits is not saved globally. spawn recreates live actors and hooks; transient pilot/timer handles are not a durable actor identity. This closes basic escort structure, not exact companion persistence.

**Open:** All callers, autonomous combat plans, relationship memory, hireling wages and guaranteed exact reload equipment remain open. No generic hireling economy was located in selected helpers.

**YAIRPG routing, INFERRED PROPOSAL:** K5 / K6 / K12 / K18; P06 / P08 / P25 / P24. Palette owners: [COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md); [CHARACTERS_AND_WORLD_EVENTS.md](../../../CHARACTERS_AND_WORLD_EVENTS.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [dat/scripts/escort.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/escort.lua), [dat/scripts/player_escorts.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/player_escorts.lua), [dat/ai/core/control/escort.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/ai/core/control/escort.lua), [src/hook.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/hook.c).

## DS05: NPC equipment as constrained choice

**Data model, SHOWN:** Outfit cache records specific stats, broad/type categories, price, limit, mass and CPU. Candidate slot/outfit pairs become binary linear-program columns; hull stats, chosen cores and parameter weights form the context.

**Rules, SHOWN unless tagged:** Objective maximizes weighted goodness. Weapon component begins 0.5*(DPS*damageWeight + disable*disableWeight), then accounts for tracking, range, absorption, lock-on and family preferences. Rows constrain CPU, energy, mass, negative energy-regeneration modifiers, optional budget, limits and one outfit per slot. energygoal=max((1-min_energy_regen)*baseRegen,min_energy_regen_abs); massgoal=max(max_mass*engine_limit-baseMass,engine_limit*min_mass_margin). It solves, equips and checks actual post-equip regeneration. Up to five attempts restore base equipment and adjust emod by 1.5 on regeneration failure; infeasible solves may double mass tolerance and relax/remove nebula regeneration requirements. This is approximate optimization with fallback, not hard proof all spawned ships satisfy every ideal constraint.

**Connections, SHOWN:** Miner template prefers mining lances, sets disable weight zero, and gives drill preference a 20% roll. Faction wrappers choose pools and cores. Some special ships bypass the solver entirely.

**Authoring, SHOWN unless tagged:** Lua templates, parameter tables and candidate pools, backed by linopt. Author can tune roles without hand-authoring every loadout. Tiny hardcoded overrides qualify the generic objective.

**Save boundary, SHOWN / limits:** Solver variables/cache are derived generation state, not a saved plan. Owned results serialize as actual equipped outfits; generic spawned pilots need not persist. No claim a random future outfit choice repeats after reload.

**Open:** All faction templates, exact solver backend behavior and fallback spaceworthiness remain unread/unexecuted.

**YAIRPG routing, INFERRED PROPOSAL:** K6 / K9 / K10 / K34; P15 / P16 / P25. Palette owners: [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md); [GENERATION_FOUNDATION_RULES_2026-10-14.md](../../../GENERATION_FOUNDATION_RULES_2026-10-14.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [dat/scripts/equipopt/optimize.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/equipopt/optimize.lua), [dat/scripts/equipopt/templates/miner.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/equipopt/templates/miner.lua), [dat/scripts/equipopt/params.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/equipopt/params.lua), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c).

## DS06: Bioship skill graph and respecialization

**Data model, SHOWN:** Skill records carry tier, requires, replaces, outfit, slot and display data. _getskills resolves requirement/reverse links and intrinsic stages. Five default families are bite, health, attack, misc and plasma; movement, stealth and carrier families depend on size/tags.

**Rules, SHOWN unless tagged:** Max skill tier is 3, 4 if size>2, 5 if size>4. Movement is added for size<=3; stealth for size<=4 or its tag; carrier by tag. Threshold for stage s is sum over i=1..s-1 of floor(300*1.2^(i-1)). Free points = stage - enabled nonzero-tier skills. Player activation requires landing, a free point and enabled prerequisites. skill_enable installs slot or intrinsic equipment and stores bio_<key>. Reset charges floor(0.2*current XP), recalculates stage, removes skill effects and rebuilds the window. It can lower stage.

**Connections, SHOWN:** Actual hull form constrains available faculties; earned state and installed organs/equipment are separate. ship_intrinsics falls back to parent hull definition through inherits. That is definition inheritance, not biological descent.

**Authoring, SHOWN unless tagged:** bioship.skills and bioship.intrinsics are Lua definitions; helpers install/remove actual outfits and resolve replacement links. NPC simulate chooses random eligible skills and heals the generated pilot.

**Save boundary, SHOWN / limits:** XP, stage and bio_ flags are shipvars; manager reconstruction was covered earlier. Installed outfit effects are saved too. The graph is rebuilt from current definitions, so content changes require the manager compatibility repairs.

**Open:** All individual skill effects and replacement dependency cases remain partial. No breeding, genome, child or family-lineage implementation is established by these files.

**YAIRPG routing, INFERRED PROPOSAL:** K3 / K9 / K18 / K22 / K33; P05 / P09 / P16 / P17. Palette owners: [GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md](../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md); [worlds/NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md](../../../worlds/NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [dat/scripts/bioship.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/bioship.lua), [dat/scripts/bioship/skills.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/bioship/skills.lua), [dat/scripts/bioship/intrinsics.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/bioship/intrinsics.lua), [dat/events/bioship.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/bioship.lua), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c).

## DS07: Mining method, yield and optional timing interaction

**Data model, SHOWN:** AsteroidType holds armour range, absorb, material reward rows with quantity/rarity and scanned message. Group XML weights asteroid types; system fields instantiate anchors. The optional mining interaction has targets with angular position, size, sway, reward and depth, and a callback supplied by its caller.

**Rules, SHOWN unless tagged:** Iron-Nickel authored armour is 80..120 with absorb 30; reward rows are Iron 25, Nickel 25 and Silicate 5. typeA-standard weights are 6/3/1. Hit absorption factor is 0.99^max(0,absorb-penetration). Explosion filters rewards by max_rarity, chooses ONE eligible material uniformly, then rolls nb in [0,round(quantity*mining_bonus)]. Each gatherable has random quantity 1..5, so nb is not final tonnage. Explosion alerts nearby pilots and respawns the asteroid elsewhere with a 0.5 transition timer. This is renewable field generation, not conserved finite geology. Optional timing minigame defaults to speed pi radians/sec and three shots. Hit requires matching depth and abs(pointer-target angle)<target size; bonus=sum(hit reward)/target count. Completion calls reward_func once per loaded interaction.

**Connections, SHOWN:** Extraction result depends on tool rarity/bonus and collection capacity. Exploration/scan tells the player about deposits. Optional active interaction is separate from ordinary weapon extraction and from an idle policy.

**Authoring, SHOWN unless tagged:** XML types/groups and native asteroid_hit/explode; Lua mining wrapper can run standalone or as custom VN state. Wrapper comment calls it Sokoban, but core implements a rotating pointer.

**Save boundary, SHOWN / limits:** Cargo results serialize through ships. Asteroid live position, armour, scan state and timing-minigame locals are not included in the inspected player serializer. No exact deposit depletion or pending-minigame save contract established.

**Open:** Gatherable lifetime/pickup rules and drill callback conversion of bonus to actual stock remain unread. No claim zero-yield roll is protected by pity.

**YAIRPG routing, INFERRED PROPOSAL:** K5 / K9 / K11 / K13; P02 / P04 / P09 / P18. Palette owners: [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md); [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [src/asteroid.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/asteroid.c), [dat/asteroids/types/iron-nickel.xml](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/asteroids/types/iron-nickel.xml), [dat/asteroids/groups/typeA_standard.xml](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/asteroids/groups/typeA_standard.xml), [dat/scripts/minigames/mining.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/minigames/mining.lua), [dat/scripts/minigames/mining/core.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/minigames/mining/core.lua), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c).

## DS08: POI leads, scanner trails and fixed reward identity

**Data model, SHOWN:** poi.generate returns sys, risk and optional reward module. Startup transfers temporary _poi_* variables into mission mem.sys/risk/reward. Reward records have type, value, weight, optional ship/name and module name. mem.poi holds target, callback name, markers and scanner hook.

**Rules, SHOWN unless tagged:** Eligible systems are softly claimable, volatility<=25, with no place both landable and inhabited; sample within 1..5 jumps. risk=min(Poisson(1.5),5,completed POIs). However mission create stores rewardrisk, THEN forces mem.risk=2 and locked=true. Credit reward is (100000+100000*U)*(rewardrisk*0.5+1); credits weight .5, or .05 with lucky state, other rows default 1. Selected reward is retained at create. On entry initial trail point is radius*.6 at a random angle; 13..17 segments have lengths 600+300*U, plus final 600+400*U. Scan requires <=3000 units; trail points and goal require <1000 and sequential reveal, checked each second. Locked boarding invokes stringguess; failure closes without reward. Enter event has 5% metadata chance and 5..15 second local delay.

**Connections, SHOWN:** Leads arrive through NPCs or naturally spawned boarded pilots. Patron route has 5% chance, prior completion, independent presence, generic unrestricted port and fewer than three active POIs. The board route lacks that same three-active check in this file. Rewards can be inventory data, money, outfits or authored module functions. Data acquired total and current owned data differ.

**Authoring, SHOWN unless tagged:** common.poi hosts trail/boarding logic; reward directory functions can refuse eligibility or return weighted records. Stable chosen reward does not mean a stable geometric trail.

**Save boundary, SHOWN / limits:** Mission mem preserves reward identity and terms; _poi_* variables are consumed on startup. Goal is assigned to mem but trail positions, started flag and visual path are module locals regenerated on enter. Inventory and poi_data_gained/known are separate retained domains. No arbitrary mid-trail or puzzle cursor restoration guarantee.

**Open:** All reward modules, stringguess algorithms, fresh-load trail behavior and interruption atomicity remain open. Source override contradicts reading generated risk as actual encounter difficulty.

**YAIRPG routing, INFERRED PROPOSAL:** K5 / K11 / K12 / K18 / K30; P04 / P10 / P11 / P15 / P24. Palette owners: [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md); [STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md](../../../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [dat/scripts/common/poi.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/common/poi.lua), [dat/missions/neutral/poi.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/neutral/poi.lua), [dat/events/poi_generator.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/poi_generator.lua), [dat/events/poi_enter.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/poi_enter.lua).

## DS09: Discovery records are more than map knowledge

**Data model, SHOWN:** Discovery table entries specify type (enter, distance, discover), variable name, title/subtitle, optional position/radius, asset or callback. Separate tables key on system, faction or custom predicate.

**Rules, SHOWN unless tagged:** handle_event ignores already recorded variables. Distance entries poll every .5 seconds and fire at distance<authored dist, commonly 5000. discover_trigger refuses during cinematics, appends a travel log, resets autonav for 3, executes optional callback, pushes a variable and shows a title/audio cue. Some callbacks mark factions known and rename visible Unknown pilots. create uses hasevent = hasevent or handle_event(...); Lua short-circuit means after a truthy result later eligible handlers are not evaluated in that call. Do not assume every simultaneous discovery queues.

**Connections, SHOWN:** Purchased maps, sensor detection, physical approach, faction recognition and flavour acknowledgement can differ. This extends the prior proximity example with a mechanical information callback and selection-order caveat.

**Authoring, SHOWN unless tagged:** Lua tables plus named predicates/callbacks. A custom atmosphere tag can nominate a discovery without a new native trigger.

**Save boundary, SHOWN / limits:** var and shiplog persist through their existing save domains; temporary .5-second timers and on-screen overlays do not. Reentry can reconstruct pending checks, subject to recorded flag and branch order.

**Open:** Runtime cinematics retry and competing discoveries not reproduced. This source uses one-time flavour flags; YAIRPG should not copy a lifetime event restriction onto recurring useful content.

**YAIRPG routing, INFERRED PROPOSAL:** K11 / K14 / K19 / K23 / K30; P04 / P10 / P11 / P21. Palette owners: [MEANS_AND_APPRAISAL.md](../../../MEANS_AND_APPRAISAL.md); [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [dat/events/discovery.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/discovery.lua), [src/hook.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/hook.c), [src/save.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/save.c).

## DS10: Knowledge-gated reference pages

**Data model, SHOWN:** Naevpedia .md files have YAML metadata title, priority and cond; parser also organizes category, entry and parent. Page text supports Lua statements, expressions and widget functions. Event registers Archives info button and A shortcut.

**Rules, SHOWN unless tagged:** Readme STATED pipeline: extract YAML, translate lines except pure Lua, expand Lua, parse CommonMark. Source SHOWN test_cond runs compiled condition under pcall; an error warns and hides the entry. Navigation filters category and conditions, orders parent/child, then priority (default 5, lower first), then translated title or filename. Dynamic body content reads current known state. Inline expressions execute in page environment, so rendering is executable content, not a declarative safety boundary.

**Connections, SHOWN:** Reference pages can reveal only known ship/faction information and use actual descriptions. This helps avoid a separate static encyclopaedia that leaks every definition or drifts from mechanics.

**Authoring, SHOWN unless tagged:** Writers add .md, YAML gates and optional Lua-generated text/widgets. Readme explicitly says .markdown files are excluded. Localization happens before Lua/Markdown rendering.

**Save boundary, SHOWN / limits:** Underlying known flags and actor state persist; pages and cached metadata are derived. No new learned skill is awarded by opening a page in the inspected registration path. Reading-history/notebook progress is not established.

**Open:** All page gates, search/accessibility and widget side effects remain partial; no rendered desktop evidence.

**YAIRPG routing, INFERRED PROPOSAL:** K11 / K14 / K30 / K34; P01 / P04 / P11 / P16. Palette owners: [MEANS_AND_APPRAISAL.md](../../../MEANS_AND_APPRAISAL.md); [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [dat/naevpedia/readme.markdown](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/naevpedia/readme.markdown), [dat/scripts/naevpedia.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/naevpedia.lua), [dat/events/naevpedia.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/naevpedia.lua).

## DS11: Technology catalogues are local supply, not research

**Data model, SHOWN:** tech_item_t distinguishes outfit, ship, commodity, group and group-pointer; holds avail string/compiled chunk, avail_search and price_mod. tech_group contains name, source filename and item array.

**Rules, SHOWN unless tagged:** Two-pass loader creates named groups before resolving members. Unspecified item type is resolved through tech lookup; explicit type chooses group/outfit/ship/commodity. Defaults: avail_search=0, price_mod=1. In actual availability mode (search=0), a false condition skips an item; search mode skips conditional entries without avail_search, rather than enforcing the same live predicate. search<0 bypasses these checks. Recursive expansion de-duplicates entries; price reader can replace a duplicate modifier when the later encountered modifier differs from 1. No per-player research points or prerequisite-learning tree is defined by tech.c.

**Connections, SHOWN:** Place services decide which store exists; catalogue decides its goods; reputation/license/payability still have their own readers. World diffs can change tech access, extending the earlier colony stage trace.

**Authoring, SHOWN unless tagged:** XML tech groups compose reusable lists and conditional items. Read tech_addGroupItemPrice for recursion and mode semantics, not just directory name.

**Save boundary, SHOWN / limits:** Catalogues reload from content; selected world diffs are saved. Purchased goods serialize as inventory/equipment. Runtime catalogue API mutation is not automatically a persistent diff; its author must use a retained path.

**Open:** All nested conditional combinations, cyclic-group handling and every shop purchase validator remain unread.

**YAIRPG routing, INFERRED PROPOSAL:** K7 / K8 / K9 / K11 / K33; P04 / P07 / P16 / P22. Palette owners: [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md); [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [src/tech.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/tech.c), [src/unidiff.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/unidiff.c), [src/save.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/save.c), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c).

## DS12: Sensing, scanning and stealth are different states

**Data model, SHOWN:** Pilot stores ew_detection, ew_signature, ew_stealth, scan timer and stealth timer; ShipStats supplies detection/tracking/hide multipliers. Local asteroid/jump interference and hull mass enter derived radii.

**Rules, SHOWN unless tagged:** Normal pilot range returns 1 for identified contact, -1 for fuzzy detection, 0 for none: d²<(observer detect*track*target signature)², else d²<(observer detect*target detection)². Nonallied stealthed contacts return 0 here, with explicit visibility/parent exceptions earlier. Scan time helper is mass^(1/3)*1.25/(ew_hide*ew_signature)*ew_scanned_time; ScanStart passes the scanning pilot, so do not silently reinterpret it as target mass. Timer decrements only within identification range and fires scan/scanned hooks below zero. Stealth with no nearby breakers recovers by dt*5000/stealthRadius capped at 1; with breakers drains dt*(stealthRadius/10000+nearbyMod)*timerStat, and reveals below zero. Entry refuses nearby breakers and turns off weapons/outfits. Missile-lock admission check is commented out.

**Connections, SHOWN:** Perception controls reliable information and patrol callbacks. Scan effects, cargo illegality and autonav interruption connect observations to consequences. A UI message for lock-on failure does not prove the commented guard executes.

**Authoring, SHOWN unless tagged:** Native EW readers with hull/outfit stats; Lua callbacks can react to scan events. Nearby-breaker eligibility is its own helper, not just all ships in radius.

**Save boundary, SHOWN / limits:** Outfits and permanent knowledge can persist; transient scan/stealth timers and flags are absent from the inspected player_saveShip body. Do not claim exact in-flight EW restoration.

**Open:** Every nearby-breaker exception, weapon lock-on/accuracy model and post-scan knowledge memory remain partial.

**YAIRPG routing, INFERRED PROPOSAL:** K10 / K11 / K24 / K30; P04 / P11 / P17 / P25. Palette owners: [MEANS_AND_APPRAISAL.md](../../../MEANS_AND_APPRAISAL.md); [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [src/pilot_ew.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/pilot_ew.c), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c).

## DS13: Timed effects and typed damage

**Data model, SHOWN:** EffectData contains duration, overwrite group, priority, stats, buff/debuff flags and Lua callbacks. Effect instance adds timer, elapsed, strength, parent and applicator. Damage type definitions are TOML at this pin; Rust exposes C ABI calculation.

**Rules, SHOWN unless tagged:** effect_add uses passed duration only if >0, otherwise definition duration. It matches overwrite group only where new priority<=existing priority. For the SAME definition, weaker strength is ignored; equal strength with a longer existing timer is ignored; accepted repeat resets timer and invokes extend callback. Different definitions in a matching group invoke old removal then replacement, without comparing incomparable strength. No overwrite group allows separate instances. effect_update subtracts dt; effect_compute scales stat merges by strength. dtype_calcDamage returns typeMultiplier*damage*absorb*max(0,1-resistanceStat) when configured, otherwise resistance factor 1. Kinetic TOML shield=.8, armour=1.15. This helper does not by itself specify shield overflow or disable recovery.

**Connections, SHOWN:** Equipment, attacks and temporary status modifiers share actual stat readers. Parent/applicator retain causal actor references while alive; not proof of long-term injury or social blame.

**Authoring, SHOWN unless tagged:** XML effects with optional Lua handlers; TOML damage types and optional resistance stat. Plasma Burn sample duration is 5, debuff, damage stat .2. Do not translate that stat into total DPS without tracing its consumer.

**Save boundary, SHOWN / limits:** Inspected player ship serialization saves installed outfits and shipvars, not an effect list or effect timers. Treat effects as transient for this inspected save route; every alternate snapshot path remains outside scope.

**Open:** All effects, damage application overflow, disable/stress, heat, difficulty presets and lingering injury remain partial.

**YAIRPG routing, INFERRED PROPOSAL:** K3 / K10 / K18 / K22; P14 / P16 / P17 / P24. Palette owners: [worlds/ABILITY_AUTHORING.md](../../../worlds/ABILITY_AUTHORING.md); [GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md](../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [src/effect.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/effect.c), [src/damagetype.rs](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/damagetype.rs), [dat/damagetype/kinetic.toml](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/damagetype/kinetic.toml), [dat/effects/plasma_burn.xml](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/effects/plasma_burn.xml), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c).

## DS14: Gates and wormholes have distinct travel contracts

**Data model, SHOWN:** Hypergate setup has destination function, cost_flat (10000), cost_mass (50), cost_mod (1) and appearance. Default destinations enumerate active hypergate-tagged places in other systems. Wormhole setup accepts fixed target or function and local parameters.

**Rules, SHOWN unless tagged:** Hypergate quote = floor(flat*modifier+.5) + totalMass*floor(perMass*modifier+.5), with mass of player and followers. A modifier table searches from floor(local standing) toward zero for first authored entry. Unknown destinations get stable-looking signature labels and can still be chosen after warning. Confirmation requires credits>cost, so exact equality fails in this pin. Pay precedes event. Hypergate event teleports immediately then runs a 4-real-second visual; its comment warns enter hooks can interact. Wormhole uses per-ship wormhole marker to avoid double landing, a cached target, two 2-real-second visual halves and at crossing advances local game time by time.new(0,0,1000+2000*U), then teleports and clears the marker.

**Connections, SHOWN:** Knowledge, faction terms, fleet size, destination and elapsed game time affect travel independently. Four visual seconds are not four game seconds or a universal crossing rate.

**Authoring, SHOWN unless tagged:** Shared Lua place modules expose hooks; each authored gate/wormhole wrapper supplies target/terms. Changed active tags can come from world diffs.

**Save boundary, SHOWN / limits:** Hypergate target uses var, wormhole target uses naev.cache; update timers, local target and shaders are transient and neither event requests evt.save here. Completed location, credits and shipvars use normal owners. Pending crossing recovery is not established, especially a stranded wormhole marker.

**Open:** Ordinary jump/fuel admission, all wrappers, transport fleets, hypergate construction and interrupted crossing remain unread.

**YAIRPG routing, INFERRED PROPOSAL:** K5 / K7 / K15 / K18; P04 / P05 / P13 / P18 / P24. Palette owners: [worlds/MULTIVERSE_STRUCTURES.md](../../../worlds/MULTIVERSE_STRUCTURES.md); [STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md](../../../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [dat/spob/lua/lib/hypergate.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/spob/lua/lib/hypergate.lua), [dat/spob/lua/lib/wormhole.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/spob/lua/lib/wormhole.lua), [dat/events/hypergate.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/hypergate.lua), [dat/events/wormhole.lua](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/wormhole.lua).

## DS15: Price motion and remembered market samples

**Data model, SHOWN:** CommodityPrice has base price, system/place variations and periods plus sample sum, sum2, count and update time. Commodity supports constant price or reference price multiplied by a modifier.

**Rules, SHOWN unless tagged:** economy_getPriceAtTime first resolves reference/constant branches. For ordinary goods, t=converted game seconds/NT_PERIOD_SECONDS; price=max(1,round(base+sysVariation*sin(2*pi*t/sysPeriod)+spobVariation*sin(2*pi*t/spobPeriod))). Missing local listing falls back to average price. Initial regional shaping multiplies base by 1+radius/200000, 1+nebulaVolatility/600 and 1+interference/10000, then smooths place/system/neighbor prices. This formula supplies periodic opportunity, not measured shortage. economy_getAverageSpobPrice uses stored samples and current catalogue price modifiers; mean and variance summarize observations.

**Connections, SHOWN:** Known market history and current world truth differ. Cargo capacity, route cost and deadlines determine useful arbitrage. No conserved merchant warehouse or autonomous factory chain is established by this engine.

**Authoring, SHOWN unless tagged:** Commodity XML, place metadata, system topology and catalogue modifiers configure price fields; native economy_init performs smoothing. News may describe computed prices, not independent causes.

**Save boundary, SHOWN / limits:** economy_sysSave writes lastPurchase prices and only observed place/commodity sample sum,sum2,cnt,time. Formula fields are derived from content and current game time. Owned stock belongs to ship cargo, not this sample history.

**Open:** Every initialization coefficient and trading UI accounting, recursive reference cycles, actual purchase quantity curves and restock semantics remain partial.

**YAIRPG routing, INFERRED PROPOSAL:** K5 / K8 / K11 / K23; P01 / P11 / P13 / P18. Palette owners: [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md); [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md). These are conceptual owners, not claims of implemented consumers.

**Primary sources:** [src/economy.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/economy.c), [src/tech.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/tech.c), [src/player.c](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c).

