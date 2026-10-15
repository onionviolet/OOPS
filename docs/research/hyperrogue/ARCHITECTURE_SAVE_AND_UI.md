# Architecture, persistence and legibility

## S1: architecture (SHOWN)

`hyper.cpp` supports a master translation unit including many C++ modules; `mymake` can build separately. `content.cpp` is an X-macro ledger included under different definitions to create enums, metadata, native classifications and requirements. `classes.cpp:663-728` generates `eLand`, `linf` and tactics metadata. New declarations are requested at the addition point so numeric constants remain stable.

That does not make all behavior data-driven. `landgen.cpp`, `bigstuff.cpp`, `complex.cpp`, `complex2.cpp`, `passable.cpp`, `pcmove.cpp`, `monstermove.cpp`, `items.cpp` and `orbs.cpp` implement distinct consumers. `environment.cpp:836` orders switch checks, mirrors, BFS, electricity, monster moves, power decay, caves, fires, tides and later checks. Speed phases condition several operations. `checkmove.cpp` records illegal-move reasons and previews lethal outcomes. Its `changes` staging and committed effects are a useful comparison, not a drop-in equivalent to YAIRPG's durable publisher.

Authoring cost: adding a new land name/treasure is small; adding a genuinely new law can require generation, movement, AI, UI, modes and save edits. K34 should validate those consumers, not merely count definitions. In YAIRPG, the start/branch integration map already recommends typed adaptation into the existing owner domains. Retain that incumbent rather than porting HyperRogue's globals.

## S2: save state is not the whole generated world (SHOWN)

`system.cpp:saveStats` opens an append text score file and writes versioned statistics plus a positional numeric score box. `applyBoxes` maps named fields to positions, including treasure, powers, kill history, mode and safety data. `loadsave` scans records and legacy versions; missing later fields receive defaults. A qualifying last record with Safety can resume through `load_last_save`, which loads boxes, selects mode/geometry data and sets `safety=true`. Unsavable special modes are reset. `game.cpp:activateSafety` and `initgame` rebuild a map using a retained land/seed and restore selected companions. This is not a serialized graph of every visited cell.

`config.cpp` handles separate settings, while map-stream and editor persistence are a distinct subsystem not fully audited here. Do not claim one save format covers all of them. `savemem.cpp:save_memory` can remove faraway map cells, guarded by geometry, range and special-location checks; `laMemory` gives that loss an explicit representation. This is suitable to a game that usually advances into huge new space, and conflicts with YAIRPG's requirement for meaningful changed revisits.

Unread: complete corruption/recovery matrix, every historical migration, full map-stream roundtrip and all fields of special-mode restore. No saves were opened or written and no executable was run. No transactional or atomic-save guarantee is inferred from the version header.

## S3: run UI and reveal (SHOWN structure, no visual test)

`help.cpp:generateHelpForItem`, `generateHelpForLand`, `generateHelpForMonster` and tile help combine declarations with live contextual rules. Land help includes requirements, coastal/sea classification and optionality for Hyperstones. Orb help explains range, actual exceptions, charge behavior and mode changes. `hud.cpp` projects resources and statistics; `checkmove.cpp` and `pcmove.cpp:wouldkill` explain blocked moves and distinguish threat, wall, gravity, wind, current, fatigue and warped movement. `yendor.cpp` mode menus organize per-land scores and locks. `tour.cpp` is a separate guided tutorial route, unread end to end.

Knowledge boundary: HyperRogue public help can directly explain content. YAIRPG requires actor-filtered discovery. Adapt context-sensitive explanations, not universal spoiler access. A discovered local rule should be visible beside a useful action at 1366×768, with carried resource and provenance readable elsewhere in the desktop layout. Mobile optimization is deferred. No HyperRogue or YAIRPG screenshot was produced in this static lane.

## S4: social and narrative limits

SHOWN: `complex2.cpp:camelot` assigns stable per-cell knight IDs, transfers them on movement and selects lines using radius, Grail history, mode and a message cursor. `roundTableMessage` responds to direction/progress and can update knighted status. This is state-conditioned speech, not a general relationship graph. Princess rescue and following have scoped state in `complex.cpp:princess`; full dialogue and rescue closure were not audited.

INFERRED: a good YAIRPG borrowing is a small original P21 ambient acknowledgement that reads real local achievement, plus a useful P19 service/choice if needed. It does not justify inventing a generic conversation engine, job system or persistent social bond from HyperRogue's short speech alone.
