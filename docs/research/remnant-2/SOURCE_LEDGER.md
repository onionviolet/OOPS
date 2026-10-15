# Source ledger

2026-10-15 inspection. SHOWN = read local structure or decoded instructions; STATED = attributed author description; INFERRED = interpretation/proposal. None means played.

**B1** Installed Steam app 1282100, build 16320528, depot 1282101 manifest 3402363259625448228. Index hashes: ~/.codex/research/mw-remnant2/notes/source-index-hashes.json.

**B2** ~/.codex/research/mw-remnant2/notes/paths.txt and iostore-list.txt; full IoStore path census, names only.

**B3** ~/.codex/research/mw-remnant2/extract/parsed2/Remnant2/Content/Campaign_Main/Quest_Campaign_Main.uasset.json; functions ActivateFirstValidWorld, IsWorldValid, ActivateWorldWaypoint, WorldBossDefeated. Quest default object is partial.

**B4** ~/.codex/research/mw-remnant2/extract/parsed2/Remnant2/Content/World_{Fae,Jungle,Nerud}/Quests/Quest_AdventureMode/Quest_AdventureMode_*.uasset.json; RemnantQuestSubQuest. Wrapper defaults partial.

**B5** ~/.codex/research/mw-remnant2/extract/parsed3/Remnant2/Content/World_*/**/TileSet_*.uasset.json; TileSet exports with no logged object read errors.

**B6** ~/.codex/research/mw-remnant2/extract/parsed/Remnant2/Content/World_Base/Items/Archetypes/{Alchemist,Challenger,Engineer}/Archetype_*.uasset.json; definition exports, unlock tables partial.

**B7** ~/.codex/research/mw-remnant2/extract/parsed4/Remnant2/Content/World_Nerud/Environments/Blueprint/{BP_Nerud_DeathFog,Action_DeathFog_BuildUpHandler}.uasset.json; overlap events and action bytecode.

**B8** ~/.codex/research/mw-remnant2/extract/parsed6/ and parsed7/; EventTree graph, conditions, dialogue/lore text. Many objects partial, see package-audit.json.

**B9** ~/.codex/research/mw-remnant2/extract/parsed3/Remnant2/Content/World_Jungle/Characters/Pan_Wolf/Blueprints/Char_Pan_Wolf_Dialogue_StateMachine.uasset.json; 45 exports, conditions and state transitions.

**B10** ~/.codex/research/mw-remnant2/extract/parsed2/Remnant2/Content/UI/UI_Dialogue/{Dialog_Dialogue,Widget_Dialogue}.uasset.json and parsed4/.../Widget_DialogueOption.uasset.json; widgets/bytecode only, not rendered.

**P1** https://www.remnantgame.com/en/news/article/11537003 (developer Archetypes Breakdown, 2023 design statement).

**P2** https://news.xbox.com/en-us/2023/07/28/gunfire-games-answers-all-our-remnant-ii-questions/ (David Adams interview, launch-era generation design).

**T1** https://github.com/Razzmatazzz/RemnantSaveGuardian/tree/501b6ff2e070af34f1cf387c9f17942153a2c158/RemnantSaveGuardian ; inspected RemnantSave.cs, RemnantCharacter.cs, RemnantWorldEvent.cs, GameInfo.cs. Third-party reader, not engine source.

Build-matching warning: public usmap repository tree `6797e0ccfd66502b835b72fbfd6a0fc0637c95da`, mapping blob `1f9a157adc6c2d381d5f2c045982ba9541d9a0aa`, 1,180,446 bytes. The publisher supplies no established match to build 16320528. Sample failures show incomplete compatibility. Clean exports remain conditional on this parser/schema, not a globally validated mapping. Preserve both the useful subset and errors.

B6 excludes hidden unlock routes from public summaries. B8 stores source dialogue privately; committed docs paraphrase. R2-S01..R2-S03 are opaque source-discovery route labels, not newly designed YAIRPG secrets.
