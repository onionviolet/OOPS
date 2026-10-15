# Immortal Life aspect pass

2026-10-14, lane immortal-life-2 follow-up. **Status: PARTIAL.** A01/A03/A04 prioritized; all twelve aspects recorded. Source is installed Unity IL2CPP build with DLL/metadata matching the earlier pass. Shown = inspected table, schema, graph or native body; stated = authored description; inferred = bounded interpretation. No game launch or personal save access.

Full reference text/data/flows remain private, linked in [EVIDENCE.md](EVIDENCE.md). This folder contains paraphrase and identifiers only. Prior roots were read-only. [System inventory](SYSTEM_INVENTORY.md) and [three deeper reads](DEEPER_SYSTEMS.md) separate discovery from understanding. Every YAIRPG takeaway below is a PROPOSAL, not an accepted change. Relevant owners: characters/world events, engine expansion, cultivation, selves/continuity, trials, thematic UI and the existing production/persistence implementation. First milestone remains one realm and one prestige; no universal once-only limit is proposed.


## A01: Dialogue and conversation

Status: covered.

SHOWN: 1,261 serialized NewDialog.DialogAsset graphs were recovered from the installed assets bundle. This equals the catalogue's 1,261 ScriptableDatas/Dialog asset paths. They contain 6,050 word nodes, 886 option nodes with 1,384 choice items, 33 condition nodes and 849 script nodes. Fifty-two choice items have their own condition. There are 59 distinct npcId values in word nodes, including special/player identifiers; this is not a count of voiced characters.

Each graph has beginGuid. Word nodes carry GUID, player/speaker identity, talker name, content, portrait reference, male/female audio cues and next connection. Options carry stable choice IDs, text, conditions and next links; conditions carry an expression and two outgoing links; scripts carry command text and a continuation. Full content, editor layouts and all these links are saved privately. Conditions remain attached to graph/choice nodes; a flattened line does not pretend to encode every incoming path condition.

Native condition/choice execution invokes GameExpression.Parser.Parse. CommandsExec parses line-oriented semicolon-separated commands and awaits GameCommand.Exec. DialogController.ChooseOption creates or increments a choice record and records current game time; SaveData persists DialogOptionData. HasChoseOption queries that history. Script nodes call item, quest, schedule, favor, save and unlock commands. The separate275-row Dialog TextAsset and19,775-row five-language Language table are also retained; their coexistence does not prove the old table is the modern graph loader.

A structural audit found97 graphs with a nonempty connection absent from their own node set, and no missing begin node. Such endpoints can terminate a graph; this is a locator list, not97 proven bugs. No generated dialogue model was established. Voice timing, every conversation's played reachability and scene-only speech remain unverified.

Locators: extract/dialogue/INDEX.json; extract/dialogue/LINES.json; extract/dialogue/CONDITIONS.json; extract/dialogue/SCRIPTS.json; Dialog275; NPC67; Language19775; DialogController.ChooseOption0x1806412d0; PanelNPCInteractNew condition/option/command state machines.

PROPOSALS: Characters/dialogue: keep stable choice IDs, counts and timestamps so later lines can respond to remembered conduct. Characters and engine: separate words, options, conditions and effect commands; retain graph provenance with each consequence.

## A02: Narrative delivery

Status: partial.

SHOWN: quests have authored stages/objectives and completion commands; triggers combine validity, expressions, count/interval settings and command arrays. Dialogue scripts can accept quests, send birds, play timelines, change scene objects and replace NPC schedules. The prior native pass found22 milestone/time trigger rows containing32 NPC advancement commands. This supports a world reacting to story milestones without establishing a general narrative planner.

PaperBird has264 definitions that reference MessageResourcePath and an initiating NPC. MessageSO declares receive-message nodes, choices, conditions and scripts; ReceiveMessage carries arrivedGameHours. This provides a separate schema for delayed correspondence. Targeted bundle and resources probes did not recover those message graphs with the expected type-tree shape. Their full line text and execution remain unread. The PaperBird table and all task/journal/localization data are preserved. Scene Timeline exports and every closure branch were not decoded.

Locators: Task393; Trigger413; PaperBird264; TaskHandBook58; HandBook1219; NewDialog graph scripts; MessageSO TypeDef12784; ReceiveMessage12786.

PROPOSALS: Characters and world events: let a letter have a sender, arrival time, remembered reply and downstream event. Quest/journal owner: distinguish accepted, completed, refused and closed states instead of deriving story memory from displayed text.

## A03: Implementation architecture

Status: covered.

SHOWN: Unity IL2CPP, x86-64 GameAssembly.dll plus global-metadata.dat. Dumper lists85 managed images; Assembly-CSharp starts at TypeDef9500. Addressables supplies a catalogue and three local bundles; TextAssets provide296 named data files,291 JSON-parsed. NewDialog is a custom serialized node graph. ConfigManager exposes typed configuration arrays and generic keyed lookup; many native functions share a generic body and require the method token to identify the actual type.

Gameplay uses singleton controllers/managers, Unity Update methods, GameTimeManager listeners, Action events, GlobalEventEntity and async state machines/coroutines. The prior pass traced minute/day NPC scheduling and combat-wave progression. This pass traced graph conditions through GameExpression.Parser and semicolon command scripts through GameCommandHelper.ToCommand and GameCommand.Exec. MoonSharp and other script libraries exist in the image list, but their mere presence does not make these dialogue scripts Lua.

SaveManager is a central coordinator over controller-owned state rather than one actor-only record. UI and content have dedicated controllers and events. These are architectural observations, not an endorsement of global singletons. No measured rendering or gameplay performance claim follows; frame-time profiling is unrun.

Locators: dump.cs image headers and TypeDef9500+; ConfigManager and GameCommand schemas; notes/native.txt; prior80 native reads.

PROPOSALS: Engine: keep content conditions and commands explicit, typed at dispatch boundaries and traceable to their originating node. Persistence: inventory every state owner before claiming a whole-world save.

## A04: Save and persistence

Status: partial.

SHOWN native: ManualSave calls SaveInOneData. The coordinator asks many controllers to save, including player, NPCs, schedules, dialogue history, tasks, scene objects, inventory, crops, letters, production, triggers, smelters, cooking, alchemy, sect, room and minigames. Save<T> stores serialized byte arrays in a shared dictionary. FinalSave writes the dictionary through SaveToOne under SaveData.sav. Application version and game time are also written. SaveManager's static initializer sets ManualSaveLimit to5; slot metadata separates Auto and Manual and records character identity, wall save time, game time and version.

The serializer instantiates Newtonsoft.Json with a WritablePropertiesOnlyResolver. SaveToOne uses UTF8 when no encoding is supplied, optional password-dependent encoder dispatch, then a FileStream write. Its final aggregate call supplies no password. A buffer predicate can reject output before the write; that predicate's complete contract was not expanded. This is not proof of atomic replacement: the inspected write path creates a stream, writes and disposes; crash-safe rename/backup settlement was not established.

Load<object> checks file existence, reads bytes, conditionally decodes, deserializes, and returns the supplied default when the file is absent. LoadOneDataMode loads the aggregate dictionary and supplies a new dictionary when empty. Native version compatibility, migration order, failed-deserialization recovery, backup fallback, cloud synchronization and autosave invocation cadence remain unread. Version fields and a PlayerValueVersionModify table prove version-aware surfaces, not a verified migration guarantee.

Saved versus derived: Info.NPC exposes computed stats marked JsonIgnore; its realm/XP/extra stats and behavior cursor are stored fields. PlayerData has stored preparation/skills plus runtime buff-derived data. SmelterData stores fuel, pending count, finished count and remaining unit seconds. No personal save was inspected, loaded, written or converted. Offline catch-up is not established by a wall timestamp.

Locators: SaveManager.ManualSave0x1802ee310; SaveInOneData0x1802ee720; SaveData.FinalSave0x181b8e140; SaveData.SaveToOne<object>0x180cee0a0; SaveData.Load<object>0x1803905d0; JsonSerializer0x1804ad2b0/0x18038adb0; PlayerValueVersionModify; PlayerData.UpdateVersion.

PROPOSALS: Persistence: save behavior cursors, event/choice memory and unfinished production, then reconstruct derived views. Persistence: test missing/corrupt/old-version saves and interrupted writes separately from a successful serializer call.

## A05: AI and NPC behavior

Status: partial.

SHOWN: schedules select presence/activity by clock and support story overrides. Work behavior retains elapsed game time. NPC realm/XP and player-facing favor have separate mutation APIs. The dialogue helper selects from condition-qualified source dialogue and uses random selection; graph conditions can query task and choice history. Authored NPC advancement events follow quest/time conditions. None of these proves paid autonomous cultivation, generated NPC marriages or a strategic faction planner. Combat and companion AI beyond the selected prior wave chain remains mostly unread.

Locators: NPC67; NPCSchedule371; Behaviour; prior NPC_AGENCY_DIGEST; DialogDataHelper.GetDialogData0x180641d50.

PROPOSALS: Actor scheduling: persist interruption/resume state and an override reason. Characters: separate authored milestones from self-directed, funded plans in both implementation and claims.

## A06: UI and information design

Status: partial.

SHOWN data/schema/native: dialogue has portraits, choice widgets, translation, keyboard/gamepad selection methods and completion tasks. Breakthrough displays readiness, three selections, cost and before/after stats. Smelting has separate fuel, upgrade, production and collection surfaces. Tooltips, floating notifications and named UI actions recur across systems. TableViewCell reuseIdentifier supplies a reusable list-cell interface; actual list reuse performance was not measured.

UNREAD: actual desktop composition, panel density, text legibility, keyboard coverage, accessibility behavior and player-visible animations. No game launch or screenshot occurred. Proposed YAIRPG comparisons target1440×900 desktop/laptop; mobile is deferred.

Locators: PanelNPCInteractNew; BreakPanel; CanvasManager; WindowSmelter; Input13; KeyIcon; Language; Tip37.

PROPOSALS: UI owner: put readiness, inputs, current process and outcome in useful independent desktop regions. UI and accessibility: surface why a choice is blocked and keep it readable without relying on portraits or color alone.

## A07: Content authoring and modding

Status: partial.

SHOWN: JSON tables, typed fields, keyed lookup, graph GUIDs and editor layouts form a data authoring layer. Serialized graph node types and commands provide reusable authoring primitives. Addressables separates catalogue addresses from bundles. Both older and newer alchemy/dialogue structures coexist, so designers and researchers must identify the actual consumer.

UNREAD: the shipped editor workflow, authoring validation, load-order conflict resolution and external mod API. No public mod support or safe hot reload is established by editable-looking JSON or command names. No mod was installed.

Locators: ConfigManager JsonAsset/HashKey attributes; NewDialog DialogAsset/NodeGraphAsset; GameCommandType/ICommander; catalog.json.

PROPOSALS: Authoring owner: validate target IDs, field types, branch conditions and command arguments before content reaches play. Engine: preserve source/version provenance when a schema is replaced.

## A08: Balance and numbers

Status: partial.

SHOWN: separate profession and realm ladders coexist. Alchemy recipes specify energy/power/hour costs, output counts, a time limit, target temperature movement, disturbances, manual speed and progress speed. Oven records modify many of these quantities, creating tradeoffs rather than one power score. The native update samples Unity random values/ranges for disturbance and target motion. Success uses star-count generation and a mutation random draw. Cooking separates quality thresholds, XP and mastery coefficients.

UNREAD: global seeding/replay determinism, the complete star-quality formula, every random range endpoint, pity/bad-luck rules and actual player difficulty. Shared floating-point calls have incomplete decompiler argument recovery; this pass does not turn missing arguments into exact formulas.

Locators: Level7; LifeSkillLevel90; AlchemyRecipe65; AlchemyOven21; CookingGrade4; CookingLevelCoefficient15; AlchemyManager.UpdateAlchemyGaming/GameSucceed.

PROPOSALS: Crafting and balance: make tool modifiers change process behavior as well as yield. Trials: label a configured probability separately from the actual consumer and any protection rule.

## A09: Time and scheduling

Status: partial.

SHOWN: calendar/time tables, day/minute callbacks, delayed commands, schedules and elapsed production coexist. Smelting tracks game seconds, recipe hours converted with3600, fuel budget, remaining unit duration, pending and finished counts. Alchemy uses Unity time/deltaTime for active control and disturbance changes. Thus one game contains different clocks with different jobs.

UNREAD: offline wall-time reconciliation, every pause boundary and time-skip caller. Lifespan/old-age policy remains unestablished. SaveTime is not proof that closed-game elapsed time produces progress.

Locators: TimeInterval; Hour; Solarterm; NPCSchedule371; GameTimeManager; DelayGameCommandManager; SmelterManager.Update0x181bad3f0.

PROPOSALS: Time/scheduler owner: name the clock for each process and define pause, interruption and catch-up explicitly. Production: batch elapsed time against fuel and work remaining rather than awarding an unconditional output per visit.

## A10: Onboarding and reveal

Status: partial.

SHOWN: graph scripts and triggers unlock tools, dialogue options, gift interactions, shops, courses, cultivation and interface elements. Quest conditions and room/sect progress stage access. This is an authored reveal order with separate capabilities and UI gates. Trigger rows can be disabled; test content exists in the payload, so not every row is a played tutorial step.

UNREAD: the complete initial experience and whether every hidden control is explained when reached. No interactive onboarding acceptance is claimed.

Locators: SchoolUnlockGroup42; SchoolUnlockType; Trigger413; graph script command inventory; Course20; Study14; Tip37.

PROPOSALS: Onboarding owner: unlock a useful action with its reason and next affordable step. Characters/quests: reveal services through people and changed institutions while retaining later alternative routes.

## A11: Little touches

Status: covered.

SHOWN: words can select audio cues for player gender; NPC lines carry speaker/portrait context. Choices retain counts and times. Start/cancel/collect are separate production events; native smelter methods emit callbacks and start/cancel notifications. Alchemy notifies listeners when temperature/progress changes and when target range/time changes. Dialogue supports repeated input/gamepad methods and type/layout metadata. Localization has CN/CNT/JP/EN columns plus stable keys.

These are implementation/data touches, not a claim that audio, animation, accessibility or notifications were experienced. Proposed comfort features must still be tested in a rebuilt desktop YAIRPG slice.

Locators: dialogue words portrait/audio fields; SmelterManager event/notification calls; Input; FX43; BattleFX; Language; LoadingImage.

PROPOSALS: Presentation/UI owner: use distinct cues for admitted, paused, finished and collected states. Characters: let repeated choices and shared days change small lines without discarding the underlying relationship history.

## A12: Other systems

Status: partial.

SHOWN discovery includes farming/crops/pests, gathering/regions, combat/equipment/skills/elements/buffs, workshop/buildings, livestock/hives/pets, housing/decor/style, trade/storage/shops/exchanges, sect development/salary/renown, classes, fishing, cooking, alchemy, smelting, prayer, delegation, letters, handbook/collections, achievements, calendar/festivals, races/quizzes/find-difference and plumber/crane minigames. The inventory enumerates every296 recovered TextAssets and203 application manager/controller types, with coverage states. This is a discovery census, not full semantic reading of every system.

The three deeper reads chosen by payoff are alchemy control, cooking process composition and smelting queues. They previously appeared as tables/categories without a comparable native digest. Trade/delegation/prayer, scene content and remaining minigames still have important unread consumers.

Locators: SYSTEM_INVENTORY.md; DEEPER_SYSTEMS.md; extract/table-inventory.json; extract/classes.json.

PROPOSALS: Crafting/production: distinguish material transformation, active skill and elapsed queues instead of using one recipe timer for all work. Research/source ledger: keep a broad inventory beside deep consumer traces so future work has a specific starting point.
