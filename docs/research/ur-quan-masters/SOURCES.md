# Pinned evidence, 2026-10-14

All S references mean official commit `a0d90e239b3a8e3dcb9d732fd76a385aac2593e5` under `/Users/weiwei/.codex/research/lib-uqm/repos/uqm`. SHOWN means static source inspected, never played behavior. Counts are lexical census results, not independent reachable branches, species counts or voiced-line counts. Source tables mix player and NPC phrases; some conversations represent home/space variants or a multi-speaker group.

| Ref | Source | Locator |
|---|---|---|
| S01 | [Conversation dispatch and local phrase lifetime](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/comm.c) | `sc2/src/uqm/comm.c`: SelectResponse, DoResponsePhrase, HailAlien |
| S02 | [Phrase and speech glue](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/commglue.h) | `sc2/src/uqm/commglue.h`: Response, PHRASE_ENABLED, DISABLE_PHRASE, NPCPhrase_cb |
| S03 | [Spathi encounters](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/comm/spathi/spathic.c) | `sc2/src/uqm/comm/spathi/spathic.c`: SpathiOnPluto, SpathiAllies, Intro |
| S04 | [Melnorme economy and knowledge](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/comm/melnorm/melnorm.c) | `sc2/src/uqm/comm/melnorm/melnorm.c`: HasTech, GrantTech, GetNextTechForSale, DeltaCredit, AlienRaces, DoBuy, DoSell, DoRescue |
| S05 | [Evidence and relationship conditions](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/comm/syreen/syreenc.c) | `sc2/src/uqm/comm/syreen/syreenc.c`: NormalSyreen, Intro |
| S06 | [Layered travel](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/hyper.c) | `sc2/src/uqm/hyper.c`: fuel_ticks, ARILOU_SPACE_SIDE, portal_pt, MoveSIS |
| S07 | [Map estimates and known influence](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/planets/pstarmap.c) | `sc2/src/uqm/planets/pstarmap.c`: UpdateFuelRequirement, known_strength, known_loc |
| S08 | [Landing and surface risk](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/planets/scan.c) | `sc2/src/uqm/planets/scan.c`: getLandingFuelNeeded, isNodeRetrieved, setNodeRetrieved |
| S09 | [Surface collection and hazards](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/planets/lander.c) | `sc2/src/uqm/planets/lander.c`: pickupMineralNode, DeltaLanderCrew, GetHazardChance, PlanetSide |
| S10 | [News and mineral conversion](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/comm/starbas/starbas.c) | `sc2/src/uqm/comm/starbas/starbas.c`: CheckBulletins, ByeBye, SellMinerals |
| S11 | [Calendar and scheduled events](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/clock.c) | `sc2/src/uqm/clock.c`: AddEvent, ValidateEvent, GameClockTick, MoveGameClockDays |
| S12 | [C event consequences](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/gameev.c) | `sc2/src/uqm/gameev.c`: AddInitialGameEvents, EventHandler, arilou_entrance_event, arilou_exit_event, check_race_growth |
| S13 | [Durable game state](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/save.c) | `sc2/src/uqm/save.c`: SaveGame, SaveGameState, SaveSisState, SaveEvents, SaveStarInfo |
| S14 | [Load behavior](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/load.c) | `sc2/src/uqm/load.c`: LoadGame, LoadGameState |
| S15 | [Planet state](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/state.c) | `sc2/src/uqm/state.c`: GetPlanetInfo, PutPlanetInfo, ScanRetrieveMask |
| S16 | [Generation and authored exceptions](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/planets/generate/genspa.c) | `sc2/src/uqm/planets/generate/genspa.c`: GenerateSpathi_generatePlanets, GenerateSpathi_generateOrbital |
| S17 | [Default seeded generation](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/planets/generate/gendefault.c) | `sc2/src/uqm/planets/generate/gendefault.c`: GenerateDefault_generateOrbital, ScanSeed |
| S18 | [Distinct ship control](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/ships/arilou/arilou.c) | `sc2/src/uqm/ships/arilou/arilou.c`: arilou_intelligence, arilou_preprocess, init_arilou |
| S19 | [A second combat grammar](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/ships/spathi/spathi.c) | `sc2/src/uqm/ships/spathi/spathi.c`: spathi_intelligence |
| S20 | [Alien meaning and stance](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/comm/orz/orzc.c) | `sc2/src/uqm/comm/orz/orzc.c`: ORZ_MANNER, ORZ_VISITS, Intro |
| S21 | [Traversal reward](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/comm/arilou/arilouc.c) | `sc2/src/uqm/comm/arilou/arilouc.c`: ArilouHome, PORTAL_KEY_ON_SHIP, PORTAL_SPAWNER_ON_SHIP |
| S22 | [Carrier and limits](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/sis.h) | `sc2/src/uqm/sis.h`: SIS_STATE, NUM_MODULE_SLOTS, MAX_BUILT_SHIPS |
| S23 | [Refit economy](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/outfit.c) | `sc2/src/uqm/outfit.c`: ModuleSlots, ModuleCost, FuelOnBoard |
| S24 | [Fleet access](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/shipyard.c) | `sc2/src/uqm/shipyard.c`: CheckAlliance, CrewCost |
| S25 | [Mixed speakers](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/comm/zoqfot/zoqfotc.c) | `sc2/src/uqm/comm/zoqfot/zoqfotc.c`: NPCPhrase_cb, ZOQFOTPIK_CONVERSATION_PHRASES |
| S26 | [Homeworld contact](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/comm/slyhome/slyhome.c) | `sc2/src/uqm/comm/slyhome/slyhome.c`: Intro, HELLO_1, HELLO_2 |
| S27 | [Data format](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/content/base/comm/orz/orz.txt) | `sc2/content/base/comm/orz/orz.txt`: #(phrase-id) records |
| S28 | [Initial event types](https://sourceforge.net/p/sc2/uqm/ci/a0d90e239b3a8e3dcb9d732fd76a385aac2593e5/tree/sc2/src/uqm/gameev.h) | `sc2/src/uqm/gameev.h`: NUM_EVENTS |

Full dialogue records, headers, complete C conditions and call-site context are retained privately. [Private reference index](private/REFERENCE_INDEX.md); bulk source is the external clone. Lexical context is a navigation index, not a solved control-flow graph. No copied code, prose or assets are proposed for gameplay.

S29: `sc2/src/uqm/planets/devices.c:PORTAL_SPAWNER_DEVICE/PORTAL_FUEL_COST` verifies acquisition has a useful fuel-gated travel consumer. S30: `sc2/src/uqm/starcon.c:Starcon2Main/on_battle_frame` verifies the inspected activity/tick join.
