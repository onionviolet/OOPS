# Rogue Legacy 1 released FNA source: deeper systems

Ranked by payoff for original YAIR work. Prior-documentation status is local to the previous game dossier; no exhaustive search of all other live lanes is claimed. Source inspection does not establish behavior in a running build.

## D1 Dialogue as a service boundary

Coverage: NEW beyond prior gameplay traces. Locator: `DialogueObj.cs; DialogueManager.cs; DialogueScreen.cs:114-210, 395-464`. [Source](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Screens/DialogueScreen.cs).

The manager maps names to aligned speaker/page arrays. The screen localizes them, clears old effect handlers and may attach a two-choice question. It later invokes the chosen callback by MethodInfo. The screen does not own a data-driven relationship graph: a shop/room/service caller chooses the entry and registers the effect. For YAIR, type the effect contract and validate target resolution before play. Re-entry must clear an abandoned handler; cancel and text completion must not purchase a service. The 106 registrations count source entries, not graph nodes or semantic coverage of all localized prose.

PROPOSAL owner: `docs/worlds/DIALOGUE_AND_INTERACTIONS.md`. Native gate if selected: one original causal chain with useful consequence, refusal/interruption and exact retained receipt after Save/reload/Import.

## D2 Five-domain persistence and failure

Coverage: NEW depth, prior catalog was bounded. Locator: `SaveGameManager.cs:115-264, 371-464, 492-594, 1520-1608, 2266 onward`. [Source](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Managers/SaveGameManager.cs).

Player, upgrades, map topology, mutable map state and lineage are separate binary files, with corresponding backups. Optional trailing blocks extend older player saves. Load errors can prompt an autosave recovery, while map loading has a separate error path. SaveAllFileTypes performs several domain saves; the read did not find a cross-file epoch/transaction contract. A mixed-generation restore is thus a concrete design concern, not a proven observed bug. Original YAIR acceptance should corrupt one domain in an isolated fixture and require a coherent recovery or safe rejection.

PROPOSAL owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`. Native gate if selected: one original causal chain with useful consequence, refusal/interruption and exact retained receipt after Save/reload/Import.

## D3 Journals as progression and reread

Coverage: NEW narrative owner. Locator: `DiaryRoomObj.cs:35-95; DiaryEntryScreen.cs; LevelEV.cs:13`. [Source](https://github.com/flibitijibibo/RogueLegacy1/blob/b41c17888a91100bbf8f1febecaa636a1b421f5b/RogueCastle/src/Game%20Objects/RoomObjs/Bonus%20Rooms/DiaryRoomObj.cs).

A diary room chooses the next entry index, requires a grounded nearby interaction, opens the corresponding dialogue and advances DiaryEntry when first read. Once completed it opens the browser instead. The constant 25 does not prove every record is reachable, because room content assets are absent and localized prose is only structurally indexed and late-entry conditions need further checks. The useful transfer is two verbs: acquire a record with a native receipt, and revisit its text without repeating the reward. Current actor knowledge must still depend on the retained carrier, not a player-wide browser flag.

PROPOSAL owner: `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md`. Native gate if selected: one original causal chain with useful consequence, refusal/interruption and exact retained receipt after Save/reload/Import.
