# Naev system inventory

Scope: captured source tree, not an installed build. File counts are recursive files, not distinct mechanics, live entities or played content. Every top-level `dat/` directory is listed. Semantic systems found while reading are listed after it. No prior Naev dossier existed at intake; coverage names refer to this lane. Full private file manifest permits deeper expansion without another fetch. Assets submodule was not captured.

| Module | Files | System/subsystem family | Documentation | Depth |
|---|---:|---|---|---|
| `dat/LICENSE` | 3 | Asset/code attribution | Inventory only | undocumented |
| `dat/ai` | 87 | Shared AI, faction combat/scan/hail/retreat policies | A05, NV-D4 | partial |
| `dat/asteroids` | 26 | Asteroid/mining fields | Inventory only | undocumented |
| `dat/bkg` | 33 | Background scenes | Inventory only | undocumented |
| `dat/commodities` | 24 | Goods and regional price inputs | A08, NV-D4 | sampled |
| `dat/damagetype` | 9 | Damage types and interactions | Inventory only | undocumented |
| `dat/difficulty` | 5 | Difficulty presets | Inventory only | undocumented |
| `dat/effects` | 44 | Status/visual effect definitions | Inventory only | undocumented |
| `dat/events` | 205 | Triggered events, news, discoveries, bioship manager, scripted people | A02/A09, NV-D1/NV-D2 | partial |
| `dat/factions` | 123 | Faction identities, standing, spawn scheduler and equipment | A05/A08, NV-D4 | partial |
| `dat/gui` | 7 | HUD variants and slim helper files | A06 | partial |
| `dat/lua-repl` | 0 | Development REPL directory | Inventory only | undocumented |
| `dat/map_decorator` | 9 | Map annotations | Inventory only | undocumented |
| `dat/missions` | 261 | Missions, campaigns, tutorials, cargo, bounties, races and project work | A01/A02/A10, NV-D1/NV-D3 | partial |
| `dat/naevpedia` | 65 | In-game reference and lore | A02 inventory only | undocumented |
| `dat/outfits` | 564 | Weapons, support modules, powers and equipment effects | A08, NV-D2 Flow example | partial |
| `dat/scripts` | 261 | VN, common campaign helpers, bioship progression, equipment optimization, minigames, escort and UI libraries | A01/A07, NV-D1/NV-D2/NV-D3 | partial |
| `dat/shaders` | 213 | Render shaders | Inventory only | undocumented |
| `dat/ships` | 170 | Hull stats, slots, intrinsic equipment and ship scripts | A08, NV-D2 | partial |
| `dat/slots` | 14 | Equipment slot properties | Inventory only | undocumented |
| `dat/snd` | 2 | Audio metadata | Inventory only | undocumented |
| `dat/spfx` | 29 | Special effect scripts | Inventory only | undocumented |
| `dat/spob` | 1380 | Physical place records and landing/service/transport scripts | A06/A12, NV-D3/NV-D4 | partial |
| `dat/spob_virtual` | 50 | Virtual presence sources | Inventory only | undocumented |
| `dat/ssys` | 554 | Star systems, topology and local environment | NV-D4 inventory | undocumented |
| `dat/tech` | 135 | Technology/store catalogues | NV-D3 stage consumer | partial |
| `dat/trails` | 34 | Ship trails | Inventory only | undocumented |
| `dat/unidiff` | 46 | Named persistent world modifications | A12, NV-D3 | sampled |
| `dat/utils` | 68 | Lua utility libraries | Inventory only | undocumented |
| `src/` | 478 | Engine, native APIs, UI, save/load, plugins | A03/A04/A07 and sampled native consumers | partial |

## Distinct semantic systems found

| Code | System and source | Size signal | Documented / open |
|---|---|---|---|
| NV-I01 | Mission availability, board generation, accept/finish, markers/OSD, cargo and scene claims: mission.c, nlua_misn.c, claim.c | 233 headers, 181 unique; see NV-D1 | Documented core; all campaign content unread |
| NV-I02 | Event trigger dispatch, event saving and hooks: event.c, hook.c | 119 headers, 54 unique | Documented core; full callbacks unread |
| NV-I03 | VN speech/menu/jump/callback state sequence and keyboard/log: scripts/vn/vn.lua | 12+ named state types by source declarations | A01; complete speaker graph unread |
| NV-I04 | Personal flags, shipvars, assets, mission history, news, eligible hooks, diff persistence: save.c/player.c/nxml_lua.c | Named save domains and 2 migration scripts | A04; load fault behavior partial |
| NV-I05 | Port services, landing, permission/bribe, purchase license/reputation: spob Lua and ship XML | 1 shared port policy plus local wrappers; Fidelity sample | NV-D2/NV-D4; all ports unread |
| NV-I06 | Faction standing source rules, local/global reputation and caps | 123 files across faction definitions and helpers | NV-D4; not a relationship simulation |
| NV-I07 | Fleet spawn/presence and NPC equipment optimization | Common scheduler + faction wrappers | A05; optimizer internals undocumented |
| NV-I08 | Combat AI, scan/hail/bribe/retreat/formation | 87 AI files | A05; combat algorithms partial |
| NV-I09 | Flow capacity, regen, charge, power tiers and activation | 3 Chakra tiers and shared Flow tables | NV-D2; charge persistence unverified |
| NV-I10 | Bioship income growth, stages, skills, intrinsic restoration | 5 core skill families plus conditional families | NV-D2; full skill tree unread |
| NV-I11 | Terraforming work, cumulative supplies, stage changes and service access | 10 main mission scripts + supplies; 9 stage diffs | NV-D3; full narrative partial |
| NV-I12 | Commodity pricing and cargo/rush contracts | 24 commodity-dir files; 5 cargo tiers in sample | A08/NV-D4; supply conservation unproved |
| NV-I13 | Runtime dt, calendar/time conversion, deadlines and transient timers | native ntime module + hook paths | A09; full pause/transition matrix unread |
| NV-I14 | Tutorial progression and discoveries | Nelly first mission plus discovery event | A10; remaining tutorial routes unread |
| NV-I15 | Logs, faction news, contextual HUD and power descriptions | shiplog/news, 7 GUI-dir files | A02/A06; no visual proof |
| NV-I16 | Plugins, metadata dependency graph, Lua checks and dev editors | plugin.rs; mission_map.py; nluacheck.py; dev_* C modules | A07; full editor/plugin precedence unread |
| NV-I17 | Fleet/deployment/capture/escort/repair | player_fleet.c, capture.lua, player_escorts.lua, ship_repairs.lua | Inventory only, undocumented behavior |
| NV-I18 | Asteroids/mining, map/safelanes, jump/hypergate/wormhole travel and nebula | asteroid, map, safelanes and nebula native modules; spob transport scripts | Inventory only, undocumented behavior |
| NV-I19 | Damage/status effects, weapons, stealth/detection and difficulty | native pilot/weapon modules; 9 damage and 5 difficulty files | Inventory only beyond Chakra/AI sample |
| NV-I20 | Racing, minigames, achievements/collections and encyclopedia | race missions, scripts/minigames, naevpedia | Inventory only; achievements framework not established |
| NV-I21 | Render/audio/physics/input/localization/development console | native modules, shaders, dat utilities, translation files | Inventory only, not a gameplay audit |

## Highest-payoff expansion

The top three unresolved joins are scene reservation release/restore (NV-I01/I02), carrier support after swapping/loading (NV-I04/I09/I10), and project phase replacement across revisits (NV-I11/I04). [DEEPER_SYSTEMS.md](DEEPER_SYSTEMS.md) traces these. Remaining systems are explicitly undocumented rather than treated as absent. K1/K34 would benefit from the private census, while K18/K33 need selected runtime checks, not a source-file count.
