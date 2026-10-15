# Naev aspect pass, 2026-10-14

Pin: `f8982244800e86553217a2dba555a0f41c2b87ba`. **Source audit only.** Covered means this bounded aspect has inspected evidence, not exhaustive reading of the game. Partial names material unread cases. No runtime or UI acceptance. [Main report](../REPORT.md), [private reference](../private/README.md).

## A01: Dialogue and conversation

**Status:** covered.

Shown: Lua constructs VN state sequences with named characters, images, transitions, menu targets and labels. Menu items may be a function evaluated on entry. Choices record visible text and pass the stored target to a handler. vn.func can mutate the host during the scene; other effects run after vn.run returns. Recruitment has a true refusal route before acceptance; Awakening includes converging expressive replies and a refusal that still leaves psychic status. Port permission text also differs by faction. Labels and character variables are navigation anchors, not universal dialogue-line IDs. No generic relationship graph is proved by these examples.

**Implementation sources:** [`dat/scripts/vn/vn.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/vn/vn.lua); [`dat/missions/empire/emp_cargo00.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/empire/emp_cargo00.lua); [`dat/missions/sirius/sirius_awakening.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/sirius/sirius_awakening.lua); [`dat/spob/lua/lib/spob.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/spob/lua/lib/spob.lua).

**YAIRPG PROPOSALS:** K6/K12/K14, P19: one useful scoped conversation with explicit speaker, known evidence, refusal and real host result; owner worlds/DIALOGUE_AND_INTERACTIONS.md. K18, P24: persist the host and supported pending decision together; no arbitrary Lua callback replay on restore.

**Limits:** Corpus-wide speaker, conditional line and relationship coverage remains partial. The full original text is retained privately in the clone, indexed by file and labels.

## A02: Narrative delivery

**Status:** covered.

Shown: missions provide title, description, reward, marker and active OSD objectives. Campaign helpers create and append named shiplogs after outcomes. News uses faction collections, chance, time and price-linked templates; its prose is not proof that the described company or politician exists as a simulated actor. Antlejos couples logs and changed place services to project stages. Narrative therefore spans action guidance, retrospective records, ambient news and persistent place presentation.

**Implementation sources:** [`dat/scripts/common/empire.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/common/empire.lua); [`dat/scripts/common/antlejos.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/common/antlejos.lua); [`dat/missions/empire/emp_cargo00.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/empire/emp_cargo00.lua); [`dat/events/news.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/news.lua); [`src/shiplog.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/shiplog.c).

**YAIRPG PROPOSALS:** K12/K16/K23/K29, P12/P20: distinguish a durable outcome from a delivered account and from reading that account; owners CHARACTERS_AND_WORLD_EVENTS.md and knowledge/message owners. K11/K31, P11/P19: write observer-known results to the journal and let a named person recognize actual conduct.

**Limits:** All campaign branches and every news generator were not read. No claim that all news is causal or all journals track independent people.

## A03: Implementation architecture

**Status:** covered.

Shown: a mixed C/Rust engine exposes Lua host APIs and reads XML/TOML data. Missions and events embed XML metadata in Lua comments; engine loaders interpret metadata and script environments execute behavior. update_routine advances time, space, pilots, weapons and update hooks. Mission acceptance, event triggering and Lua hooks are separate paths. Rust core owns typed time and other newer engine domains. This is content-oriented extensibility backed by native host functions, not content tables that can enact arbitrary mechanics by themselves.

**Implementation sources:** [`src/naev.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/naev.c); [`src/mission.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/mission.c); [`src/event.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/event.c); [`src/nlua_misn.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/nlua_misn.c); [`src/nlua_evt.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/nlua_evt.c); [`src/core/src/ntime.rs`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/core/src/ntime.rs); [`meson.build`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/meson.build).

**YAIRPG PROPOSALS:** K12/K34, P10/P22: map authored offers onto current storylet and typed-effect consumers; owners ENGINE_EXPANSION.md and pack compiler. K18, P24: keep definition revision, mutable occurrence and presentation lifetimes separate.

**Limits:** No engine build, performance profile or all-API audit. A native update trace is not evidence of offline simulation.

## A04: Save and persistence

**Status:** partial.

Shown: XML saves include game version and last-played metadata, world diffs, player assets, active missions/events, variables, standing, eligible hooks and logs. Player loading reads shipvars. Lua persistence serializes supported mem values, including named game-object references; functions are excluded. hook_needSave excludes timer and pilot hooks. Missing mission content is warned, recorded as failed and skipped. Autosave rotates backups before xmlSaveFileEnc writes the target; the code explicitly identifies a crash-vulnerable region. Lua update scripts map renamed assets and apply version repairs, including bioship skill restoration in the manager.

**Implementation sources:** [`src/save.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/save.c); [`src/player.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c); [`src/mission.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/mission.c); [`src/event.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/event.c); [`src/nxml_lua.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/nxml_lua.c); [`src/hook.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/hook.c); [`dat/save_updater.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/save_updater.lua); [`dat/events/updater.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/updater.lua).

**YAIRPG PROPOSALS:** K18/K33, P24: restore paid host state and pending work coherently; owner durable publisher and save compatibility map. K18, P23: preserve unavailable content recoverably rather than adopting the source skip policy. A last-played timestamp does not authorize absence rewards.

**Limits:** No save was opened or changed, no import roundtrip, malformed-save test, full migration ordering or every userdata persistence case. Mid-VN cursor restoration not established.

## A05: AI and NPC behavior

**Status:** partial.

Shown: faction AI configures a shared core with aggression, retreat thresholds, formations, scans, bribes and hails. Sirius uses zero armour-run threshold and a wedge; Za'lek uses a high retreat threshold and circle, with drone exceptions including refusal of normal refuel service. Spawn logic reads faction presence, valid origins and neighbors, builds fleet choices and schedules later traffic. Equipment generation uses faction-specific optimization wrappers. This creates distinct encounter ecologies, but spawned traffic is not evidence for individually persistent daily lives or relationships.

**Implementation sources:** [`dat/ai/sirius.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/ai/sirius.lua); [`dat/ai/zalek.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/ai/zalek.lua); [`dat/ai/core/core.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/ai/core/core.lua); [`dat/factions/spawn/lib/common.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/factions/spawn/lib/common.lua); [`dat/factions/equip/zalek.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/factions/equip/zalek.lua); [`src/ai.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/ai.c).

**YAIRPG PROPOSALS:** K6/K7/K10/K24, P25/P14: one bounded resident plan should use actual means and law; owner CHARACTERS_AND_WORLD_EVENTS.md. K6/K18: separate generated traffic identity from persistent residents and their saved memories.

**Limits:** Full combat planners, optimization solver and persistent named-person events unread; no claim that every NPC shares every player rule.

## A06: UI and information design

**Status:** partial.

Shown in source: the desktop HUD has distinct player/target/navigation/radar/weapon/OSD surfaces, with Flow-specific display support. Bioship Manager registers a contextual info button and marks unspent skill points. VN menus number options, compute wrapping and support keyboard/mouse input. The power description generates all amplifier tiers from the same stat function used to initialize the ability. These are implementation facts; no rendered viewport, actual readability or screen fit was exercised.

**Implementation sources:** [`dat/gui/slim.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/gui/slim.lua); [`dat/scripts/vn/vn.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/vn/vn.lua); [`dat/events/bioship.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/bioship.lua); [`dat/outfits/flow/abilities/seeking_chakra.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/outfits/flow/abilities/seeking_chakra.lua); [`src/gui_osd.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/gui_osd.c); [`src/map.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/map.c).

**YAIRPG PROPOSALS:** K14/K30, P04/P01: show learned/support/resource and the next useful action in independent desktop panels; owner THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. K14/K34: later UI proof targets fresh rebuilt 1366×768 desktop behavior, with 1440×900 and 1920×1080 affected checks; mobile remains deferred.

**Limits:** No assets submodule, game launch, screenshots, accessibility audit or native keyboard exercise. No claim the HUD layout should be copied.

## A07: Content authoring and modding

**Status:** covered.

Shown: mission headers declare availability and notes such as tier/campaign. Common Lua helpers centralize rewards, named characters, logging and project stages. The mission-map tool reads metadata to graph dependencies; Lua checking tools and VN debug warnings help catch authoring faults. Plugin discovery filters disabled plugins and sorts by priority. The readme documents plugin support and a built-in manager. Metadata dependency graphs are incomplete when actual gates live in arbitrary Lua conditions and variables.

**Implementation sources:** [`src/mission.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/mission.c); [`src/event.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/event.c); [`src/plugin.rs`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/plugin.rs); [`utils/mission_map.py`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/utils/mission_map.py); [`utils/nluacheck.py`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/utils/nluacheck.py); [`dat/scripts/vn/vn.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/vn/vn.lua); [`dat/missions/neutral/antlejos/readme.md`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/neutral/antlejos/readme.md).

**YAIRPG PROPOSALS:** K1/K12/K34, P22: authoring tools should report explicit links plus dynamic/unresolved gates rather than claim a complete causal graph. K33/K34, P10/P22: validate one authored lifecycle before activation; owner structured pack definitions and ENGINE_EXPANSION.md.

**Limits:** Plugin collision, override/mount precedence and manager security not fully traced. No upstream helper or untrusted code was executed.

## A08: Balance and numbers

**Status:** covered.

Shown: cargo amount grows by tier while pay uses tier, route length, commodity price and piracy risk, deliberately not tonnage. Rush delivery trades tighter time bounds for higher pay and allows reduced pay before total failure. Bioship stage thresholds sum floor(300 × 1.2^(i-1)); positive income generates XP, with a square-root branch above 500,000 credits and a ship-faction factor. Flow separates capacity, regeneration, current charge, active use and cooldown. Trade prices combine place/system periodic terms. No universal pity system or arbitrary-precision progression was established.

**Implementation sources:** [`dat/missions/neutral/cargo.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/neutral/cargo.lua); [`dat/missions/neutral/cargo_rush.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/neutral/cargo_rush.lua); [`dat/events/bioship.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/bioship.lua); [`dat/scripts/bioship.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/bioship.lua); [`dat/ships/lua/lib/flow.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/ships/lua/lib/flow.lua); [`src/economy.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/economy.c).

**YAIRPG PROPOSALS:** K3/K8/K13, P17/P18: expose the full commitment and independent resource dimensions; owners TECHNOLOGY_AND_PROGRESSION.md and economic action owner. K3/K9, P09/P16: tie growth to a meaningful real trigger and the correct carrier; source numbers are reference, not proposed YAIRPG balance.

**Limits:** No balance simulation, seed reproducibility proof, all difficulty modifiers or reward exploits audit. Ship growth caps are source facts, not a recommended solo-player limit.

## A09: Time and scheduling

**Status:** partial.

Shown: runtime dt drives time and update callbacks; time hooks and transient timer hooks differ. Rush cargo retains authored deadline values and evaluates late/failure paths against game time. Antlejos datecheck prevents immediately reoffering certain work at exactly the same game timestamp, not a universal daily cooldown. Fleet spawning returns a delay. Economy reads game-time periods, and its implementation notes that time does not advance while landed. No offline catch-up award was established.

**Implementation sources:** [`src/naev.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/naev.c); [`src/core/src/ntime.rs`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/core/src/ntime.rs); [`src/hook.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/hook.c); [`dat/missions/neutral/cargo_rush.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/neutral/cargo_rush.lua); [`dat/scripts/common/antlejos.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/common/antlejos.lua); [`dat/factions/spawn/lib/common.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/factions/spawn/lib/common.lua); [`src/economy.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/economy.c).

**YAIRPG PROPOSALS:** K8/K12/K32, P10/P13: every occurrence needs a declared clock and recurrence rule; owner ENGINE_EXPANSION.md and world clock owner. K18/K33, P24: restore supported deadlines from retained values; never infer function/timer restoration from mem serialization.

**Limits:** All pause, acceleration, jump, landing and save-load time interactions unread. Do not convert Naev dt or last-played fields into YAIRPG wall-time progression.

## A10: Onboarding and reveal

**Status:** covered.

Shown: the initial scenario defines a starting ship, credits, system, chapter and event. Nelly's first mission teaches through delivery, equipping, boarding and return, gating its destination by required services. Its comments distinguish persistent mission state from a non-persistent derelict handle. Sirius introduces a special power through a faction person and a practical apparatus/trial goal. Discovery overlays can trigger by entry or proximity and record a named discovery variable; a comment explicitly notes one route will not fire for map-based discovery.

**Implementation sources:** [`dat/missions/tutorial/nelly01.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/tutorial/nelly01.lua); [`dat/missions/sirius/sirius_awakening.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/sirius/sirius_awakening.lua); [`dat/events/discovery.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/discovery.lua); [`dat/start.toml`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/start.toml); [`dat/scripts/common/tutorial.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/common/tutorial.lua).

**YAIRPG PROPOSALS:** K4/K11/K13/K14, P04/P09: teach one useful verb with reachable means and a visible result; owner start/branch map and skill-means owner. K11/K30: acquiring map information, physically arriving and approaching an object can reveal different things.

**Limits:** All tutorial routes and discovery completion/skip cases unread; no played onboarding evidence.

## A11: Little touches

**Status:** covered.

Shown in sampled source: place discoveries get contextual title/subtitle overlays, bioship readiness gives a message and sound and a contextual skill button, local traffic has faction-specific scan/hail language, ports vary granted/denied/bribed responses, numbered VN choices retain a readable selection log, and ability descriptions highlight the current apparatus tier. These cues sit beside actual rule readers rather than replacing their state. See SMALL_TOUCHES.md for 30 discrete adaptation ideas with source anchors.

**Implementation sources:** [`dat/events/discovery.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/discovery.lua); [`dat/events/bioship.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/bioship.lua); [`dat/ai/sirius.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/ai/sirius.lua); [`dat/ai/zalek.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/ai/zalek.lua); [`dat/spob/lua/lib/spob.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/spob/lua/lib/spob.lua); [`dat/scripts/vn/vn.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/vn/vn.lua); [`dat/outfits/flow/abilities/seeking_chakra.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/outfits/flow/abilities/seeking_chakra.lua).

**YAIRPG PROPOSALS:** K14/K19/K20/K21/K27/K30/K31: let local voice and cues reflect known actual state; owners UI and world-card owners. K11/K23, P20/P21: atmosphere and messages must not leak undiscovered requirements or private truth.

**Limits:** Source-inspected cues, not audio/visual/taste acceptance. No new YAIRPG secrets were designed.

## A12: Other systems

**Status:** partial.

Shown: commodity pricing, project supply totals, authored place stages and scene reservations operate beside ship careers. Fleet ownership and minigame directories are inventoried, but their full behavior was not read. The Antlejos progression has persistent useful service changes, not just quest completion; exclusive/non-exclusive scene claims stop overlapping scripted content from fighting over a location. These claims are encounter reservations, not property ownership or in-world faction jurisdiction.

**Implementation sources:** [`dat/commodities/food.xml`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/commodities/food.xml); [`src/economy.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/economy.c); [`dat/missions/neutral/antlejos/ant_supplies.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/neutral/antlejos/ant_supplies.lua); [`dat/scripts/common/antlejos.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/common/antlejos.lua); [`src/claim.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/claim.c); [`src/player_fleet.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player_fleet.c); [`dat/scripts/minigames`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/minigames).

**YAIRPG PROPOSALS:** K5/K8/K9/K29, P02/P12/P16: a project phase must have a real consumer and retained destination identity. K12/K34, P10/P22: add a reservation only for an actual scene conflict; keep it separate from legal ownership.

**Limits:** Fleet repair/transfer/capture, minigames, racing, most combat systems and all late campaigns remain unread. See SYSTEM_INVENTORY.md for the complete module-directory census.
