# CivIdle checkpoint (2026-10-13)

**Status:** finite source audit COMPLETE for the core loop, prestige and saves at `e15fe039ed5c0794df05e52258bc9663761a140a` (upstream HEAD on 2026-10-13). No install, scripts, npm or build. Shallow clone in session scratch. No YAIR edits or commits by the lane.

**License:** CivIdle source is GPL-3.0, and its README asks that artworks and assets not be redistributed. YAIR's LICENSE is MIT (Copyright 2021 Miktaew). Copying CivIdle code would make the combined work GPL-3.0, which conflicts with the fork's MIT licensing. Use ideas and mechanics only, re-expressed in YAIR's own code and words: no code, assets, text or translations. Quoted formulas are design facts and balance references; write any implementation independently.

**Read:** GameState, Tile, TickLogic, Update (tick, transport, production), relevant BuildingLogic, CalculateTierAndPrice, RebirthLogic, TechLogic, FeatureLogic, Config, heads of Tech/Building/GreatPerson definitions, TraditionDefinitions, CityDefinitions interface, ClientUpdate, the offline path in Bootstrap and RPCClient, RebirthConfirm, GameStateLogic serialize, MigrateSavedGame head, README license section.

**Unread:** UpgradeDefinitions, most Great Person and Building definitions, wonder hooks in OnProductionComplete and OnBuildingComplete, HappinessLogic detail, TransportSourcePlanner internals, multiplayer trade and server, conquest, achievements, tests, Electron and Steam paths, runtime play.

**Revisit when:** P1 or P3 is chosen (read upgrade and Great Person definitions for content patterns), or the offline policy is decided (read TransportSourcePlanner cache semantics). No decompile needed.

Proposals P1 to P5 are unaccepted.
